/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'



export default createVuetify({
  theme: {
    //defaultTheme: 'dark',
    defaultTheme: 'light',  // Define el tema claro como el predeterminado
    themes: {
      light: {
        colors: {
          background: '#FCFCFC', // Color de fondo para el body
        },
        primary: '#F78F33',  // Personaliza tu color primario
        secondary: '#424242',  // Personaliza tu color secundario
      },
    },
  },
})
