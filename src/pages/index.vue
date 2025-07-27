<template>
  <form-wizard  ref="wizard" shape="circle" nextButtonText="Siguiente" backButtonText="Atras" :color="wizardColor"
    @on-change="handleStepChange" @on-complete="resetWizard" finishButtonText="Finalizar">
    
    <tab-content title="Buscar Cliente">
      <v-card class="mx-auto my-8 rounded-card" >
        <BuscarClienteComponent></BuscarClienteComponent>
      </v-card>
    </tab-content>
    <tab-content title="Seleccionar Deudas">
      <v-card 
        class="mx-auto my-8 rounded-card pa-4" max-width="100%">
        <SeleccionarDeudasComponent ref="seleccionarPagoRef"/>
      </v-card>
    </tab-content>
    <tab-content title="Pagar">
      <v-row align="center" v-if="pasarelaStore.lstDeudasSeleccionadas.length > 0">
        <DatosParaFacturaComponent></DatosParaFacturaComponent>
        <v-col cols="12" md="6">
          <PagosSeleccionadosComponent></PagosSeleccionadosComponent>
        </v-col>
        <v-col cols="12" md="6">
          <PagarComponent></PagarComponent>
        </v-col>
      </v-row>
      <v-alert v-else border="top" type="warning" variant="outlined" prominent color="primary">
        No existe Deudas Seleccionados
      </v-alert>
    </tab-content>
  </form-wizard>
</template>
<script setup>
import { ref } from 'vue';
import { basicMessage, showCustomAlert } from '@/utils/swalAlert';
const wizard = ref(null); // Referencia al wizard

import BuscarClienteComponent from '@/components/pasos/BuscarClienteComponent.vue';
import SeleccionarDeudasComponent from '@/components/pasos/SeleccionarDeudasComponent.vue';
import DatosParaFacturaComponent from '@/components/pasos/pagar/DatosParaFacturaComponent.vue';
import PagosSeleccionadosComponent from '@/components/pasos/pagar/PagosSeleccionadosComponent.vue';
import PagarComponent from '@/components/pasos/pagar/PagarComponent.vue';
import { useTheme } from 'vuetify'
const theme = useTheme()
const {current} = useTheme()
const wizardColor = computed(() => current.value.colors.primary);
import axiosInstance from "@/services/axios";
import { useRoute } from 'vue-router';
const route = useRoute();

import { usePasarelaStore } from '@/stores/usePasarelaStore';
const pasarelaStore = usePasarelaStore();




const seleccionarPagoRef = ref(null);
const handleStepChange = async (prevIndex, nextIndex) => {
  console.log(nextIndex);
    if (nextIndex === 1 && seleccionarPagoRef.value) {
        await seleccionarPagoRef.value.buscaDeudas();
    }
}


const resetWizard = async () => {
  console.log("finalizando wizard");
  if (pasarelaStore.lstDeudasSeleccionadas.length) {
    let result = await showCustomAlert('Finalizar', 'Esta seguro de finalizar?, perdera los pagos seleccionados');
    if (result.isConfirmed) {
      pasarelaStore.lstDeudasSeleccionadas = []
      wizard.value?.reset();
    }
  } else {
    pasarelaStore.lstDeudasSeleccionadas = []
    wizard.value?.reset();
  }
};



// Al montar el componente, obtener configuración inicial
onMounted(async () => {
  try {
    const empresa = route.query.empresa;
    console.log("empresa", empresa);
    if (empresa) {
      const response = await axiosInstance.get("/configuracion/obtener-configuracion-empresa/", { params: { slug: empresa }, });
      pasarelaStore.datosEmpresa = response.data.result;
      aplicarColores(response.data.result);
    }

  } catch (err) {
    console.log(err);
  } finally {
  }
})

function aplicarColores(config) {
  const { colorPrimario, colorSecundario } = config;
  
  if (isValidColor(colorPrimario) && isValidColor(colorSecundario)) {
    console.log("ssss",colorPrimario,colorSecundario);
    // Crea nuevos objetos de color para activar la reactividad
    theme.themes.value.light.colors = {
      ...theme.themes.value.light.colors,
      primary: colorPrimario,
      secondary: colorPrimario, // Asumiendo que quieres que secondary sea igual a primary por ahora
    };
    theme.themes.value.dark.colors = {
      ...theme.themes.value.dark.colors,
      primary: colorPrimario,
      secondary: colorPrimario, // Asumiendo que quieres que secondary sea igual a primary por ahora
    };
    console.log('🎨 Colores aplicados dinámicamente a light y dark');
  } else {
    console.warn('⚠️ Colores inválidos:', colorPrimario, colorSecundario); // Nombres de variable corregidos
  }
}
function isValidColor(color) {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color.trim())
}

</script>
