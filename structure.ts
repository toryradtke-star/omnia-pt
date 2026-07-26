import {type StructureResolver} from 'sanity/structure'

/**
 * Document types that must only ever have one instance.
 *
 * The `_id` of each is the type name itself — scripts/seed.ts creates them
 * that way via createOrReplace, so pinning the same id here means the Studio
 * edits the seeded document rather than spawning a second one.
 */
export const singletonTypes = [
  'siteSettings',
  'homePage',
  'servicesPage',
  'appointmentPage',
  'contactPage',
] as const

/** Titles for the pinned list items, keyed by type name. */
const singletonTitles: Record<(typeof singletonTypes)[number], string> = {
  siteSettings: 'Site settings',
  homePage: 'Home page',
  servicesPage: 'Services page',
  appointmentPage: 'Appointments page',
  contactPage: 'Contact page',
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...singletonTypes.map((type) =>
        S.listItem()
          .id(type)
          .title(singletonTitles[type])
          .child(S.document().schemaType(type).documentId(type).title(singletonTitles[type])),
      ),
      S.divider(),
      // Everything else (currently just blogPost) keeps the default list behaviour.
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.includes(listItem.getId() as (typeof singletonTypes)[number]),
      ),
    ])
