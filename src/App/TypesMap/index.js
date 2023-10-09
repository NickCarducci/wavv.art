import React from "react";
import EventType from "./EventType";
//import firebase from "../../.././init-firebase";
import Claim from ".././SwitchCity/Display/Claim";
import {
  BudgetProposalImg,
  ClassImg,
  CourtCaseImg,
  DepartmentImg,
  ElectionImg,
  FormsAndPermitsImg,
  GameImg,
  LessonImg,
  NewCommPostImg,
  NewPostImg,
  OrdinanceImg,
  ShowImg
} from "./aphoto";
import "./EventTypesMap.css";
import EventTypeTop from "./EventTypeTop";
const statesForBillsOfOpenStates = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];
export class FilterButton extends React.Component {
  render() {
    //const { color } = this.props;
    return (
      <div
        onClick={this.props.openFilters}
        style={{
          color: "white",
          alignItems: "center",
          display: "flex",
          position: "relative",
          padding: "7px",
          margin: "0px 14px",
          backgroundColor: "black",
          //backgroundColor: `rgb(${color})`,
          borderRadius: "13px"
        }}
      >
        <div
          style={{
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "33px",
              height: "3px",
              backgroundColor: "rgb(50,50,50)",
              margin: "2px 0"
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "30px",
              height: "3px",
              backgroundColor: "#444",
              margin: "2px 0"
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "35px",
              height: "3px",
              backgroundColor: "#555",
              margin: "2px 0"
            }}
          />
        </div>
        <div style={{ marginLeft: "6px", width: "max-content" }}>
          {this.props.thru}
        </div>
      </div>
    );
  }
}
class ForumType extends React.Component {
  render() {
    const {
      commtype,
      forumOpen,
      community,
      subForum,
      show,
      width
    } = this.props;
    const notBlocked = (x) => community && !community.blockedForum.includes(x);
    return (
      <div style={{ display: !subForum && show ? "block" : "none" }}>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.tileChanger(e.target.id.split("/")[1], false);
              this.props.eventTypes();
            }
          }}
          className="eventtypessetmap"
          style={{
            width: "100%",
            display:
              !community && forumOpen && !this.props.globeChosen
                ? "none"
                : "none"
          }}
        >
          <NewPostImg commtype={commtype} id={commtype} maxWidth={width} />
          <LessonImg commtype={commtype} id={commtype} maxWidth={width} />
          <ShowImg commtype={commtype} id={commtype} maxWidth={width} />
          <GameImg commtype={commtype} id={commtype} maxWidth={width} />
        </div>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.setData({ commtype: e.target.id.split("/")[1] });
              //this.props.tileChanger(e.target.id.split("/")[1], false);
            }
          }}
          className="eventtypessetmap"
          style={{
            display: community ? "flex" : "none"
          }}
        >
          <NewCommPostImg commtype={commtype} maxWidth={width} />
          {false && notBlocked("forms & permits") && (
            <FormsAndPermitsImg commtype={commtype} maxWidth={width} />
          )}
          {notBlocked("ordinances") && (
            <OrdinanceImg commtype={commtype} maxWidth={width} />
          )}
          {false && notBlocked("budget") && (
            <BudgetProposalImg commtype={commtype} maxWidth={width} />
          )}
          {notBlocked("elections") && (
            <ElectionImg commtype={commtype} maxWidth={width} />
          )}
          {notBlocked("cases") && (
            <CourtCaseImg commtype={commtype} maxWidth={width} />
          )}
          {notBlocked("classes") && (
            <ClassImg commtype={commtype} maxWidth={width} />
          )}
          {notBlocked("departments") && (
            <DepartmentImg commtype={commtype} maxWidth={width} />
          )}
          {community && statesForBillsOfOpenStates.includes(community.message) && (
            <div
              id="bills"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderRadius: "20px",
                width: "120px",
                height: "40px",
                backgroundColor: "navy"
              }}
            >
              Bills
            </div>
          )}
        </div>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.tileChanger(e.target.id.split("/")[1], false);
              this.props.eventTypes();
            }
          }}
          className="eventtypessetmap"
          style={{
            width: "100%",
            display: this.props.globeChosen ? "flex" : "none"
          }}
        >
          Global
          <NewPostImg commtype={commtype} maxWidth={width} />
          <LessonImg commtype={commtype} maxWidth={width} />
          <ShowImg commtype={commtype} maxWidth={width} />
        </div>
      </div>
    );
  }
}
class EventTypesMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.header = React.createRef();
  }
  socialOpener = () => {
    this.setState({
      socialOpen: !this.state.socialOpen
    });
  };
  render() {
    const {
      showReqMayorForm,
      community,
      subForum,
      type,
      subtype,
      tileChosen,
      show,
      forumOpen,
      commtype
    } = this.props;
    const max = 200;
    var columncount = 3; //
    if (this.props.width < max + 1350) columncount = 4;
    if (this.props.width < max + 900) columncount = 3;
    if (this.props.width < max + 450) columncount = 2;
    if (this.state.listplz || this.props.width < max) columncount = 1;
    const width = this.props.width / columncount;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: this.props.forumOpen ? "1" : "",
          overflow: "hidden",
          height: "min-height",
          maxHeight: show ? "min-content" : "0px",
          position: "relative",
          wordBreak: "break-word",
          width: "100%",
          transition: ".3s ease-in"
        }}
      >
        <div
          ref={this.header}
          style={{
            position: "absolute",
            width: "100%",
            height: show ? "100%" : "0%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transition: ".7s ease-in"
          }}
          onClick={this.props.eventTypes}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column"
          }}
        >
          <EventTypeTop
            setFolder={this.props.setFolder}
            getUserInfo={this.props.getUserInfo}
            setEventTypes={(x) => this.setState(x)}
            tileChosen={tileChosen}
            forumOpen={forumOpen}
            subForum={subForum}
            commtype={commtype}
            eventTypes={this.props.eventTypes}
            openFilters={this.props.openFilters}
            auth={this.props.auth}
            city={this.props.city}
            showReqMayorForm={showReqMayorForm}
            community={community}
            type={type}
          />
          <div
            style={{
              display:
                !["classes", "departments"].includes(commtype) &&
                (!forumOpen || subForum)
                  ? "block"
                  : "none"
            }}
          >
            <EventType
              type={type}
              width={width}
              tileChosen={tileChosen}
              forumOpen={forumOpen}
              subForum={subForum}
              commtype={commtype}
              subtype={subtype}
              eventTypes={this.props.eventTypes}
              openFilters={this.props.openFilters}
              auth={this.props.auth}
              city={this.props.city}
              showReqMayorForm={this.state.showReqMayorForm}
              community={community}
              change={(e) => {
                console.log("s", e);
                if (e) {
                  this.props.tileChanger(e, false);
                  this.props.eventTypes();
                }
              }}
            />
          </div>
          {this.props.forumOpen && (
            <ForumType
              setData={this.props.setData}
              show={this.props.show}
              setEventTypes={(x) => this.setState(x)}
              commtype={commtype}
              width={width}
              openFilters={this.props.openFilters}
              community={community}
              auth={this.props.auth}
              city={this.props.city}
              globeChosen={this.props.globeChosen}
              forumOpen={forumOpen}
              eventTypes={this.props.eventTypes}
              getUserInfo={this.props.getUserInfo}
              showReqMayorForm={this.state.showReqMayorForm}
              user={this.props.user}
              tileChanger={this.props.tileChanger}
              tileChosen={tileChosen}
              subForum={subForum}
            />
          )}
          <div
            style={{
              width: "calc(100% - 2px)",
              display: "flex"
            }}
          >
            <div
              onClick={() => this.props.eventTypes()}
              style={{
                padding: "10px 0px",
                textAlign: "center",
                fontSize: "20px",
                position: "relative",
                width: "calc(100% - 2px)",
                color: "white",
                border: "1px solid white",
                backgroundImage:
                  "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
              }}
            >
              Close
            </div>
            {this.props.community && (
              <div
                style={{
                  padding: "10px 0px",
                  textAlign: "center",
                  fontSize: "20px",
                  position: "relative",
                  width: "calc(100% - 2px)",
                  color: "white",
                  border: "1px solid white",
                  backgroundImage:
                    "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
                }}
                onClick={() => {
                  this.props.fetchCommForum();
                  this.props.eventTypes();
                }}
              >
                Start Search
              </div>
            )}
          </div>
        </div>
        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />
      </div>
    );
  }
}
export default EventTypesMap;

/**
 * 
<div
onClick={this.props.eventTypes}
style={{
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "white"
}}
>
<FilterButton
  openFilters={this.props.openFilters}
  thru={"services in"}
/>
{community ? (
  this.props.auth !== undefined &&
  (this.props.auth.uid === community.authorId ||
    community.admin.includes(this.props.auth.uid)) && (
    <div
      onClick={() => {
        this.props.eventTypes("settings");
      }}
      style={{
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img
        src={settings}
        alt="settings"
        style={{
          zIndex: "9999",
          top: "200px",
          opacity: ".95",
          left: "20px",
          position: "absolute",
          height: "19px",
          padding: "7px",
          backgroundColor: "#333",
          width: "19px",
          borderRadius: "13px"
        }}
      />
    </div>
  )
) : (
  <div
    onClick={() => {
      var answer = window.confirm("Are you a town clerk?");
      if (answer && this.props.auth === undefined) {
        var sendtologin = window.confirm("You need to login");
        if (sendtologin) {
          this.props.getUserInfo();
        }
      } else if (answer) {
        this.setState({ showReqMayorForm: this.props.city });
      }
    }}
    style={{
      color: "white",
      borderRadius: "20px",
      padding: "0px 20px",
      display: this.props.showReqMayorForm ? "none" : "flex",
      position: "absolute",
      right: "40px",
      backgroundColor: "rgba(50,50,50,.8)",
      top: "10px",
      zIndex: "9999"
    }}
  >
    ...
  </div>
)}
<div
  style={{
    paddingBottom: "15px",
    paddingTop: "5px"
  }}
>
  {community
    ? community.message
    : this.props.city}
</div>
<div
  style={{
    position: "relative",
    height: "min-content",
    display: "flex",
    flexDirection: "column"
  }}
>
  <div
    style={{
      display: "flex",
      position: "relative",
      transform: "translateX(-10%)",
      zIndex: "9999"
    }}
  >
    <Fave
      x={
        community
          ? community.message
          : this.props.city
      }
      user={this.props.user}
      auth={this.props.auth}
    />
  </div>
  {community ? (
    <Link
      to={`/${uriParser(community.message)}`}
      style={{
        display: "flex",
        width: "100px",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <img
        src={
          community.photoThumbnail
            ? community.photoThumbnail
            : images1
        }
        alt={community.message}
      />
    </Link>
  ) : (
    <Link
      to={`/${uriParser(this.props.city)}`}
      style={{
        overflow: "hidden",
        display: "flex",
        position: "relative",
        height: "100px",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <WeatherCitySky
        style={{ touchAction: "none" }}
        city={this.props.city}
        leaveItAlone={false}
      />
    </Link>
  )}
</div>
 */
