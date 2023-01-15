(function(){
    const lat = 19.0470994;
    const lng = -98.1726242;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //PIN

})()