import Swal from 'sweetalert2';

// Función para mostrar alerta básica
export const basicMessage = (titulo='mensaje',texto) => {
  Swal.fire({
    title: titulo,
    text: texto,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: 'orange',  // Color verde para el botón OK
  });
};

// Función para mostrar alerta básica
export const showAlert = () => {
  Swal.fire({
    title: '¡Bienvenido!',
    text: 'Este es un ejemplo básico con SweetAlert2',
    icon: 'info',
    confirmButtonText: 'Aceptar',
  });
};

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


 /*Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});*/
