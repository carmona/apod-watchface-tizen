/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var flagConsole = false,
    battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,
    interval;

function displayWeekDay(date) {
    var str_day = document.getElementById('str_day'),
        get_day = date.getDay(),
        str_allday;
        arr_day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        arr_month = ["Jan", "Fab", "Mar", "Apr", "May", "Jul", "Jun","Aug", "Sep", "Oct", "Nov", "Dec" ], 
        get_date = date.getDate(),
        month = date.getMonth();

    if (get_date < 10) {
        get_date = "0" + get_date;
    }

    str_allday = arr_day[get_day] + " " + get_date + " " + arr_month[month];
    str_day.innerHTML = str_allday;
}

function displayTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_minutes = document.getElementById('str_minutes'),
        str_ampm = document.getElementById('str_ampm'),
        date;

    try{
        date  = tizen.time.getCurrentDateTime();
    }catch(e) {
        alert(e.message);
    }

    displayWeekDay(date);

    hours = date.getHours();
    str_hours.innerHTML = date.getHours();
    str_minutes.innerHTML = date.getMinutes();

    if (hours < 12) {
        str_ampm.innerHTML = "AM";

        if (hours < 10) {
            str_hours.innerHTML = "0" + date.getHours();
        }
    } else {
        str_ampm.innerHTML = "PM";
    }

    if (date.getMinutes() < 10) {
        str_minutes.innerHTML = "0" + date.getMinutes();
    }
    if (flagConsole) {
        str_console.style.visibility = 'visible';
        flagConsole = false;
    } else {
        str_console.style.visibility = 'hidden';
        flagConsole = true;
    }
}

function initDigitalWatch() {
    //document.getElementsByTagName('body')[0].style.backgroundImage = "url('/images/bg.jpg')";
    interval = setInterval(displayTime, 500);
}

function ambientDigitalWatch() {
    clearInterval(interval);
    document.getElementsByTagName('body')[0].style.backgroundImage = "none";
    displayTime();
    document.getElementById('str_console').style.visibility = 'visible';
}

function getBatteryState() {
    var battery_level = Math.floor(battery.level * 10),
        battery_fill = document.getElementById('battery_fill');

    battery_level = battery_level + 1;
    battery_fill.style.width = battery_level + "%";

}

function bindEvents() {
    battery.addEventListener('chargingchange', getBatteryState);
    battery.addEventListener('chargingtimechange', getBatteryState);
    battery.addEventListener('dischargingtimechange', getBatteryState);
    battery.addEventListener('levelchange', getBatteryState);

    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        ambientDigitalWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            ambientDigitalWatch();

        } else {
            // rendering normal case
            initDigitalWatch();
        }
    });
}
function trocaFonte(){
    var contador = 0;
    var classes = ['sarpanch','sharetech','orbitron'];
    setInterval(function(){
        document.querySelector('#carmona').className = classes[contador];
        document.querySelector('#nomeclasse').text = document.querySelector('#carmona').className;
        //contador = (contador < 6) ? contador++ : 0;
        if(contador < 2){
            contador++;
        }else{
            contador = 0;
        }
    }, 2000);
}
window.onload = function() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    displayTime();
    initDigitalWatch();
    bindEvents();
    //trocaFonte();
};
