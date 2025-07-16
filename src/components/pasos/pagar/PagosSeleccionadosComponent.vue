<template>
  <v-container>
  
    <v-card border="opacity-40 sm" class="pa-5" rounded="xl" variant="text">
      <h2 style="text-align: center;">Detalle de Pago</h2><br>
      <div class="receipt-details" v-for="deuda in pasarelaStore.lstDeudasSeleccionadas" :key="deuda">
        <div class="detail-item">
          <p class="font-weight-bold">
            Servicio
          </p>
          <p class="font-weight-thin">
            {{ deuda.descripcion }}
          </p>
        </div>
        <div class="detail-item">
          <p class="font-weight-bold">
            Periodo
          </p>
          <p class="font-weight-thin">
            {{ deuda.periodo }}
          </p>
        </div>
        <div class="detail-item">
          <p class="font-weight-bold">
            Cantidad
          </p>
          <p class="font-weight-thin">
            {{ deuda.cantidad }}
          </p>
        </div>
        <div class="detail-item">
          <p class="font-weight-bold">
            Precio Unitario
          </p>
          <p class="font-weight-thin">
            {{ deuda.precioUnitario }}
          </p>
        </div>
        <div class="detail-item">
          <p class="font-weight-bold">
            Monto Descuento
          </p>
          <p class="font-weight-thin">
            {{ deuda.montoDescuento }}
          </p>
        </div>

        <div class="detail-item">
          <p class="font-weight-bold">
            Monto Total
          </p>
          <p class="bold">
            {{ deuda.montoTotal }}
          </p>
        </div>
        <div style=" border-top: 1px solid #ccc;"></div>
      </div>
      <div class="total">
        <p class="font-weight-medium">
          Total:
        </p>
        <p class="font-weight-bold">
          Bs {{ totalMontoSeleccionado }}
        </p>
      </div>
    </v-card>
  </v-container>
</template>
<script setup>
import { usePasarelaStore } from '@/stores/usePasarelaStore';
const pasarelaStore = usePasarelaStore();

const totalMontoSeleccionado = computed(() => {
  if (pasarelaStore.lstDeudasSeleccionadas.length) {
    let total = pasarelaStore.lstDeudasSeleccionadas.reduce((suma, deuda) => {
      const cantidad = parseFloat(deuda.cantidad) || 0;
      const precioUnitario = parseFloat(deuda.precioUnitario) || 0;
      const montoDescuento = parseFloat(deuda.montoDescuento) || 0;
      return suma + (cantidad * precioUnitario - montoDescuento);
    }, 0);
    return total ? parseFloat(total.toFixed(2)) : 0;
  }
  return 0;
});

</script>
<style lang="css" scoped>
/* Cada elemento de detalle */
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

/* Total */
.total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  padding-top: 10px;
  margin-top: 10px;
  color: #e74c3c;
}
</style>
