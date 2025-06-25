<template>
  <v-app-bar app :elevation="0" absolute color="#FCFCFC" density="prominent">
    <v-container class="d-flex justify-center" v-if="datosEmpresa.datosEmpresa">
      <img :src="datosEmpresa.datosEmpresa.logoBase64" alt="Logo" style="width: 100px; height: auto;" />
      <!-- Nombre y NIT -->
      <div>
        <div style="font-weight: bold; font-size: 18px;">
          {{ datosEmpresa.datosEmpresa.nombreEmpresa }}
        </div>
        <div style="font-size: 14px; color: #555;">
          NIT: {{ datosEmpresa.datosEmpresa.nitEmpresa }}
        </div>
      </div>
    </v-container>
    <template v-slot:append>
      <a :href="url_wa" target="_blank">
        <v-btn icon="mdi-whatsapp" color="green" elevation="0"></v-btn>
      </a>
    </template>
  </v-app-bar>

</template>


<script setup>
const url_wa = import.meta.env.VITE_WA
import { useDatosEmpresaStore } from "@/stores/useDatosEmpresaStore";
const datosEmpresa = useDatosEmpresaStore();

</script>

<style scoped></style>
