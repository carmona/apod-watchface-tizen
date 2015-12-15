var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

var dia,
    horas,
    minutos;

var apodUrl,
    apodTitulo,
    apodData;

function atualizarHora(){
    //moment -> tela
    dia = moment().format("ddd, DD/MM");
    horas = moment().format("HH");
    minutos = moment().format("mm");
    mostrarHora();
}

function mostrarHora(){
    document.querySelector("#str_hora").innerText = horas;
    document.querySelector("#str_minuto").innerText = minutos;
    document.querySelector("#str_dia").innerText = dia;

    var faltaParaMinuto = 60 - moment().format("s");
    setTimeout(atualizarHora(),faltaParaMinuto*1000);
}

function handleXhr(event, xhr, options){
    //if media type = image then trocaFundo
    if(xhr.status === 200 && event.media_type === "image"){
        trocarFundo(event.url);
    }
}

function trocarFundo(url){
    //xhr apod -> fundo
    document.querySelector("body")style.backgroundImage = "url('"+url+"')";
}

function atualizarBateria() {
    var battery_level = Math.floor(battery.level * 10) + 1;
    document.querySelector("#batt-val")style.width = battery_level + "%";
}

function bindEvents() {
    battery.addEventListener('chargingchange', atualizarBateria);
    battery.addEventListener('chargingtimechange', atualizarBateria);
    battery.addEventListener('dischargingtimechange', atualizarBateria);
    battery.addEventListener('levelchange', atualizarBateria);

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            //ambientDigitalWatch();

        } else {
            // rendering normal case
            //initDigitalWatch();
        }
    });
}
window.onload = function() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    $.ajaxSetup({
        url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
        success: handleXhr
    });

    atualizarHora();
    mostrarHora();
    bindEvents();
    
};
