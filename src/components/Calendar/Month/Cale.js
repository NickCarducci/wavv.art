import React from "react";
import CalendarDay from "./CalendarDay";
const localize = new Date().setHours(0, 0, 0, 0);
const getLastMonth = (month, year) => {
    const lastMonth = month - 1 > -1 ? month - 1 : 11;
    const lastMonthYear = month - 1 > -1 ? year : year - 1;

    return { lastMonth, lastMonthYear };
  },
  getNextMonth = (month, year) => {
    const nextMonth = month + 1 < 12 ? month + 1 : 0;
    const nextMonthYear = month + 1 < 12 ? year : year + 1;

    return { nextMonth, nextMonthYear };
  },
  getMonthDays = (
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
  },
  layCalendar = (month, year) => {
    const daysPrior = new Date(year, month, 1, 0, 0, 0, 0).getDay();
    const { lastMonth, lastMonthYear } = getLastMonth(month, year);
    const { nextMonth, nextMonthYear } = getNextMonth(month, year);
    const lastMonthDays = getMonthDays(lastMonth, lastMonthYear);
    const days = getMonthDays(month, year);
    const priorDays = {};
    for (let x = 0; x < daysPrior; x++)
      priorDays[daysPrior - x] = new Date(
        lastMonthYear,
        lastMonth,
        lastMonthDays - x,
        0,
        0,
        0,
        0
      );
    const theseDays = {};
    for (let x = 0; x < days; x++) {
      theseDays[x] = new Date(year, month, x + 1, 0, 0, 0, 0);
    }
    const daysFollowing = 6 - new Date(year, month, days, 0, 0, 0, 0).getDay();
    const nextDays = {};
    for (let x = 0; x < daysFollowing; x++) {
      nextDays[x] = new Date(nextMonthYear, nextMonth, x + 1, 0, 0, 0, 0);
    }

    var calendardays = [
      ...Object.values(priorDays),
      ...Object.values(theseDays),
      ...Object.values(nextDays)
    ];

    var firstDay = new Date(
      lastMonthYear,
      lastMonth,
      lastMonthDays,
      0,
      0,
      0,
      0
    ).setHours(0, 0, 0, 0);

    var lastDay = new Date(year, month, days, 0, 0, 0, 0).setHours(0, 0, 0, 0);

    return {
      firstDay,
      priorDays,
      theseDays,
      nextDays,
      lastDay,
      calendardays
    };
  };
class Calendar extends React.Component {
  state = {};
  componentDidMount = () => {
    const { month, year } = this.props;
    var f = layCalendar(month, year);
    f && this.setState(f);
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.month !== prevProps.month ||
      this.props.year !== prevProps.year
    ) {
      var f = layCalendar(this.props.month, this.props.year);
      //f.lastMonth = this.props.year;
      //f.lastYear = this.props.year;
      f && this.setState(f);
    }
  };
  render() {
    const datecelestial = new Date();

    const isSameDay = (date, dte) => {
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
      },
      { calendardays } = this.state;
    return (
      <div className="CalendarGrid">
        <div className="CalendarWeekday">Sun</div>
        <div className="CalendarWeekday">Mon</div>
        <div className="CalendarWeekday">Tue</div>
        <div className="CalendarWeekday">Wed</div>
        <div className="CalendarWeekday">Thu</div>
        <div className="CalendarWeekday">Fri</div>
        <div className="CalendarWeekday">Sat</div>
        {calendardays &&
          calendardays.map((_date, index) => {
            var weekday = _date.getDay();
            var isToday = isSameDay(_date, datecelestial);
            var isCurrent = isSameDay(_date, this.props.chosen);
            return (
              <div key={index}>
                <CalendarDay
                  communities={this.props.communities}
                  members={this.props.members}
                  freetime={this.props.freeTime}
                  invitesFromEntityChat={this.props.invitesFromEntityChat}
                  events={this.props.events}
                  weekday={weekday}
                  initial={this.props.initial}
                  plansShowing={this.props.plansShowing}
                  invites={this.props.invites}
                  schedule={this.props.schedule}
                  calendar={this.props.calendar ? this.props.calendar : []}
                  isToday={isToday}
                  isCurrent={isCurrent}
                  _date={_date}
                  assignments={this.props.assignments}
                  notes={this.props.notes}
                  chosen={this.props.chosen}
                  month={this.props.month}
                  year={this.props.year}
                  gotoDate={this.props.gotoDate}
                  datecelestial={datecelestial}
                />
              </div>
            );
          })}
      </div>
    );
  }
}
export default Calendar;
