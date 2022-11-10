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
    const { city } = item;
    const displayName = name.toLowerCase();
    const displayCity = city.toLowerCase();
    const injectThis = `<li>Name: ${displayName}</li>`;
    const injectThisCity = `<li>City: ${displayCity}</li>`;
    targetList.innerHTML += injectThis;
    targetList.innerHTML += injectThisCity;
  });
}
async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector('#main_form');
  const submitButton = document.querySelector('#submit_button');
  const restName = document.querySelector('#restName');
  const city = document.querySelector('#city');
  submitButton.style.display = 'none';

  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object

  if (arrayFromJson.data.length > 0) {
    submitButton.style.display = 'block';
    console.log('start');

    let currentArray = [];
    restName.addEventListener('input', async (event) => {
      console.log(event.target.value);
      if (event.length < 1) {
        console.log('caught');
        return;
      }
      // change arrayFromJson.data to currentArray if needed
      const selectRest = arrayFromJson.data.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      console.log(selectRest);
      createHtmlList(restArrayMake(selectRest));
    });

    city.addEventListener('input', async (event) => {
      console.log(event.target.value);
      const cityRest = arrayFromJson.data.filter((item) => {
        const lowerName = item.city.toLowerCase();
        const lowerCity = event.target.value.toLowerCase();
        return lowerName.includes(lowerCity);
      });
      console.log(cityRest);
      createHtmlList(restArrayMake(cityRest));
    });
    form.addEventListener('submit', async (submitEvent) => {
      // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      console.log('form submission'); // this is substituting for a 'breakpoint'
      currentArray = restArrayMake(arrayFromJson.data);
      createHtmlList(currentArray);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
