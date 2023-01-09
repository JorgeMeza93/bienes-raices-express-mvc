import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
Dropzone.options.imagen = {
    dictDefaultMessage: "Sube tus imágenes aquí",
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 3,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: true,
    addRemoveLinks: true,
    dictRemoveFile: "Quitar Archivo",
    dictMaxFilesExceeded: "El límite es 1 archivo",
    headers: {
        "CSRF-TOKEN": token
    },
    paramName: "imagen",
    init: function(){
        const botonPublicar = document.querySelector("#publicar");
    }
}