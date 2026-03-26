import { defineNuxtPlugin } from '#app'
import Nora from '@primeuix/themes/nora'
import "primeicons/primeicons.css";


export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  nuxtApp.vueApp.use(nuxtApp.$primevue, {
    theme: {
      preset: Nora,
      options: {
        darkModeSelector: 'dark',
        cssLayer: false
      }
    }
  })
})
