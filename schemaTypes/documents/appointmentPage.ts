import {defineArrayMember, defineField, defineType} from 'sanity'

export const appointmentPage = defineType({
  name: 'appointmentPage',
  title: 'Appointments page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Appointments',
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
    defineField({name: 'backLinkLabel', title: 'Back link label', type: 'string', initialValue: '← Home'}),
    defineField({name: 'backLinkHref', title: 'Back link', type: 'string', initialValue: '/'}),
    defineField({name: 'leadHeading', title: 'Lead heading', type: 'string'}),
    defineField({name: 'leadBody', title: 'Lead body', type: 'text', rows: 2}),
    defineField({
      name: 'reassurances',
      title: 'Reassurance list',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reassuranceItem',
          fields: [
            defineField({name: 'lead', title: 'Bold lead-in', type: 'string'}),
            defineField({name: 'rest', title: 'Remaining text', type: 'string'}),
          ],
          preview: {
            select: {lead: 'lead', rest: 'rest'},
            prepare: ({lead, rest}) => ({title: [lead, rest].filter(Boolean).join(' ')}),
          },
        }),
      ],
    }),
    defineField({name: 'launchEyebrow', title: 'Launch panel eyebrow', type: 'string'}),
    defineField({name: 'launchHeading', title: 'Launch panel heading', type: 'string'}),
    defineField({name: 'launchBody', title: 'Launch panel body', type: 'text', rows: 2}),
    defineField({name: 'launchButtonLabel', title: 'Launch button label', type: 'string'}),
    defineField({name: 'launchNote', title: 'Launch note', type: 'string'}),
    defineField({
      name: 'phone',
      title: 'Scheduling phone',
      type: 'string',
    }),
    defineField({
      name: 'onlineBookingUrl',
      title: 'Online booking URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'whatToExpect',
      title: 'What to expect (first visit)',
      type: 'blockContent',
    }),
    defineField({
      name: 'insuranceNote',
      title: 'Insurance / billing note',
      type: 'blockContent',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare: ({title}) => ({title: title || 'FAQ'}),
          },
        }),
      ],
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
      return {title: 'Appointments page'}
    },
  },
})
