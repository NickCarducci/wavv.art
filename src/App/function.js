import React from "react";
import firebase from ".././init-firebase";
//fair banking or no lending
import {
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore, //G-d is not the Father, rather the father is a real douche
  startAt, //gigilos will settle it
  getDoc,
  doc,
  collection,
  updateDoc,
  getDocs,
  limitToLast
} from "firebase/firestore";
import PropTypes from "prop-types";
import Forum from ".././components/Forum";
import Filters from "./Filters";
import Find from "./Find";
import Header from "./Header";
import List from "./SwitchCity/List";
import Notifs from ".././notifs";
import RollFiles from "./Post/Media/RollFiles";
import FormPicker from "./TV/FormPicker";
import LocOpen from "./TV/LocOpen";
import { specialFormatting } from "../widgets/Sudo";
//Didn't Trump collude with the government to set up checking bank runs?
//If you are smart enough to defect from banking, why would you take a
//technical electrical job? Isn't working for equity in private intellectual property
//and copyright of entrepreneurship and more competition more fruitful for themselves and everyone?
//Why is 401k favored to the leisure to prefer from competition?
//If you are a software developer, would you work for an accounting firm or build a competitor?
//When has an entrepreneur not made a substitute? Is a business or technology deflationary?
//How does an actor handle character?
//When is finance a good use of money?
//Are there any Republicans left who are against a safety net for bottom feeding government contractors?
//Does crowding out or government contracting generally make real income?
//bob fund, drop dead
//Should socialists or everyone at 77 WABC drop dead?
//Is good the product or right of the subject?
class Stuff extends React.Component {
  state = {};
  render() {
    const {
      editingCommunity,
      community,
      auth,
      commtype,
      highAndTight
    } = this.props;
    return (
      <div>
        {!this.props.globeChosen &&
        this.props.users &&
        editingCommunity &&
        commtype === "new" &&
        auth !== undefined &&
        community &&
        (auth.uid === community.authorId ||
          community.admin.includes(auth.uid) ||
          community.faculty.includes(auth.uid)) ? (
          //community edit button & Loc
          <div>
            <LocOpen
              choosePrediction={(prediction) => {
                this.props.setLoc({ locOpen: false });
                this.setState({
                  place_name: prediction.place_name,
                  center: [prediction.center[1], prediction.center[0]]
                });
              }}
              locOpen={this.props.locOpen}
              closeLoc={() => this.props.setLoc({ locOpen: false })}
              openLoc={() => this.props.setLoc({ locOpen: true })}
            />
            {((this.state.place_name !== "" &&
              this.props.community.place_name !== this.state.place_name) ||
              (this.state.center !== "" &&
                this.props.community.center !== this.state.center)) && (
              <div
                onClick={() =>
                  updateDoc(
                    doc(firestore, "communities", this.props.community.id),
                    {
                      place_name: this.state.place_name,
                      center: this.state.center
                    }
                  ).catch((err) => console.log(err.message))
                }
                style={{
                  backgroundColor: "rgb(0,30,60)",
                  display: "flex",
                  position: "relative",
                  boxShadow: "6px 3px 50px #222",
                  border: "none",
                  margin: "10px",
                  breakInside: "avoid",
                  textIndent: "10px",
                  alignItems: "center",
                  color: "grey"
                }}
              >
                Change to
                <br />
                {this.state.place_name}
                <br />
                {this.state.center}
              </div>
            )}
            {(this.state.place_name !== "" || this.state.center !== "") && (
              <div
                onClick={() => this.setState({ place_name: "", center: "" })}
                style={{
                  display: "flex",
                  border: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Clear
              </div>
            )}
            {/*<form
              onSubmit={async (e) => {
                e.preventDefault();

                if (auth !== undefined) {
                  var theri = false;
                  await fetch(
                    //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.message.toLowerCase()}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                  )
                    .then(async (response) => await response.json())
                    .then(
                      (body) => {
                        var predictions = body.features;
                        if (predictions.includes(this.state.message)) {
                          console.log("already there");
                          return (theri = true);
                        }
                      },
                      (err) => console.log(err)
                    );
                  if (
                    this.props.communities.find(
                      (x) => x.messageLower !== this.state.message.toLowerCase()
                    )
                  ) {
                    theri = true;
                  }
                  if (theri) {
                    this.setState({ useOtherName: true });
                  } else {
                    var there = this.props.communities.find(
                      (x) => x.message === this.state.message
                    );
                    if (there) {
                      this.setState({ useOtherName: true });
                    } else
                      auth &&
                        auth.uid &&
                        firebase
                          .firestore()
                          .collection("communities")
                          .doc(community.id)
                          .update({
                            message:
                              this.state.message !== ""
                                ? this.state.message
                                : community.id,
                            messageLower:
                              this.state.message !== ""
                                ? this.state.message.toLowerCase()
                                : community.messageLower,
                            body:
                              this.state.body !== ""
                                ? this.state.body
                                : community.body
                          })
                          .catch((err) => console.log(err.message));
                  }
                }
              }}
            >
              <input
                className="input"
                onChange={(e) => {
                  e.preventDefault();
                  this.state.useOtherName &&
                    this.setState({
                      useOtherName: false
                    });
                  this.setState({ message: e.target.value });
                }}
                value={this.state.message}
                minLength="3"
                style={
                  editingCommunity
                    ? {
                        display: "flex",
                        position: "relative",
                        boxShadow: "6px 3px 50px #222",
                        border: "none",
                        margin: "10px",
                        height: "36px",
                        breakInside: "avoid",
                        textIndent: "10px"
                      }
                    : { display: "none" }
                }
                placeholder={community.id}
              />
              {this.state.useOtherName && (
                <div>
                  {community.id === this.props.message
                    ? "Already yours"
                    : "Name taken"}
                </div>
              )}
              {(this.state.message || this.state.body) && (
                <div
                  onClick={() => this.setState({ place_name: "", center: "" })}
                  style={{
                    display: "flex",
                    border: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  Clear
                </div>
              )}
              <textarea
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ body: e.target.value });
                }}
                value={this.state.body}
                placeholder={community.body}
                style={
                  editingCommunity
                    ? {
                        display: "flex",
                        position: "relative",
                        boxShadow: "6px 3px 50px #222",
                        border: "none",
                        margin: "10px",
                        height: "120px",
                        breakInside: "avoid",
                        textIndent: "10px",
                        marginBottom: "20px",
                        paddingTop: "4px"
                      }
                    : { display: "none" }
                }
              />
              </form>*/}
          </div>
        ) : null}
        <div
          onClick={this.props.scrollBackToTheLeft}
          style={{
            display: "flex",
            position: "fixed",
            bottom: "0px",
            right: "0px",
            width: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            height: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "50px",
              color: "grey",
              backgroundColor: "white",
              positon: "absolute",
              display: "flex",
              width: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              fontSize: !highAndTight && this.props.forumOpen ? "" : "0px",
              height: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(270deg)"
            }}
          >
            {">"}
          </div>
        </div>
      </div>
    );
  }
}

class ForumAccessories extends React.Component {
  state = {};
  render() {
    return (
      <div
        style={{
          zIndex: "6",
          display: "flex",
          position: "fixed",
          backgroundColor: "black"
        }}
      >
        {this.props.commtype === "forms & permits" && (
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "0px",
              width: "100%",
              top: "0px",
              flexDirection: "column",
              backgroundColor: "white"
              //backgroundColor: "rgb(23, 27, 32)",
            }}
          >
            {/*<div
            style={{
              display: "flex",
              position: "relative",
              height: "56px",
              width: "100%",
              border: "blue 1px solid"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                height: "56px"
              }}
            >
              <div
                style={{
                  margin: "10px",
                  display: "flex",
                  position: "relative",
                  border: "blue 1px solid"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    width: "calc(56px - 20px)",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "blue"
                  }}
                >
                  _/
                </div>
                folder
              </div>
            </div>
          </div>*/}
            {!this.props.commdocs ? (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height: "min-content",
                  width: "300px",
                  color: "grey"
                }}
              >
                No docs to show
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  border: "blue 1px solid",
                  overflowX: "auto"
                }}
              >
                <RollFiles
                  user={this.props.user}
                  auth={this.props.auth}
                  showStuff={true}
                  videos={this.props.commdocs}
                  dontworry={true}
                />
              </div>
            )}
          </div>
        )}
        <FormPicker
          photoThumbnail={this.props.photoThumbnail}
          photoSrc={this.props.photoSrc}
          contents={this.props.contents}
          showpicker2={this.props.showpicker2}
          clearFiles={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          s={this.props.s}
          community={this.props.community}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          signIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          commtype={this.props.commtype}
          auth={this.props.auth}
          showDriver={this.props.showDriver}
          closeDriver={this.props.closeDriver}
        />
        {this.props.commtype === "forms & permits" ? (
          this.state.showDriver ? (
            <div
              onClick={() => this.setState({ showDriver: false })}
              style={{
                display: "flex",
                position: "fixed",
                right: "40px",
                top: "86px",
                color: "black",
                height: "40px",
                width: "40px",
                zIndex: "9999"
              }}
            >
              &times;
            </div>
          ) : (
            <div
              onClick={() => this.setState({ showDriver: true })}
              style={{
                display: "flex",
                position: "fixed",
                right: "40px",
                top: "86px",
                color: "grey",
                height: "40px",
                width: "40px",
                zIndex: "9999"
              }}
            >
              +
            </div>
          )
        ) : null}
      </div>
    );
  }
}

const firestore = getFirestore(firebase);
class Function extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      findheighter: 0,
      highAndTight: true,
      comm: {},
      notificationComments: [],
      notificationReactions: [],
      searching: "",
      //...this.resolveStateFromProp(),
      closeBottom: true,
      dayLiked: new Date().getHours() > 4 && new Date().getHours() < 20,
      zoomerOpen: true,
      zoomUpdated: true,
      zoomChosen: props.zoomChosen,
      city: "Los Angeles",
      cityapi: "Los%20Angeles",
      state: "CA",
      search: "",
      //mapheight: "",
      apiKeyFound: false,
      zoomerControl: false,
      data: [],
      counter: 0,
      chosenEdmevent: props.edmTrainevents && props.edmTrainevents[0],
      current: new Date().setHours(0, 0, 0, 0),
      date: new Date(),
      dateTimeZeroed: new Date(),
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      loading: false,
      searchedDate: new Date().setHours(0, 0, 0, 0),
      prev: props.queriedDate,
      mounted: false,
      stop: false,
      pointData: null,
      center: "",
      place_name: "",
      deletedForumPosts: [],
      comment: "",
      budgetTyped: "",
      ordinanceTyped: "",
      classTyped: "",
      caseTyped: "",
      departmentTyped: "",
      electionTyped: "",
      forumTyped: "",
      openWhat: "council",
      openWhen: "new",
      browsedCommunities: [],
      predictions: [],
      entitiesFound: []
    };
    this.map = React.createRef();
    this.closeSwitchMarker = React.createRef();
    this.forum = React.createRef();
    this.fwd = React.createRef();

    //props.combined.map(x => (this["myRef" + x.id] = React.createRef()));
    //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount = async () => {
    this.browseCommunities();
    //this.props.community && this.getBills();
    this.refresh();
    window.addEventListener("scroll", this.scroll);
    window.addEventListener("resize", this.refresh);
  };
  browseCommunities = (paginate, cities) => {
    //collection cannot be instantiated
    //const query = collection(firestore, "communities");
    //Function.prototype.apply was called on #<Aa>, which is a object and not a function
    const base =
      cities === 1 //countries
        ? [
            collection(firestore, "communities"),
            where("splitComma2", "<", ""),
            orderBy("splitComma2", "desc")
          ] //without a single comma
        : [2, 3, 4].includes(cities)
        ? [
            collection(firestore, "communities"),
            where(
              "tract",
              "==",
              cities === 4
                ? "school"
                : cities === 3
                ? "town/county"
                : "country/city/providence"
            ),
            orderBy("createdDate", "desc")
          ]
        : cities //cities
        ? [
            collection(firestore, "communities"),
            where("splitComma2", ">", ""),
            orderBy("splitComma2", "desc")
          ] //has at least two
        : [collection(firestore, "communities"), orderBy("members", "desc")];
    var shot = null;
    var nuller = "";
    if (!paginate) {
      shot = query(...base, limit(10));
    } else if (paginate === "undo") {
      nuller = "undoCommunity";
      shot = query(...base, startAfter(this.state.undoCommunity), limit(10));
    } else if (paginate === "last") {
      nuller = "lastCommunity";
      shot = query(
        ...base,
        endBefore(this.state.lastCommunity),
        limitToLast(10)
      );
    }
    shot &&
      onSnapshot(
        shot,
        (querySnapshot) => {
          let p = 0;
          let browsedCommunities = [];
          if (querySnapshot.empty) {
            this.setState({
              [nuller]: null
            });
          }
          querySnapshot.docs.forEach((dc) => {
            p++;
            if (dc.exists) {
              var community = dc.data();
              community.id = dc.id;
              var messageAsArray = [];
              for (let i = 1; i < community.message.length + 1; i++) {
                messageAsArray.push(community.message.substring(0, i));
              }
              /*if (community.tract === "campus") {
                firebase
                  .firestore()
                  .collection("communities")
                  .doc(community.id)
                  .update({ tract: "country/providence/state" });
              }*/
              if (this.props.auth !== undefined) {
                if (community) {
                  const sc = (community.isCommunity
                    ? community.message
                    : community.place_name
                  ).split(",")[1];
                  const splitComma = sc ? sc : false;
                  if (community.splitComma !== splitComma) {
                    updateDoc(doc(firestore, "communities", community.id), {
                      splitComma
                    });
                  }
                  const sc2 = (community.isCommunity
                    ? community.message
                    : community.place_name
                  ).split(",")[2];
                  const splitComma2 = sc2 ? sc2 : false;
                  if (community.splitComma2 !== splitComma2) {
                    updateDoc(doc(firestore, "communities", community.id), {
                      splitComma2
                    });
                  }
                  /*if (
                    splitComma2 &&
                    community.tract === "country/providence/state"
                  ) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({ tract: "town/county" });
                  }*/
                  if (community.messageAsArray !== messageAsArray) {
                    updateDoc(doc(firestore, "communities", community.id), {
                      messageAsArray
                    });
                  }
                  browsedCommunities.push(community);
                }
              }
            }
          });
          if (p === querySnapshot.docs.length) {
            const undoCommunity =
              querySnapshot.docs[querySnapshot.docs.length - 1];
            const lastCommunity = querySnapshot.docs[0];
            this.setState({
              browsedCommunities,
              undoCommunity,
              lastCommunity
            });
          }
        },
        (e) => console.log(e.message)
      );
  };
  searcher = (searching) => {
    //console.log(searching);
    this.setState(
      {
        searching: specialFormatting(searching)
      },
      () => {
        //this.props.setFoundation({ forumOpen: true });
        clearTimeout(this.closer);
        this.closer = setTimeout(() => this.onSearcher(searching), 2000);
      } /*
      if (searching === "" || !this.props.forumOpen)
        if (searching !== "") {
          if (this.state.lastForumOpen === undefined)
            this.setState({ lastForumOpen: this.props.forumOpen });
          if (!this.props.forumOpen)
            this.props.setIndex({
              forumOpen: true
            });
        } else {
          this.props.setIndex({
            forumOpen: this.state.lastForumOpen
          });
          this.setState({ lastForumOpen: null });
        }
    }*/
    );
  };
  onSearcher = async (lastSearching) => {
    const { typesA = ["(address)"] } = this.props;
    //const { typesE = ["(establishment)"] } = this.props;

    //const numberEntered = /^[\d]/;
    const letterEntered = /^[\W\D]/;
    if (this.state.lastSearching !== lastSearching) {
      this.setState({ lastSearching, typesA }, () => {
        if (lastSearching && letterEntered.test(lastSearching)) {
          clearTimeout(this.timepout);
          this.timepout = setTimeout(async () => {
            if (!this.props.forumOpen) {
              getDocs(
                query(
                  collection(firestore, "event"),
                  where("titleAsArray", "array-contains", lastSearching),
                  //.orderBy("time", "desc")
                  //.startAfter(this.state.lastCityPost)
                  limit(14)
                )
              ).then((querySnapshot) => {
                let entitiesFound = [];
                if (querySnapshot.empty) {
                  /*console.log(
                  `no communities including "${this.state.queryCity}"`
                );*/
                  console.log("nothing for ", lastSearching);
                } else
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists()) {
                      var foo = doc.data();
                      foo.id = doc.id;
                      entitiesFound.push(foo);
                    }
                  });
                if (querySnapshot.docs.length === entitiesFound.length)
                  this.setState({
                    entitiesFound
                  });
              });
            } else
              getDocs(
                query(
                  collection(firestore, "communities"),
                  where("messageAsArray", "array-contains", lastSearching),
                  //.orderBy("time", "desc")
                  //.startAfter(this.state.lastCityPost)
                  limit(14)
                )
              ).then(async (querySnapshot) => {
                let communitiesFound = [];
                if (querySnapshot.empty) {
                  /*console.log(
                  `no communities including "${this.state.queryCity}"`
                );*/
                  console.log("nothing for ", lastSearching);
                } else
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists()) {
                      var foo = doc.data();
                      foo.id = doc.id;
                      foo.isCommunity = true;
                      console.log("found community " + foo.message);
                      communitiesFound.push(foo);
                    }
                  });
                if (querySnapshot.docs.length === communitiesFound.length)
                  await fetch(
                    //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lastSearching}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                  )
                    .then(async (response) => await response.json())
                    .then(
                      (body) => {
                        if (
                          body.features &&
                          body.features.constructor === Array &&
                          body.features.length > 0
                        ) {
                          this.setState(
                            {
                              predictions: [
                                ...communitiesFound,
                                ...body.features
                              ],
                              lastPredictions: body.features
                            },
                            () => {}
                          );
                        } else
                          this.setState({
                            predictions: communitiesFound
                          });
                      },
                      (err) => console.log(err)
                    )
                    .catch((err) => {
                      console.log(err);
                      alert("please try another city name");
                    });
              });
          }, 1200);
        }
      });
    } else {
      this.setState({ predictions: this.state.lastPredictions });
    }
  };
  checkfeas = (now, last) => {
    const myLabels = [
      "departments",
      "classes",
      "oldClasses",
      "events",
      "clubs",
      "jobs",
      "venues",
      "services",
      "restaurants",
      "shops",
      "pages",
      "housing"
    ];
    return myLabels.every((x) => {
      return last[x] === now[x];
    });
  };
  componentDidUpdate = async (prevProps) => {
    if (!this.checkfeas(this.props.tileOnce, prevProps.tileOnce)) {
      this.setState(this.props.tileOnce);
    }
    const { appHeight } = this.props;
    if (appHeight !== prevProps.appHeight) {
      clearTimeout(this.appHeightTimeout);
      this.appHeightTimeout = setTimeout(() => {
        window.scroll(0, 0);
      }, 100);
    }
    if (this.props.isProfile && this.state.searching !== "") {
      this.setState({ searching: "" });
    }
    if (this.props !== prevProps) {
      this.setState({ woah: true });
      clearTimeout(this.woah);
      this.woah = setTimeout(() => {
        this.setState({ woah: false });
      }, 900);
    }
    if (!this.props.forumOpen && this.props.forumOpen !== prevProps.forumOpen) {
      this.setState({ closeBottom: true, focusSuggest: null });
    }
    if (this.state.height !== this.state.lastHeight) {
      if (this.state.height < 380) {
        !this.state.closeBottom && this.setState({ closeBottom: true });
      }
      this.setState({ lastHeight: this.state.height });
    }
    var community = this.props.community;
    if (false && community && community !== prevProps.community) {
      onSnapshot(
        query(
          collection(firestore, "commdocs"),
          where("communityId", "==", community.id),
          orderBy("time", "desc")
        ),
        (querySnapshot) => {
          let p = 0;
          let f = [];
          if (querySnapshot.empty) {
            this.setState({ commdocs: [] });
          } else {
            querySnapshot.docs.forEach((doc) => {
              p++;
              if (doc.exists()) {
                const foo = doc.data();
                foo.id = doc.id;
                //if (foo.entityType) {
                f.push(foo);
                //}
                if (
                  p === querySnapshot.docs.length &&
                  this.state.commdocs !== f
                ) {
                  this.setState({ commdocs: f });
                }
              }
            });
          }
        },
        (e) => console.log(e.message)
      );
    }
    if (this.state.focusSuggest !== this.state.lastFocusSuggest) {
      this.setState({ lastFocusSuggest: this.state.focusSuggest }, () => {
        clearInterval(this.focusheighterTO);
        this.focusheighterTO = setInterval(
          () =>
            this.fwd &&
            this.fwd.current &&
            this.setState(
              {
                findheighter: this.fwd.current.offsetHeight
              },
              () =>
                this.fwd.current.innerHeight < 10 &&
                clearInterval(this.focusheighterTO)
            ),
          200
        );
        this.state.focusSuggest && this.props.setIndex({ forumOpen: true });
      });
    }
  };

  /* calculateZoom = () => {
    var Lat = this.state.center[0];
    var Length = this.props.distance * 1.60934;
    var Ratio = 100;
    var WidthPixel = window.innerWidth;
    Length = Length * 1000;
    var k = WidthPixel * 156543.03392 * Math.cos((Lat * Math.PI) / 180);
    //console.log(k);
    var myZoom = Math.round(Math.log((Ratio * k) / (Length * 100)) / Math.LN2);
    myZoom = myZoom - 1;
    //https:// gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to/31551#31551
    if (this.state.scrollChosen !== myZoom) {
      this.setState({ scrollChosen: myZoom });
    }
    return myZoom;
  };*/
  componentWillUnmount = () => {
    clearTimeout(this.timepout);
    clearTimeout(this.closer);
    clearInterval(this.focusheighterTO);
    clearTimeout(this.woah);
    clearTimeout(this.appHeightTimeout);
    clearTimeout(this.mounting);
    clearTimeout(this.resizeTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.scrolltimeout);
    window.removeEventListener("scroll", this.scroll);
    window.removeEventListener("resize", this.refresh);
  };
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        width,
        height
      });
    }, 200);
  };

  scroll = () => {
    const switchCity = () => {
      this.props.setFoundation(
        {
          switchCityOpen: this.props.switchCityOpen
            ? document.body.scrollHeight - window.scrollY - window.innerHeight >
              0 // - this.closeSwitchMarker.current.offsetTop - > 56
            : this.props.switchCityOpen
        },
        () => {
          clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(
            () => this.setState({ scrolling: false, goAhead: false }),
            3000
          );
        }
      );
    };
    !this.state.scrolling && this.setState({ scrolling: true });
    clearTimeout(this.scrolltimeout);
    this.scrolltimeout = setTimeout(() => {
      if (this.state.focusSuggest) return null;
      if (this.props.switchCityOpen) {
        switchCity();
      } else {
        const ifMapIsOpen = (highAndTight) => {
          if (this.state.cancelScroll) {
            this.setState({ cancelScroll: false });
          } else {
            if (!highAndTight) {
              if (!this.props.started) {
                this.props.setFoundation({ started: true });
              }
              window.scroll(0, 0);
            } else if (highAndTight && this.props.started) {
              this.props.setFoundation({ started: false });
            }
          }
        };
        var highAndTight = window.scrollX === 0 || window.scrollY < 4;

        !this.props.forumOpen &&
          this.setState(
            { highAndTight },
            () =>
              this.props.tilesMapOpen === "tiles" && ifMapIsOpen(highAndTight)
          );
      }
    }, 400);
  };

  bigClose = () => {
    const {
      forumTyper,
      electionTyper,
      classTyper,
      departmentTyper,
      budgetTyper,
      caseTyper,
      ordinanceTyper
    } = this.state;
    this.props.showFilters && this.props.openFilters();
    forumTyper && this.setState({ forumTyper: false });
    electionTyper && this.setState({ electionTyper: false });
    classTyper && this.setState({ classTyper: false });
    departmentTyper && this.setState({ departmentTyper: false });
    budgetTyper && this.setState({ budgetTyper: false });
    caseTyper && this.setState({ caseTyper: false });
    ordinanceTyper && this.setState({ ordinanceTyper: false });
  };
  resetSearch = () =>
    this.setState(
      {
        focusSuggest: false,
        cancelScroll: true,
        searching: "",
        predictions: []
      },

      this.bigClose
    );

  render() {
    var newFollowers = [];
    this.props.followingMe &&
      this.props.user !== undefined &&
      this.props.followingMe.map(
        (x) =>
          !(
            this.props.user.followingNoticed &&
            this.props.user.followingNoticed.includes(x.id)
          ) && newFollowers.push(x)
      );
    //Why would a non-inflationary recession make it harder to hire people?

    const {
      profile,
      users,
      auth,
      comments,
      started,
      tileChosen,
      forumOpen,
      postHeight,
      subForum,
      displayPreferences,
      commtype,
      forumPosts,
      community,
      electionTyper,
      forumTyper,
      caseTyper,
      classTyper,
      budgetTyper,
      ordinanceTyper,
      departmentTyper,
      openWhen,
      type
    } = this.props;
    const {
      openNotifs,
      notificationReactions,
      notificationComments,
      mounted,
      height,
      width,
      searching,
      highAndTight
    } = this.state;
    var isLoggedAndInComm = community && auth !== undefined;
    var isAuthor = isLoggedAndInComm && auth.uid === community.authorId;
    var isAdmin =
      isAuthor ||
      (isLoggedAndInComm &&
        community.admin &&
        community.admin.includes(auth.uid));
    var isFaculty =
      isLoggedAndInComm &&
      community.faculty &&
      community.faculty.includes(auth.uid);
    var isAdminOrFaculty = isAdmin || isFaculty;
    var isMemberMaker =
      isLoggedAndInComm &&
      community.memberMakers &&
      community.memberMakers.includes(auth.uid);
    var canMember =
      isMemberMaker ||
      (isLoggedAndInComm && community.facultyCanMember && isFaculty);
    var permitted =
      !community ||
      (community && !community.privateToMembers) ||
      isAuthor ||
      isAdmin ||
      isFaculty ||
      (community.members && auth && community.members.includes(auth.uid));
    var ownerOpen =
      !this.props.globeChosen &&
      !subForum &&
      users &&
      commtype === "new" &&
      this.props.editingCommunity &&
      isAdminOrFaculty;
    /*var communitiesThatPartOf =
      auth !== undefined &&
      this.props.communities.filter(
        (x) =>
          x.admin.includes(auth.uid) ||
          x.faculty.includes(auth.uid) ||
          x.members.includes(auth.uid)
      );
    var suggested = [];
    communitiesThatPartOf &&
      communitiesThatPartOf.map((x) => {
        x.admin.map((a) => {
          if (!suggested.includes(a)) {
            return suggested.push(a);
          } else return null;
        });
        x.faculty.map((d) => {
          if (!suggested.includes(d)) {
            return suggested.push(d);
          } else return null;
        });
        return x.members.map((m) => {
          if (!suggested.includes(m)) {
            return suggested.push(m);
          } else return null;
        });
      });*/
    var top = (height < 380 || !forumOpen) && this.state.closeBottom;
    var shiftRight = (height < 200 && !started) || (height < 400 && started);
    const showFilters =
      !subForum &&
      postHeight === 0 &&
      !this.props.editingCommunity &&
      (this.props.showFilters ||
        electionTyper ||
        forumTyper ||
        caseTyper ||
        classTyper ||
        budgetTyper ||
        ordinanceTyper ||
        departmentTyper);
    var vertical = false;
    /*height < 380 &&
      forumOpen &&
      this.state.closeBottom &&
      !showFilters &&
      highAndTight;*/
    const { backgroundColor } = displayPreferences;

    var coll =
      commtype === "court case"
        ? this.props.materialDate < new Date()
          ? "oldCases"
          : "cases"
        : commtype === "department"
        ? "departments"
        : commtype === "classes"
        ? "classes"
        : commtype === "ordinances"
        ? "ordinances"
        : commtype === "budget & proposal"
        ? this.props.materialDate < new Date()
          ? "oldBudget"
          : "budget"
        : commtype === "elections"
        ? this.props.materialDate < new Date()
          ? "oldElections"
          : "elections"
        : "forum";
    var theLotOfPosts = this.props.globeChosen
      ? this.props.globalForumPosts
      : subForum
      ? []
      : commtype === "classes" && openWhen === "expired"
      ? this.props.oldClasses
      : commtype === "budget" && openWhen === "expired"
      ? this.props.oldBudget
      : commtype === "elections" && openWhen === "expired"
      ? this.props.oldElections
      : commtype === "cases" && openWhen === "expired"
      ? this.props.oldCases
      : forumPosts;
    /*forumOpen && ["classes", "department"].includes(commtype)
      ? commtype
      : type*/
    const typeOrder = [
      /*{ type: "clubs", name: "myClubs" },
        { type: "shops", name: "myShops" },
        { type: "restaurants", name: "myRestaurants" },
        { type: "services", name: "myServices" },
        { type: "pages", name: "myPages" },
        { type: "jobs", name: "myJobs" },
        { type: "venues", name: "myVenues" },
        { type: "housing", name: "myHousing" },
        { type: "planner", name: "myEvents" },*/
      { trigger: "openClasses", type: "classTyped", name: "classes" },
      {
        trigger: "openDepartments",
        type: "departmentTyped",
        name: "department"
      },
      {
        trigger: "openBudget",
        type: "budgetTyped",
        name: "budget & proposal"
      },
      { trigger: "openCases", type: "caseTyped", name: "court case" },
      {
        trigger: "openElections",
        type: "electionTyped",
        name: "election"
      },
      {
        trigger: "openOrdinances",
        type: "ordinanceTyped",
        name: "ordinance"
      },
      //{ type: "forms & permits", name: "forms & permits" },
      { trigger: "openForum", type: "forumTyped", name: "new" },
      { trigger: "openForum", type: "forumTyped", name: "lesson" },
      { trigger: "openForum", type: "forumTyped", name: "show" },
      { trigger: "openForum", type: "forumTyped", name: "game" },
      { trigger: "eventTypes", type: "subtype", name: "event" },
      { trigger: "eventTypes", type: "subtype", name: "restaurant" },
      { trigger: "eventTypes", type: "subtype", name: "club" },
      { trigger: "eventTypes", type: "subtype", name: "shop" },
      { trigger: "eventTypes", type: "subtype", name: "service" },
      { trigger: "eventTypes", type: "subtype", name: "job" },
      { trigger: "eventTypes", type: "subtype", name: "housing" },
      { trigger: "eventTypes", type: "subtype", name: "page" },
      { trigger: "eventTypes", type: "subtype", name: "venue" }
    ].find((x) => x.name === commtype || x.name === tileChosen);
    var open = !this.props.switchCityOpen && !this.props.createSliderOpen;
    const person = {
      profile,
      isProfile: this.props.isProfile,
      findPost: this.props.findPost
    };
    //console.log(this.props.subtype);
    return (
      <div
        ref={this.forum}
        style={{
          overflow: "hidden",
          transition: ".3s ease-in",
          display: vertical ? "flex" : "block",
          zIndex: this.props.forumOpen ? 1 : 0,
          position: "relative",
          width: "100%",
          height: this.props.forumOpen
            ? "min-content"
            : this.props.started
            ? "0px"
            : "56px"
        }}
      >
        {this.props.switchCityOpen && (
          //deal rights / nurse cops is nuts
          //If options to buy are securities, isn’t a mortgage a stolen purchase?
          <List
            rebeat={this.props.rebeat}
            setRebeat={this.props.setRebeat}
            setCommtype={this.props.setCommtype}
            commtype={this.props.commtype}
            profileTileChosen={this.props.profileTileChosen}
            //selected
            openOptionsForThis={(x) => {
              this.setState({
                options: true,
                comm: x,
                comms: false
              });
            }}
            communities={this.props.communities}
            comm={this.state.comm}
            community={this.props.community}
            switchCMapCloser={this.props.switchCMapCloser}
            chooseFromTiptool={this.props.chooseFromTiptool}
            distance={this.props.distance}
            chooseCommunity={this.props.chooseCommunity}
            right={this.state.comms}
            options={this.state.options}
            comms={this.state.comms}
            thisone={{}}
            favorites={this.props.favoriteCities}
            auth={auth}
            user={this.props.user}
            setHovers={(x) => this.setState(x)}
            clickCityGifmap={async (x, tile) => {
              await fetch(
                //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${x}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
              )
                .then(async (response) => await response.json())
                .then((
                  body //console.log(body.features[0]))
                ) => this.props.clickCityGifmap(body.features[0], tile))
                .catch((err) => {
                  console.log(err);
                  alert(
                    "body.features[0] doesn't exist " +
                      `https://api.mapbox.com/geocoding/v5/mapbox.places/${x}.json?limit=2&types=place`
                  );
                }); //who is forcing safety deposit box risk
              //deficit is no accident when it's half
              //natural monopoly is more fallacious than sunk costs
              //Natural or government monopoly
              //How much deficit is ok for you? 40-50%?

              //One dollar of deficit is stolen; taxes are for cops
              //free rider immutable plaintiff pac
              //"they are not in the forefront, and they won't be"
            }}
          />
        )}
        <Header
          subtype={this.props.subtype}
          navigate={this.props.navigate}
          pathname={this.props.pathname}
          drop={this.props.drop}
          findheighter={this.state.findheighter}
          typeOrder={typeOrder}
          setNapkin={(obj) => this.setState(obj)}
          tileChosen={this.props.tileChosen}
          setFoundation={this.props.setFoundation}
          focusSuggest={this.state.focusSuggest}
          focusSearching={() =>
            this.setState({ focusSuggest: this.props.forumOpen })
          }
          blurSearching={() =>
            this.setState({ focusSuggest: false, predictions: [] })
          }
          lastForumOpen={this.state.lastForumOpen}
          searching={searching}
          searcher={(e) => this.searcher(e.target.value)}
          resetSearch={this.resetSearch}
          notificationReactions={notificationReactions}
          notificationComments={notificationComments}
          newFollowers={newFollowers}
          openNotifs={openNotifs}
          setNotifOpen={(openNotifs) => this.setState(openNotifs)}
          isProfile={this.props.isProfile}
          profileCommunity={this.state.community}
          profileCity={this.state.city}
          hydrateUser={this.props.hydrateUser}
          eventTypes={this.props.eventTypes}
          openForum={() => {
            this.props.openForum("forum");
          }}
          toggleForumBtn={this.props.toggleForumBtn}
          y={this.props.y}
          distance={this.props.distance}
          started={this.props.started}
          top={top}
          vertical={vertical}
          openElections={() => this.setState({ electionTyper: true })}
          openDepartments={() => this.setState({ departmentTyper: true })}
          openClasses={() => this.setState({ classTyper: true })}
          openCases={() => this.setState({ caseTyper: true })}
          openOrdinances={() => this.setState({ ordinanceTyper: true })}
          openBudget={() => this.setState({ budgetTyper: true })}
          commtype={commtype}
          highAndTight={highAndTight}
          community={community}
          openFilters={() => {
            this.props.openFilters();
            this.setState({ forumTyper: true });
          }}
          //
          closeForum={this.props.closeForum}
          scrollBackToTheLeft={this.scrollBackToTheLeft}
          closeBottom={this.props.closeBottom}
          unclose={this.props.unclose}
          forumOpen={this.props.forumOpen}
          createSliderOpener={this.props.createSliderOpener}
          open={open}
          height={height}
          unSubForum={this.props.unSubForum}
          tilesMapOpen={this.props.tilesMapOpen}
          showFilters={showFilters}
          showFollowing={this.props.showFollowing}
          type={type}
          postHeight={postHeight}
          postMessage={this.props.postMessage}
          subForum={subForum}
          profileTileChosen={this.props.profileTileChosen}
          globeChosen={this.props.globeChosen}
          city={this.props.city}
          searchEvents={this.props.searchEvents}
          searcherEventer={this.props.searcherEventer}
          switchCMapOpener={this.props.switchCMapOpener}
        />
        <Find
          navigate={this.props.navigate}
          chooseCommunity={this.props.chooseCommunity}
          fwd={this.fwd}
          started={this.props.started}
          focusSuggest={this.state.focusSuggest}
          focusSearching={() => this.setState({ focusSuggest: true })}
          blurSearching={() => this.setState({ focusSuggest: false })}
          resetSearch={this.resetSearch}
          resetPathAlias={this.props.resetPathAlias}
          findCity={(prediction, tile) => {
            const q = prediction.place_name;

            const city = q.split(", ")[0];
            const cityapi = city.replace(/, /g, "%20").replace(/ /g, "%20");
            const distance = this.props.y;
            const state = prediction.place_name.split(", ")[1].split(", ")[0];
            const stateapi = state.replace(/ /, "%20");
            this.props.chooseCitypoint(
              prediction.center,
              distance,
              q,
              cityapi,
              stateapi,
              tile
            );
          }}
          searching={searching}
          browsedCommunities={this.state.browsedCommunities}
          lastCommunity={this.state.lastCommunity}
          undoCommunity={this.state.undoCommunity}
          browseCommunities={this.browseCommunities}
          predictions={this.state.predictions}
          backgroundColor={backgroundColor}
          openBuyer={this.state.openBuyer}
          height={this.state.height}
          favoriteCities={this.props.favoriteCities}
          nope={() =>
            this.setState({
              options: false,
              comms: false,
              comm: false
            })
          }
          on={() => this.setState({ options: false })}
          off={() => this.setState({ comms: true, options: false })}
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          comm={this.state.comm}
          city={this.props.city}
          community={this.props.community}
          switchCMapCloser={this.props.switchCMapCloser}
          auth={auth}
          user={this.props.user}
          communities={this.props.communities}
          distance={this.props.distance}
          chooseFromTiptool={this.props.chooseFromTiptool}
          setHovers={(x) => this.setState(x)}
        />
        <Notifs
          findheighter={this.state.findheighter}
          logoutofapp={this.props.logoutofapp}
          getUserInfo={this.props.getUserInfo}
          auth={auth}
          user={this.props.user}
          notificationReactions={notificationReactions}
          notificationComments={notificationComments}
          newFollowers={newFollowers}
          openNotifs={openNotifs}
          setNotifOpen={(openNotifs) => this.setState(openNotifs)}
          forumOpen={this.props.forumOpen}
        />
        <Forum
          openFilters={() => {
            this.props.openFilters();
            this.setState({ forumTyper: true });
          }}
          navigate={this.props.navigate}
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          location={this.props.location}
          fetchForum={this.props.fetchForum}
          isProfile={this.props.isProfile}
          chosenPost={this.props.chosenPost}
          findPost={this.props.findPost}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          setForumDocs={this.props.setForumDocs}
          paginationhandle={this.props.paginationhandle}
          profile={profile}
          setAuth={this.props.setAuth}
          findheighter={this.state.findheighter}
          setFoundation={this.props.setFoundation}
          typeOrder={typeOrder}
          openForum={() => {
            this.props.openForum("forum");
          }}
          openElections={() => this.setState({ electionTyper: true })}
          openDepartments={() => this.setState({ departmentTyper: true })}
          openClasses={() => this.setState({ classTyper: true })}
          openCases={() => this.setState({ caseTyper: true })}
          openOrdinances={() => this.setState({ ordinanceTyper: true })}
          openBudget={() => this.setState({ budgetTyper: true })}
          budgetTyped={this.state.budgetTyped}
          ordinanceTyped={this.state.ordinanceTyped}
          caseTyped={this.state.caseTyped}
          classTyped={this.state.classTyped}
          departmentTyped={this.state.departmentTyped}
          electionTyped={this.state.electionTyped}
          forumTyped={this.state.forumTyped}
          highAndTight={highAndTight}
          canMember={canMember}
          permitted={permitted}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
          isFaculty={isFaculty}
          ownerOpen={ownerOpen}
          manuallyDeleteKeyBox={this.props.manuallyDeleteKeyBox}
          go={this.props.go}
          recipientsProfiled={this.props.recipientsProfiled}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getDrop={this.props.getDrop}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          dropId={this.props.dropId}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          width={width}
          openChatWithGroup={this.props.openChatWithGroup}
          myStuff={this.props.myStuff}
          thisentity={this.props.thisentity}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          setTopic={this.props.setTopic}
          threadId={this.props.threadId}
          chosenTopic={this.props.chosenTopic}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          forumOpen={forumOpen}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filesPreparedToSend={this.props.filesPreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.props.switchCityOpen}
          addPic={this.props.addPic}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          notes={this.props.notes}
          users={users}
          auth={auth}
          user={this.props.user}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
          //
          clickZoomer={this.props.clickZoomer}
          eventTypes={this.props.eventTypes}
          displayPreferences={displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          calToggle={this.props.calToggle}
          woah={this.state.woah}
          shiftRight={shiftRight}
          goToRadius={this.props.goToRadius}
          monthCalOpen={this.props.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={this.props.fonish}
          materialDateOpen={this.props.materialDateOpen}
          pathname={this.props.pathname}
          started={started}
          tilesMapOpen={this.props.tilesMapOpen}
          achatopen={this.props.achatopen}
          unreadChatsCount={this.props.unreadChatsCount}
          setData={this.props.setData}
          current={this.props.current}
          current1={this.props.current1}
          y={this.props.y}
          toggleCloseStuff={this.props.toggleCloseStuff}
          start={this.props.start}
          unStart={this.props.unStart}
          tilesOpener={this.props.tilesOpener}
          openStart={this.props.openStart}
          range={this.props.range}
          queriedDate={this.props.queriedDate}
          backtotoday={this.backtotoday}
          alltime={this.props.alltime}
          sliderchange={(x) => {
            this.props.sliderchange(x);
            this.setState({ zoomUpdated: false });
          }}
          distance={this.props.distance}
          trueZoom={this.props.trueZoom}
          zoomUpdated={this.state.zoomUpdated}
          chooseEvents={this.props.chooseEvents}
          commtype={this.props.commtype}
          openchat={this.props.openchat}
          tileChosen={tileChosen}
          openthestuff={this.props.openthestuff}
          zoomChoose1={this.props.zoomChoose1}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose3={this.props.zoomChoose3}
          zoomChoose4={this.props.zoomChoose4}
          queryDate={this.props.queryDate}
          zoomChosen={this.props.zoomChosen}
          community={this.props.community}
          city={this.props.city}
          //
          switchCityOpen={this.props.switchCityOpen}
          setNapkin={(obj) => this.setState(obj)}
          searching={searching}
          apple={this.props.apple}
          setCommunity={this.props.setCommunity}
          birdsEyeZoomOn={this.props.birdsEyeZoomOn}
          birdsEyeZoomOff={this.props.birdsEyeZoomOff}
          address={this.props.address}
          chooseCommunity={this.props.chooseCommunity}
          waitForMove={this.props.waitForMove}
          height={this.state.height}
          chooseEdmevent={this.props.chooseEdmevent}
          daylike={() => this.setState({ dayLiked: true })}
          daydislike={() => this.setState({ dayLiked: false })}
          chooseCitypoint={this.props.chooseCitypoint}
          mounted={mounted}
          center={this.props.center}
          zoomIn={this.props.zoomIn}
          classes={this.props.classes}
          cityapi={this.props.cityapi}
          chooseEvent={this.props.chooseEvent}
          searchEvents={this.props.searchEvents}
          //
          scrolling={this.props.scrolling}
          lastSearching={this.state.lastSearching}
          searcher={(e) => this.searcher(e.target.value)}
          resetSearch={this.resetSearch}
          predictions={this.state.predictions}
          resetPathAlias={this.props.resetPathAlias}
          switchCMapCloser={this.props.switchCMapCloser}
          setIndex={this.props.setIndex}
          newFollowers={newFollowers}
          drop={this.props.drop}
          statePathname={this.props.statePathname}
          profileEntities={this.props.profileEntities}
          person={person}
          chosenPostId={this.props.chosenPostId}
          postHeight={this.props.postHeight}
          forumPosts={forumPosts}
          profilePosts={this.props.profilePosts}
          comments={comments}
          postMessage={this.props.postMessage}
          openWhen={openWhen}
          helper2={this.props.helper2}
          helper={this.props.helper}
          linkDrop={this.props.linkDrop}
          bumpScrollReady={this.props.bumpScrollReady}
          //
          top={top}
          vertical={vertical}
          lastComments={this.props.lastComments}
          undoComments={this.props.undoComments}
          lastPostOfComment={this.props.lastPostOfComment}
          undoPostOfComment={this.props.undoPostOfComment}
          lastPosts={this.props.lastPosts}
          lastPost={this.props.lastPost}
          undoPosts={() => {
            this.props.undoPosts();
          }}
          undoPost={this.props.undoPost}
          lastGlobalPost={this.props.lastGlobalPost}
          undoGlobalPost={this.props.undoGlobalPost}
          lastGlobalCommForum={this.props.lastGlobalForum}
          undoGlobalCommForum={this.props.undoGlobalForum}
          //
          lastCityPost={this.props.lastCityPost}
          undoCityPost={this.props.undoCityPost}
          lastCityForum={this.props.lastCityForum}
          undoCityForum={this.props.undoCityForum}
          //
          lastCommForum={this.props.lastCommForum}
          undoCommForum={this.props.undoCommForum}
          switchCMapOpener={this.props.switchCMapOpener}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          individualTypes={this.props.individualTypes}
          showFilters={showFilters}
          toggleEditing={this.props.toggleEditing}
          editingCommunity={this.props.editingCommunity}
          type={type}
          openCommunityAdmin={this.props.openCommunityAdmin}
          issues={this.props.issues}
          oldBudget={this.props.oldBudget}
          oldElections={this.props.oldElections}
          oldCases={this.props.oldCases}
          oldClasses={this.props.oldClasses}
          followingMe={this.props.followingMe}
          dayLiked={this.state.dayLiked}
          materialDate={this.props.materialDate}
          clearMaterialDate={this.props.clearMaterialDate}
          listplz={this.props.listplz}
          listplzToggle={this.props.listplzToggle}
          addPicTrue={this.props.addPicTrue}
          addPicFalse={this.props.addPicFalse}
          subForum={this.props.subForum}
          subForumPosts={this.props.subForumPosts}
          showpicker2={this.props.showpicker2}
          settingsOpen={this.state.settingsOpen}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          filePreparedToSend={this.props.filePreparedToSend}
          closeForum={this.props.closeForum}
          globalForumPosts={this.props.globalForumPosts}
          globeChosen={this.props.globeChosen}
          chooseGlobe={this.props.chooseGlobe}
          // header stuff below...\/

          closeBottom={this.state.closeBottom}
          unclose={() => this.setState({ closeBottom: false })}
          createSliderOpener={this.props.createSliderOpener}
          open={open}
          unSubForum={this.props.unSubForum}
          showFollowing={this.props.openFollowing}
          searcherEventer={this.props.searcherEventer}
          cancelRebeat={this.props.cancelRebeat}
          rebeat={this.props.rebeat}
          coll={this.props.coll}
        />
        {/*
        <Chats
          getRoomKeys={(x) => this.Vintages.getRoomKeys(x)}
          vintageOfKeys={this.state.vintageOfKeys}
          setNapkin={(x) => this.setState(x)}
          hydrateEntity={this.props.hydrateEntity}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          setToUser={this.props.setToUser}
          standbyMode={this.props.standbyMode}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          forumOpen={this.props.forumOpen}
          go={this.props.go}
          recipientsProfiled={this.props.recipientsProfiled}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getDrop={this.props.getDrop}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          dropId={this.props.dropId}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          width={width}
          openChatWithGroup={this.props.openChatWithGroup}
          myEvents={this.props.myEvents}
          myClubs={this.props.myClubs}
          myJobs={this.props.myJobs}
          myVenues={this.props.myVenues}
          myServices={this.props.myServices}
          myClasses={this.props.myClasses}
          myDepartments={this.props.myDepartments}
          myRestaurants={this.props.myRestaurants}
          myShops={this.props.myShops}
          myPages={this.props.myPages}
          myHousing={this.props.myHousing}
          thisentity={this.props.thisentity}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          setTopic={this.props.setTopic}
          threadId={this.props.threadId}
          chosenTopic={this.props.chosenTopic}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filesPreparedToSend={this.props.filesPreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.props.switchCityOpen}
          addPic={this.props.addPic}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          notes={this.props.notes}
          profileOpener={this.props.profileOpener}
          profileOpen={this.props.profileOpen}
          chatscloser={this.props.chatscloser}
          users={users}
          auth={auth}
          user={this.props.user}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
        />*/}
        <div
          style={{
            backgroundColor: "rgba(20,20,90,.4)",
            width: "100%",
            height: this.props.chatsopen ? "0px" : "200px",
            transition: ".3s ease-in"
          }}
        ></div>
        <Stuff
          forumOpen={this.props.forumOpen}
          highAndTight={highAndTight}
          closeForum={this.props.closeForum}
          scrollBackToTheLeft={this.scrollBackToTheLeft}
          users={users}
          globeChosen={this.props.globeChosen}
          locOpen={this.state.locOpen}
          setLoc={(parent) => this.setState(parent)}
          toggleEditing={this.props.toggleEditing}
          height={height}
          editingCommunity={this.props.editingCommunity}
          community={community}
          auth={auth}
          postHeight={postHeight}
          addPic={this.props.addPic}
        />
        <ForumAccessories
          chosenPostId={this.props.chosenPostId}
          comments={comments}
          postMessage={this.props.postMessage}
          getUserInfo={this.props.getUserInfo}
          vertical={vertical}
          editingCommunity={this.props.editingCommunity}
          //
          openWhen={openWhen}
          postHeight={postHeight}
          height={height}
          width={width}
          users={users}
          user={this.props.user}
          auth={auth}
          commdocs={this.state.commdocs}
          //
          photoThumbnail={this.state.photoThumbnail}
          photoSrc={this.state.photoSrc}
          contents={this.state.contents}
          showpicker2={this.props.showpicker2}
          clearFiles={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          s={this.props.s}
          community={community}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          signIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          commtype={commtype}
          showDriver={this.state.showDriver}
          closeDriver={() => this.setState({ showDriver: false })}
          //
          left={this.state.left}
          //
          openGroupFilter={this.state.openGroupFilter}
          closeGroupFilter={() => this.setState({ openGroupFilter: false })}
          helper={() => this.props.helper()}
        />
        {/*this.props.commtype !== "forms & permits" &&
          this.props.forumOpen &&
          (this.props.drop ? (
            <Link
              to={this.props.statePathname}
              style={{
                backgroundColor: "rgba(20,20,40,.5)",
                display: "flex",
                top: "0px",
                position: "fixed",
                width: "calc(100% - 4px)",
                border: "2px solid",
                height: "100%"
              }}
            />
          ) : (
            <div
              //#333
              onClick={this.props.closeForum}
              style={{
                backgroundColor: "rgba(20,20,40,.5)",
                display: "flex",
                top: "0px",
                position: "fixed",
                width: "calc(100% - 4px)",
                border: "2px solid",
                height: "100%"
              }}
            />
            ))*/}
        <Filters
          coll={coll}
          getUserInfo={this.props.getUserInfo}
          commtype={commtype}
          subForum={subForum}
          globeChosen={this.props.globeChosen}
          issues={this.props.issues}
          city={this.props.city}
          showFilters={showFilters}
          theLotOfPosts={theLotOfPosts}
          isAdmin={isAdmin}
          auth={auth}
          user={this.props.user}
          community={community}
          //
          width={width}
          //
          bigClose={this.bigClose}
        />
        {/*this.props.isProfile && false && (
          <PersonHeader
            togglePaw={
              swipe === "forum"
                ? () => this.setState({ swipe: "home" })
                : swipe === "paw"
                ? () => this.setState({ swipe: "forum" })
                : () => this.setState({ swipe: "paw" })
            }
            swipe={swipe}
            community={this.state.community}
            city={this.state.city}
            columncount={columncount}
            myCommunities={this.props.myCommunities}
            headerScrolling={this.state.headerScrolling}
            thechats={thechats}
            auth={auth}
            profile={profile}
            user={this.props.user}
          />
          )*/}
        <div
          style={{
            backgrouncColor: "white",
            minHeight: "100%",
            width: "100%",
            position: "fixed",
            transform: `translateY(${
              this.state.entitiesFound.length > 0 ? "0%" : "100%"
            })`
          }}
        >
          <div
            onClick={() => this.setState({ entitiesFound: [] })}
            style={{
              padding: "0px 4px",
              borderRadius: "10px",
              color: "white",
              backgroundColor: "navy",
              position: "absolute",
              right: "10px",
              top: "10px",
              fontSize: "20px"
            }}
          >
            &times;
          </div>
          {this.state.entitiesFound.map((x) => {
            return (
              <div
                onClick={() => {
                  var answer = window.confirm("Travel to " + x.title + "?");
                  answer && this.props.navigate(`/event/${x.id}`);
                  //answer && this.props.navigate(`/${x.community}/${x.title}`);
                }}
              >
                {x.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Function.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Function;
