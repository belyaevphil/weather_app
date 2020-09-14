import { apiConfig } from './apiConfig';
import { IGetTime, IBuildDateString } from './interfaces';

import '@/assets/scss';

const searchBox = document.querySelector('.search-box') as HTMLInputElement;
const city = document.querySelector('.region') as HTMLDivElement;
const time = document.querySelector('.time') as HTMLSpanElement;
const day = document.querySelector('.day') as HTMLSpanElement;
const temperature = document.querySelector('.degrees') as HTMLDivElement;
const description = document.querySelector('.description') as HTMLSpanElement;
const weatherCard = document.querySelector('.weather-card') as HTMLDivElement;
const weatherImage = document.querySelector('.weather-image') as HTMLDivElement;
const body = document.querySelector('body') as HTMLBodyElement;
const header = document.querySelector('.header__heading') as HTMLHeadingElement;

const getTime = (now: Date): IGetTime => {
  let hours = now.getHours();
  let minutes = now.getMinutes() as string | number;
  const amOrPm = hours >= 12 ? 'pm' : ('am' as string);

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const timeNow = `${hours}:${minutes}`;

  return { timeNow, amOrPm };
};

const getDayOfWeek = (now: Date): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ] as string[];
  const weekDay = days[now.getDay()];

  return weekDay;
};

const buildDateString = (): IBuildDateString => {
  const now = new Date();
  const { timeNow, amOrPm } = getTime(now);
  const dayOfWeek = getDayOfWeek(now);

  const dateString = `<strong class="time-bold">${timeNow}</strong> ${amOrPm}`;

  return { dateString, dayOfWeek };
};

const buildTemperatureString = (temp: number): string =>
  `${Math.round(temp)}°c`;

const clearBackgroundImage = () => {
  body.classList.remove('default-background');
  body.classList.remove('clear-background');
  body.classList.remove('rain-background');
  body.classList.remove('clouds-background');
};

const clearWeatherCard = () => {
  weatherCard.classList.remove('default-weather-card');
  weatherCard.classList.remove('clear-weather-card');
  weatherCard.classList.remove('rain-weather-card');
  weatherCard.classList.remove('clouds-weather-card');
};

const clearTemperature = () => {
  temperature.classList.remove('default-degrees-after');
  temperature.classList.remove('clear-degrees-after');
  temperature.classList.remove('rain-degrees-after');
  temperature.classList.remove('clouds-degrees-after');
};

const clearSearchBox = () => {
  searchBox.classList.remove('default-search-box');
  searchBox.classList.remove('clear-search-box');
  searchBox.classList.remove('rain-search-box');
  searchBox.classList.remove('clouds-search-box');
};

const changeBackground = (kind: string): void => {
  clearBackgroundImage();
  clearWeatherCard();
  clearTemperature();
  clearSearchBox();
  body.classList.remove('with-after');
  body.classList.add('without-after');
  body.classList.add(`${kind}-background`);
  weatherCard.classList.add(`${kind}-weather-card`);
  temperature.classList.add(`${kind}-degrees-after`);
  searchBox.classList.add(`${kind}-search-box`);
  weatherImage.innerHTML = `<img src="${kind}.svg" alt="${kind}" />`;
};

const displayResults = ({
  name,
  sys: { country },
  main: { temp },
  weather
}) => {
  const { dateString, dayOfWeek } = buildDateString();
  const temperatureString = buildTemperatureString(temp);
  const { main } = weather[0];

  switch (main) {
    case 'Clear':
      changeBackground('clear');
      break;
    case 'Rain':
      changeBackground('rain');
      break;
    case 'Clouds':
      changeBackground('clouds');
      break;
    default:
      break;
  }

  time.innerHTML = dateString;
  day.innerText = dayOfWeek;
  temperature.innerHTML = temperatureString;
  description.innerText = main;
  city.innerText = `${name}, ${country}`;
};

const fetchResults = async (query: string): Promise<void> => {
  const { key, base } = apiConfig;
  const queryString = `${base}weather?q=${query}&units=metric&appid=${key}`;

  const response = await fetch(queryString);
  const weather = await response.json();

  displayResults(weather);
};

const makeQuery = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    fetchResults(searchBox.value);
    searchBox.value = '';
    weatherCard.style.display = 'flex';
    header.style.display = 'none';
  }
};

searchBox.addEventListener('keypress', makeQuery);
