<template>
  <v-dialog v-model="loadingStore.isLoading" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item :title="loadingStore.message ? loadingStore.message : 'Procesando....'">
        <template v-slot:append>
          <v-progress-circular color="primary" indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
<script setup>
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
</script>
