import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'mission', title: 'Mission'},
    {name: 'team', title: 'Team'},
    {name: 'services', title: 'Services preview'},
    {name: 'why', title: 'Why Us'},
    {name: 'cta', title: 'CTA band'},
    {name: 'faq', title: 'FAQ'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Home',
      validation: (Rule) => Rule.required(),
    }),

    // Hero
    defineField({name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroHeadingLines',
      title: 'Hero heading lines',
      description: 'Each line has a highlighted word/phrase and the remaining text.',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'headingLine',
          fields: [
            defineField({name: 'highlight', title: 'Highlighted text', type: 'string'}),
            defineField({name: 'rest', title: 'Remaining text', type: 'string'}),
          ],
          preview: {
            select: {highlight: 'highlight', rest: 'rest'},
            prepare: ({highlight, rest}) => ({title: [highlight, rest].filter(Boolean).join(' ')}),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'heroSubheading', title: 'Subheading', type: 'text', rows: 3, group: 'hero'}),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alternative text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({name: 'heroPrimaryCtaLabel', title: 'Primary CTA label', type: 'string', group: 'hero'}),
    defineField({name: 'heroPrimaryCtaHref', title: 'Primary CTA link', type: 'string', group: 'hero'}),
    defineField({name: 'heroSecondaryCtaLabel', title: 'Secondary CTA label', type: 'string', group: 'hero'}),
    defineField({name: 'heroSecondaryCtaHref', title: 'Secondary CTA link', type: 'string', group: 'hero'}),

    // Mission
    defineField({name: 'missionEyebrow', title: 'Eyebrow', type: 'string', group: 'mission'}),
    defineField({
      name: 'missionHeading',
      title: 'Heading',
      description: 'Plain text. Frontend applies emphasis styling to "healthier" and "recover".',
      type: 'string',
      group: 'mission',
    }),
    defineField({
      name: 'missionStats',
      title: 'Stats',
      type: 'array',
      group: 'mission',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'number', title: 'Number / value', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
          preview: {
            select: {number: 'number', label: 'label'},
            prepare: ({number, label}) => ({title: `${number} — ${label}`}),
          },
        }),
      ],
    }),
    defineField({name: 'missionBody', title: 'Body', type: 'blockContent', group: 'mission'}),

    // Team
    defineField({name: 'teamEyebrow', title: 'Eyebrow', type: 'string', group: 'team'}),
    defineField({
      name: 'teamPhoto',
      title: 'Team photo',
      type: 'image',
      options: {hotspot: true},
      group: 'team',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alternative text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({name: 'teamBadgeName', title: 'Photo badge — name', type: 'string', group: 'team'}),
    defineField({name: 'teamBadgeTitle', title: 'Photo badge — title', type: 'string', group: 'team'}),
    defineField({name: 'teamHeading', title: 'Heading', type: 'string', group: 'team'}),
    defineField({name: 'teamName', title: 'Name (with credentials)', type: 'string', group: 'team'}),
    defineField({name: 'teamBio', title: 'Bio', type: 'blockContent', group: 'team'}),

    // Services preview
    defineField({name: 'servicesEyebrow', title: 'Eyebrow', type: 'string', group: 'services'}),
    defineField({name: 'servicesHeading', title: 'Heading', type: 'string', group: 'services'}),
    defineField({name: 'servicesIntro', title: 'Intro', type: 'text', rows: 3, group: 'services'}),
    defineField({name: 'servicesViewAllLabel', title: '"View all" label', type: 'string', group: 'services'}),
    defineField({name: 'servicesViewAllHref', title: '"View all" link', type: 'string', group: 'services'}),

    // Why Us
    defineField({name: 'whyEyebrow', title: 'Eyebrow', type: 'string', group: 'why'}),
    defineField({name: 'whyHeading', title: 'Heading', type: 'string', group: 'why'}),
    defineField({
      name: 'whyImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'why',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alternative text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({name: 'whyBody', title: 'Body', type: 'blockContent', group: 'why'}),
    defineField({
      name: 'whyList',
      title: 'Bullet list',
      type: 'array',
      group: 'why',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'whyListItem',
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
    defineField({name: 'howCanWeHelpEyebrow', title: '"How can we help" eyebrow', type: 'string', group: 'why'}),
    defineField({
      name: 'howCanWeHelpCards',
      title: '"How can we help" cards',
      type: 'array',
      group: 'why',
      of: [defineArrayMember({type: 'blockContent', name: 'helpCard'})],
    }),

    // CTA band
    defineField({name: 'ctaEyebrow', title: 'Eyebrow', type: 'string', group: 'cta'}),
    defineField({name: 'ctaHeading', title: 'Heading', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'Body', type: 'text', rows: 2, group: 'cta'}),
    defineField({name: 'ctaButtonLabel', title: 'Button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaButtonHref', title: 'Button link', type: 'string', group: 'cta'}),

    // FAQ
    defineField({name: 'faqHeading', title: 'Section heading', type: 'string', group: 'faq', initialValue: 'FAQs'}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'answer', title: 'Answer', type: 'blockContent'}),
          ],
          preview: {
            select: {title: 'question'},
            prepare: ({title}) => ({title: title || 'FAQ'}),
          },
        }),
      ],
    }),

    // SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta title (SEO)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70).warning('Keep under ~70 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (SEO)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('Keep under ~160 characters'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home page'}
    },
  },
})
