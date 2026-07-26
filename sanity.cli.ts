import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ksx13wmz',
    dataset: 'production'
  },
  deployment: {
    /**
     * The deployed studio at https://omnia-pt.sanity.studio
     * Pinning this stops `sanity deploy` from prompting for a target.
     */
    appId: 'rhbxz98tkgad1g0i38tgr0vy',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
