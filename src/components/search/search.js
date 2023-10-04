//async paginate burada kullanılacak
import { AsyncPaginate } from "react-select-async-paginate";
import { useState } from "react";
import { GEO_API_URL, geoApiOptions } from "../api";

const Search = ({ onSearchChange }) => { //onSearchChange func. u parametre olarak geçiyoruz. app.js de kullanılıyor.
  const [search, setSearch] = useState(null);

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          //obje array i require ediyor api. input a girilen datayı editliyoruz.
/*latitude ve longitude openweather API si tarafından istenen bir şey. O yüzden rapidApi sitesinden(GeoAPİ) şehirlerin lat ve lon unu buradan alıyoruz.
Böylece lot ve lon a göre şehri tanıyıp hava durumunu verecek bize openweather api si. latitude ve longitude u Openweather api si istediği için kullanmak zorundayız */          
          options: response.data.map((e) => {
            return {
              value: `${e.latitude} ${e.longitude}`, 
              label: `${e.name} ${e.countryCode}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };

  const handleOnChange = (searchData) => {
    //paginate e girilen data yı parametre alır.
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600} //API ye gönderilen request leri sınırlama. 600 ms.
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
