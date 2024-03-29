import React from "react";
import sort from "./sort.png";
import { FilterButton } from "../../.././App/TypesMap";

class Topsort extends React.Component {
  state = { notif: 0 };

  openChat = () => {
    this.props.setForum({
      chatsopen: true,
      closeAllStuff: true,
      started: false
    });
    !this.props.forumOpen && this.props.setIndex({ forumOpen: true });
  };
  render() {
    const { community, globeChosen, typeOrder } = this.props;
    return (
      <div
        style={{
          display: "block",
          width: "100%"
        }}
      >
        <div
          onMouseEnter={() => this.setState({ tophover: true })}
          onMouseLeave={() => this.setState({ tophover: false })}
          style={{
            transition: ".3s ease-in",
            alignItems: "center",
            display: "flex",
            justifyContent: "space-around",
            borderBottom: "1px solid grey",
            width: "100%",
            height: "56px",
            position: "relative"
          }}
        >
          <div
            onClick={() => {
              if (this.props.pathname === "/login") {
                return this.props.navigate("/");
              }
              this.props.setFoundation({ forumOpen: false });
            }}
            style={{
              overflow: "hidden",
              display: "flex",
              position: "relative",
              width: this.props.forumOpen ? "56px" : "0px",
              height: this.props.forumOpen ? "56px" : "0px",
              transition: ".3s ease-out",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                backgroundColor: "rgb(20,20,20)",
                display: "flex",
                top: "56px",
                width: this.props.forumOpen ? "46px" : "0px",
                height: this.props.forumOpen ? "46px" : "0px",
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px"
              }}
            >
              &times;
            </div>
          </div>
          <div
            onClick={this.props.eventTypes} //togglePagination
            style={{
              height: "36px",
              width: "36px",
              position: "relative"
            }}
          >
            <img
              style={{
                height: "100%",
                width: "auto",
                backgroundColor: "black",
                borderRadius: "10px"
              }}
              alt="sort btn"
              src={sort}
            />
          </div>
          {
            //highAndTight ? (
            /*<FilterButton
              //color={this.state.tophover ? [20, 20, 20] : backgroundColor}
              openFilters={() => {
                if (subForum) {
                  this.props.eventTypes();
                } else if (this.props.showFilters) {
                  if (typeOrder && this.props[typeOrder.type]) {
                    this.props.openFilters();
                  }
                } else {
                  typeOrder && this.props[typeOrder.trigger]();
                }
              }}
              inTopSort={true}
              thru={
                commtype === "budget & proposal"
                  ? "budget"
                  : commtype === "forms & permits"
                  ? "forms"
                  : commtype +
                    `${
                      this.props.openWhen === "expired"
                        ? `/${this.props.openWhen}`
                        : ""
                    }`
              }
            />*/
            /**
           * 
            <Type
              eventTypes={this.props.eventTypes}
              subForum={subForum}
              unSubForum={this.props.unSubForum}
              forumOpen={forumOpen}
              showFilters={this.props.showFilters}
            />
           */
          }
          {this.props.showFilters && (
            <div
              onClick={() => {
                if (this.props.showFilters) {
                  this.props[typeOrder.trigger]();
                } else {
                  this.props.openFilters();
                }
              }}
              style={{
                right: "-20px",
                top: "10px",
                opacity: ".4",
                position: "absolute",
                padding: "7px",
                backgroundColor: "grey",
                borderRadius: "13px"
              }}
            >
              &times;
            </div>
          )}
          <div>
            <div
              style={{
                position: "relative",
                boxShadow: "-2px 1px 1px 2px rgb(200,100,250)",
                borderRadius: "2px",
                marginRight: "2px",
                paddingRight: "5px",
                color: "black",
                backgroundColor: "rgb(250,250,250)",
                width: "max-content"
              }}
            >
              {community
                ? community.tract && community.tract
                : globeChosen
                ? "following"
                : "local"}
            </div>
            <div
              onMouseEnter={() => this.setState({ hoverListToggle: true })}
              onMouseLeave={() => this.setState({ hoverListToggle: false })}
              onClick={this.props.listplzToggle}
              style={{
                display: "flex",
                position: "relative",
                flexWrap: "wrap",
                width: "40px",
                opacity: this.state.hoverListToggle ? "1" : ".6",
                transition: ".1s ease-in"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "2px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black"
                }}
              />
            </div>
          </div>
          {/*!openCal && (!chatsopen || achatopen) && (
            <Link
              to={{
                pathname: achatopen ? "/calendar" : "/plan",
                state: {
                  prevLocation: this.props.pathname,
                  chatwasopen: achatopen,
                  recentchatswasopen: chatsopen
                }
              }}
              style={{
                left: shiftRight ? "56px" : "10px",
                textDecoration: "none",
                display: "flex",
                position: "relative",
                backgroundColor: "black",
                border:
                  notesForward && notesForward.length > 0
                    ? "2px rgb(197,179,88) solid"
                    : "0px rgb(88,179,197) solid",
                width: "46px",
                height: "46px",
                borderRadius: "45px",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                transition: ".3s ease-in"
              }}
              onClick={this.openChat}
            >
              {notesForward && notesForward.length}
            </Link>
            )*/}
          <div
            style={{
              justifyContent: "space-between",
              minWidth: "60px",
              //ahh
              borderRadius: "10px",
              backgroundColor: "rgba(30,20,30,.4)",
              display: "none",
              position: "relative",
              width: `max-content`,
              padding: "14px 10px",
              alignItems: "center",
              color: "white",
              transition: "ease-in .5s"
            }}
          >
            {this.props.unreadChatsCount > 0 && (
              <div style={{ display: "flex" }}>
                <p style={{ color: "rgb(120,230,240)" }}>&#8226;</p>&nbsp;
                <p>{this.props.unreadChatsCount} new messages</p>
              </div>
            )}
            <img
              onClick={this.openChat}
              style={{
                width: "20px"
              }}
              src="https://www.dropbox.com/s/ierecm4f5q5z706/chats%20map%20%283%29.png?raw=1"
              alt="My Messages"
            />
            |
            <img
              onClick={() => {
                this.props.setForum({ openCal: !this.props.openCal });
              }}
              style={{
                width: "20px"
              }}
              src="https://www.dropbox.com/s/tq38q9pdert0f0n/PLAN%20BUTTON.png?raw=1"
              alt="My Plans"
            />
          </div>
          {!this.props.showNew && (
            <span
              onClick={() => this.props.triggerNew()}
              style={{
                fontSize: "30px",
                border: "2px solid",
                padding: "0px 10px",
                borderRadius: "10px"
              }}
            >
              +
            </span>
          )}
        </div>
      </div>
    );
  }
}
export default Topsort;
