function convertDate(dateString) {
  const dateMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  }

  var dateDate = dateString.split(" ")[0].split("-")[2];
  var dateMonth = dateMap[dateString.split("-")[1]];

  return `${dateDate} ${dateMonth}`;
}

let weather = {
  apiKey: "1afc7abcd883c297e561010b20596b02",

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=metric&appid=" + this.apiKey
      ) 
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  fetchForecast: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=metric&appid=" + this.apiKey
      ) 
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayForecast(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1920x1080/?" + name + "')";
  },
  displayForecast: function (data) {
    var cardDetails = [];
    const forecastData = data.list;

    forecastData.forEach((element) => {
      cardDetails.push({
        date: element.dt_txt,
        icon: element.weather[0].icon,
        temp: element.main.temp, 
      })
    })

    var finalCardDetails = cardDetails.filter((element) => {
      return element.date.includes("00:00:00");
    });

    for (let x = 0; x < finalCardDetails.length; x++) {
      document.querySelectorAll(".forecast-card")[x].children[0].innerText = convertDate(finalCardDetails[x].date);
      document.querySelectorAll(".forecast-card")[x].children[1].src = "https://openweathermap.org/img/wn/" + finalCardDetails[x].icon + ".png";
      document.querySelectorAll(".forecast-card")[x].children[2].innerText = finalCardDetails[x].temp + "°C";
    }

  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
    this.fetchForecast(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });


weather.fetchWeather("Mumbai");
weather.fetchForecast("Mumbai");
