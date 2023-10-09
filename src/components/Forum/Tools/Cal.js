import React from "react";
import * as shape from "d3-shape";
import ART from "react-art";
import "art/modes/svg";
import DayCal from "./DayCal.js";
import firebase from "../../.././init-firebase.js";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import { standardCatch } from "../../../widgets/Sudo";
const d3 = {
  shape
};

const { Surface, Group, Shape } = ART;

class TodaySun extends React.Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
  }
  render() {
    const { datecelestial } = this.props;
    const _datezero = this.props._date.setHours(0, 0, 0, 0);
    const hour = datecelestial.getHours();
    const minute = datecelestial.getMinutes();
    const second = datecelestial.getSeconds();
    const totalseconds = hour * 3600 + minute * 60 + second;
    const totalsecondsoutofday = totalseconds / 86400;
    const totaldegrees = totalsecondsoutofday * 360;
    /*const size = Math.min(
      window.innerHeight * 0.059,
      window.innerWidth * 0.059
    );*/
    //const width = size;
    //const height = size;
    //const x = width / 2;
    //const y = height / 2;
    const outerRadius = 20;
    /* this.props.smallplz && this.props.height < 100
        ? Math.min(window.innerHeight * 0.045, 20)
        : this.props.smallplz
        ? Math.min(window.innerHeight * 0.045, 20) * 0.5
        : Math.min(window.innerHeight * 0.045, 20);*/
    const innerRadius = 20;
    /* this.props.smallplz && this.props.height < 100
        ? Math.min(window.innerHeight * 0.045, 20)
        : this.props.smallplz
        ? Math.min(window.innerHeight * 0.04, 20) * 0.5
        : Math.min(window.innerHeight * 0.04, 20);*/
    const arcGenerato2 = d3.shape
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .startAngle(0)
      .endAngle(
        ((datecelestial.getHours() / 24) * 360 * Math.PI) / 180 +
          ((datecelestial.getMinutes() / 60) * (360 / 24) * Math.PI) / 180
      );
    return (
      <div ref={this.myInput} style={{ position: "absolute" }}>
        {this.props.isToday ? (
          hour === 20 ||
          hour === 21 ||
          hour === 22 ||
          hour === 23 ||
          hour === 0 ||
          hour === 1 ||
          hour === 2 ||
          hour === 3 ||
          hour === 4 ? (
            <img
              src="https://www.dropbox.com/s/tqw39uh4mcywirx/clockbordermoonmenu%20%288%29.png?raw=1"
              style={{
                transform: `rotate(${totaldegrees}deg)`,
                width: "100%"
              }}
              alt="error"
            />
          ) : (
            <img
              src="https://www.dropbox.com/s/fegsthumkz6pufy/clockbordersun.png?raw=1"
              style={{
                transform: `rotate(${totaldegrees}deg)`,
                width: "100%"
              }}
              alt="error"
            />
          )
        ) : null}
        {/*this.myInput.current && (
          <Surface
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: "rotate(180deg)"
            }}
            width={this.myInput.current.offsetHeight}
            height={this.myInput.current.offsetHeight}
          >
            <Group //x={"100%"} y={"100%"}
              x={this.myInput.current.offsetHeight / 2}
              y={this.myInput.current.offsetHeight / 2}
            >
              {/*new Date(date).getTime() < new Date().getTime() && inMonth && (
                  <Shape
                    key={_date}
                    d={arcGenerato1()}
                    stroke={"rgb(0,0,0)"}
                    fill={"rgba(28,124,132,.4)"}
                  />
                )* /}
              <Shape
                style={{
                  display: "flex",
                  position: "absolute"
                }}
                key={_datezero}
                d={arcGenerato2()}
                stroke={"rgb(28,124,132)"}
                fill={"rgb(28,124,132, .4)"}
              />
            </Group>
          </Surface>
              )*/}
      </div>
    );
  }
}
class TodayPlans extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myInput = React.createRef();
  }
  render() {
    var _datezero = this.props._date;
    _datezero.setHours(0, 0, 0, 0);
    /*
    const size = Math.min(
      this.state.height * 0.059,
      window.innerWidth * 0.059
    );*/
    const outerRadius = Math.min(this.props.height * 0.045, 20);
    const innerRadius = Math.min(this.props.height * 0.04, 20);
    //console.log(this.props.thePlans)
    return (
      <Surface
        style={{
          top: "0px",
          position: "absolute",
          transform: "rotate(180deg)"
        }}
        width={this.props.height}
        height={this.props.height}
      >
        <Group //x={"100%"} y={"100%"}
          x={this.props.height / 2}
          y={this.props.height / 2}
        >
          {this.props.thePlans.map((plan, index) => {
            var plandate = new Date(plan.date);
            var plandate1 = new Date(plan.date);
            plandate.setHours(0, 0, 0, 0);
            var startAngleRad1 =
              ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
              ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
            const range = plan.rangeChosen ? plan.rangeChosen : 1;
            const timespan = ((range / 24) * 360 * Math.PI) / 180;
            const endAngleRad1 = startAngleRad1 + (range ? timespan : 0.25);
            const arcGenerato = d3.shape
              .arc()
              .outerRadius(outerRadius)
              .innerRadius(innerRadius)
              .startAngle(Number(startAngleRad1.toFixed(5)))
              .endAngle(Number(endAngleRad1.toFixed(5)));
            if (
              _datezero.getTime() === plandate.getTime() &&
              (this.props.plansShowing || this.props.initial !== "invite")
            ) {
              return (
                <Shape
                  style={{}}
                  key={index}
                  //ref={plan._id + "note"}
                  d={arcGenerato()}
                  stroke={"rgb(49,212,212)"}
                  strokeWidth="3"
                  fill={"rgba(49,212,212, .6)"}
                />
              );
            } else return null;
          })}
          {/*(this.props.freetime
                ? this.props.calendar
                : this.props.invitesFromEntityChat
                ? this.props.schedule //invites if entity chat
                : this.state.invites
              ) //events if entity chat
                .map((plan, index) => {
                  var plandate = new Date(plan.date);
                  var plandate1 = new Date(plan.date);
                  plandate.setHours(0, 0, 0, 0);
                  var startAngleRad1 =
                    ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                    ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) /
                      180;
                  var endAngleRad1 = startAngleRad1 + 0.3;
                  const arcGenerato = d3.shape
                    .arc()
                    .outerRadius(outerRadius)
                    .innerRadius(innerRadius)
                    .startAngle(Number(startAngleRad1.toFixed(5)))
                    .endAngle(Number(endAngleRad1.toFixed(5)));
                  if (
                    _datezero.getTime() === plandate.getTime() &&
                    (this.props.members.includes(plan.authorId) ||
                      this.props.members.length === 0)
                  ) {
                    return (
                      <Shape
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          position: "absolute"
                        }}
                        key={index}
                        //ref={plan.id + "planref"}
                        d={arcGenerato()}
                        stroke={"rgb(169,129,220)"}
                        strokeWidth="1"
                        fill={"rgba(169,129,220, .6)"}
                      />
                    );
                  } else return null;
                })}
              {this.props.assignments.map((plan, index) => {
                var plandate = new Date(plan.date);
                var plandate1 = new Date(plan.date);
                plandate.setHours(0, 0, 0, 0);
                var startAngleRad1 =
                  ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                  ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
                var endAngleRad1 = startAngleRad1 + 0.3;
                const arcGenerato = d3.shape
                  .arc()
                  .outerRadius(outerRadius)
                  .innerRadius(innerRadius)
                  .startAngle(Number(startAngleRad1.toFixed(5)))
                  .endAngle(Number(endAngleRad1.toFixed(5)));
                if (_datezero.getTime() === plandate.getTime()) {
                  return (
                    <Shape
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        position: "absolute"
                      }}
                      key={index}
                      //ref={plan.id + "planref"}
                      d={arcGenerato()}
                      stroke={"rgb(150, 200, 150)"}
                      strokeWidth="1"
                      fill={"rgba(150, 200, 150, .6)"}
                    />
                  );
                } else return null;
              })}
              {this.props.events.map((plan, index) => {
                var plandate = new Date(plan.date.seconds * 1000);
                var plandate1 = new Date(plan.date.seconds * 1000);
                plandate.setHours(0, 0, 0, 0);
                var startAngleRad1 =
                  ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                  ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
                var endAngleRad1 = startAngleRad1 + 0.3;
                const arcGenerato = d3.shape
                  .arc()
                  .outerRadius(outerRadius)
                  .innerRadius(innerRadius)
                  .startAngle(Number(startAngleRad1.toFixed(5)))
                  .endAngle(Number(endAngleRad1.toFixed(5)));
                var community =
                  plan.communityId &&
                  this.props.communities.find((h) => h.id === plan.communityId);
                if (
                  !community ||
                  (community.privateToMembers &&
                    !(
                      this.props.auth === undefined ||
                      this.props.auth.uid === community.authorId ||
                      (community.admin &&
                        community.admin.includes(this.props.auth.uid)) ||
                      (community.faculty &&
                        community.faculty.includes(this.props.auth.uid)) ||
                      (community.members &&
                        community.members.includes(this.props.auth.uid))
                    ))
                ) {
                  if (_datezero.getTime() === plandate.getTime()) {
                    return (
                      <Shape
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          position: "absolute"
                        }}
                        key={index}
                        //ref={plan.id + "planref"}
                        d={arcGenerato()}
                        stroke={"rgb(150, 200, 150)"}
                        strokeWidth="1"
                        fill={"rgba(150, 200, 150, .6)"}
                      />
                    );
                  } else return null;
                } else return null;
              })*/}
        </Group>
      </Surface>
    );
  }
}
class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
    var _datezero = this.props._date;
    _datezero.setHours(0, 0, 0, 0);
    let filtered = [];
    var thePlans = this.props.notes.filter((x) => {
      //const isToday = isSameDay(_date, today);
      const plandate = new Date(
        x.date.seconds ? x.date.seconds * 1000 : x.date
      );
      plandate.setHours(0, 0, 0, 0);
      if (plandate.getTime() === _datezero.getTime()) {
        filtered.push(x);
      }
      return filtered;
    });
    this.state = {
      thePlans
    };
    this.is = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      var boxHeight = this.is.current && this.is.current.offsetHeight;
      this.setState({ boxHeight });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  getDateISO = (date = new Date()) => {
    return [
      date.getFullYear(),
      this.zeroPad(date.getMonth() + 1, 2),
      this.zeroPad(date.getDate(), 2)
    ].join("-");
  };

  zeroPad = (value, length) => `${value}`.padStart(length, "0");
  componentDidUpdate = (prevProps) => {
    if (this.props.notes !== prevProps.notes) {
      var _datezero = this.props._date;
      _datezero.setHours(0, 0, 0, 0);
      let filtered = [];
      var thePlans = this.props.notes.filter((x) => {
        //const isToday = isSameDay(_date, today);
        const plandate = new Date(
          x.date.seconds ? x.date.seconds * 1000 : x.date
        );
        plandate.setHours(0, 0, 0, 0);
        if (plandate.getTime() === _datezero.getTime()) {
          filtered.push(x);
        }
        return filtered;
      });
      this.setState({ thePlans });
    }
  };
  render() {
    const { isToday, isCurrent, datecelestial } = this.props;
    const { boxHeight } = this.state;
    const yest = this.props._date < datecelestial.getTime();
    var datet = this.props._date.getDate();
    var inMonth =
      this.props.month === this.props._date.getMonth() &&
      this.props.year === this.props._date.getFullYear();
    //console.log(this.state.thePlans);
    return (
      <div
        ref={this.is}
        /*className={
          isCurrent
            ? "HighlightedCalendarDate"
            : isToday
            ? "TodayCalendarDate"
            : inMonth && !yest
            ? "CalendarDateNumber"
            : "PrevPostDateNumber"
        }*/
        style={{
          position: "relative",
          border: isToday ? "1px solid" : "",
          width: "33px",
          height: "33px",
          color: isCurrent
            ? "yellowgreen"
            : isToday
            ? ""
            : inMonth //&& !yest
            ? yest
              ? "tan"
              : "mistyrose"
            : "lightskyblue"
        }}
        onClick={() => this.props.gotoDate(this.props._date)}
      >
        {/*className={
          this.props.smallplz && boxHeight < 100
            ? "square"
            : this.props.smallplz
            ? "squaretop"
            : "square"
        }
       style={
          yest && inMonth && !isCurrent && !isToday
            ? {
                color: "rgb(100,100,130)",
                backgroundColor: "rgba(28,124,132,.4)",
                border: "rgba(28,124,132,.1) 8px solid",
                borderRadius: "100px",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px"
              }
            : inMonth
            ? { color: "#888", fontSize: "22px" }
            : { color: "#555", fontSize: "22px" }
        }*/}

        {isToday ? (
          <TodaySun
            height={boxHeight}
            _date={this.props._date}
            date={this.props.date}
            chosen={this.props.chosen}
            month={this.props.month}
            year={this.props.year}
            isToday={isToday}
            datecelestial={datecelestial}
          />
        ) : (
          <div style={{ position: "absolute" }}>{datet}</div>
        )}
        {this.state.thePlans.length > 0 && (
          <TodayPlans
            communities={this.props.communities}
            members={this.props.members ? this.props.members : []}
            freetime={this.props.freeTime}
            events={this.props.events}
            invitesFromEntityChat={this.props.invitesFromEntityChat}
            height={boxHeight}
            initial={this.props.initial}
            plansShowing={this.props.plansShowing}
            thePlans={this.state.thePlans}
            invites={this.props.invites}
            schedule={this.props.schedule}
            calendar={this.props.calendar}
            assignments={this.props.assignments}
            _date={this.props._date}
          />
        )}
      </div>
    );
  }
}

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
      { calendardays } = this.state,
      weekdayStyle = {
        borderTop: "1px solid"
      };
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          fontSize: "26px"
        }}
      >
        <div style={weekdayStyle}>Sun</div>
        <div style={weekdayStyle}>Mon</div>
        <div style={weekdayStyle}>Tue</div>
        <div style={weekdayStyle}>Wed</div>
        <div style={weekdayStyle}>Thu</div>
        <div style={weekdayStyle}>Fri</div>
        <div style={weekdayStyle}>Sat</div>
        {calendardays &&
          calendardays.map((_date, index) => {
            var weekday = _date.getDay();
            var isToday = isSameDay(_date, this.props.datecelestial);
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
                  calendar={this.props.calendar}
                  assignments={this.props.assignments}
                  isToday={isToday}
                  isCurrent={isCurrent}
                  _date={_date}
                  notes={this.props.notes}
                  chosen={this.props.chosen}
                  month={this.props.month}
                  year={this.props.year}
                  gotoDate={this.props.gotoDate}
                  datecelestial={this.props.datecelestial}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

var priorDates = [];
var dO = new Date();
const ind = [dO.getFullYear(), dO.getMonth(), dO.getDate(), 0, 0, 0, 0];
var before = new Date(...ind); //fulcrum
for (let loop = 100; loop > 0; loop--) {
  var last = new Date(before);
  const month = last.getMonth();
  const year = last.getFullYear();
  const yesterdayMonth = month - 1 > -1 ? month - 1 : 11;
  const yesterdayYear = month - 1 > -1 ? year : year - 1;

  before = new Date(yesterdayYear, yesterdayMonth, 1, 0, 0, 0, 0).setHours(
    0,
    0,
    0,
    0
  );
  priorDates.push(before);
}
const getPriorDates = () => priorDates;
var after = new Date(...ind); //fulcrum2
var forwardDates = [];
for (let loop = 100; loop > 0; loop--) {
  var next = new Date(after);
  const month = next.getMonth();
  const year = next.getFullYear();
  const nextMonth = month + 1 < 12 ? month + 1 : 0;
  const nextMonthYear = month + 1 < 12 ? year : year + 1;

  after = new Date(nextMonthYear, nextMonth, 1, 0, 0, 0, 0).setHours(
    0,
    0,
    0,
    0
  );
  forwardDates.push(after);
}
const getForwardDates = () => forwardDates;

const hydrateDates = (calendarWithDates) => {
  const checkDate = (a) =>
    a.date.seconds
      ? a.date.seconds * 1000
      : isNaN(a.date)
      ? new Date(a.date).getTime()
      : a.date;
  priorDates.map((x) =>
    calendarWithDates.push({
      date: x
    })
  );
  forwardDates.map((x) =>
    calendarWithDates.push({
      date: x
    })
  );

  return calendarWithDates.sort(
    (a, b) => new Date(checkDate(a)) - new Date(checkDate(b))
  );
};

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
export class PDB {
  //Random Scope for API security
  constructor(name) {
    PouchDB.plugin(upsert);

    this.deletion = (d, db) => db.remove(d).catch(standardCatch);
    this.destroy = (db) => db.destroy();
    this.set = (db, c) =>
      !c._id
        ? window.alert(
            "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
          )
        : db
            .upsert(c._id, (copy) => {
              copy = { ...c };
              return copy;
            })
            .catch(standardCatch);
    this.read = async (db, notes) =>
      await db
        .allDocs({ include_docs: true })
        .then((allNotes) =>
          Promise.all(
            allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
          )
        )
        .catch(standardCatch);
    this.db = new PouchDB("thumbprint", {
      revs_limit: 1,
      auto_compaction: true
    });
  }
  deleteNote = (note) => this.deletion(note, this.db);
  deleteKeys = () => this.destroy(this.db);
  getAllNotes = async () =>
    //let notes = {};
    await this.read(this.db, {});
  createNote = async (note) => {
    return await this.set(this.db, note);
  };
}
const firestore = getFirestore(firebase);
export default class Monthly extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date(dO.setHours(0, 0, 0, 0));
    var first = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    // return { notesWithDates, noteList, noteTitles };

    const { noteList, noteTitles, notesWithDates } = returnNotesWithDates(
      [],
      priorDates,
      forwardDates,
      today,
      first
    );
    this.state = {
      notes: [],
      db: new PDB(),
      today,
      first,
      noteList,
      noteTitles,
      notesWithDates,
      chosen: new Date(props.queriedDate),
      month: new Date(props.queriedDate).getMonth(),
      year: new Date(props.queriedDate).getFullYear(),
      invites: []
    };
  }
  async handleDelete(id) {
    let { notes } = this.state;
    var note = notes.find((x) => x._id === id);

    if (note) {
      const noAuthorOrMatch =
        !note.authorId ||
        note.authorId === "" ||
        note.authorId === this.props.auth.uid;
      //copies for anonymity
      noAuthorOrMatch &&
        deleteDoc(doc(firestore, "chats", note._id))
          .then((ref) => {
            console.log("deleted plan from messages " + note._id);
          })
          .catch(standardCatch);
      noAuthorOrMatch &&
        deleteDoc(doc(firestore, "calendar", note._id))
          .then((ref) => {
            console.log("deleted plan from calendar " + note._id);
          })
          .catch(standardCatch);
      noAuthorOrMatch &&
        onSnapshot(
          query(
            collection(firestore, "planchats"),
            where("chatId", "==", note._id)
          ),
          (querySnapshot) => {
            querySnapshot.docs.forEach(async (doc) => {
              return deleteDoc(doc(firestore, "planchats", doc.id))
                .then((ref) => {
                  console.log("deleted plan from messages " + doc.id);
                })
                .catch(standardCatch);
            });
          },
          standardCatch
        ); //query, or document; delete, update, add, set
      await this.state.db
        .deleteNote(note)
        .then(() => {
          console.log("deleted plan from local " + note._id);
          //this.getNotes();
        })
        .catch(standardCatch);
    } else {
      console.log("no plan to delete");
    }
  }
  async handleSave(note, method) {
    delete note.term;
    delete note.saving;
    delete note.planDateOpen;
    delete note.planSettingsOpen;
    delete note.predictions;
    delete note.enteredValue;
    var foo = await this.state.db[method](note);
    return foo;
  }
  getNotes = () => {
    onSnapshot(
      query(
        collection(firestore, "chats"),
        where("authorId", "==", this.props.auth.uid),
        where("date", ">", new Date(new Date().getTime() - 2629800000))
      ),
      (querySnapshot) =>
        this.setState({
          notes: querySnapshot.docs
            .map((doc) => {
              return doc.exists() && { ...doc.data(), id: doc.id };
            })
            .filter((x) => x)
        })
    );
  };
  componentDidMount = () => {
    this.props.auth !== undefined && this.getNotes();
  };
  componentDidUpdate = (prevProps) => {
    const { initial } = this.props;
    if (this.state.notes !== this.state.lastnotes) {
      this.setState({ lastnotes: this.state.notes }, () => {
        const { today, first } = this.state;
        const { noteList, noteTitles, notesWithDates } = returnNotesWithDates(
          this.state.notes,
          priorDates,
          forwardDates,
          today,
          first
        );
        this.setState(
          {
            noteList,
            noteTitles,
            notesWithDates,
            plansWithInvites: notesWithDates,
            plansOpen: notesWithDates
          },
          () => {
            const { notesWithDates } = this.state;
            if (initial === "event") {
              this.handleEvents(notesWithDates, this.props.events); //city-based
            } else if (initial === "book") {
              this.props.match.params.id && this.handleBook(notesWithDates); //personal
            } else if (initial === "calendar") {
              this.handleCal(notesWithDates); //group (entity-chat)
            } else if (initial === "sd") {
              const d = window.location.pathname.split("/sd/")[1]; //entity-schedule
              if (d) {
                this.handleSchedule(d, notesWithDates);
              } else
                window.alert(`url path must be /sd/entity/id for schedule`);
            } else {
              var invitesWithDates = [...this.state.invites];
              var plansWithInvites = [...notesWithDates, ...this.state.invites];

              const inv = {
                plansAlone: hydrateDates(invitesWithDates),
                invites: this.state.invites,
                plansWithInvites
              };

              this.setState({
                plansAlone: inv.plansAlone,
                invites: inv.invites,
                plansWithInvites: inv.plansWithInvites
              });
            }
          }
        );
      });
    }
    const {
      calByRecipient,
      notesWithDates,
      month,
      year,
      lastMonth,
      lastYear
    } = this.state;
    if (month !== lastMonth || year !== lastYear) {
      if (notesWithDates && calByRecipient !== this.state.lastCalendar) {
        this.setState({ lastCalendar: calByRecipient }, () => {
          clearTimeout(this.setCalendar);
          this.setCalendar = setTimeout(() => {
            let calendarFlat = Object.values(calByRecipient).map((x) => x);
            this.setState({
              calendar: hydrateDates(calendarFlat),
              plansWithCalendar: [...notesWithDates, ...calendarFlat]
            });
          });
        });
      }
    }
  };
  render() {
    const { chosen, month, year } = this.state,
      gotoDate = (date) =>
        this.setState({
          monthCalOpen: "day",
          chosen: new Date(date),
          month: new Date(date).getMonth(),
          year: new Date(date).getFullYear()
        }),
      localize = new Date().setHours(0, 0, 0, 0),
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
      gotoPreviousMonth = (month, year) => {
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
      },
      gotoNextMonth = (month, year) => {
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
    };
    var datecelestial = new Date(),
      isCurrent = isSameDay(new Date(datecelestial), chosen),
      space = " ";
    //console.log("notes", this.state.notes);
    const handlePreviousDay = (chosen) => {
      const today = chosen.getDate();
      const thismonth = chosen.getMonth();
      const thisyear = chosen.getFullYear();
      let yesterday, yesterdayMonth, yesterdayYear;

      if (today > 1) {
        yesterday = today - 1;
        yesterdayMonth = thismonth;
        yesterdayYear = thisyear;
      } else {
        yesterdayMonth = thismonth - 1 > -1 ? thismonth - 1 : 11;
        yesterdayYear = thismonth - 1 > -1 ? thisyear : thisyear - 1;
        yesterday = getMonthDays(yesterdayMonth, yesterdayYear);
      }

      this.setState({
        chosen: new Date(yesterdayYear, yesterdayMonth, yesterday),
        year: yesterdayYear,
        month: yesterdayMonth
      });
    };
    const handleNextDay = (chosen) => {
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
      this.setState({
        chosen: new Date(tomorrowYear, tomorrowMonth, tomorrow, 0, 0, 0, 0),
        year: tomorrowYear,
        month: tomorrowMonth
      });
    };
    return (
      //invites, assignments
      <div
        style={{
          color: "white",
          backgroundColor: "black" // "radial-gradient(white black)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            //className="monthlyl"
            onClick={() => {
              const e = gotoPreviousMonth(month, year);
              this.setState(
                { month: e.month, year: e.year },
                () =>
                  this.props.initial === "event" && this.props.queryDate(e.e)
              );
            }}
            style={{ userSelect: "none" }}
            //onMouseUp={this.clearPressureTimer}
          >
            Last
            <br />
            Month
          </div>
          <div>
            <div
              style={{
                color:
                  new Date(this.state.year, this.state.month).getTime() >
                  datecelestial.getTime()
                    ? "lightskyblue"
                    : new Date(this.state.year, this.state.month).getTime() <
                      datecelestial.getTime() - 2680000000
                    ? "lightgrey"
                    : ""
              }}
            >
              {
                Object.keys({
                  January: "Jan",
                  February: "Feb",
                  March: "Mar",
                  April: "Apr",
                  May: "May",
                  June: "Jun",
                  July: "Jul",
                  August: "Aug",
                  September: "Sep",
                  October: "Oct",
                  November: "Nov",
                  December: "Dec"
                })[this.state.month]
              }
              {space}
              {this.state.year}
            </div>
            <div
              style={{
                backgroundColor: "black",
                color: isCurrent ? "white" : "rgb(100,200,250)"
              }}
            >
              <span
                onClick={() => gotoDate(datecelestial)}
                aria-label="refresh"
                role="img"
              >
                ↻
              </span>
              {space}
              {new Date(this.state.chosen).toLocaleDateString()}
            </div>
          </div>
          <div
            //className="monthlyr"
            onClick={() => {
              const e = gotoNextMonth(month, year);
              this.setState(
                { month: e.month, year: e.year },
                () =>
                  this.props.initial === "event" && this.props.queryDate(e.e)
              );
            }}
            style={{ userSelect: "none" }}
            //onMouseUp={this.clearPressureTimer}
          >
            Next
            <br />
            Month
          </div>
        </div>
        <Calendar
          ref={{ current: {} }}
          hydrateUser={this.props.hydrateUser}
          user={this.props.user}
          auth={this.props.auth}
          notes={this.state.notes}
          invites={[]}
          datecelestial={datecelestial}
          queriedDate={this.props.queriedDate}
          chosen={chosen}
          month={month}
          year={year}
          schedule={[]}
          events={[]}
          initial={"plan"}
          //CalendarDay
          location={this.props.location}
          gotoDate={gotoDate}
          communities={this.props.communities}
          members={this.props.members}
          freetime={this.props.freeTime}
          invitesFromEntityChat={this.props.invitesFromEntityChat}
          plansShowing={true}
          calendar={this.props.calendar ? this.props.calendar : []}
          assignments={this.props.assignments}
        />
        <DayCal
          chosen={this.state.chosen}
          datecelestial={datecelestial}
          notes={this.state.notes}
          invites={this.state.invites}
          schedule={[]}
          events={[]}
          initial={"plan"}
          isSameDay={isSameDay}
          handlePreviousDay={handlePreviousDay}
          handleNextDay={handleNextDay}
          backtotoday={() => gotoDate(datecelestial)}
          navigate={this.props.navigate}
        />
      </div>
    );
  }
}
