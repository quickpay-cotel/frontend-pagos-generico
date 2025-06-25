// stores/useCounter.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axiosInstance from "@/services/axios";
export const useDatosEmpresaStore = defineStore("datos-empresa", () => {
  const datosEmpresa = ref(null);
  const buscarDatosEmpresa = async (slug) => {
    datosEmpresa.value = null;
    try {
      const response = await axiosInstance.get(
        "/configuracion/obtener-configuracion-empresa/",
        {
          params: { slug },
        }
      );
      datosEmpresa.value = response.data.result;
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  // Devolver el estado y las acciones
  return {
    buscarDatosEmpresa,
    datosEmpresa,
  };
});
