import un19n from '.'

export default (otps: any, nuxt: any) => {
  nuxt.hook('webpack:config', (configs: any[]) => {
    configs.forEach((config) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(un19n.webpack(otps))
    })
  })

  // install vite plugin
  nuxt.hook('vite:extend', (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(un19n.vite(otps))
  })
}
