import { Dropzone } from "dropzone";

Dropzone.options.imagen = {
    dictDefaultMessage: "Sube tus imágenes aquí",
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 3,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false
}