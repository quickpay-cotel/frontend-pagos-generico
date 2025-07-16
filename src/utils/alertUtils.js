// utils/alertUtils.js
import Swal from 'sweetalert2'

export const showToast = ({ icon, title, text }) => {
  Swal.fire({
    icon,
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
  })
}
// utils/alertUtils.js
export const showDialog = ({
  icon,
  title,
  text,
  confirmButtonText = 'Aceptar',
  confirmButtonColor = '#0D47A1',
  confirmButtonTextClass = 'swal-text-white',
  showCancelButton = false,
  cancelButtonText = 'Cancelar',
  cancelButtonTextClass = 'swal-text-white',
}) => {
  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonText,
    confirmButtonColor,
    showCancelButton,
    cancelButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      confirmButton: confirmButtonTextClass,
      cancelButton: cancelButtonTextClass, // ✅ Añade esta línea
    },
  })
}

// Función con configuración personalizada (puedes agregar más si es necesario)
export const showCustomAlert = async (title, text, icon = 'warning') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: "orange",
    cancelButtonColor: "#9b9b9b",
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
  });
};

export const basicMessage = (message) => {
  Swal.fire({
    icon: 'info',
    title: 'Información',
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#0D47A1',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};



