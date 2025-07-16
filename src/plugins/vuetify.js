// plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#b0b0b1ff',   // azul Vuetify por defecto
          secondary: '#f1eeeeff', // gris oscuro por defecto
        },
      },
    },
  },
})

export default vuetify
