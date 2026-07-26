import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageHeading',
      title: 'Page heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'blockContent',
    }),
    defineField({
      name: 'clinicName',
      title: 'Clinic name',
      type: 'string',
    }),
    defineField({
      name: 'addressLines',
      title: 'Address',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'fax',
      title: 'Fax',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'hours',
      title: 'Hours of operation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursRow',
          fields: [
            defineField({name: 'label', title: 'Day or label', type: 'string'}),
            defineField({name: 'hours', title: 'Hours', type: 'string'}),
          ],
          preview: {
            select: {label: 'label', hours: 'hours'},
            prepare: ({label, hours}) => ({
              title: [label, hours].filter(Boolean).join(' — ') || 'Hours row',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'servingArea',
      title: 'Serving area',
      description: 'e.g. "Superior · Duluth · greater MN & WI"',
      type: 'string',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      description: 'Google Maps embed or similar HTTPS URL.',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'formNote',
      title: 'Note above contact form',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title (SEO)',
      type: 'string',
      validation: (Rule) => Rule.max(70).warning('Keep under ~70 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (SEO)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Keep under ~160 characters'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact page'}
    },
  },
})
