<template>
  <v-data-table :headers="headers" :items="pasarelaStore.lstDeudasTodos">
    <template v-slot:item.seleccionado="{ index, item }">
      <v-checkbox @click="actualizarSeleccionados(index, item)" v-model="item.seleccionado" readonly></v-checkbox>
    </template>
    <template v-slot:no-data>
      <div class="text-center pa-4">No hay deudas disponibles</div>
    </template>
  </v-data-table>
</template>
<script setup>

import { usePasarelaStore } from '@/stores/usePasarelaStore';
const pasarelaStore = usePasarelaStore();
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
import axiosInstance from "@/services/axios";

const indiceSeleccionadoAnterior = ref(-1); // Guarda el índice anterior

const actualizarSeleccionados = (index, item) => {

  if (pasarelaStore.lstDeudasSeleccionadas.length) {
    const ultimoSeleccionado = pasarelaStore.lstDeudasSeleccionadas.at(-1);
    // Solo si el nuevo item es diferente al último seleccionado
    if (item.deudaId !== ultimoSeleccionado.deudaId) {
      pasarelaStore.qrGenerado = null;
    }
  }


  // Actualiza los seleccionados hasta el índice
  const datosDeudas = pasarelaStore.lstDeudasTodos.map((obj, i) => ({
    ...obj,
    seleccionado: i <= index
  }));

  pasarelaStore.lstDeudasTodos = datosDeudas;
  pasarelaStore.lstDeudasSeleccionadas = datosDeudas.filter(r => r.seleccionado);
};


const buscaDeudas = async () => {
  console.log('busca deudas');
  try {
    loadingStore.startLoading('cargando deudas....')
    let request = {
      tipoPago: pasarelaStore.datosBusqueda.tipoPago,
      parametroBusqueda: pasarelaStore.datosBusqueda.parametroBusqueda.trim()
    }
    let response = await axiosInstance.post('/deudas/cobros-pendiente', request);
    // Mantener seleccionados previos
    const seleccionadosIds = pasarelaStore.lstDeudasSeleccionadas.map(d => d.id);
    pasarelaStore.lstDeudasTodos = response.data.result.map(deuda => ({
      ...deuda,
      seleccionado: seleccionadosIds.includes(deuda.id)
    }));
    pasarelaStore.lstDeudasSeleccionadas = pasarelaStore.lstDeudasTodos.filter(r => r.seleccionado);
    loadingStore.stopLoading()
  } catch (error) {
    pasarelaStore.lstDeudasTodos = [];
    pasarelaStore.lstDeudasSeleccionadas = [];
    loadingStore.stopLoading()
  }
};
defineExpose({
  buscaDeudas
});
const headers = [
  { key: "seleccionado", title: "SELECCIONAR", align: "start", },
  { key: "descripcion", title: "DESCRIPCIÓN", align: "start", },
  { key: "periodo", title: "PERIODO", align: "start", },
  { key: "cantidad", title: "CANTIDAD", align: "end", },
  { key: "precioUnitario", title: "PRECIO UNITARIO", align: "end", },
  { key: "montoDescuento", title: "MONTO DESCUENTO", align: "end", },
  { key: "montoTotal", title: "MONTO TOTAL", align: "end", },
];
</script>
