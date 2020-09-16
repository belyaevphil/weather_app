import { IGetTime, IBuildDateString } from './interfaces';

import '@/assets/scss';

const searchBox = document.querySelector(
  '.search-panel__input'
) as HTMLInputElement;
const city = document.querySelector('.region') as HTMLDivElement;
const time = document.querySelector('.time') as HTMLSpanElement;
const day = document.querySelector('.day') as HTMLSpanElement;
const temperature = document.querySelector('.degrees') as HTMLDivElement;
const description = document.querySelector('.description') as HTMLSpanElement;
const weatherCard = document.querySelector('.weather-card') as HTMLDivElement;
const weatherImage = document.querySelector('.weather-image') as HTMLDivElement;
const body = document.querySelector('body') as HTMLBodyElement;
const heading = document.querySelector(
  '.header__heading'
) as HTMLHeadingElement;
const searchPanelImage = document.querySelector(
  '.search-panel__image'
) as SVGAElement;

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
      temperature.style.borderRight = '2px solid #ffcd4e';
      searchPanelImage.style.fill = '#ffcd4e';
      heading.style.color = '#ffeb87';
      searchBox.style.background = 'rgba(0, 0, 0, 0.1)';
      weatherImage.innerHTML = `<img src="clear.svg" alt="clear" />`;
      body.style.background =
        'linear-gradient(130.33deg, #FFDB00 17.14%, #FFA41A 34.19%, #FFA41A 65.93%, #FFDC00 83.21%)';
      weatherCard.style.background =
        'linear-gradient(160.37deg, #FFDE15 0%, #FEAA2B 24.48%, #FEAA2B 61.24%, #FFDE15 100%)';
      break;
    case 'Rain':
      temperature.style.borderRight = '2px solid #646464';
      searchPanelImage.style.fill = '#686868';
      heading.style.color = '#686868';
      searchBox.style.background = 'rgba(0, 0, 0, 0.1)';
      weatherImage.innerHTML = `<img src="rain.svg" alt="rain" />`;
      body.style.background =
        'linear-gradient(129.54deg, #4E4E4E 16.96%, #3B3B3B 34.36%, #3B3B3B 65.7%, #4E4E4E 83.18%)';
      weatherCard.style.background =
        'linear-gradient(160.37deg, #313131 0%, #232323 26.75%, #232323 61.84%, #313131 100%)';
      break;
    case 'Clouds':
      temperature.style.borderRight = '2px solid #85e0ff';
      searchPanelImage.style.fill = '#0073c5';
      heading.style.color = '#0073c5';
      searchBox.style.background = 'rgba(0, 0, 0, 0.1)';
      weatherImage.innerHTML = `<img src="clouds.svg" alt="clouds" />`;
      body.style.background =
        'linear-gradient(129.61deg, #79DEFF 16.83%, #00BFFF 34%, #00BEFF 65.55%, #79DEFF 83.03%)';
      weatherCard.style.background =
        'linear-gradient(160.37deg, #A6E9FF 0%, #39CDFF 29.17%, #39CDFF 60.42%, #A6E9FF 100%)';
      break;
    case 'Mist':
      temperature.style.borderRight = '2px solid #646464';
      searchPanelImage.style.fill = '#686868';
      heading.style.color = '#686868';
      searchBox.style.background = 'rgba(0, 0, 0, 0.1)';
      weatherImage.innerHTML = `<img src="mist.svg" alt="mist" />`;
      body.style.background =
        'linear-gradient(129.54deg, #4E4E4E 16.96%, #3B3B3B 34.36%, #3B3B3B 65.7%, #4E4E4E 83.18%)';
      weatherCard.style.background =
        'linear-gradient(160.37deg, #313131 0%, #232323 26.75%, #232323 61.84%, #313131 100%)';
      break;
    default:
      temperature.style.borderRight = '2px solid rgb(90 90 90)';
      searchPanelImage.style.fill = '#ffffff';
      heading.style.color = '#2b2b2b';
      weatherImage.innerHTML = `<img src="clouds.svg" alt="clouds" />`;
      body.style.background = '#ffffff';
      weatherCard.style.background =
        'linear-gradient(160.37deg, rgba(32, 32, 32, 0.8) 0%, rgba(17, 17, 17, 0.8) 29.63%, rgba(17, 17, 17, 0.8) 57.95%, rgba(32, 32, 32, 0.8) 100%)';
      break;
  }

  time.innerHTML = dateString;
  day.innerText = dayOfWeek;
  temperature.innerHTML = temperatureString;
  description.innerText = main;
  city.innerText = `${name}, ${country}`;
};

const fetchResults = async (query: string): Promise<void> => {
  const apiKey = process.env.API_KEY;
  const apiBase = process.env.API_BASE;
  const queryString = `${apiBase}weather?q=${query}&units=metric&appid=${apiKey}`;

  const response = await fetch(queryString);
  const weather = await response.json();

  displayResults(weather);
};

const makeQuery = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    fetchResults(searchBox.value);
    searchBox.value = '';
    weatherCard.style.display = 'flex';
  }
};

searchBox.addEventListener('keypress', makeQuery);
