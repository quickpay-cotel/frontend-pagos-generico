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
          <div v-if="!generandoQr && deudasStore.qrGenerado && !datosPago">
            <v-chip color="#ff8a24" variant="flat" @click="verificarEstadoPagoQr()">Ya realice el PAGO</v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- cuando esta generando QR -->
      <img width="200px" v-if="generandoQr" src="../../../assets/pago/generando_qr.gif" alt="genera qr" />

      <!-- cuando ya se ha relizado el pago -->

      <!--<div v-if="!generandoQr && datosPago">-->
      <div v-if="!generandoQr && datosPago">
        <v-sheet class="pa-4 text-center mx-auto" elevation="" max-width="600" rounded="lg" width="100%">
          <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
          <h2 class="text-h5 mb-6">La transacción se ha realizado con exito</h2>
          <div>
            <b>Nro de transacción</b> : {{ deudasStore.qrGenerado.alias.slice(-8) }}
          </div>
          <div>
            <b>Monto</b> : {{ datosPago.monto + ' ' + datosPago.moneda }}<br>
          </div>
          <div>
            <b>Fecha Procesado</b> : {{ datosPago.fechaproceso }}
          </div>
          <br>
          <p class="mb-4 text-medium-emphasis text-body-2">
            Gracias por utilizar <b>QUICKPAY</b> , porfavor
            descarga el comprobante</p>
          <v-divider class="mb-4"></v-divider>

          <div class="text-end">
            <v-btn class="text-none" color="success" variant="flat" width="100%" rounded
              @click="clickDescargarComprobante(deudasStore.qrGenerado.alias)">
              Comprobante
            </v-btn>
          </div>
        </v-sheet>
      </div>
      <!-- cuando ya ha generado QR y existe de datos de QR generado -->
      <div v-else-if="!generandoQr && deudasStore.qrGenerado">
        <img @click="dialogQR = true" :src="deudasStore.qrGenerado.imagen_qr" alt="Pago" width="400px" />
        <v-row no-gutters>
          <div class="pa-4 text-center mx-auto">
            <b> Vigencia QR:{{ deudasStore.qrGenerado.fecha_vencimiento }}</b><br>
            <v-chip color="success" variant="flat" @click="descargaQr(deudasStore.qrGenerado.imagen_qr)">
              Descargar QR &nbsp;&nbsp; <v-icon icon="mdi mdi-arrow-collapse-down" start></v-icon></v-chip>
          </div>
          <div>
            <fieldset>
              <legend>Solo para PRUEBAS</legend>
              Código reserva - COTEL:{{ deudasStore.qrGenerado.id_transaccion_reserva }}<br>
              Alias QR - SIP:<span style="font-size: 11px;">{{ deudasStore.qrGenerado.alias }}</span>
            </fieldset>
          </div>
          <div v-if="respSocket">
            Mensaje: {{ respSocket ? respSocket.mensaje : '' }}
          </div>
        </v-row>
      </div>
    </v-card>
  </v-container>
  <!-- Popup con la imagen -->
  <v-dialog v-model="dialogQR" max-width="500">
    <v-card>
      <v-card-text>
        <v-img :src="deudasStore.qrGenerado.imagen_qr" max-height="400" max-width="400"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialogQR = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useDeudasStore } from '@/stores/useDeudasStore';
import { ref, onMounted } from 'vue';
const deudasStore = useDeudasStore();
const generandoQr = ref(false);
const datosPago = ref(null);
const dialogQR = ref(false);
import { basicMessage, showCustomAlert } from '@/utils/swalAlert';
const url_sockete = import.meta.env.VITE_WS_URL;
const url_api = import.meta.env.VITE_API_URL
const respSocket = ref(null);
import { io } from "socket.io-client";
onMounted(() => {
  const socket = io(url_sockete);
  socket.on("connect", () => {
    console.log("sokete conectado");
    console.log(url_sockete);
  });
  socket.on("notification", (event) => {
    respSocket.value = null;
    if (event) {
      setTimeout(() => {
        if (deudasStore.qrGenerado.alias == event.alias) {
          if (event.mensaje == 'PROCESANDO PAGO') {
            deudasStore.loading = true;
            deudasStore.smsLoading = event.mensaje
          }
          else if (event.mensaje == 'PAGO REALIZADO') {
            deudasStore.loading = false;
            datosPago.value = event.datosPago
          }
          else {
            deudasStore.loading = false;
          }
          respSocket.value = event;
        }
      }, 1000);
    }
  });
});
const clickDescargarComprobante = async (alias) => {
  await deudasStore.obtenerComprobantes(alias);
  console.log(deudasStore.lstComprobantes);
  if (deudasStore.lstComprobantes.length > 0) {
    for (var comprobante of deudasStore.lstComprobantes) {
      /*console.log("iterandoooo");
      if (comprobante.includes('factura')) {
        console.log("bajando factura");
        const pdfFacturaUrl = url_api + '/reportes/descargar-factura/' + comprobante;
        console.log(pdfFacturaUrl);
        window.open(pdfFacturaUrl, '_blank');
      } else {
        console.log("bajando recibo");
        const pdfReciboUrl = url_api + '/reportes/descargar-recibo/' + comprobante;
        console.log(pdfReciboUrl);
        window.open(pdfReciboUrl, '_blank');
      }*/
      console.log("bajando recibo");
      const pdfReciboUrl = url_api + '/reportes/descargar-recibo/' + comprobante;
      console.log(pdfReciboUrl);
      window.open(pdfReciboUrl, '_blank');
    }
  }
}
const clickGenerarQr = async () => {
  if (!deudasStore.datosCliente.email) {
    basicMessage("Correo es requerido")
    return;
  }

  deudasStore.datosCliente.email = deudasStore.datosCliente.email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(deudasStore.datosCliente.email)) {
    basicMessage("Ingrese un correo válido");
    return;
  }

  if (deudasStore.qrGenerado) {
    let result = await showCustomAlert('Generar QR', 'Ya existe un QR generado. ¿Desea continuar generando un nuevo QR?');
    if (result.isConfirmed) {
      generarQR();
    }
  } else {
    generarQR();
  }
}


const generarQR = async () => {
  generandoQr.value = true;
  let request = {
    deudaIds: deudasStore.deudaSeleccionado.map(item => item.deudaId),
    email: deudasStore.datosCliente.email,
    telefono: deudasStore.datosCliente.telefono ? deudasStore.datosCliente.telefono.trim() : ''
  };
  await deudasStore.generarQr(request);
  if (deudasStore.error) {
    basicMessage(deudasStore.error)
  }
  generandoQr.value = false;
}
const descargaQr = (linkSource) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = "qr.jpg";
  downloadLink.click();
};
const verificarEstadoPagoQr = async () => {
  if (!deudasStore.qrGenerado.alias) {
    basicMessage("QR no esta generado");
    return;
  }
  await deudasStore.verificarEstadoQR({
    alias: deudasStore.qrGenerado.alias
  });
  if (deudasStore.error) {
    basicMessage(deudasStore.error)
    return;
  }
}
</script>
