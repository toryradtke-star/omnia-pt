import {defineArrayMember, defineField, defineType} from 'sanity'

// TODO: pin as a singleton in sanity.config.ts / desk structure (one document, no "create new").
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'brandName', title: 'Brand name', type: 'string', initialValue: 'OMNIA'}),
    defineField({
      name: 'footerBrandLines',
      title: 'Footer brand name (lines)',
      description: 'e.g. "Omnia Wellness" / "& Recovery" shown on two lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'Link', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({
      name: 'navCtaLabel',
      title: 'Nav CTA label',
      type: 'string',
      initialValue: 'Schedule an Appointment',
    }),
    defineField({
      name: 'navCtaHref',
      title: 'Nav CTA link',
      type: 'string',
      initialValue: '/appointment',
    }),
    defineField({
      name: 'footerExploreLinks',
      title: 'Footer "Explore" links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'Link', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'phoneHref', title: 'Phone link (tel:)', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.email()}),
    defineField({name: 'fax', title: 'Fax', type: 'string'}),
    defineField({
      name: 'addressLines',
      title: 'Address (lines)',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'serviceArea',
      title: 'Service area line',
      description: 'e.g. "Superior · Duluth · Virtual — MN & WI"',
      type: 'string',
    }),
    defineField({
      name: 'copyrightLine',
      title: 'Copyright line',
      description: 'e.g. "© 2026 Omnia Wellness & Recovery"',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site settings'}
    },
  },
})
