<template>
  <v-app>
    <DialogLoadingComponent></DialogLoadingComponent>
    <AppHeaderComponent></AppHeaderComponent>
    <v-main>
      <v-container :class="['custom-container']" >
        <div width="100%">
          <router-view />
        </div>
      </v-container>
    </v-main>
    <!--<AppFooterComponent />-->
  </v-app>
</template>

<script setup>
import DialogLoadingComponent from '@/components/DialogLoadingComponent'
</script>
<style scoped>

.custom-container {
  max-width: 80%; /* Ancho por defecto para pantallas grandes */
  margin: 0 auto;
}

@media (max-width: 600px) {
  /* Cuando es móvil */
  .custom-container {
    max-width: 100%; /* Cambia el ancho al 100% */
  }
}

</style>
