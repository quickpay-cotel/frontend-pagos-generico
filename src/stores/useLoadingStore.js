import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const message = ref('')

  const startLoading = (msg = 'Cargando...') => {
    isLoading.value = true
    message.value = msg
  }

  const stopLoading = () => {
    isLoading.value = false
    message.value = ''
  }

  return { isLoading, message, startLoading, stopLoading }
})
