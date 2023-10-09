import React from "react";
import { Link } from "react-router-dom";
import "./DayCalBackdrop.css";
import DayCalAccessories from "./DayCalAccessories";
import * as shape from "d3-shape";
import ART from "react-art";
import "art/modes/svg";

const d3 = {
  shape
};

const { Surface, Group, Shape } = ART;

class CalSlideDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedplan: "" };
    this.day = React.createRef();
  }
  percentToColor(weight) {
    var color2 = [49, 171, 212];
    var color1 = [143, 136, 0];
    var w1 = weight;
    var w2 = 1 - w1;
    var timecolor = [
      Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return `rgb(${timecolor})`;
  }
  Arc = ({
    size = Math.min(window.innerHeight * 0.6, window.innerWidth * 0.6),
    outerRadius = Math.min(window.innerHeight * 0.15, window.innerWidth * 0.15),
    innerRadius = Math.min(window.innerHeight * 0.14, window.innerWidth * 0.14),
    startAngleRad = 0,
    endAngleRad = ((new Date(this.props.datecelestial).getHours() / 24) *
      360 *
      Math.PI) /
      (180 +
        ((new Date(this.props.datecelestial).getMinutes() / 60) *
          (360 / 24) *
          Math.PI) /
          180)
  }) => {
    const width = size;
    const height = size;
    const arcGenerator = d3.shape
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .startAngle(startAngleRad)
      .endAngle(endAngleRad);

    const x = width / 2;
    const y = height / 2;

    return (
      <Surface width={width} height={height}>
        <Group x={x} y={y}>
          <Shape
            key="arc"
            d={arcGenerator()}
            stroke={"rgb(28,124,132)"}
            fill={"rgb(28,124,132, .4)"}
          />
        </Group>
      </Surface>
    );
  };
  onresize = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      var width = this.day.current && this.day.current.offsetWidth;

      this.setState({ width });
    }, 20);
  };
  render() {
    const WEEK_DAYS = {
      0: "SUN",
      1: "MON",
      2: "TUE",
      3: "WED",
      4: "THU",
      5: "FRI",
      6: "SAT"
    };
    const today = new Date(this.props.datecelestial);
    const year = this.props.chosen.getFullYear();
    const month = this.props.chosen.getMonth();
    const day = this.props.chosen.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    const totalseconds = hour * 3600 + minute * 60 + second;
    const totalsecondsoutofday = totalseconds / 86400;
    const totaldegrees = totalsecondsoutofday * 360;
    const monthname = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ][month].toUpperCase();

    var diffDays = Math.round(
      (this.props.datecelestial - this.props.chosen) / 86400000
    );
    var is_negative = diffDays < 0;
    var change = this.state.width;
    var compare = this.props.chosen
      ? this.props.chosen
      : new Date(this.props.datecelestial).setHours(0, 0, 0, 0);
    var filteredPlans = this.props.notes.filter(
      (plan) => compare === new Date(plan.date).setHours(0, 0, 0, 0)
    );
    var filteredInvites = this.props.invites.filter(
      (plan) => compare === new Date(plan.date).setHours(0, 0, 0, 0)
    );
    var filteredSchedule = this.props.schedule.filter(
      (plan) => compare === new Date(plan.date).setHours(0, 0, 0, 0)
    );
    var le = [];
    var count;
    for (count = 0; count < 24; count++)
      le.push({
        hour: count
      });
    var night = [20, 21, 22, 23, 0, 1, 2, 3, 4];
    return (
      <div ref={this.day} style={{ userSelect: "none" }}>
        <Link
          to="/"
          className="cal_backdrop"
          style={
            this.props.monthCalOpen === "day"
              ? { display: "flex", height: "100%" }
              : { display: "none", height: "100%" }
          }
        />
        <div
          style={
            this.props.monthCalOpen === "day"
              ? {
                  display: "grid",
                  position: "absolute",
                  transform: "translate(-50%, 0)",
                  gridTemplateColumns: "1fr",
                  backgroundColor: "rgba(0, 0, 0, 0.699)",
                  top: "2%",
                  marginBottom: `8%`,
                  width: "90%",
                  height: "90%",
                  minHeight: "380px",
                  left: "50%",
                  borderRadius: "30px",
                  color: "white",
                  boxShadow: "1px 0px 7px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.3s ease-in",
                  zIndex: "4"
                }
              : {
                  display: "grid",
                  position: "fixed",
                  gridTemplateColumns: "1fr",
                  backgroundColor: "rgba(0, 0, 0, 0.699)",
                  top: "2%",
                  marginBottom: `8%`,
                  width: "90%",
                  height: "90%",
                  minHeight: "380px",
                  left: "50%",
                  borderRadius: "30px",
                  color: "white",
                  boxShadow: "1px 0px 7px rgba(0, 0, 0, 0.5)",
                  transform: "translate(-50%, -110%)",
                  transition: "transform 0.3s ease-out",
                  zIndex: "1"
                }
          }
        >
          <div>
            <div
              style={{ fontSize: "10px" }}
              className="calendaricon"
              onClick={this.props.monthCalOpener}
            >
              cal
            </div>
            <div className="monthyear">
              <div className="month">
                <div>&nbsp;&nbsp;&nbsp;{`${monthname}`}</div>
                <div className="year">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${year}`}
                </div>
              </div>
              <div className="weekdayday">
                <div className="weekday">
                  {WEEK_DAYS[this.props.chosen.getDay()]}
                </div>
                <div className="day">{`${day}`}</div>
              </div>
              <div onClick={this.props.switchPlansShowing}>
                <div className="daysuntil">
                  &nbsp;&nbsp;
                  {diffDays === 0
                    ? "Today"
                    : diffDays === -1
                    ? "Tomorrow"
                    : diffDays === 1
                    ? "Yesterday"
                    : is_negative
                    ? `In ${Math.abs(diffDays)} days`
                    : `${diffDays} days ago`}
                </div>
                <div
                  style={{
                    display: this.state.width < 600 ? "none" : "block",
                    transform: "rotate(90px)"
                  }}
                  onClick={this.props.dayCalOpener}
                >
                  {"^"}
                </div>
                <div
                  className="plancount"
                  style={{
                    display:
                      filteredSchedule.length === 0 &&
                      filteredInvites.length === 0 &&
                      filteredPlans.length === 0
                        ? "none"
                        : "block",
                    color:
                      this.props.plansShowing || !this.props.inviteInitial
                        ? "rgb(60,120,160)"
                        : "rgb(120,120,140)"
                  }}
                >
                  &nbsp;&nbsp;&nbsp;
                  {this.props.sdInitial
                    ? filteredSchedule.length
                    : this.props.inviteInitial
                    ? filteredInvites.length
                    : filteredPlans.length}{" "}
                  {this.props.sdInitial
                    ? `INVITE${filteredSchedule.length === 1 ? "" : "S"}`
                    : this.props.inviteInitial
                    ? `INVITE${filteredInvites.length === 1 ? "" : "S"}`
                    : `PLAN${filteredPlans.length === 1 ? "" : "S"}`}
                  {
                    //this.props.inviteInitial && " : "
                  }
                  <br />
                  &nbsp;&nbsp;&nbsp;
                  {this.props.inviteInitial && filteredPlans.length}{" "}
                  {this.props.inviteInitial
                    ? `PLAN${filteredPlans.length === 1 ? "" : "S"} ${
                        this.props.plansShowing ? "" : "HIDDEN"
                      }`
                    : null}
                </div>
              </div>
            </div>
            <span
              className="gototoday"
              onClick={this.props.backtotoday}
              aria-label="refresh"
              role="img"
            >
              ↻
            </span>
          </div>
          {diffDays === 0 ? (
            <div className="containclock">
              <div className="placeArcOnClock">
                {this.props.datecelestial && <this.Arc />}
              </div>
            </div>
          ) : null}

          <DayCalAccessories
            communities={this.props.communities}
            height={this.state.height}
            width={this.state.width}
            notes={this.props.notes}
            invites={this.props.invites}
            events={this.props.events}
            schedule={this.props.schedule}
            chosen={this.props.chosen}
            datecelestial={this.props.datecelestial}
            plansShowing={this.props.plansShowing}
            inviteInitial={this.props.inviteInitial}
            eventsInitial={this.props.eventsInitial}
            calendarInitial={this.props.calendarInitial}
            change={change}
          />
          {/*<img src={clockdial} className="clockdial" alt="error" />*/}
          {!this.props.isSameDay(
            new Date(this.props.datecelestial),
            this.props.chosen
          ) ? null : night.includes(hour) ? (
            <img
              src="https://www.dropbox.com/s/tqw39uh4mcywirx/clockbordermoonmenu%20%288%29.png?raw=1"
              className="clockborder"
              style={{
                transform: `translate(-50%, -50%) rotate(${totaldegrees}deg)`
              }}
              alt="error"
            />
          ) : (
            <img
              src="https://www.dropbox.com/s/fegsthumkz6pufy/clockbordersun.png?raw=1"
              className="clockborder"
              style={{
                transform: `translate(-50%, -50%) rotate(${totaldegrees}deg)`
              }}
              alt="error"
            />
          )}
          {le.map((x, i) =>
            night.includes(i) ? (
              <img
                key={i}
                src="https://www.dropbox.com/s/tqw39uh4mcywirx/clockbordermoonmenu%20%288%29.png?raw=1"
                className="clockborder"
                style={{
                  transform: `translate(-50%, -50%) rotate(${
                    360 * (x.hour / 24)
                  }deg)`,
                  opacity: ".1"
                }}
                alt="error"
              />
            ) : (
              <img
                key={i}
                src="https://www.dropbox.com/s/fegsthumkz6pufy/clockbordersun.png?raw=1"
                className="clockborder"
                style={{
                  transform: `translate(-50%, -50%) rotate(${
                    360 * (x.hour / 24)
                  }deg)`,
                  opacity: ".1"
                }}
                alt="error"
              />
            )
          )}
          <div className="weeklyskip">
            <div className="weeklyl" onClick={this.props.handlePreviousDay}>
              Prev
              <br />
              Day
            </div>
            <div className="close" onClick={this.props.dayCalCloser}>
              Inspect
            </div>
            <div className="weeklyr" onClick={this.props.handleNextDay}>
              Next
              <br />
              Day
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CalSlideDrawer;

//Assertive controls vivo
//Test thousand artifacts at a time vitro no order
//peer reviewed donuts
//Such is not conclusive by testing 10 at a time.
//Geneologists make jokes about polyphyletic thinking like these peers you speak of
//We haven't made a virus that inceminates a cell. It is debris (exocytosis) "or true amino"
//If pandemics are real I am locking down humanharvest.info//what would you suggest to "control the virus"
//The whole industry is fake!
//Plumbers are champions of lifetime
//Michael suffers basis rate fallacy. 2025 will be worse by population growth lifetime ago
//Now he says stoks falling is bad for competition
//Now he says bankruptcy hurt the rich with foreclosure and down payments kept
//Am I the only good fact checker? Is this guy just trying to waste my time
//Inject me with virus see if I make more.
//Look for electromagnetic ? electron microscope

//renting property to eachother because dollars are deeds

//Do you agree 1941 1946 expected 2020 and 2025. Every 20 is normal
