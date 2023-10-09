import React from "react";
import AsEntity from "./AsEntity";
import Types from "./Types";

class Confirm extends React.Component {
  state = {};
  render() {
    const subtypes =
      this.props.initial === "event"
        ? [
            "food",
            "business",
            "tech",
            "recreation",
            "education",
            "arts",
            "sport",
            "concert",
            "cause",
            "party & clubbing",
            "day party festival"
          ]
        : this.props.initial === "club"
        ? [
            "sport",
            "networking",
            "technology",
            "engineering",
            "science",
            "literature",
            "recreation",
            "arts",
            "medicine",
            "music",
            "non-profit",
            "politics"
          ]
        : this.props.initial === "shop"
        ? [
            "clothing",
            "technology",
            "movies",
            "trinkets",
            "home furnishing",
            "tools",
            "auto",
            "grocery",
            "music",
            "appliances"
          ]
        : this.props.initial === "restaurant"
        ? [
            "chinese",
            "italian",
            "mexican",
            "indian",
            "homestyle & fried",
            "burgers & sandwich",
            "noodles",
            "vegan & health",
            "seafood",
            "breakfast & lunch"
          ]
        : this.props.initial === "service"
        ? [
            "hair, nails & tan",
            "catering",
            "lawyer",
            "mechanic",
            "internist",
            "orthopedist",
            "orthodontist",
            "dentist",
            "graphics & animation",
            "video production",
            "photography",
            "code",
            "architecture",
            "interior design",
            "landscaping",
            "framing",
            "HVAC",
            "painting",
            "plumbing",
            "electrician",
            "accounting",
            "carpentry",
            "welding",
            "masonry",
            "musician",
            "acting",
            "writer",
            "singer"
          ]
        : this.props.initial === "job"
        ? [
            "tech",
            "hospitality",
            "office",
            "auto",
            "home",
            "shipping",
            "education",
            "arts",
            "medical",
            "music",
            "non-profit",
            "business"
          ]
        : this.props.initial === "housing"
        ? [
            "stay",
            "rent",
            "+5m",
            "3-5m",
            "1-3m",
            "800-1m",
            "500-800",
            "100-500",
            "50-100",
            "<50"
          ]
        : this.props.initial === "page"
        ? ["pod", "radio", "television news", "series", "movies"]
        : this.props.initial === "venue"
        ? [
            "in theatre",
            "rewinds & drive-ins",
            "playwrights",
            "music",
            "sport",
            "museum"
          ]
        : false;
    return (
      <div
        style={{
          display: "block",
          position: "relative"
        }}
      >
        <div
          onClick={this.props.back}
          style={{
            backgroundColor: "rgb(200,200,250)",
            height: "56px",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            display: "flex",
            width: "100%"
          }}
        >
          Close
        </div>
        <div>
          {this.props.initial === "event" &&
            ((this.props.myClubs && this.props.myClubs !== []) ||
              (this.props.myShops && this.props.myShops !== []) ||
              (this.props.myServicess && this.props.myServicess !== []) ||
              (this.props.myClasses && this.props.myClasses !== []) ||
              (this.props.myPages && this.props.myPages !== []) ||
              (this.props.myRestaurants && this.props.myRestaurants !== []) ||
              (this.props.myDepartments &&
                this.props.myDepartments !== [])) && (
              <AsEntity
                postedAs={this.props.postedAs}
                entityId={this.props.entityId}
                setPoster={this.props.setPoster}
                myClubs={this.props.myClubs}
                myShops={this.props.myShops}
                myServices={this.props.myServices}
                myClasses={this.props.myClasses}
                myPages={this.props.myPages}
                myRestaurants={this.props.myRestaurants}
                myDepartments={this.props.myDepartments}
                auth={this.props.auth}
              />
            )}
        </div>
        <Types
          subtype={this.props.subtype}
          setType={this.props.setType}
          recipientSuggestionsProfiled={this.props.recipientSuggestionsProfiled}
          pauseNeedTopic={this.props.pauseNeedTopic}
          topicSuggestions={this.props.topicSuggestions}
          auth={this.props.auth}
          users={this.props.users}
          subtypes={subtypes}
          selectedType={this.props.selectedType}
          setRecipients={this.props.setRecipients}
        />
      </div>
    );
  }
}
export default Confirm;
