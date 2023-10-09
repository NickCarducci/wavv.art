import React from "react";
import firebase from "../../.././init-firebase";
import NewPost from "./NewPost";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  updateDoc,
  where
} from "firebase/firestore";
import { arrayMessage } from "../../../App/Post/Media/EditTitle";
import Make from ".././Make";
import { specialFormatting } from "../../../widgets/Sudo";

//prople never change and 68.85% occupy protestors don't vote

export const standardCatch = (err) => console.log(err.message);

const firestore = getFirestore(firebase);
class NewForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textBoxHeight: 30,
      comments: [],
      chosenEntity: null,
      chosenIssue: "Miscellaneous",
      entityId: null,
      lastEntityId: null,
      entityType: "users",
      height: 0,
      optionMake: "forum"
    };
    this.post = React.createRef();
    this.size = React.createRef();
    this.textBox = React.createRef();
  }
  checkfeas = (now, last) => {
    const myLabels = [
      "myEvents",
      "myJobs",
      "myCommunities",
      "myClubs",
      "myServices",
      "myClasses",
      "myDepartments",
      "myRestaurants",
      "myShops",
      "myPages",
      "myVenues",
      "myHousing"
    ];
    return myLabels.every((x) => {
      return last[x] === now[x];
    });
  };
  componentDidUpdate = async (prevProps) => {
    if (!this.checkfeas(this.props.myStuff, prevProps.myStuff)) {
      this.setState(this.props.myStuff);
    }
    if (
      this.state.entityId &&
      this.state.entityId !== this.state.lastEntityId
    ) {
      onSnapshot(
        doc(firestore, this.state.entityType, this.state.entityId),
        (doc) => {
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            this.setState({ chosenEntity: foo });
          }
        }
      );
      this.setState({ lastEntityId: this.state.entityId });
    }
  };
  render() {
    const { profileEntities, community } = this.props;
    var issuess =
      this.props.issues && this.props.issues.length > 0
        ? ["Miscellaneous", ...this.props.issues]
        : ["Miscellaneous"];
    var issues = [...new Set(issuess)];
    const allow = this.props.onlyPost === "" && this.props.onlyCommunity === "";
    return (
      <div
        style={{
          backgroundColor: "white",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          transition: ".5s ease-out"
        }}
      >
        <div
          style={{
            opacity:
              this.props.onlyPost !== "" || this.props.onlyCommunity !== ""
                ? 0.6
                : 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            borderBottom: "1px solid black",
            width: "100%"
          }}
        >
          <div
            style={{
              width: "max-content"
            }}
          >
            {community ? community.message : this.props.city}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {this.props.user === undefined ? (
              <div
                onClick={this.props.getUserInfo}
                //to="/login"
                style={{
                  color: "black",
                  flexDirection: "column",
                  alignText: "center",
                  opacity: ".5",
                  left: "20px"
                }}
              >
                <div
                  style={{
                    padding: "3px 1px",
                    border: "1px solid",
                    width: "max-content"
                  }}
                >
                  <i className="fas fa-user-secret"></i>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex"
                }}
              >
                {!this.state.chosenEntity && (
                  <img
                    onClick={() =>
                      this.setState(
                        {
                          openOptions: !this.state.openOptions
                        },
                        () =>
                          this.state.openOptions &&
                          this.setState({
                            chosenEntity: null,
                            entityId: null,
                            entityType: null
                          })
                      )
                    }
                    style={{
                      display: "flex",
                      width: "56px",
                      height: "auto"
                    }}
                    src={this.props.user.photoThumbnail}
                    alt={this.props.user.username}
                  />
                )}
                <img
                  onClick={() =>
                    this.setState({ openOptions: !this.state.openOptions })
                  }
                  style={{
                    display: !this.state.chosenEntity ? "none" : "flex",
                    position: "absolute",
                    width: "100%",
                    height: "auto"
                  }}
                  src={
                    this.state.chosenEntity &&
                    this.state.chosenEntity.chosenPhoto &&
                    this.state.chosenEntity.chosenPhoto.small
                  }
                  alt="error"
                />
              </div>
            )}
            {this.state.chosenIssue === this.state.newIssue ? (
              <div style={{ display: "flex" }}>
                <b>{this.state.chosenIssue}</b>
                <button onClick={() => this.setState({ newIssue: null })}>
                  &times;
                </button>
              </div>
            ) : (
              <div>
                <select
                  style={{
                    userSelect: "none"
                  }}
                  onChange={(e) =>
                    this.setState({ chosenIssue: e.target.value })
                  }
                >
                  {issues.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                {!this.state.newIssue && this.state.newIssue !== "" ? (
                  <button
                    onClick={() => {
                      this.setState({ newIssue: "" });
                    }}
                  >
                    +
                  </button>
                ) : (
                  <form
                    style={{ display: "flex" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.setState({
                        chosenIssue: this.state.newIssue
                      });
                    }}
                  >
                    <input
                      value={this.state.newIssue}
                      className="input"
                      placeholder="new issue"
                      onChange={(e) =>
                        this.setState({
                          newIssue: specialFormatting(e.target.value)
                        })
                      }
                    />
                    <button onClick={() => this.setState({ newIssue: null })}>
                      &times;
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
          <div
            onClick={() => this.props.triggerNew()}
            style={{
              userSelect: "none",
              borderLeft: "10px solid rgb(80,50,190)",
              borderTopLeftRadius: "50px",
              borderBottomLeftRadius: "50px",
              display: "flex",
              position: "absolute",
              right: "0px",
              top: "17px",
              width: "56px",
              height: "42px",
              alignItems: "center",
              justifyContent: "center",
              color: "rgb(200,200,200)",
              backgroundColor: "rgb(20,20,20)"
            }}
          >
            &times;
          </div>
        </div>

        {[
          "forum",
          "department",
          "class",
          "ordinance",
          "election",
          "case"
        ].includes(this.state.optionMake) ? (
          <NewPost
            city={this.props.city}
            getUserInfo={this.props.getUserInfo}
            closeNewForum={this.props.closeNewForum}
            openOptions={this.state.openOptions}
            profileEntities={profileEntities}
            allow={allow}
            comments={this.props.comments}
            community={community}
            rebeat={this.props.rebeat}
            cancelRebeat={this.props.cancelRebeat}
            chosenEntity={this.state.chosenEntity}
            chosenIssue={this.state.chosenIssue}
            commtype={this.props.commtype}
            auth={this.props.auth}
            user={this.props.user}
            etypeChanger={this.props.etypeChanger}
            chosenPostId={this.props.chosenPostId}
            entityType={this.props.entityType}
            entityId={this.props.entityId}
            initial={this.state.optionMake}
          />
        ) : (
          <Make
            allow={allow}
            optionMake={this.state.optionMake}
            recipients={this.props.recipients}
            initial={this.state.optionMake}
            materialDate={this.props.materialDate}
            materialDateOpener={this.props.materialDateOpener}
            auth={this.props.auth}
            navigate={this.props.navigate}
          />
        )}
        <select
          value={this.state.optionMake}
          style={{ margin: "10px", maxWidth: "80%", width: "100px" }}
          onChange={(e) => {
            this.setState({
              optionMake: e.target.value
            });
          }}
        >
          {[
            "forum",
            "event",
            "election",
            "ordinance",
            "class",
            "case",
            "department",
            "restaurant",
            "service",
            "shop",
            "page",
            "venue",
            "club",
            "job",
            "housing"
          ].map((x) => {
            const auth = (key) =>
              this.props.community &&
              this.props.community[key] &&
              this.props.auth !== undefined &&
              this.props.community[key].includes(this.props.auth.uid);
            if (
              ![
                "ordinance",
                "election",
                "department",
                "class",
                "case"
              ].includes(x) ||
              auth("faculty") ||
              auth("admin")
            ) {
              return <option key={x + "new"}>{x}</option>;
            } else return null;
          })}
        </select>
      </div>
    );
  }
}
export default NewForum;

/*componentDidMount = () => {
    window.twttr = (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");

    window.addEventListener("resize", this.refresh);
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.refresh);
  }
  tweetEmbed = (id) => {
    var url =
        "https://api.twitter.com/1/statuses/oembed.json?id=" +
        id +
        "&callback=",
      fn = "TE_" + Date.now();

    url += fn;

    window[fn] = (data) => {
      document.body.removeChild(script);
      console.log(data);
      this.setState({ data });
    };

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    document.body.appendChild(script);
  };*/
