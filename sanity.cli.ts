import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'us9jz0mn',
    // Also drives CLI commands, so `sanity migration run` and dataset
    // operations target whichever dataset SANITY_STUDIO_DATASET names.
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
