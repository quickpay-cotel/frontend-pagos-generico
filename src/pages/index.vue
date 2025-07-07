<template>


  <form-wizard v-if="datosEmpresa.datosEmpresa" ref="wizard" shape="circle" nextButtonText="Siguiente" backButtonText="Atras" :color="datosEmpresa.datosEmpresa.colorPrimario"
    @on-change="handleStepChange" @on-complete="resetWizard" finishButtonText="Finalizar">
    
    <tab-content title="Buscar Cliente">
      <v-card class="mx-auto my-8 rounded-card">
        <BuscarDeudaComponent></BuscarDeudaComponent>
      </v-card>
    </tab-content>
    <tab-content title="Seleccionar Deudas">
      <v-card v-if="deudasStore.datosDeudas && deudasStore.datosDeudas.length > 0"
        class="mx-auto my-8 rounded-card pa-4" max-width="100%">
        <SeleccionarPagoComponent></SeleccionarPagoComponent>
      </v-card>
      <v-card v-else class="mx-auto my-8 rounded-card">
        <v-alert border="top" type="warning" variant="outlined" prominent>
          No existe Deudas
        </v-alert>
      </v-card>
    </tab-content>
    <tab-content title="Pagar">
      <v-row align="center" v-if="deudasStore.deudaSeleccionado.length > 0">
        <DatosParaFacturaComponent></DatosParaFacturaComponent>
        <v-col cols="12" md="6">
          <PagosSeleccionadosComponent></PagosSeleccionadosComponent>
        </v-col>
        <v-col cols="12" md="6">
          <PagarComponent></PagarComponent>
        </v-col>
      </v-row>
      <v-alert v-else border="top" type="warning" variant="outlined" prominent>
        No existe Deudas Seleccionados
      </v-alert>
    </tab-content>
  </form-wizard>
</template>

<script setup>
import { ref } from 'vue';

const wizard = ref(null); // Referencia al wizard
import { basicMessage, showCustomAlert } from '@/utils/swalAlert';
import { useDeudasStore } from "@/stores/useDeudasStore";
import { useDatosEmpresaStore } from "@/stores/useDatosEmpresaStore";
import BuscarDeudaComponent from '@/components/pasos/BuscarDeudaComponent.vue';
import SeleccionarPagoComponent from '@/components/pasos/SeleccionarPagoComponent.vue';
import DatosParaFacturaComponent from '@/components/pasos/pagar/DatosParaFacturaComponent.vue';
import PagosSeleccionadosComponent from '@/components/pasos/pagar/PagosSeleccionadosComponent.vue';
import PagarComponent from '@/components/pasos/pagar/PagarComponent.vue';
const deudasStore = useDeudasStore();
const datosEmpresa = useDatosEmpresaStore();

// Dentro de <script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const empresa = route.query.empresa


onMounted(async () => {
  console.log(empresa);
  await datosEmpresa.buscarDatosEmpresa(empresa);
})
const handleStepChange = async (prevIndex, nextIndex) => {
  if (nextIndex == 1) { // seleccion de pagos
    console.log("pestaña 2");
    await deudasStore.buscarDeudasCliente({
      tipoPago: deudasStore.datosConsultaPersona.tipoPago,
      parametroBusqueda: deudasStore.datosConsultaPersona.parametroBusqueda
    });
    if (deudasStore.error) {
      basicMessage(deudasStore.error)
    }
  }
}
const resetWizard = async () => {
  if (deudasStore.deudaSeleccionado.length) {
    let result = await showCustomAlert('Finalizar', 'Esta seguro de finalizar?, perdera los pagos seleccionados');
    if (result.isConfirmed) {
      deudasStore.deudaSeleccionado = []
      wizard.value?.reset();
    }
  } else {
    deudasStore.deudaSeleccionado = []
    wizard.value?.reset();
  }
};
</script>
