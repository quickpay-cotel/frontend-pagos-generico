// Utilities
import { defineStore } from 'pinia'
import { ref } from "vue";
export const usePasarelaStore = defineStore('pasarela',()=> {
  const datosEmpresa = ref(null);
  const qrGenerado = ref(null);
  const datosBusqueda = ref({});
  const datosCliente = ref({});
  const lstDeudasTodos = ref([]);
  const lstDeudasSeleccionadas = ref([]);
  return { datosEmpresa,datosBusqueda,lstDeudasSeleccionadas,datosCliente,lstDeudasTodos,qrGenerado };
})
