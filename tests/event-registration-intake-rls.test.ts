import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

// No application client or credentials: only synthetic rows in a fresh cluster.
const environment = { PATH: process.env.PATH, LANG: 'C', LC_ALL: 'C' }
const available = ['initdb', 'pg_ctl', 'psql'].every((command) =>
  spawnSync(command, ['--version'], { env: environment }).status === 0,
)

test('intake migration denies public roles while preserving server upsert and read', {
  skip: available ? false : 'Requires local PostgreSQL tools for isolated database integration',
  timeout: 60_000,
}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'workshop-intake-rls-'))
  const data = join(directory, 'data')
  const socket = join(directory, 'socket')
  mkdirSync(socket)
  // A private Unix socket directory, no TCP listener or existing database.
  const port = '55439'
  const command = (name: string, args: string[]) => execFileSync(name, args, {
    env: environment, encoding: 'utf8', timeout: 20_000,
  })
  const query = (statement: string) => spawnSync('psql', [
    '-X', '-h', socket, '-p', port, '-U', 'synthetic_owner', '-d', 'postgres',
    '-v', 'ON_ERROR_STOP=1', '-At',
  ], { input: statement, env: environment, encoding: 'utf8', timeout: 10_000 })
  const execute = (statement: string) => {
    const result = query(statement)
    assert.equal(result.status, 0, result.stderr)
    return result.stdout.trim()
  }
  command('initdb', ['-D', data, '-A', 'trust', '-U', 'synthetic_owner', '--no-locale'])
  command('pg_ctl', ['-D', data, '-l', join(directory, 'postgres.log'), '-o',
    `-k ${socket} -p ${port} -c listen_addresses=''`, '-w', 'start'])
  try {
    execute(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE TABLE public.event_registrations(id uuid PRIMARY KEY);
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`)
    const migration = (name: string) => readFileSync(join(process.cwd(), 'supabase/migrations', name), 'utf8')
    for (const name of ['011_event_registration_intake.sql', '012_fix_intake_upsert_conflict_target.sql', '015_event_registration_ai_level.sql']) {
      execute(migration(name))
    }
    // Reproduce default-grant exposure, including a PUBLIC grant as a guard case.
    execute('GRANT ALL PRIVILEGES ON public.event_registration_intake TO anon, authenticated, service_role, PUBLIC;')
    const row = `INSERT INTO public.event_registration_intake(event_slug,attendee_name,attendee_email)
      VALUES ('synthetic-event','Synthetic Person','synthetic@example.invalid')
      ON CONFLICT(event_slug,attendee_email) DO UPDATE SET attendee_name=excluded.attendee_name;`
    execute('SET ROLE service_role;' + row)
    assert.ok(execute('SET ROLE anon; SELECT count(*) FROM public.event_registration_intake;').endsWith('1'))

    const hardening = migration('017_event_registration_intake_rls.sql')
    execute(hardening)
    execute(hardening) // Existing and fresh installs may both replay the migration.
    assert.equal(execute(`SELECT relrowsecurity AND NOT relforcerowsecurity FROM pg_class
      WHERE oid='public.event_registration_intake'::regclass;`), 't')
    assert.equal(execute(`SELECT count(*) FROM pg_policies
      WHERE schemaname='public' AND tablename='event_registration_intake';`), '0')
    assert.equal(execute(`SELECT count(*) FROM pg_class c, LATERAL aclexplode(c.relacl) a
      WHERE c.oid='public.event_registration_intake'::regclass AND a.grantee=0;`), '0')
    const version = Number(execute('SHOW server_version_num;'))
    const privileges = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']
    if (version >= 170000) privileges.push('MAINTAIN')
    for (const role of ['anon', 'authenticated']) {
      for (const privilege of privileges) {
        assert.equal(execute(`SELECT has_table_privilege('${role}','public.event_registration_intake','${privilege}');`), 'f')
      }
      for (const operation of [
        'SELECT * FROM public.event_registration_intake;', row,
        "UPDATE public.event_registration_intake SET attendee_name='Denied';",
        'DELETE FROM public.event_registration_intake;', 'TRUNCATE public.event_registration_intake;',
      ]) {
        const result = query(`SET ROLE ${role};` + operation)
        assert.notEqual(result.status, 0)
        assert.match(result.stderr, /permission denied/)
      }
    }
    // Actual server operations: insert, conflict update, profile update, intake read.
    execute('SET ROLE service_role;' + row)
    execute(`SET ROLE service_role; UPDATE public.event_registration_intake
      SET business_context='Synthetic profile',ai_level=4,ai_level_source='self'
      WHERE attendee_email='synthetic@example.invalid';`)
    assert.ok(execute(`SET ROLE service_role; SELECT business_context||':'||ai_level
      FROM public.event_registration_intake WHERE attendee_email='synthetic@example.invalid';`).endsWith('Synthetic profile:4'))
    assert.ok(execute('SET ROLE service_role; SELECT count(*) FROM public.event_registration_intake;').endsWith('1'))
  } finally {
    command('pg_ctl', ['-D', data, '-m', 'fast', '-w', 'stop'])
    // Retain the isolated cluster/log for failed-test diagnosis; no source cleanup.
  }
})
