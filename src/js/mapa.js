(function() {

    const lat = 19.0470994;
    const lng = -98.1726242;
    const mapa = L.map('mapa').setView([lat, lng ], 17);
    let marker;
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //PIN
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)
    //Detectar el movimiento del pin
    marker.on("moveend", function(e){
        marker = e.target;
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng))
        //Obtener informacion de las calles
        geocodeService.reverse().latlng(position, 16).run(function (error, resultado){
            marker.bindPopup(resultado.address.LongLabel);
            //Llenar los campos
            document.querySelector(".calle").textContent = resultado?.address?.Address ?? "";
            document.querySelector("#calle").value = resultado?.address?.Address ?? "";
            document.querySelector("#lat").value = resultado?.latlng?.Address ?? "";
            document.querySelector("#lng").value = resultado?.address?.Address ?? "";
             
        })
    })


})()