/*
3 component olacak.
1.si: en tepedeki arama kısmı
2.si o anki hava durumu
3.sü ileriki zamanlardaki hava durumu(forecast)
*/
import "./App.css";
import Currentweather from "./components/current-weather/current-weather";
import Search from "./components/search/search";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./components/api";
import { useState } from "react";
import Forecast from "./components/forecast/forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleonSearchChange = (searchData) => {

    const [lat, lon] = searchData.value.split(" ");

    //current ve forecast weather için 2 api call fetch edeceğiz. promise all kullanıyoruz.
    const currentWeatherFetch = fetch( 
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric` //&units&metric api den gelen fahrenheit i celcius a çevirmek için ekledik
    );

    const forecastFetch = fetch( 
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        //response lar geldikten ve json olduktan sonra update edebiliriz.
        setCurrentWeather({ city: searchData.label, ...weatherResponse });//api dan gelen data ekranda gösterilmesini istediğimiz gibi olmadığı için (Belgrade BS şeklinde istiyoruz) o yüzden json olan veriyi seatch.js deki label ile eşleştirdik.
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };
  console.log(currentWeather);
  console.log(forecast);

  return (
    <div className="container">
      <Search onSearchChange={handleonSearchChange} />

      {currentWeather && <Currentweather data={currentWeather} />} {/*current weather varsa "data" yı currentWeather e gönder*/}

      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
