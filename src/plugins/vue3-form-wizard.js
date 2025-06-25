import { App } from 'vue';
import Vue3FormWizard from 'vue3-form-wizard';
import {FormWizard, TabContent} from 'vue3-form-wizard'
export default {
  install(app) {
    app.use(Vue3FormWizard); // Registrar el plugin
  },
};
