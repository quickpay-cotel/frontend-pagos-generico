<template>
  <v-container>
    <v-card class="pa-5" border="opacity-40 sm" rounded="xl" variant="text">
      <h2 style="text-align: center;">Datos para facturación</h2><br>
      <div v-if="deudasStore.deudaSeleccionado.length">
        <v-row align="center" justify="center">
          <v-col cols="12" align="center" ><span class="font-weight-bold">Nombre</span>&nbsp;&nbsp;<span
              class="font-weight-thin">
              {{ deudasStore.datosCliente.nombreCompleto}}</span>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" md="3"> <v-text-field v-model="deudasStore.datosCliente.email" color="primary"
              label="Correo Electrónico" variant="underlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="deudasStore.datosCliente.telefono" color="primary" label="Nro Celular" variant="underlined"
              type="text" maxlength="20"
              @input="deudasStore.datosCliente.telefono = deudasStore.datosCliente.telefono.replace(/\D/g, '').slice(0, 20)"></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>
<script setup>
import { useDeudasStore } from '@/stores/useDeudasStore';
const deudasStore = useDeudasStore();

</script>
<style lang="css" scoped>
/* Cada elemento de detalle */
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
