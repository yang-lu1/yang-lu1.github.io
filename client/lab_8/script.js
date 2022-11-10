function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
}

function restArrayMake(dataArray) {
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });
  return listItems;
}

function createHtmlList(collection) {
  const targetList = document.querySelector('.restList');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const { name } = item;
    const displayName = name.toLowerCase();
    const injectThis = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThis;
  });
}

function initMap(targetId) {
  const pgCountyCoord = [38.7849, -76.8721];
  const map = L.map(targetId).setView(pgCountyCoord, 13);
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }
  ).addTo(map);
  return map;
}
function addMapMarker(map, collection) {
  const bounds = L.latLngBounds();
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  collection.forEach((item) => {
  //   const point = item.geocoded_column_1?.coordinates;
  //   L.marker([point[1], point[0]]).addTo(map);
  // });
    const point = item.geocoded_column_1?.coordinates;
    const LatLong = [point[1], point[0]];
    L.marker(LatLong).addTo(map);
    bounds.extend(LatLong); // Extend LatLngBounds with coordinates
  });
  map.fitBounds(bounds);
}

function refreshList(target, storage) {
  target.addEventListener('click', async (event) => {
    event.preventDefault();
    localStorage.clear();
    const results = await fetch('/api/foodServicesPG');
    const arrayFromJson = await results.json();
    localStorage.setItem(storage, JSON.stringify(arrayFromJson.data));
    location.reload();
  });
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector('#main_form');
  const submitButton = document.querySelector('#submit_button');
  const restName = document.querySelector('#restName');
  const city = document.querySelector('#city');
  const refresh = document.querySelector('#refresh_button');
  const map = initMap('map');
  const retrevialVar = 'restaurants';
  submitButton.style.display = 'none';

  refreshList(refresh, retrevialVar);

  if (localStorage.getItem(retrevialVar) === undefined) {
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    localStorage.setItem(retrevialVar, JSON.stringify(arrayFromJson.data));
  }
  const storedData = localStorage.getItem(retrevialVar);
  const storedDataArray = JSON.parse(storedData);
  if (storedDataArray.length > 0) {
    submitButton.style.display = 'block';
    console.log('start');

    let currentArray = [];
    restName.addEventListener('input', async (event) => {
      console.log(event.target.value);
      if (event.length < 1) {
        console.log('caught');
        return;
      }

      const selectRest = storedDataArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      console.log(selectRest);
      createHtmlList(selectRest);
      addMapMarker(map, selectRest);
    });

    city.addEventListener('input', async (event) => {
      console.log(event.target.value);
      const cityRest = storedDataArray.filter((item) => {
        const lowerName = item.city.toLowerCase();
        const lowerCity = event.target.value.toLowerCase();
        return lowerName.includes(lowerCity);
      });
      console.log(cityRest);
      createHtmlList(cityRest);
      addMapMarker(map, cityRest);
    });
    form.addEventListener('submit', async (submitEvent) => {
      // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      console.log('form submission'); // this is substituting for a 'breakpoint'
      currentArray = restArrayMake(storedDataArray);
      createHtmlList(currentArray);
      addMapMarker(map, currentArray);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
