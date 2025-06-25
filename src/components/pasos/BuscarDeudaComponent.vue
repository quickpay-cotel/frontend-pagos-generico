<template>
  <v-container>
    <v-form ref="formBusquedaDeuda">
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet class="pa-2 ma-2">
            <v-select variant="outlined" v-model="consultaDeuda.tipoPago" item-title="descripcion" item-value="dominioId"
              :items="deudasStore.lstTipoPagos " label="Seleccione Tipo de Pago"
              :rules="[v => !!v || 'Valor requerido']" hidden>
            </v-select>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="5">
          <v-sheet class="pa-2 ma-2">
            <v-text-field variant="outlined" v-model="consultaDeuda.parametroBusqueda"
              :label="'Ingrese parametro de búsqueda'" :rules="[v => !!v || 'Valor requerido']" hidden></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="pa-2 ma-2">
            <v-btn class="text-none mb-4 text-white" :color="datosEmpresa.datosEmpresa.colorPrimario" size="x-large"
              variant="flat" hidden @click="buscarDeudas()">Buscar
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-row v-if="deudasStore.datosCliente" class="pl-10">
    <v-col cols="12" md="3">
      <h5>Codigo Cliente</h5>
      {{ deudasStore.datosCliente.codigoCliente }}
    </v-col>
    <v-col cols="12" md="5">
      <h5>Nombre Completo</h5>
      {{ deudasStore.datosCliente.nombreCompleto }}
    </v-col>
    <v-col cols="12" md="4">
      <h5>Numero Documento</h5>
      {{ deudasStore.datosCliente.tipoDocumento + ' ' + deudasStore.datosCliente.numeroDocumento + ' ' +
        deudasStore.datosCliente.complementoDocumento }}
    </v-col>
  </v-row>

  <br>
</template>
<script setup>
import { ref } from 'vue';
import { useDeudasStore } from '@/stores/useDeudasStore';
import { basicMessage } from '@/utils/swalAlert'; // Importa la función
const deudasStore = useDeudasStore();
import { useDatosEmpresaStore } from "@/stores/useDatosEmpresaStore";
const datosEmpresa = useDatosEmpresaStore();
import axiosInstance from "@/services/axios";
const formBusquedaDeuda = ref(null);
onMounted(async ()=>{ 
    let response = await axiosInstance.post('/dominio/por-dominio', { dominio: 'tipo_pago_id' })
    deudasStore.lstTipoPagos = response.data.result
})
const consultaDeuda = ref({
  tipoPago: '',
  parametroBusqueda: ''
});
const buscarDeudas = async () => {
  if (formBusquedaDeuda.value) {
    const isValid = await formBusquedaDeuda.value.validate();
    if (isValid.valid) {
      deudasStore.datosDeudas = [];
      deudasStore.deudaSeleccionado = [];
      deudasStore.qrGenerado = null;
      let request =
      {
        tipoPago: consultaDeuda.value.tipoPago,
        parametroBusqueda: consultaDeuda.value.parametroBusqueda.trim()
      }
      await deudasStore.buscarDatosCliente(request);
      if (deudasStore.error) {
        basicMessage(deudasStore.error)
        return;
      }
    } else {
      basicMessage('Los datos de busqueda son obligatorios')
    }
  }
}
</script>
