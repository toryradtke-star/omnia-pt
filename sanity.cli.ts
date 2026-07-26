import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ksx13wmz',
    dataset: 'production'
  },
  deployment: {
    /**
     * The deployed studio at https://omnia-pt.sanity.studio
     * Pinning this here stops `sanity deploy` from prompting for a target.
     */
    appId: 'a0m2ntdq6cvcydmkhr07r7hq',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
