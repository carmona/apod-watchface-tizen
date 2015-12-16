var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

var dia,
    horas,
    minutos;

var apodUrl,
    apodTitulo,
    apodImg;

function configuracoes(){
    var strLocale = navigator.languages[0] || "en-US";
    moment.locale(strLocale);
    if(!localStorage.getItem("apodTitulo")){
        localStorage.setItem("apodTitulo","When Gemini Sends Stars to Paranal");
    }
    if(!localStorage.getItem("apodUrl")){
        localStorage.setItem("apodUrl","../images/paranalgeminids_guisard.jpg");
    }
    $.ajaxSetup({
        url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
        success: sucesso,
        error: trataErro
    });
}

function atualizarHora(){
    //moment -> tela
    var diaAtual = dia,
        novoDia = moment().format("DD");
    dia = moment().format("ddd DD/MM");
    horas = moment().format("HH");
    minutos = moment().format("mm");
    mostrarHora();
    if(novoDia > diaAtual){
        $.ajax();
    }
}

function mostrarHora(){
    document.querySelector("#horas").innerText = horas;
    document.querySelector("#minutos").innerText = minutos;
    document.querySelector("#dia").innerText = dia;

    var faltaParaMinuto = 60 - moment().format("s");
    setTimeout(function(){
        atualizarHora();
    },faltaParaMinuto*1000);
}

function baixarImagem(url){
    $.ajax({
        url:url,
        succes: function(event, xhr, options){
            localStorage.setItem("apodImg",window.btoa(event));
        },
        error: function(data){
            console.dir(data);
        }
    });
}

function sucesso(event, xhr, options){
    if(options.status === 200 && event.media_type === "image"){
        localStorage.setItem("apodTitulo", event.title);
        localStorage.setItem("apodUrl", event.url);
        //baixarImagem(event.url);
        trocarFundo();
    }
}

function trataErro(data){
    console.dir(data);
    alert("update service unavailable");
}

function trocarFundo(){
    //$("#apod-back").css("background-image","url(data:image/jpg;base64"+texto);
    document.querySelector("#apod-back").style.backgroundImage = "url('"+localStorage.getItem("apodUrl")+"')";
}

function mostrarTitulo(){
    alert(localStorage.getItem("apodTitulo"));
}

function setBateria(val){
    battery_level = val;
}

function atualizarBateria() {
    var cor = "green";
    var battery_level = Math.floor(battery.level * 10) + 1;
    if(battery_level > 50){
        cor = "green";
    }else if(battery_level > 15){
        cor = "yellow";
    }else{
        cor = "red";
    }
    document.querySelector("#batt-val").style.width = battery_level + "%";
    document.querySelector("#batt-val").style.backgroundColor = cor;
}

function bindEvents() {
    if(battery){
        battery.addEventListener('chargingchange', atualizarBateria);
        battery.addEventListener('chargingtimechange', atualizarBateria);
        battery.addEventListener('dischargingtimechange', atualizarBateria);
        battery.addEventListener('levelchange', atualizarBateria);
    }
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
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    $("#data").off("click").on("click",function(){
        mostrarTitulo();
    });
}
window.onload = function() {
    configuracoes();
    atualizarHora();
    if(battery){
        atualizarBateria();
    }
    bindEvents();
};
