<template>
  <v-app-bar app :elevation="0" absolute color="#FCFCFC" density="prominent">
    <v-row class="fill-height" align="center" justify="center" style="width: 100%;">
      <v-col cols="auto" v-if="datosEmpresa.datosEmpresa" class="d-flex justify-center">
        <img :src="datosEmpresa.datosEmpresa.logoBase64" alt="Logo" style="width: 120px; height: 100%; object-fit: fill;" />
      </v-col>
    </v-row>
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
