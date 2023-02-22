import React from "react";
import back from "../.././Icons/Images/back.png";

class Body extends React.Component {
  render() {
    const { eventInitial, entityType, submitPaused } = this.props;
    let drawerClasses = "eventsettings-drawer";
    if (this.props.eventSettingsOpen) {
      drawerClasses = "eventsettings-drawer open";
    }
    return (
      <div>
        <div className="New_EventSettings_Header">
          {submitPaused ? null : (
            <img
              src={back}
              className="backnew"
              alt="error"
              onClick={this.props.eventSettingsCloser}
            />
          )}
          {entityType}
          details
        </div>
        <div className={drawerClasses}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              position: "absolute",
              width: "100%",
              height: "min-content"
            }}
          >
            <textarea
              type="search"
              className="event-form-details"
              name="body"
              id="body"
              rows="2"
              cols="20"
              wrap="hard"
              onChange={this.props.handleChangeBody}
              placeholder="Write details here"
              autoComplete="off"
              onFocus={() => window.scrollTo(0, 0)}
            />
            {eventInitial && (
              <div
                style={{
                  margin: "30px",
                  fontSize: "15px",
                  display: "flex",
                  position: "relative",
                  height: "min-content",
                  width: "90%",
                  top: "15px",
                  color: "grey",
                  left: "50%",
                  transform: "translateX(-50%)",
                  justifyContent: "center"
                }}
              >
                Add tickets from event edit page after you post item
                <br />
                Access this event page from your profile, or search for it
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Body; //big buy ins not human action
//​profit share (in kind) usually down to reverse amortize (from liability)
//​we can bankrupt advances with foreclosure and reverse payables
//​good place to start is income by race 1820-1870? https://usafacts.org/articles/the-1860-census-counted-4-million-enslaved-people-it-counted-zero-in-1870/
//debts are stolen purchase but industry payday or work for someone to skimp (when income > their income)
//kennedy wanted fedcash atm invest in yourself
//​the mafia want right to try; ​petro is revenuedata.doi.gov?
//petro dollar because of a tentative deal instead of consortium
