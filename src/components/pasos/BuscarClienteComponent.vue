<template>
  <v-container>
    <v-form ref="formBusquedaDeuda">
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet class="pa-2 ma-2">
            <v-select variant="outlined" v-model="pasarelaStore.datosBusqueda.tipoPago" item-title="descripcion"
              item-value="dominioId" :items="lstTipoPagos" label="Seleccione Tipo de Pago"
              :rules="[v => !!v || 'Valor requerido']" hidden>
            </v-select>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="5">
          <v-sheet class="pa-2 ma-2">
            <v-text-field variant="outlined" v-model="pasarelaStore.datosBusqueda.parametroBusqueda"
              :label="'Ingrese parametro de búsqueda'" :rules="[v => !!v || 'Valor requerido']" hidden></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="pa-2 ma-2">
            <v-btn class="text-none mb-4 text-white" color="primary" size="x-large"
              variant="flat" hidden @click="buscarDeudas()">Buscar
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
 <v-row v-if="pasarelaStore.datosCliente && Object.keys(pasarelaStore.datosCliente).length > 0" class="pl-10">
    <v-col cols="12" md="3">
      <h5>Codigo Cliente</h5>
      {{ pasarelaStore.datosCliente.codigoCliente }}
    </v-col>
    <v-col cols="12" md="5">
      <h5>Nombre Completo</h5>
      {{ pasarelaStore.datosCliente.nombreCompleto }}
    </v-col>
    <v-col cols="12" md="4">
      <h5>Numero Documento</h5>
      {{ pasarelaStore.datosCliente.tipoDocumento + ' ' + pasarelaStore.datosCliente.numeroDocumento + ' ' +
        pasarelaStore.datosCliente.complementoDocumento }}
    </v-col>
  </v-row>

  <br>
</template>
<script setup>
import { ref } from 'vue';

import { basicMessage } from '@/utils/swalAlert'; // Importa la función
import { useRoute } from 'vue-router';
const route = useRoute();

import { usePasarelaStore } from '@/stores/usePasarelaStore';
const pasarelaStore = usePasarelaStore();
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
const lstTipoPagos = ref([]);

import axiosInstance from "@/services/axios";
const formBusquedaDeuda = ref(null);
onMounted(async ()=>{ 
    let response = await axiosInstance.post('/dominio/por-dominio', { dominio: 'tipo_pago_id' })
    lstTipoPagos.value = response.data.result
})
const buscarDeudas = async () => {
   if (formBusquedaDeuda.value) {
    const isValid = await formBusquedaDeuda.value.validate();
    if (isValid.valid) {
      loadingStore.startLoading('buscando deudas ..')
      const slug = route.query.empresa;
      let request = {
        tipoPago: pasarelaStore.datosBusqueda.tipoPago,
        parametroBusqueda: pasarelaStore.datosBusqueda.parametroBusqueda.trim(),
        slug:slug
      }
      try {
        let response = await axiosInstance.post('/deudas/datos-cliente', request);
        pasarelaStore.datosCliente = response.data.result;
        loadingStore.stopLoading()
      } catch (error) {
        pasarelaStore.datosCliente = null;
        pasarelaStore.lstDeudasTodos = [];
        pasarelaStore.lstDeudasSeleccionadas = [];
        basicMessage(error.response?.data?.message || 'Error al buscar deudas. Intente nuevamente.');
        loadingStore.stopLoading()
      }
    } else {
      basicMessage('Los datos de busqueda son obligatorios');
    }
  }

}
</script>
