<template>
  <v-container>
    <v-card border="opacity-40 sm" class="pa-5 text-center" rounded="xl" variant="text">
      <h2 style="text-align: center;" v-if="!generandoQr && !datosPago">Métodos de Pago</h2>
      <v-row>
        <v-col>
          <a v-if="!generandoQr && !datosPago" @click="clickGenerarQr()">
            <img src="../../../assets/pago/pago_qr.png" width="120px">
          </a>
        </v-col>
        <v-col class="mt-4">
          <div v-if="!generandoQr && pasarelaStore.qrGenerado && !datosPago">
            <v-chip color="#ff8a24" variant="flat" @click="verificarEstadoPagoQr()">Ya realicé el PAGO</v-chip>
          </div>
        </v-col>
      </v-row>

      <img width="200px" v-if="generandoQr" src="../../../assets/pago/generando_qr.gif" alt="genera qr" />

      <div v-if="!generandoQr && datosPago">
        <v-sheet class="pa-4 text-center mx-auto" max-width="600" rounded="lg" width="100%">
          <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
          <h2 class="text-h5 mb-6">La transacción se ha realizado con éxito</h2>
          <div><b>Nro de transacción</b> : {{ pasarelaStore.qrGenerado.alias.slice(-8) }}</div>
          <div><b>Monto</b> : {{ datosPago.monto + ' ' + datosPago.moneda }}</div>
          <div><b>Fecha Procesado</b> : {{ datosPago.fechaproceso }}</div>
          <br>
          <p class="mb-4 text-medium-emphasis text-body-2">
            Gracias por utilizar <b>QUICKPAY</b>, por favor descarga tu comprobante:
          </p>
          <v-divider class="mb-4"></v-divider>

          <div class="text-end">

            <v-btn class="text-none mb-2" color="blue-darken-1" variant="flat" width="100%" rounded
              @click="clickDescargarFactura(pasarelaStore.qrGenerado.alias)">
              Descargar Factura
            </v-btn>
            <v-btn class="text-none" color="green" variant="flat" width="100%" rounded
              @click="clickDescargarRecibo(pasarelaStore.qrGenerado.alias)">
              Descargar Recibo
            </v-btn>
          </div>
        </v-sheet>
      </div>

      <div v-else-if="!generandoQr && pasarelaStore.qrGenerado">
        <img @click="dialogQR = true" :src="pasarelaStore.qrGenerado.imagen_qr" alt="Pago" width="400px" />
        <v-row no-gutters>
          <div class="pa-4 text-center mx-auto">
            <b> Vigencia QR: {{ pasarelaStore.qrGenerado.fecha_vencimiento }}</b><br>
            <v-chip color="success" variant="flat" @click="descargaQr(pasarelaStore.qrGenerado.imagen_qr)">
              Descargar QR &nbsp;&nbsp;<v-icon icon="mdi-arrow-collapse-down" start></v-icon>
            </v-chip>
          </div>
          <div>
            <fieldset>
              <legend>Solo para PRUEBAS</legend>
              Código reserva - COTEL: {{ pasarelaStore.qrGenerado.id_transaccion_reserva }}<br>
              Alias QR - SIP: <span style="font-size: 11px;">{{ pasarelaStore.qrGenerado.alias }}</span>
            </fieldset>
          </div>
          <div v-if="respSocket">
            Mensaje: {{ respSocket ? respSocket.mensaje : '' }}
          </div>
        </v-row>
      </div>
    </v-card>
  </v-container>

  <v-dialog v-model="dialogQR" max-width="500">
    <v-card>
      <v-card-text>
        <v-img :src="pasarelaStore.qrGenerado.imagen_qr" max-height="400" max-width="400"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialogQR = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/*import { useDeudasStore } from '@/stores/useDeudasStore';
const deudasStore = useDeudasStore();*/
import { ref, onMounted } from 'vue';
import { basicMessage, showCustomAlert } from '@/utils/swalAlert';
import { io } from "socket.io-client";
import axiosInstance from "@/services/axios";


import { usePasarelaStore } from '@/stores/usePasarelaStore';
const pasarelaStore = usePasarelaStore();


const generandoQr = ref(false);
const datosPago = ref(null);
const dialogQR = ref(false);
const respSocket = ref(null);

import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()

const url_sockete = import.meta.env.VITE_WS_URL;
const url_api = import.meta.env.VITE_API_URL;
const lstComprobantes = ref([]);
onMounted(() => {
  const socket = io(url_sockete);
  socket.on("connect", () => {
    console.log("sokete conectado", url_sockete);
  });
  socket.on("notification", (event) => {
    respSocket.value = null;
    if (event) {
      setTimeout(() => {
        if (pasarelaStore.qrGenerado.alias === event.alias) {
          if (event.mensaje === 'PROCESANDO PAGO') {
            loadingStore.startLoading(event.mensaje)
          } else if (event.mensaje === 'PAGO REALIZADO') {
            loadingStore.stopLoading()
            datosPago.value = event.datosPago;
          } else {
           loadingStore.stopLoading()
          }
          respSocket.value = event;
        }
      }, 1000);
    }
  });
});

const clickGenerarQr = async () => {
  if (!pasarelaStore.datosCliente.email) {
    basicMessage("Correo es requerido");
    return;
  }

  pasarelaStore.datosCliente.email = pasarelaStore.datosCliente.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(pasarelaStore.datosCliente.email)) {
    basicMessage("Ingrese un correo válido");
    return;
  }

  if (pasarelaStore.qrGenerado) {
    const result = await showCustomAlert('Generar QR', 'Ya existe un QR generado. ¿Desea continuar generando un nuevo QR?');
    if (result.isConfirmed) {
      generarQR();
    }
  } else {
    generarQR();
  }
};

const generarQR = async () => {
  generandoQr.value = true;
  const request = {
    deudaIds: pasarelaStore.lstDeudasSeleccionadas.map(item => item.deudaId),
    email: pasarelaStore.datosCliente.email,
    telefono: pasarelaStore.datosCliente.telefono ? pasarelaStore.datosCliente.telefono.trim() : ''
  };
  await generaQr(request);
  generandoQr.value = false;
};
const generaQr = async (request) =>{
   try {
      loadingStore.startLoading("Generando QR...");
      const response = await axiosInstance.post(`/deudas/generar-qr`, request);
      pasarelaStore.qrGenerado = response.data.result;

    } catch (err) {
      // Manejar el error
      if (err.response) {
        basicMessage(err.response.data.message || "Error desconocido del servidor");
      } else {
        basicMessage("Error de red o problema desconocido");
      }
    } finally {
       loadingStore.stopLoading()
    }
}
const descargaQr = (linkSource) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = "qr.jpg";
  downloadLink.click();
};

const verificarEstadoPagoQr = async () => {
  if (!deudasStore.qrGenerado.alias) {
    basicMessage("QR no está generado");
    return;
  }

  await deudasStore.verificarEstadoQR({ alias: deudasStore.qrGenerado.alias });

  if (deudasStore.error) {
    basicMessage(deudasStore.error);
  }
};

const clickDescargarFactura = async (alias) => {

  await obtenerComprobantes(alias);
  const facturas = lstComprobantes.value.filter(c => c.includes('factura'));
  for (const factura of facturas) {
    const fileUrl = `${url_api}/recursos/facturas/${factura}`;
    window.open(fileUrl, '_blank');
  }

};

const clickDescargarRecibo = async (alias) => {

  await obtenerComprobantes(alias);
  const recibos = lstComprobantes.value.filter(c => c.includes('recibo'));
  for (const recibo of recibos) {
    const fileUrl = `${url_api}/recursos/recibos/${recibo}`;
    window.open(fileUrl, '_blank');
  }

};
const obtenerComprobantes = async (pAlias) => {
  try {
      loadingStore.startLoading("Obteniendo comprobantes...");
      const response = await axiosInstance.get(`/pagos/obtener-comprobantes/${pAlias}`);
      lstComprobantes.value = response.data.result;

    } catch (err) {
      if (err.response) {
        basicMessage( err.response.data.message || "Error desconocido del servidor");
      } else {
        basicMessage( error.value = "Error de red o problema desconocido");
      }
    } finally {
     loadingStore.stopLoading()
    }
};
</script>
