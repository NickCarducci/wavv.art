import { localize } from "../components/Calendar";

export const getMonthDays = (
  month = new Date(localize).getMonth(), //func default, localize
  year = new Date(localize).getFullYear() //for Date construction
) => {
  const months30 = [3, 5, 8, 10];
  const leapYear = year % 4 === 0;
  return month === 1
    ? leapYear
      ? 29
      : 28
    : months30.includes(month)
    ? 30
    : 31;
};

/*const zeroPad = (num) => {
  var res = "0";
  if (String(num).length === 1) {
    res = `0${num}`;
  } else {
    res = num;
  }
  return res;
};*/
const returnNotesWithDates = (
  notesInput,
  priorDates,
  forwardDates,
  today,
  first
) => {
  let noteList = [];
  let noteTitles = [];
  let notes = Object.values({ ...notesInput });
  notes.map((x) => {
    noteTitles.push(x.message);
    return noteList.push(String(x._id));
  });

  let notesWithDates = Object.values({ ...notes });
  priorDates.map((x) =>
    notesWithDates.push({
      date: x
    })
  );
  if (1 !== today.getDate()) {
    notesWithDates.push({
      date: today
    });
  }

  notesWithDates.push({
    date: first
  });
  forwardDates.map((x) =>
    notesWithDates.push({
      date: x
    })
  );
  notesWithDates.sort((a, b) => new Date(a.date) - new Date(b.date));
  return { notesWithDates, noteList, noteTitles };
};

export const gotoPreviousMonth = (month, year) => {
  var lastMonth = month - 1 > -1 ? month - 1 : 11;
  var lastMonthYear = month - 1 > -1 ? year : year - 1;
  return {
    month: lastMonth,
    year: lastMonthYear,
    e: [
      new Date(lastMonthYear, lastMonth, 1, 0, 0, 0, 0).getTime(),
      new Date(
        lastMonthYear,
        lastMonth,
        getMonthDays(lastMonth, lastMonthYear),
        0,
        0,
        0,
        0
      ).getTime()
    ]
  };
};

export const gotoNextMonth = (month, year) => {
  var nextMonth = month + 1 < 12 ? month + 1 : 0;
  var nextMonthYear = month + 1 < 12 ? year : year + 1;

  return {
    month: nextMonth,
    year: nextMonthYear,
    e: [
      new Date(nextMonthYear, nextMonth, 1, 0, 0, 0, 0).getTime(),
      new Date(
        nextMonthYear,
        nextMonth,
        getMonthDays(nextMonth, nextMonthYear),
        0,
        0,
        0,
        0
      ).getTime()
    ]
  };
};

export const handlePreviousDay = (chosen) => {
  const today = chosen.getDate();
  const thismonth = chosen.getMonth();
  const thisyear = chosen.getFullYear();
  let yesterday, yesterdayMonth, yesterdayYear;

  if (today > 1) {
    yesterday = today - 1;
    yesterdayMonth = thismonth;
    yesterdayYear = thisyear;
  } else {
    yesterday = getMonthDays(yesterdayMonth, yesterdayYear);
    yesterdayMonth = thismonth - 1 > -1 ? thismonth - 1 : 11;
    yesterdayYear = thismonth - 1 > -1 ? thisyear : thisyear - 1;
  }

  return {
    chosen: new Date(yesterdayYear, yesterdayMonth, yesterday, 0, 0, 0, 0),
    year: yesterdayYear,
    month: yesterdayMonth
  };
};
export const handleNextDay = (chosen) => {
  const today = chosen.getDate();
  const thismonth = chosen.getMonth();
  const thisyear = chosen.getFullYear();
  let tomorrow, tomorrowMonth, tomorrowYear;

  if (today < getMonthDays(thismonth, thisyear)) {
    tomorrow = today + 1;
    tomorrowMonth = thismonth;
    tomorrowYear = thisyear;
  } else {
    tomorrow = 1;
    tomorrowMonth = thismonth + 1 < 12 ? thismonth + 1 : 0;
    tomorrowYear = thismonth + 1 < 12 ? thisyear : thisyear + 1;
  }
  return {
    chosen: new Date(tomorrowYear, tomorrowMonth, tomorrow, 0, 0, 0, 0),
    year: tomorrowYear,
    month: tomorrowMonth
  };
};
export const isSameDay = (date, dte) => {
  const basedateDate = dte.getDate();
  const basedateMonth = dte.getMonth();
  const basedateYear = dte.getFullYear();

  const dateDate = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  return (
    basedateDate === dateDate &&
    basedateMonth === dateMonth &&
    basedateYear === dateYear
  );
};

export const CALENDAR_MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

export const WEEK_DAYS = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};
