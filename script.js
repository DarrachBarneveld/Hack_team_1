import L from "leaflet";
import axios from "axios";

const fetchCountryBtn = document.getElementById("fetch-country-btn");
const geolocationBtn = document.getElementById("geolocation-btn");

const map = L.map("map").setView([51.505, -0.09], 8);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Async function that fetching country information from rest-countries API
async function fetchCountryData(name) {
  const url = `https://restcountries.com/v3.1/name/${name}`;
  try {
    const { data } = await axios(url);
    const { capitalInfo } = data[1]; // This is due to two results from Ireland , GB and Ire
    console.log(data[1]);
    const { latlng } = capitalInfo;
    map.flyTo([latlng[0], latlng[1]], 13);
    displayCountryFlag(data[1].name.common, data[1].flags.svg);
  } catch (error) {
    print(error);
  }
}

// Using web geolocation to find current users location and display on map
function getCurrentLocation() {
  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        map.flyTo([latitude, longitude], 14);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function displayCountryFlag(country, flagUrl) {
  const flag = document.getElementById("flag");
  flag.src = flagUrl;
  flag.alt = `${country}'s flag`;
}

fetchCountryBtn.addEventListener("click", () => fetchCountryData("ireland"));
geolocationBtn.addEventListener("click", getCurrentLocation);