import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'

/**
 * Actions that would break the "exactly one document" guarantee for the
 * singleton types. Publishing and reverting stay available.
 */
const singletonForbiddenActions = new Set(['delete', 'duplicate', 'unpublish'])

const isSingleton = (schemaType: string) =>
  singletonTypes.includes(schemaType as (typeof singletonTypes)[number])

export default defineConfig({
  name: 'default',
  title: 'omnia-pt',

  projectId: 'ksx13wmz',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, {schemaType}) =>
      isSingleton(schemaType)
        ? prev.filter(({action}) => !action || !singletonForbiddenActions.has(action))
        : prev,

    // Keep the singletons out of the global "Create new document" menu.
    newDocumentOptions: (prev) => prev.filter(({templateId}) => !isSingleton(templateId)),
  },
})
