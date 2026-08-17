
let appState = {
    dataloc: '',
    todayWeatherData: {},
    weekWeatherData: [],
    weather_loc: '',
    icon: '',
    iconText:'',
    weather_Code: '',
    eachday: [],
    eachdayicon: [],
    eachdayiconText: [],
    eachdaytime: [],
    meteoData: [],
}

const fields =[
    "temperature",
    "temperatureApparent",
    "temperatureMin",
    "temperatureMax",
    "windSpeed",
    "windDirection",
    "humidity",
    "pressureSeaLevel",
    "uvIndex",
    "weatherCode",
    "precipitationProbability",
    "precipitationType",
    "sunriseTime",
    "sunsetTime",
    "visibility",
    "moonPhase",
    "cloudCover",
];

const units = "imperial";

const timesteps = ["1h", "1d"];
const timezone = "America/Los_Angeles";




document.getElementById('auto_detect').onclick = function() {checked()};
document.getElementById('submit').onsubmit = function() {getGeodata()};
document.getElementById('clear').onclick = function() {cleardata()};


 function checked() {
    if (document.getElementById('auto_detect').checked == true) {
        document.getElementById('city').removeAttribute('required');
        document.getElementById('state').removeAttribute('required');
        document.getElementById('street').removeAttribute('required');
    }else {
        document.getElementById('city').setAttribute('required', true);
        document.getElementById('state').setAttribute('required', true);
        document.getElementById('street').setAttribute('required', true);
    } 
 } 



 function ipdata() {
    var ip_url = 'https://ipinfo.io/json?token=#';
 
     fetch(ip_url)
     .then(res => res.json())
     .then(data => {
        appState.dataloc = data.loc
        appState.weather_loc = data.city + ', ' + data.region + ', ' + data.country;
        displayWeather(appState);
        getWeather(appState);
    })
     .catch(err => {
            console.log(err)
    })
 }
     

 

function getGeodata() {
    event.preventDefault();
        var street = document.getElementById('street').value;
        var city = document.getElementById('city').value;
        var state = document.getElementById('state').value;

        city = city.replace(/\s/g, '+');
        state = state.replace(/\s/g, '+');

        var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=#`

    if (document.getElementById('auto_detect').checked == true) {
            ipdata();  
    }else {
        fetch(url)
        .then(response => response.json())
        .then(data => obj = data)
        .then(() => {
            appState.dataloc = obj.results[0].geometry.location.lat + ',' + obj.results[0].geometry.location.lng;

            appState.weather_loc = obj.results[0].formatted_address;
            console.log(appState);
            displayWeather(appState);
            getWeather(appState);
        });
        
        

    }
}

function cleardata(){
    document.getElementById('street').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('auto_detect').checked = false;
    document.getElementById('result').innerHTML = '';
    appState ={
        dataloc: '',
        todayWeatherData: {},
        weekWeatherData: [],
        weather_loc: '',
        icon: '',
        iconText:'',
        weather_Code: '',
        eachday: [],
        eachdayicon: [],
        eachdayiconText: [],
        eachdaytime: [],
        meteoData: [],
    };
}

function getWeather(appState){
   let getdataloc = appState.dataloc
    url = `/weather?location=${getdataloc}&fields=${fields}&units=${units}&timesteps=${timesteps}&timezone=${timezone}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        getdata= data;
        console.log(getdata);
        appState.todayWeatherData = getdata.data.timelines[1].intervals[0].values;
        appState.meteoData = getdata.data.timelines[1].intervals;
        appState.weekWeatherData = getdata.data.timelines[0].intervals;
        console.log(appState.todayWeatherData);
        
    })
    .catch(err => {
        console.log(err)
    })
    
    displayWeather(appState);
}


function displayWeather(appState){
    let weekResult;
    let weather_loc;
    let temp;
    let results;
    console.log(appState.todayWeatherData);

    setTimeout(() => {
        if (appState.todayWeatherData.temperature == undefined) {
            document.getElementById('result').innerHTML = `<p class="backend_error"> Limit reached for tomorrow.io </p>`;
            return
        }else{
        setTimeout(() => {
        
        weekfraction = document.getElementById('week');
        todayfractionn = document.getElementById('today');
    
        if (weekfraction) {
            weekfraction.remove();
        }
    
        if (todayfractionn) {
            todayfractionn.remove();
        }
    
        weather_loc = appState.weather_loc;
        results = document.getElementById('result');
        temp = appState.todayWeatherData.temperature + '°';
    
        let humidity = appState.todayWeatherData.humidity + '%';
        let windSpeed = appState.todayWeatherData.windSpeed + 'mph';
        let uvIndex = appState.todayWeatherData.uvIndex;
        let Pressure = appState.todayWeatherData.pressureSeaLevel+ 'inHg';
        let visibility = appState.todayWeatherData.visibility + 'mi';
        let cloudCover = appState.todayWeatherData.cloudCover + '%';
        appState.weather_Code = appState.todayWeatherData.weatherCode;
    
        console.log(appState.weather_Code);
        weatherDisplayIcon(appState.weather_Code);
    
       weekResult = `<div class="today" id="today">
            <p class="today_loc" id="today_loc">${weather_loc}</p>
            <div class="today_row">
                <div class="today_colomn">
                    <img id="today_img" src="${appState.icon}" alt="weather icon">
                    <p class="today_cast" id="today_cast">${appState.iconText}</p>
                </div>
                <div class="today_colomnI">
                    <p class="T_temp" id="temp">${temp}</p>
                </div>
            </div>
            <div class="today_row">
                <div class="today_colomn1">
                    <p class="today_lable">Humidity</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/humidity.png" alt="weather icon">
                    <p class="today_val" id="today_val">${humidity}</p>
                </div>
                <div class="today_colomn1">
                    <p class="today_lable">Pressure</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/Pressure.png" alt="weather icon">
                    <p class="today_val" id="today_val">${Pressure}</p>
                </div>
                <div class="today_colomn1">
                    <p class="today_lable">Wind Speed</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/Wind_Speed.png" alt="weather icon">
                    <p class="today_val" id="today_val">${windSpeed}</p>
                </div>
                <div class="today_colomn1">
                    <p class="today_lable">Visibility</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/Visibility.png" alt="weather icon">
                    <p class="today_val" id="today_val">${visibility}</p>
                </div>
                <div class="today_colomn1">
                    <p class="today_lable">Cloud Cover</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/Cloud_Cover.png" alt="weather icon">
                    <p class="today_val" id="today_val">${cloudCover}</p>
                </div>
                <div class="today_colomn1">
                    <p class="today_lable">UV Level</p>
                    <img class="today_img2" id="today_img2" src="../static/Images/UV_Level.png" alt="weather icon">
                    <p class="today_val" id="today_val">${uvIndex}</p>
                </div>
            </div>
        </div>
        <div class="week" id="week"></div>`;
       
    
        results.innerHTML = weekResult
        }, 2000);
        
        setTimeout(() => {
            
            let weekly_weather = appState.weekWeatherData;
            let dataResult = document.getElementById('week');
    
            let weekData = `<table id="weekly_weather">
                <tr>
                  <th>Date</th>
                  <th colspan="2">Status</th>
                  <th>Temp High</th>
                  <th>Temp low</th>
                  <th>Wind Speed</th>
                </tr>
              `;
            for (let i = 0; i < weekly_weather.length; i++) {
                let status = weekly_weather[i].values.weatherCode;
                let day = new Date(weekly_weather[i].startTime).toLocaleString('default', {weekday: 'long',day: 'numeric',month: 'short', year: 'numeric'});
                
                weatherDisplayIcon(status);
    
                let tempLow = Math.round(weekly_weather[i].values.temperatureMin).toFixed(2);
                let tempHigh = Math.round(weekly_weather[i].values.temperatureMax).toFixed(2);
                let windSpeed = weekly_weather[i].values.windSpeed;
                weekData += `<tr id="row_${i}" onclick="weather_details()">
                  <td>${day}</td>
                  <td class="td1"><img class="status_img" src="${appState.icon}"></td>
                  <td class="td2">${appState.iconText}</td>
                  <td>${tempHigh}</td>
                  <td>${tempLow}</td>
                  <td>${windSpeed}</td>
                </tr>`;
                appState.eachday.push(weekly_weather[i].values);
                appState.eachdayicon.push(appState.icon);
                appState.eachdayiconText.push(appState.iconText);
                appState.eachdaytime.push(day);
            }
    
            weekData += `</table>`;
    
            dataResult.innerHTML = weekData;
    
            for(let i=0; i<appState.eachday.length; i++){
                document.getElementById(`row_${i}`).onclick = function() {weather_details(i, appState)};
            }
        }, 2000);
        }
    }, 2000);
   

}


    
function weatherDisplayIcon(weatherCode){
    let weatherIcon;
    let weatherIconText;

    if (weatherCode == 1000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/clear_day.svg';
        weatherIconText = 'Clear';
    }else if (weatherCode == 1001){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/cloudy.svg';
        weatherIconText = 'Cloudy';
    }else if (weatherCode == 1100){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/mostly_clear_day.svg';
        weatherIconText = 'Mostly Clear';
    }else if(weatherCode == 1101){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/partly_cloudy_day.svg';
        weatherIconText = 'Partly Cloudy';
    }else if(weatherCode == 1102){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/mostly_cloudy.svg';
        weatherIconText = 'Mostly Cloudy';
    }else if(weatherCode == 2000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/fog.svg';
        weatherIconText = 'Fog';
    }else if(weatherCode == 2100){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/fog_light.svg';
        weatherIconText = 'Light Fog';
    }else if(weatherCode == 4000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/drizzle.svg';
        weatherIconText = 'Drizzle Rain';
    }else if(weatherCode == 4001){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/rain.svg';
        weatherIconText = 'Rain';
    }else if(weatherCode == 4200){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/rain_light.svg';
        weatherIconText = 'Light Rain';
    }else if(weatherCode == 4201){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/rain_heavy.svg';
        weatherIconText = 'Heavy Rain';
    }else if(weatherCode == 5000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/snow.svg';
        weatherIconText = 'Snow';
    }else if(weatherCode == 5001){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/flurries.svg';
        weatherIconText = 'Flurries';
    }else if(weatherCode == 5100){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/snow_light.svg';
        weatherIconText = 'Light Snow';
    }else if(weatherCode == 5101){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/snow_heavy.svg';
        weatherIconText = 'Heavy Snow';
    }else if(weatherCode == 6000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/freezing_drizzle.svg';
        weatherIconText = 'Freezing Drizzle';
    }else if(weatherCode == 6001){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/freezing_rain.svg';
        weatherIconText = 'Freezing Rain';
    }else if(weatherCode == 6200){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/freezing_drizzle_light.svg';
        weatherIconText = 'Light Freezing Drizzle';
    }else if(weatherCode == 6201){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/freezing_rain_heavy.svg';
        weatherIconText = 'Heavy Freezing Rain';
    }else if(weatherCode == 7000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/ice_pellets.svg';
        weatherIconText = 'Ice Pellets';
    }else if(weatherCode == 7101){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/ice_pellets_heavy.svg';
        weatherIconText = 'Heavy Ice Pellets';
    }else if(weatherCode == 7102){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/ice_pellets_light.svg';
        weatherIconText = 'Light Ice Pellets';
    }else if(weatherCode == 8000){
       weatherIcon = '../static/Images/Weather Symbols for Weather Codes/tstorm.svg';
        weatherIconText = 'Thunderstorm';
    }

    appState.icon = weatherIcon;
    appState.iconText = weatherIconText;
}


function weather_details(id,appState){


    let time = appState.eachdaytime;
    let eachday = appState.eachday[id];
    console.log(eachday);
    let status = appState.eachdayiconText[id];
    let icon =  appState.eachdayicon[id];
    let date = new Date(time[id]).toLocaleString('default', {weekday: 'long',  day: 'numeric',month: 'short', year: 'numeric'});
    let tempHigh = eachday.temperatureMax.toFixed(2);
    let tempLow = eachday.temperatureMin.toFixed(2);
    let precipitation = eachday.precipitationType;
    let rainChance = eachday.precipitationProbability + '%';
    let windSpeed = eachday.windSpeed + 'mph';
    let humidity = eachday.humidity + '%';
    let visibility = eachday.visibility + 'mi';
    let sunrise = new Date(eachday.sunriseTime).toLocaleTimeString('en-us', {hour:'numeric', minute:'numeric'});
    let sunset = new Date(eachday.sunsetTime).toLocaleTimeString('en-us', {hour:'numeric', minute:'numeric'});

   
    if(precipitation == 0){
        precipitation = 'N/A';
    }else if (precipitation == 1){
        precipitation = 'rain';
    }else if (precipitation == 2){
        precipitation = 'snow';
    }else if (precipitation == 3){
        precipitation = 'freezing rain';
    }else if (precipitation == 4){
        precipitation = 'ice pellets';
    };  


    details = `<p class="daily_title"> Daily weather details</p>
   <hr id="rule">
    <div class="daily_container" id="daily">
        <div class="daily_row">
            <div class="daily_column1">
                <p class="daily_date">${date}</p>
                <p class="daily_status">${status}</p>
                <p class="daily_temp">${tempHigh}˚F/${tempLow}˚F</p>
            </div>
            <div class="daily_column2">
                <img class="daily_img" src="${icon}">
            </div>
        </div>
        <div class="daily_row">
            <div class="daily_column">
                <p class="daily_info">Precipitation: ${precipitation}</p>
                <p class="daily_info">chance of rain: ${rainChance}</p>
                <p class="daily_info">Wind speed: ${windSpeed}</p>
                <p class="daily_info">Humidity: ${humidity}</p>
                <p class="daily_info">Visibility: ${visibility}</p>
                <p class="daily_info">sunrise/sunset: ${sunrise + '/' + sunset}</p>
            </div>
        </div>
    </div>
    <div class="charts" id="charts">
        <p class="weather_charts">Weather Charts</p>
        <hr id="rule">
        <img class="view_chart" id="view_chart" src="../static/Images/point-down-512.png" onclick="function()">
        <div id="show_chart" class="show_chart" style="height:0px" hidden>
        <div id="display_charts" class="display_charts"></div>
        <div id="display_chart2" class="display_chart2"></div>
        </div>
        
    </div>`

    document.getElementById('result').innerHTML = details;
    
    document.getElementById('view_chart').onclick = function() {
        if(document.getElementById('show_chart').hidden == false){
            document.getElementById('show_chart').hidden = true;
            document.getElementById('view_chart').src="../static/Images/point-down-512.png";
            document.getElementById('show_chart').style.height = '0px';
        }else{document.getElementById('show_chart').hidden = false;
            document.getElementById('view_chart').src="../static/Images/point-up-512.png";
            document.getElementById('show_chart').style.height = '1000px';
        }
       };


setTimeout(() => {
        
    (async () => {
        const data = appState.weekWeatherData.map((item) => {   
            return [new Date(item.startTime).getTime(), item.values.temperatureMin, item.values.temperatureMax];
        }
        );
    
        Highcharts.chart('display_charts', {
            chart: {
                type: 'arearange',
                zooming: {
                    type: 'x'
                },
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },
            title: {
                text: 'Temperature variation by day'
            },
            xAxis: {
                type: 'datetime',
                accessibility: {
                    rangeDescription: '#'
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°F',
                xDateFormat: '%A, %b %e'
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Temperatures',
                data: data,
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#f7a35c'],
                        [1, '#aaeeee']
                    ]
                }
            }]
        });
    })()
    


    function Meteogram(json, container) {
        // Parallel arrays for the chart data, these are populated as the JSON file
        // is loaded
        this.symbols = [];
        this.humidity = [];
        this.humidityError = []; // Only for some data sets
        this.winds = [];
        this.temperatures = [];
        this.pressures = [];
    
        // Initialize
        this.json = json;
        this.container = container;
    
        // Run
        this.parseYrData();
    }
    

    Meteogram.dictionary = {
        clearsky: {
            symbol: '01',
            text: 'Clear sky'
        },
        fair: {
            symbol: '02',
            text: 'Fair'
        },
        partlycloudy: {
            symbol: '03',
            text: 'Partly cloudy'
        },
        cloudy: {
            symbol: '04',
            text: 'Cloudy'
        },
        lightrainshowers: {
            symbol: '40',
            text: 'Light rain showers'
        },
        rainshowers: {
            symbol: '05',
            text: 'Rain showers'
        },
        heavyrainshowers: {
            symbol: '41',
            text: 'Heavy rain showers'
        },
        lightrainshowersandthunder: {
            symbol: '24',
            text: 'Light rain showers and thunder'
        },
        rainshowersandthunder: {
            symbol: '06',
            text: 'Rain showers and thunder'
        },
        heavyrainshowersandthunder: {
            symbol: '25',
            text: 'Heavy rain showers and thunder'
        },
        lightsleetshowers: {
            symbol: '42',
            text: 'Light sleet showers'
        },
        sleetshowers: {
            symbol: '07',
            text: 'Sleet showers'
        },
        heavysleetshowers: {
            symbol: '43',
            text: 'Heavy sleet showers'
        },
        lightsleetshowersandthunder: {
            symbol: '26',
            text: 'Light sleet showers and thunder'
        },
        sleetshowersandthunder: {
            symbol: '20',
            text: 'Sleet showers and thunder'
        },
        heavysleetshowersandthunder: {
            symbol: '27',
            text: 'Heavy sleet showers and thunder'
        },
        lightsnowshowers: {
            symbol: '44',
            text: 'Light snow showers'
        },
        snowshowers: {
            symbol: '08',
            text: 'Snow showers'
        },
        heavysnowshowers: {
            symbol: '45',
            text: 'Heavy show showers'
        },
        lightsnowshowersandthunder: {
            symbol: '28',
            text: 'Light snow showers and thunder'
        },
        snowshowersandthunder: {
            symbol: '21',
            text: 'Snow showers and thunder'
        },
        heavysnowshowersandthunder: {
            symbol: '29',
            text: 'Heavy snow showers and thunder'
        },
        lightrain: {
            symbol: '46',
            text: 'Light rain'
        },
        rain: {
            symbol: '09',
            text: 'Rain'
        },
        heavyrain: {
            symbol: '10',
            text: 'Heavy rain'
        },
        lightrainandthunder: {
            symbol: '30',
            text: 'Light rain and thunder'
        },
        rainandthunder: {
            symbol: '22',
            text: 'Rain and thunder'
        },
        heavyrainandthunder: {
            symbol: '11',
            text: 'Heavy rain and thunder'
        },
        lightsleet: {
            symbol: '47',
            text: 'Light sleet'
        },
        sleet: {
            symbol: '12',
            text: 'Sleet'
        },
        heavysleet: {
            symbol: '48',
            text: 'Heavy sleet'
        },
        lightsleetandthunder: {
            symbol: '31',
            text: 'Light sleet and thunder'
        },
        sleetandthunder: {
            symbol: '23',
            text: 'Sleet and thunder'
        },
        heavysleetandthunder: {
            symbol: '32',
            text: 'Heavy sleet and thunder'
        },
        lightsnow: {
            symbol: '49',
            text: 'Light snow'
        },
        snow: {
            symbol: '13',
            text: 'Snow'
        },
        heavysnow: {
            symbol: '50',
            text: 'Heavy snow'
        },
        lightsnowandthunder: {
            symbol: '33',
            text: 'Light snow and thunder'
        },
        snowandthunder: {
            symbol: '14',
            text: 'Snow and thunder'
        },
        heavysnowandthunder: {
            symbol: '34',
            text: 'Heavy snow and thunder'
        },
        fog: {
            symbol: '15',
            text: 'Fog'
        }
    };
    
   
    Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
        const xAxis = chart.xAxis[0];
    
        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {
    
            // Get the X position
            const isLast = pos === max + 36e5,
                x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
    
            // Draw the vertical dividers and ticks
            const isLong = this.resolution > 36e5 ?
                pos % this.resolution === 0 :
                i % 2 === 0;
    
            chart.renderer
                .path([
                    'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32,
                    'Z'
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }
    
        // Center items in block
        chart.get('windbarbs').markerGroup.attr({
            translateX: chart.get('windbarbs').markerGroup.translateX + 8
        });
    
    };
    
    /**
     * Build and return the Highcharts options structure
     */
    Meteogram.prototype.getChartOptions = function () {
        return {
            chart: {
                renderTo: this.container,
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 310,
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },
    
            defs: {
                patterns: [{
                    id: 'humidity-error',
                    path: {
                        d: [
                            'M', 3.3, 0, 'L', -6.7, 10,
                            'M', 6.7, 0, 'L', -3.3, 10,
                            'M', 10, 0, 'L', 0, 10,
                            'M', 13.3, 0, 'L', 3.3, 10,
                            'M', 16.7, 0, 'L', 6.7, 10
                        ].join(' '),
                        stroke: '#68CFE8',
                        strokeWidth: 1
                    }
                }]
            },
    
            title: {
                text: 'Hourly Weather(For Next 5 Days)',
                align: 'center',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            },
    
            credits: {
                text: 'Forecast',
                href: '',
                position: {
                    x: -40
                }
            },
    
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'
    
            },
    
            xAxis: [{ // Bottom X axis
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
                minorTickInterval: 36e5, // one hour
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, { // Top X axis
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: ' +
                        'bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: 8
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],
    
            yAxis: [{ // temperature axis
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{ // zero plane
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'
    
            }, { // humidity axis
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0
    
            }, { // Air pressure
                allowDecimals: false,
                title: { // Title on top of axis
                    text: 'inHg',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: 'orange'
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: 'orange'
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],
    
            legend: {
                enabled: false
            },
    
            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },
    
    
            series: [{
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.y}°F</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            }, {
                name: 'humidity',
                data: this.humidityError,
                type: 'column',
                color: 'url(#humidity-error)',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                tooltip: {
                    valueSuffix: ' %',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.minvalue} % - ' +
                        '{point.maxvalue} %</b><br/>'
                },
                grouping: false,
                dataLabels: {
                    enabled: this.hashumidityError,
                    filter: {
                        operator: '>',
                        property: 'maxValue',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: 'gray'
                    }
                }
            }, {
                name: 'humidity',
                data: this.humidity,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: !this.hashumidityError,
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: '#666'
                    }
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }, {
                name: 'Air pressure',
                color: 'orange',
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' inHg'
                },
                dashStyle: 'shortdot',
                yAxis: 2
            }, {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors[1],
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 18,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' mph'
                }
            }]
        };
    };
    
    /**
     * Post-process the chart from the callback function, the second argument
     * Highcharts.Chart.
     */
    Meteogram.prototype.onChartLoad = function (chart) {
    
      //  this.drawWeatherSymbols(chart);
        this.drawBlocksForWindArrows(chart);
    
    };
    
    /**
     * Create the chart. This function is called async when the data file is loaded
     * and parsed.
     */
    Meteogram.prototype.createChart = function () {
        this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
            this.onChartLoad(chart);
        });
    };
    
    Meteogram.prototype.error = function () {
        document.getElementById('loading').innerHTML =
            '<i class="fa fa-frown-o"></i> Failed loading data, please try again ' +
            'later';
    };
    
    /**
     * Handle the data. This part of the code is not Highcharts specific, but deals
     * with yr.no's specific data format
     */
    Meteogram.prototype.parseYrData = function () {
    
        let pointStart;
    
        if (!this.json) {
            return this.error();
        }
    
        // Loop over hourly (or 6-hourly) forecasts
        this.json.forEach((node, i) => {
            
            const x = Date.parse(node.startTime),
            
               nextHours = appState.iconText,
                to = Date.parse(node.endTime);
    
            if (to > pointStart + 48 * 36e5) {
                return;
            }
    
            // Populate the parallel arrays
            this.symbols.push(nextHours)
    
            this.temperatures.push({
                x,
                y: Math.round(node.values.temperature),
                // custom options used in the tooltip formatter
                to,
            });
    
            this.humidity.push({
                x,
                y: Math.round(node.values.humidity) ,
            });
            
            

            if (i % 2 === 0) {
                this.winds.push({
                    x,
                    value: node.values.windSpeed,
                    direction: node.values.windDirection
                });
            }
    
            this.pressures.push({
                x,
                y: Math.round(node.values.pressureSeaLevel),
            });
    
            if (i === 0) {
                pointStart = (x + to) / 2;
            }
        });
    
        // Create the chart when the data is loaded
        this.createChart();
    };
    // End of the Meteogram protype
    
    // On DOM ready...
    
    // Set the hash to the yr.no URL we want to parse

    window.meteogram = new Meteogram(appState.meteoData,'display_chart2');
}, 3000);

}   


