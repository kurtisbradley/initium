/*--------------------------------------------------------------
Search
--------------------------------------------------------------*/
// variables
const search = document.querySelector("#search");
const help = document.querySelector("#search-help");
const icon = document.querySelector("#search-icon");
const form = document.querySelector("#search-form");
var commands = [
    {
        command: "",
        label: "Google",
        icon: "fab fa-google",
        url: "https://www.google.com/search?q="
    },
    {
        command: "/a",
        label: "Amazon",
        icon: "fab fa-amazon",
        url: "https://www.amazon.com/s/field-keywords="
    },
    {
        command: "/b",
        label: "Book Custom Search",
        icon: "fas fa-book",
        url: "https://cse.google.com/cse?cx=003753031376654422446:szjag5vbefo&q="
    },
    {
        command: "/d",
        label: "DuckDuckGo",
        icon: "fas fa-ban",
        url: "https://duckduckgo.com/?q="
    },
    {
        command: "/r",
        label: "Reddit",
        icon: "fab fa-reddit-alien",
        url: "https://www.reddit.com/search?sort=relevance&t=all&q="
    },
    {
        command: "/w",
        label: "Wikipedia",
        icon: "fab fa-wikipedia-w",
        url: "http://en.wikipedia.org/wiki/Special:Search/"
    },
    {
        command: "/y",
        label: "YouTube",
        icon: "fab fa-youtube",
        url: "https://www.youtube.com/results?search_query="
    }
];
var command = commands[0];

// keyup event
search.addEventListener("keyup", function(e) {
    var value = search.value;
    if (value.indexOf("/?") == 0) {
        help.style.opacity = 1;
        help.style["max-height"] = "1000px";
    } else if (e.keyCode == 13 || e.which == 13) {
        if (value.indexOf(".") > 0) {
            window.location.href = "http://" + encodeURIComponent(value);
        } else {
            window.location.href = command.url + encodeURIComponent(value);
        }
    } else if (value[0] == "/" && value[value.length - 1] == " ") {
        value = value.trim();
        for (var i = 0; i < commands.length; i++) {
            if (value == commands[i].command) {
                command = commands[i];
                icon.className = command.icon;
                search.value = "";
                form.setAttribute("action", command.url);
                break;
            }
        }
    }
});

// keydown event
search.addEventListener("keydown", function(e) {
    var value = search.value;
    var key = e.keyCode || e.which;
    if (key == 0 || key == 229) {
        key = isBackspace(value) ? 8 : 0;
    }
    if (key == 8) {
        if (value == "" && command.icon != commands[0].icon) {
            command = commands[0];
            icon.className = command.icon;
            search.value = "";
            form.setAttribute("action", command.url);
        }
        help.style.opacity = 0;
        help.style["max-height"] = "100px";
    }
});

// fix for Android keycode 229 issue
var prevWord = "";
function isBackspace(val) {
    var bool = val && val.length < prevWord.length;
    prevWord = val;
    return bool;
}

// setup help html
help.innerHTML = "";
for (var i = 0; i < commands.length; i++) {
    var helpcommand = commands[i];
    if (helpcommand.command.length > 0) {
        help.innerHTML += "<li><span><span class='icon " + helpcommand.icon + "'></span><span class='command'>" + helpcommand.command + "</span></span></li>";
    }
}



/*--------------------------------------------------------------
Notes
--------------------------------------------------------------*/
// variables
const notesContainer = document.querySelector('#notes-container');
const notepad = document.querySelector("#notepad");
var notes =  localStorage.getItem("notes");

// event handlers
notepad.addEventListener("keydown", function(e) {
    let key = e.keyCode || e.which;
    if (key === 27) notepad.blur();
});
notepad.addEventListener("focus", function() {
    notepad.value = localStorage.getItem("notes");
    notesContainer.classList.add("active");
});
notepad.addEventListener("blur", function() {
    notesContainer.classList.remove("active");
    if (notes !== notepad.value) {
        localStorage.setItem("notes", notepad.value);
    }
});



/*--------------------------------------------------------------
Weather
--------------------------------------------------------------*/
// access weather data for location then handle and display
function getWeather() {
    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=gold+coast&units=metric&appid=50a34e070dd5c09a99554b57ab7ea7e2', true);
    request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(request.responseText);
        let temperature = Math.round(data.main.temp), weather = data.weather[0].main, icon = 'wb_sunny', color = 'sunny';[
            ['cloud', 'cloudy', 'Clouds', 'Mist', 'Haze'],
            ['cloud-showers-heavy', 'cloudy', 'Drizzle', 'Snow', 'Rain'],
            ['sun', 'sunny', 'Clear']
        ].forEach((key) => {
            key.slice(2).forEach((elem) => {
                if (weather == elem) {
                    [icon, color] = key;
                }
            });
        });
        document.querySelector('#weather').innerHTML = '<i class="fas fa-' + icon +'" ' + color + '></i>';
        document.querySelector('#temperature').innerHTML = temperature + '&deg;C';
    } else {
        document.querySelector('#temperature').innerText = 'ERROR';

    }};
    request.onerror = function() {
        document.querySelector('#temperature').innerText = 'ERROR';
    };
    request.send();
}
getWeather();



/*--------------------------------------------------------------
Bitcoin Price
--------------------------------------------------------------*/
// access current bitcoin price then handle and display
function getBitcoin() {
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.coindesk.com/v1/bpi/currentprice/USD.json", true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            let price = Math.round(data["bpi"]["USD"]["rate_float"]);
            document.querySelector("#btc-price").innerHTML = price;
        } else {
            document.querySelector("#btc-price").innerHTML = "ERROR";
        }
    };
    request.onerror = function() {
        document.querySelector("#btc-price").innerHTML = "ERROR";
    };
    request.send();
}
getBitcoin();



/*--------------------------------------------------------------
Date/Time
--------------------------------------------------------------*/
// variables
const dtInterval = 100;
const timeElement = document.querySelector('#time');
const dateElement = document.querySelector('#date');

// return a string containing the formatted current time
function getTime() {
    let time = new Date();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();

    // hour handling 24 to 12 hr
    let ampm = (hour < 12) ? "AM" : "PM";
    hour = (hour > 12) ? hour - 12 : hour;
    hour = (hour == 0) ? 12 : hour;

    time = hour + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + " " + ampm;
    return time;
}

// return a string containing the formatted current date
function getDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    let year = date.getFullYear()

    date = day + " " + months[month] + " " + year;
    return date;
}

// set date/time and update at interval
function setDateTime() {
    timeElement.innerText = getTime();
    dateElement.innerText = getDate();
}
setDateTime();
setInterval('setDateTime()', dtInterval);