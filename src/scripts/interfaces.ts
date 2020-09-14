interface IGetTime {
  timeNow: string;
  amOrPm: string;
}

interface IBuildDateString {
  dateString: string;
  dayOfWeek: string;
}

export { IGetTime, IBuildDateString };
