/**
 * MIRROR of `CHECKOUT_BRANDING` in
 * `projects/mastermind/mhq-homepage/src/lib/masterminds-brand.ts`.
 *
 * This is a duplicate, and duplicates rot. It exists because workshop-site and
 * mhq-homepage are separate git repos with separate node_modules and no
 * monorepo, workspace, or shared package between them, so there is no import
 * path from here to there. Extracting a published package for ten lines of
 * plain data costs more than it saves.
 *
 * The canonical file is the one named above. If it changes, change this too.
 * `masterminds-checkout-branding.test.ts` pins these exact values so the drift
 * is at least loud on this side.
 *
 * Why it is needed at all: the Stripe account (acct_16xK9a...) is "The
 * Connection Map", and account branding is global. Without per-session
 * `branding_settings`, every workshop checkout shows Connection Map branding
 * instead of Masterminds HQ. See the "Checkout branding" iron rule in
 * `projects/mastermind/CLAUDE.md`.
 *
 * The logo is an absolute URL served from mastermindshq.business, so this repo
 * does not need to host the asset. It is a PNG on purpose: Stripe renders SVG
 * unreliably on checkout.
 */
export const MASTERMINDS_LOGO_ABSOLUTE_PNG =
  'https://mastermindshq.business/images/logos/masterminds/masterminds-logo-current-black.png'

export const CHECKOUT_BRANDING = {
  display_name: 'MastermindsHQ',
  background_color: '#FCF4EB',
  button_color: '#7C69C7',
  font_family: 'inter',
  border_style: 'rounded',
  logo: { type: 'url', url: MASTERMINDS_LOGO_ABSOLUTE_PNG },
  icon: { type: 'url', url: MASTERMINDS_LOGO_ABSOLUTE_PNG },
} as const
