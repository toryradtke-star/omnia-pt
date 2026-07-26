import {defineArrayMember, defineField, defineType} from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Services',
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
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'service',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Needle (dry needling)', value: 'needle'},
                  {title: 'Hand (manual therapy)', value: 'hand'},
                  {title: 'Dumbbell (strength)', value: 'dumbbell'},
                  {title: 'Cupping', value: 'cupping'},
                  {title: 'Mobility', value: 'mobility'},
                  {title: 'Recovery', value: 'recovery'},
                  {title: 'Ultrasound', value: 'ultrasound'},
                  {title: 'Manipulation', value: 'manipulation'},
                  {title: 'Athlete', value: 'athlete'},
                ],
              },
            }),
            defineField({
              name: 'displayNumber',
              title: 'Display number',
              description: 'e.g. "01" — shown as a badge on the card',
              type: 'string',
            }),
            defineField({
              name: 'name',
              title: 'Service name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {source: 'name', maxLength: 96},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'summary',
              title: 'Short summary',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'description',
              title: 'Full description',
              type: 'blockContent',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'name'},
            prepare: ({title}) => ({title: title || 'Service'}),
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
      return {title: 'Services page'}
    },
  },
})
