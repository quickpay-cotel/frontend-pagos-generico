<template>
  <v-dialog v-model="deudasStore.loading" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item
        :title="deudasStore.smsLoading ? deudasStore.smsLoading : 'Procesando....'">
        <!--<template v-slot:prepend>
          <v-avatar>
            <img src="@/assets/icono/logo_quickpay.ico" width="30" alt="QuickPay Icon">
          </v-avatar>
        </template>-->

        <template v-slot:append>
          <v-progress-circular color="primary" indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
<script setup>
import { useDeudasStore } from '@/stores/useDeudasStore';
const deudasStore = useDeudasStore();
</script>
