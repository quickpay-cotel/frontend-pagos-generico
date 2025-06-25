// stores/useCounter.js
import { defineStore } from "pinia";
import { ref } from "vue";
export const useUtilsStore = defineStore("utils", () => {
// Función para convertir "MM/YYYY" en un número para ordenarlo correctamente
const parsePeriodo = (periodo) => {
  const [mes, año] = periodo.split("/").map(Number);
  return año * 100 + mes; // Convierte "02/2020" en 202002 (año*100 + mes)
};

  // Devolver el estado y las acciones
  return {
    parsePeriodo
  };
});
