export const ROUTING_TITLE = 'Cross CLI Compatibility Routing'

export const ROUTING_SUMMARY =
  'A lane-based architecture for making large agent, skill, recipe, and workflow systems smarter, faster, and easier to maintain without dumping the whole catalog into every call.'

export const PROBLEM_POINTS = [
  {
    title: 'Context bloat',
    body: 'Too many skills, prompts, and helper descriptions get shoved into the top of every session. The model spends context budget on metadata instead of the actual job.',
  },
  {
    title: 'Routing ambiguity',
    body: 'Recipes, skills, workflows, and background agents all blur together. The system cannot tell what is deterministic infrastructure and what requires judgment.',
  },
  {
    title: 'Discovery failure',
    body: 'Important capabilities exist, but they are buried behind folder structure, naming drift, or inconsistent manifests. The agent misses them until a human points them out.',
  },
  {
    title: 'Maintenance drift',
    body: 'As more capabilities are added, aliases sprawl, helper files leak into routing, and nobody can explain why a task was routed one way instead of another.',
  },
] as const

export const FLOW_STEPS = [
  {
    id: 'bootstrap',
    step: '01',
    title: 'Tiny bootstrap',
    summary: 'Start with `ROUTING-SLIM.md` only.',
    detail:
      'This file stays intentionally small. Its only job is to point the runtime toward the global discovery index and the lane-selection rules.',
  },
  {
    id: 'index',
    step: '02',
    title: 'Capability index',
    summary: 'Load a compact machine-readable capability registry.',
    detail:
      'The system reads one generated index that lists the routable capability packages across recipes, worker skills, and workflows. It does not load execution docs yet.',
  },
  {
    id: 'lane',
    step: '03',
    title: 'Lane selector',
    summary: 'Decide what kind of work this request actually is.',
    detail:
      'The selector answers one question first: is this deterministic operational work, ambiguous compositional work, or an orchestration pattern request?',
  },
  {
    id: 'native',
    step: '04',
    title: 'Lane-native execution',
    summary: 'Hand off to the authoritative executor for that lane.',
    detail:
      'Recipes stay inside the recipe dispatcher. Worker and skill requests stay inside the adaptive planning runtime. Workflows like Dalio Council stay in the workflow lane.',
  },
  {
    id: 'result',
    step: '05',
    title: 'Normalized output',
    summary: 'Return one result envelope to the caller.',
    detail:
      'The top-level router should not care which lane fulfilled the request. The lane systems stay specialized while the outer interface stays clean.',
  },
] as const

export const LANE_CARDS = [
  {
    lane: 'Recipe Lane',
    label: 'Deterministic operations',
    why: 'Best for repeatable, validated, code-backed actions.',
    body: 'If a task is structured, repeatable, and already modeled as an operational recipe, route into the authoritative recipe dispatcher. Do not flatten recipe semantics into generic skill routing.',
    points: [
      'Recipe manifests stay the source of truth.',
      'Dispatcher scoring, validation, precedence, and fallback remain authoritative.',
      'Best for operational tasks where reliability matters more than creativity.',
    ],
  },
  {
    lane: 'Worker / Skill Lane',
    label: 'Ambiguous and compositional work',
    why: 'Best for novel requests, synthesis, and routing uncertainty.',
    body: 'This lane handles the work that needs judgment. It can load a selected capability package, compose multiple steps, and explicitly invoke recipes by ID when needed.',
    points: [
      'Only load execution instructions after a capability is selected.',
      'Keep discovery coarse and execution rich.',
      'Use this lane for planning, synthesis, migration work, and unfamiliar requests.',
    ],
  },
  {
    lane: 'Workflow Lane',
    label: 'Reusable orchestration patterns',
    why: 'Best for explicit orchestration systems like councils, war rooms, or structured review flows.',
    body: 'Some capabilities are not recipes and are not ordinary skills. They are reusable orchestration patterns. They need their own lane so they can be discovered without being misclassified.',
    points: [
      'Model workflows as first-class capabilities.',
      'Keep them separate from recipes and ordinary skill payloads.',
      'Use this lane when the user is asking for a named orchestration pattern.',
    ],
  },
] as const

export const RULE_SECTIONS = [
  {
    title: 'Creation rules',
    body: 'Every new routable thing must enter the system through one authoritative metadata source, one immutable ID, one declared lane, and zero hand-edited central registry files.',
  },
  {
    title: 'Authority boundaries',
    body: 'Global routing chooses the lane. Lane-native systems choose the executor inside that lane. Recipes keep their dispatcher logic. Workflows keep their orchestration logic.',
  },
  {
    title: 'Drift controls',
    body: 'The generated index must be rebuildable, validated, and linted. Non-routable helpers stay out of the index. Routing decisions need explanation output.',
  },
  {
    title: 'Growth model',
    body: 'The system should expand by adding a capability package and manifest, not by enlarging bootstrap docs or stuffing more catalog text into every call.',
  },
] as const

export const WHY_IT_SCALES = [
  'Every call starts with dramatically less global context.',
  'Discovery becomes cheaper because the selector reads a compact index instead of a giant prompt dump.',
  'Recipes stop getting mislabeled as skills, and workflows stop getting buried as random helpers.',
  'The model spends more attention on the request and less on memorizing the catalog.',
  'New capabilities can be added without increasing prompt clutter linearly.',
] as const

export const MIGRATION_PROMPT = `You are the top-level orchestrator for a migration from an ad hoc AI capability system to a lane-based cross-CLI routing architecture.

Your job is to inspect the current system first, then produce a migration plan, then execute only after the plan is internally validated.

Operate conservatively. Do not rewrite the whole system blindly. Preserve working deterministic infrastructure. Remove ambiguity, not capability.

OBJECTIVE

Restructure the current system so it follows this shape:

ROUTING-SLIM.md
-> capabilities index
-> lane selector
-> lane-native execution

The target lanes are:
1. Recipe lane for deterministic, validated, operational execution
2. Worker or skill lane for ambiguous, novel, and compositional work
3. Workflow lane for reusable orchestration patterns

PRIMARY OUTCOME

The migrated system must become:
- smarter at selecting the right capability
- faster at startup and routing
- leaner in context usage
- easier to grow without routing drift
- portable across multiple CLIs or orchestrators

NON-NEGOTIABLE ARCHITECTURE RULES

1. Keep the bootstrap tiny.
ROUTING-SLIM.md must remain a protocol entrypoint, not a catalog dump.

2. Use one generated discovery artifact.
Do not hand-maintain a giant central registry. Build one machine-readable index from authoritative local metadata.

3. Route by lane first.
Do not flatten recipes, worker skills, and orchestration workflows into one undifferentiated selector.

4. Preserve deterministic recipe systems.
If the current system already has a recipe dispatcher, manifest schema, precedence rules, validation logic, or fallback behavior, preserve that lane instead of replacing it.

5. Treat capability packages as the unit.
Do not assume everything is a SKILL.md file. Skills, recipes, workflows, agents, prompts, and tool-backed capabilities may all exist in different forms.

6. Exclude non-routable helpers.
Utility files, helper modules, and implementation details should not appear in the global routing index unless they are intended to be selected directly.

7. Use immutable IDs.
Do not derive stable identity from display names.

8. Prefer deterministic selection before model-heavy selection.
The first pass should use explicit metadata, runtime availability, aliases, and routing rules before loading verbose execution docs.

DISCOVERY PHASE

Before proposing any migration, inspect and classify the current system.

Inventory:
- recipes
- skills
- workflows
- agents
- shared modules
- dispatchers
- helper utilities
- registries
- top-level routing files
- prompt bundles
- direct-download assets
- launch automation surfaces if they are part of the capability lifecycle

For each discovered item, determine:
- what it is
- whether it is directly routable
- whether it is deterministic or judgment-based
- whether it already has an authority boundary
- whether it belongs in recipe, worker or skill, or workflow lane
- whether it is a helper that should be excluded from routing

CURRENT-STATE ANALYSIS

Produce a precise diagnosis of the current architecture:
- where context bloat comes from
- where routing ambiguity comes from
- where recipes and skills are being confused
- where workflows are hidden or mislabeled
- where capability discovery fails
- where helper files are leaking into routing surfaces
- where naming or alias drift is likely
- where central inventory files are overloaded

TARGET MODEL

Design the target system with these layers:

1. Bootstrap
- tiny ROUTING-SLIM.md

2. Discovery
- one generated capability index

3. Lane selector
- recipe vs worker or skill vs workflow

4. Lane-native executor
- authoritative executor inside each lane

5. Normalized result
- one result envelope returned to the caller

CAPABILITY PACKAGE RULES

Define a capability package model that supports:
- one canonical ID
- one authoritative metadata source adjacent to the capability
- one declared lane
- one declared type
- clear routable vs non-routable status

Types may include:
- recipe
- skill
- workflow
- worker-backed capability
- tool-backed capability
- plugin or connector-backed capability

RECIPE LANE RULES

If recipes already exist:
- keep their manifest format authoritative
- keep their dispatcher authoritative
- keep scoring, validation, precedence, and fallback behavior inside that lane
- expose recipes in the global discovery index only for coarse discovery
- do not duplicate recipe semantics into the outer routing layer

WORKER OR SKILL LANE RULES

- select one capability by default
- load rich execution docs only after selection
- allow explicit composition of recipes when necessary
- keep discovery metadata narrow
- keep routing logic centralized rather than embedding complex policy into every capability

WORKFLOW LANE RULES

- treat reusable orchestration patterns as first-class capabilities
- do not force them into recipe or ordinary skill categories
- define when they are directly invokable and when they are internal-only

MIGRATION STRATEGY

Do not migrate everything at once.

Phase the migration:
1. identify top-level routing and overloaded inventory surfaces
2. identify the existing deterministic lane, if any
3. classify high-frequency capabilities first
4. add authoritative metadata to routable capabilities
5. generate the capability index
6. implement lane selection
7. test with real prompts
8. migrate long-tail capabilities gradually

VALIDATION REQUIREMENTS

Add validation for:
- duplicate IDs
- alias collisions
- missing or vague routing metadata
- missing capability paths
- helpers incorrectly exposed as routable
- stale generated index
- lane/type mismatches

TEST REQUIREMENTS

Create tests or fixtures for:
- deterministic operational requests routing to the recipe lane
- ambiguous or novel work routing to the worker or skill lane
- explicit orchestration requests routing to the workflow lane
- important named capabilities resolving correctly by alias
- low-confidence fallback behavior
- exclusion of non-routable helpers

OUTPUT FORMAT

Produce:
1. current-state diagnosis
2. target architecture
3. lane classification table
4. migration phases
5. validation rules
6. test cases
7. implementation checklist

IMPORTANT BEHAVIOR

- Do not start by mutating files.
- Audit first.
- Preserve working deterministic infrastructure.
- Keep the top of the system tiny.
- Expand only as necessary.
- Optimize for portability across different CLIs and orchestrators.
- Optimize for long-term maintainability, not cleverness.

If the current system already contains a dispatcher, giveaway pipeline, registry, workflow runner, or orchestration layer, classify it before changing it.`
