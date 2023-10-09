import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { specialFormatting } from "../widgets/Sudo.js";
import Filter from "./Filter.js";
class NewFilter extends React.Component {
  state = {};
  render() {
    const { field } = this.props;
    return (
      <div
        style={{
          breakInside: "avoid",
          display: "flex",
          width: "calc(100%)",
          backgroundColor: "rgb(20,20,20)",
          color: "white",
          height: "min-content"
        }}
      >
        <input
          maxLength="15"
          className="input"
          style={{ margin: "10px", border: "none" }}
          placeholder="new election filter"
          value={this.state.entry}
          onChange={(e) =>
            this.setState({ entry: specialFormatting(e.target.value) })
          }
        />
        {this.state.entry && (
          <div
            onClick={() => {
              updateDoc(
                doc(firestore, "communities", this.props.community.id),
                {
                  [field]: arrayUnion(this.state.entry)
                }
              )
                .then(() => this.setState({ entry: "" }))
                .catch((err) => console.log(err.message));
              this.setState({ entry: "" });
            }}
          >
            +
          </div>
        )}
      </div>
    );
  }
}

const budgetType = (community) =>
  community.tract === "school"
    ? [
        { name: "class & campus", code: "a" }, //a
        { name: "records & preservation", code: "c" }, //c
        { name: "events & recreation", code: "d" }, //d
        { name: "engineering arts & science", code: "f" }, //f
        { name: "health & safety", code: "b" }, //b
        { name: "tuition & finance", code: "e" } //e
      ]
    : community.tract === "town/county"
    ? [
        { name: "engineering & variance", code: "f" }, //f
        { name: "records & preservation", code: "c" }, //c
        { name: "events parks & recreation", code: "d" }, //d
        { name: "education", code: "a" }, //a
        { name: "public health", code: "b" }, //b
        { name: "fire safety & stormweather", code: "h" },
        { name: "sanitation", code: "i" },
        { name: "power", code: "g" }, //g
        { name: "custodial & taxes", code: "e" } //e
      ]
    : community.tract === "country/providence/state"
    ? [
        { name: "custodial & spending", code: "e" }, //e
        { name: "education & services", code: "a" }, //a
        { name: "food, drug & safety", code: "b" }, //b
        { name: "human & civic rights", code: "f" }, //f
        { name: "records & preservation", code: "c" }, //c
        { name: "international", code: "d" } //d
      ]
    : [
        { name: "class & campus", code: "a" }, //a
        { name: "records & preservation", code: "c" }, //c
        { name: "events & recreation", code: "d" }, //d
        { name: "engineering arts & science", code: "f" }, //f
        { name: "health & safety", code: "b" }, //b
        { name: "tuition & finance", code: "e" } //e
      ];
const ordinanceType = [
  { name: "food, drug & safety", code: "b" }, //a
  { name: "education & services", code: "a" }, //c
  { name: "custodial rights", code: "e" }, //e
  { name: "international", code: "d" }, //d
  { name: "records & preservation", code: "c" }, //c
  { name: "civil rights", code: "f" } //b
];
const caseType = [
  { name: "food, drug & safety", code: "b" }, //a
  { name: "education & services", code: "a" }, //c
  { name: "custodial rights", code: "e" }, //e
  { name: "international", code: "d" }, //d
  { name: "records & preservation", code: "c" }, //c
  { name: "civil rights", code: "f" } //b
];

class Filters extends React.Component {
  state = { newIssue: "" };
  render() {
    const { coll, commtype, departmentTyped, showFilters } = this.props;
    var isMember = "";
    var isAdmin = "";
    var isLoggedAndCommunity =
      this.props.auth !== undefined && this.props.community;
    if (isLoggedAndCommunity) {
      isAdmin =
        this.props.auth.uid === this.props.community.authorId ||
        (this.props.community.admin &&
          this.props.community.admin.includes(this.props.auth.uid));
      isMember =
        !this.props.community.privateToMembers ||
        this.props.community.faculty.includes(this.props.auth.uid) ||
        this.props.community.members.includes(this.props.auth.uid);
    }
    var field = this.props.isClass
      ? "classFilters"
      : this.props.isOrdinance
      ? "departmentFilters"
      : this.props.isElection
      ? "electionFilters"
      : "";
    return (
      <div
        style={{
          bottom: "0px",
          overflow: "hidden",
          zIndex: 9999,
          width: "100%",
          transition: ".5s ease-out",
          height: !showFilters ? "0%" : "100%",
          position: "fixed"
        }}
      >
        <div
          //#333
          onClick={this.props.bigClose}
          style={{
            transition: ".3s ease-in",
            backgroundColor: "rgba(20,20,40,.5)",
            display: "flex",
            top: "0px",
            position: "absolute",
            width: "100%",
            height: showFilters ? "100%" : "0%"
          }}
        />
        {["elections", "classes", "departments"].includes(
          this.props.commtype
        ) &&
          !this.props.subForum &&
          this.props.isAdmin && (
            <NewFilter community={this.props.community} field={field} />
          )}

        <Filter
          openWhen={this.props.openWhen}
          departmentTyped={departmentTyped}
          theLotOfPosts={this.props.theLotOfPosts}
          city={this.props.city}
          community={this.props.community}
          coll={coll}
          field={field}
          commtype={commtype}
          isAdmin={isAdmin}
          isMember={isMember}
        />
      </div>
    );
  }
}

export default Filters;
