import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
Dropzone.options.imagen = {
    dictDefaultMessage: "Sube tus imágenes aquí",
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 3,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Quitar Archivo",
    dictMaxFilesExceeded: "El límite es 1 archivo",
    headers: {
        "CSRF-TOKEN": token
    },
    paramName: "imagen",
    init: function(){
        const dropzone = this;
        const botonPublicar = document.querySelector("#publicar");
        botonPublicar.addEventListener("click", function (){
            dropzone.processQueue()
        });
        dropzone.on("queuecomplete", function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = "/mis-propiedades"
            }
        });
    }
}