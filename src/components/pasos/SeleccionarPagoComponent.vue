<template>
  <v-data-table 
  v-if="!isMobile"
  :headers="headers"
  :items="deudasStore.datosDeudas"
>
  <template v-slot:item.seleccionado="{ index, item }">
    <v-checkbox 
      @click="deudasStore.actualizarSeleccionados(index, item)" 
      v-model="item.seleccionado"
      readonly
    ></v-checkbox>
  </template>
</v-data-table>

  <div v-if="isMobile">
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in deudasStore.datosDeudas" :key="index">
          <v-list-item-content>
            <!-- Campos del registro -->
            <v-list-item-subtitle>
              <v-card border="opacity-40 sm" class="mx-auto pa-2" max-width="100%" rounded="xl" variant="text">
                <v-col cols="12">

                  <!--<v-checkbox @click="deudasStore.actualizarSeleccionados(index,item)" v-model="item.seleccionado" readonly ></v-checkbox>-->

                  <v-switch color="primary" v-model="item.seleccionado" label="Seleccionar"
                   @click="deudasStore.actualizarSeleccionados(index,item)" readonly ></v-switch>
                  <v-row align="center" class="pa-1">
                    <span class="font-weight-bold ">SERVICIO</span><br>
                    <span class="font-weight-thin ">{{ item.descripcionServicio }}</span>
                  </v-row>
                  <v-row align="center" class="pa-1">
                    <span class="font-weight-bold ">PERIODO&nbsp;</span>
                    <span class="font-weight-thin ">{{ item.periodo }}</span>
                  </v-row>
                  <v-row align="center" class="pa-1">
                    <span class="font-weight-bold ">MONTO&nbsp;</span>
                    <span class="font-weight-thin ">{{ item.monto }}</span>
                  </v-row>
                  <v-row align="center" class="pa-1">
                    <span class="font-weight-bold ">SERVICIO</span><br>
                    <span class="font-weight-thin ">{{ item.montoDescuento }}</span>
                  </v-row>
                </v-col>
              </v-card>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
  <!-- Lista para pantallas móviles -->
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useDeudasStore } from "@/stores/useDeudasStore";
const deudasStore = useDeudasStore();
const expanded = ref([]);

// Detectar si es móvil
const isMobile = ref(window.innerWidth <= 768);
const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
// =============

const headers = [
  { key: "seleccionado", title: "SELECCIONAR", align: "start", },
  { key: "descripcionServicio", title: "SERVICIO", align: "start", },
  { key: "periodo", title: "PERIODO", align: "start", },
  { key: "monto", title: "MONTO", align: "end", },
  { key: "montoDescuento", title: "MONTO DESCUENTO", align: "start", },
  { key: "montoTotal", title: "MONTO TOTAL", align: "start", },
];
</script>
