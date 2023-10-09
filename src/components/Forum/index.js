import React from "react";
import firebase from "../.././init-firebase.js";
import Topsort from "./Tools/Topsort";
import NewForum from "./New";
import AddMemberMaker from "./Owner/AddMemberMaker.js";
import AddRep from "./Owner/AddRep.js";
import AddJudge from "./Owner/AddJudge.js";
import Addteach from "./Owner/Addteach";
import Addtiles from "./Owner/Addtiles";
import Addforum from "./Owner/Addforum";
//deficit everyone is a tie breaker, IRS agents over barter
import SearchSettings from "./Owner/SearchSettings";
import Addmembers from "./Owner/Addmembers";
import Addself from "./Addself.js";
import Addadmin from "./Owner/Addadmin";
import UpdateProfilePicture from "./Owner/UpdateProfilePicture";
import USBudget from "./Tools/USBudget.js";
import Vintages from "../.././fumbler";
import Chats from ".././Chats";
//​I've found stolen purchase contract splits the party
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import ForumPagination from "./Tools/ForumPagination";
import { Link } from "react-router-dom";
import Entities from "./Entities.js";
import NewItem from "./New/NewItem.js";
import NewClass from "./New/NewClass.js";
import { RegisterCurseWords } from "../../App/Post/PeanutGallery/EmbeddedRebeat.js";
import Nav from "../../App/Post/PeanutGallery/Person/Nav.js";
import ListEvents from "../../App/Post/PeanutGallery/Person/ListEvents.js";
import Accolades from "../../App/Post/PeanutGallery/Person/Accolades.js";
import Card from "../../App/Post/Card.js";
import Monthly from "./Tools/Cal.js";
import ByMe from "../Profile/ByMe.js";
import { JailClass } from "../../fuffer.js";
import { standardCatch } from "../../widgets/Sudo.js";
export const stateCity = [
  {
    name: "Alabama",
    abbreviation: "AL"
  },
  {
    name: "Alaska",
    abbreviation: "AK"
  },
  {
    name: "American Samoa",
    abbreviation: "AS"
  },
  {
    name: "Arizona",
    abbreviation: "AZ"
  },
  {
    name: "Arkansas",
    abbreviation: "AR"
  },
  {
    name: "California",
    abbreviation: "CA"
  },
  {
    name: "Colorado",
    abbreviation: "CO"
  },
  {
    name: "Connecticut",
    abbreviation: "CT"
  },
  {
    name: "Delaware",
    abbreviation: "DE"
  },
  {
    name: "District Of Columbia",
    abbreviation: "DC"
  },
  {
    name: "Federated States Of Micronesia",
    abbreviation: "FM"
  },
  {
    name: "Florida",
    abbreviation: "FL"
  },
  {
    name: "Georgia",
    abbreviation: "GA"
  },
  {
    name: "Guam",
    abbreviation: "GU"
  },
  {
    name: "Hawaii",
    abbreviation: "HI"
  },
  {
    name: "Idaho",
    abbreviation: "ID"
  },
  {
    name: "Illinois",
    abbreviation: "IL"
  },
  {
    name: "Indiana",
    abbreviation: "IN"
  },
  {
    name: "Iowa",
    abbreviation: "IA"
  },
  {
    name: "Kansas",
    abbreviation: "KS"
  },
  {
    name: "Kentucky",
    abbreviation: "KY"
  },
  {
    name: "Louisiana",
    abbreviation: "LA"
  },
  {
    name: "Maine",
    abbreviation: "ME"
  },
  {
    name: "Marshall Islands",
    abbreviation: "MH"
  },
  {
    name: "Maryland",
    abbreviation: "MD"
  },
  {
    name: "Massachusetts",
    abbreviation: "MA"
  },
  {
    name: "Michigan",
    abbreviation: "MI"
  },
  {
    name: "Minnesota",
    abbreviation: "MN"
  },
  {
    name: "Mississippi",
    abbreviation: "MS"
  },
  {
    name: "Missouri",
    abbreviation: "MO"
  },
  {
    name: "Montana",
    abbreviation: "MT"
  },
  {
    name: "Nebraska",
    abbreviation: "NE"
  },
  {
    name: "Nevada",
    abbreviation: "NV"
  },
  {
    name: "New Hampshire",
    abbreviation: "NH"
  },
  {
    name: "New Jersey",
    abbreviation: "NJ"
  },
  {
    name: "New Mexico",
    abbreviation: "NM"
  },
  {
    name: "New York",
    abbreviation: "NY"
  },
  {
    name: "North Carolina",
    abbreviation: "NC"
  },
  {
    name: "North Dakota",
    abbreviation: "ND"
  },
  {
    name: "Northern Mariana Islands",
    abbreviation: "MP"
  },
  {
    name: "Ohio",
    abbreviation: "OH"
  },
  {
    name: "Oklahoma",
    abbreviation: "OK"
  },
  {
    name: "Oregon",
    abbreviation: "OR"
  },
  {
    name: "Palau",
    abbreviation: "PW"
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA"
  },
  {
    name: "Puerto Rico",
    abbreviation: "PR"
  },
  {
    name: "Rhode Island",
    abbreviation: "RI"
  },
  {
    name: "South Carolina",
    abbreviation: "SC"
  },
  {
    name: "South Dakota",
    abbreviation: "SD"
  },
  {
    name: "Tennessee",
    abbreviation: "TN"
  },
  {
    name: "Texas",
    abbreviation: "TX"
  },
  {
    name: "Utah",
    abbreviation: "UT"
  },
  {
    name: "Vermont",
    abbreviation: "VT"
  },
  {
    name: "Virgin Islands",
    abbreviation: "VI"
  },
  {
    name: "Virginia",
    abbreviation: "VA"
  },
  {
    name: "Washington",
    abbreviation: "WA"
  },
  {
    name: "West Virginia",
    abbreviation: "WV"
  },
  {
    name: "Wisconsin",
    abbreviation: "WI"
  },
  {
    name: "Wyoming",
    abbreviation: "WY"
  }
];
export const statesForBillsOfOpenStates = [
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
const firestore = getFirestore(firebase);
class AllowVoting extends React.Component {
  render() {
    const { columncount, postHeight, community, bubbleStyle } = this.props;
    return (
      <div
        style={{
          backgroundColor: "rgb(170,170,130)",
          breakInside: "avoid",
          zIndex: 6,
          width: "calc(100% - 4px)",
          //border: "2px solid",
          maxHeight: columncount === 1 || postHeight > 0 ? "" : "100%",
          height: `max-content`,
          position: "relative",
          display: "flex",
          color: "black",
          flexDirection: "column",
          borderBottom: "1px solid grey",
          overflowX: "hidden",
          overflowY: columncount === 1 ? "hidden" : "auto"
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "min-content",
            width: "calc(100% - 4px)",
            //border: "2px solid",
            breakInside: "avoid"
          }}
        >
          <div
            onClick={() =>
              updateDoc(doc(firestore, "communities", community.id), {
                privateToMembers: !community.privateToMembers
              }).catch((err) => console.log(err.message))
            }
            style={{
              height: "min-content",
              padding: "10px 0px",
              margin: "0px 10px",
              display: "flex",
              position: "relative"
            }}
          >
            <div
              style={{
                ...bubbleStyle,
                height: "22px",
                width: "46px",
                right: "30px",
                backgroundColor: community.privateToMembers ? "" : "blue"
              }}
            />
            <div
              style={{
                ...bubbleStyle,
                height: "16px",
                width: "16px",
                right: "50px",
                backgroundColor: community.privateToMembers ? "" : "lightblue"
              }}
            />
            <div
              style={{
                minHeight: "min-content"
              }}
            >
              {community.privateToMembers
                ? `private to members`
                : "public forum tiles"}
              <div
                style={{
                  minHeight: "min-content",
                  fontSize: "12px"
                }}
              >
                {community.privateToMembers
                  ? ` only members can see `
                  : " everyone can see "}
                & post
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              updateDoc(doc(firestore, "communities", community.id), {
                privateVoting: !community.privateVoting
              }).catch((err) => console.log(err.message))
            }
            style={{
              opacity: "0",
              zIndex: !community.privateToMembers ? "" : "-9999",
              height: !community.privateToMembers ? "min-conte" : "0px",
              padding: "10px 0px",
              margin: "0px 10px",
              display: "flex",
              position: "relative",
              transition: ".3s ease-out"
            }}
          >
            <div
              style={{
                ...bubbleStyle,
                height: "22px",
                width: "46px",
                right: "30px",
                backgroundColor: community.privateVoting ? "" : "green"
              }}
            />
            <div
              style={{
                ...bubbleStyle,
                transform: "translate(-3px,3px)",
                height: "16px",
                width: "16px",
                right: "50px",
                backgroundColor: community.privateVoting ? "" : "lightgreen"
              }}
            />
            <div
              style={{
                minHeight: "min-content"
              }}
            >
              {community.privateVoting ? `private voting` : "public voting"}
              <div
                style={{
                  minHeight: "min-content",
                  fontSize: "12px"
                }}
              >
                {community.privateVoting ? `only members ` : "everyone "}
                can vote
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      int: 3,
      onlyPost: "",
      seeContents: "",
      onlyCommunity: "",
      swipe: "forum",

      /*lastComments:,
      undoComments,
      lastPostOfComment,
      undoPostOfComment,
      lastPosts,
      lastPost,
      undoPosts,
      undoPost,*/
      lastForumOpen: undefined,
      post: "",
      deletedEvts: [],
      clubs: [],
      deletedClbs: [],
      jobs: [],
      deletedJobs: [],
      collection: "forum",
      events: [],
      lessonsGamesShows: [],
      chosenForum: [
        "new",
        "lessons",
        "shows",
        "games",
        "budget",
        "cases",
        "elections",
        "ordinances"
      ],
      community: { message: "" },
      city: "",
      billPagination: 1,
      bills: [],
      commdocs: [],
      users: [],
      heights: [],
      left: "0",
      s: "",
      filesPreparedToSend: [],
      userQuery: "",
      openGroupFilter: false,
      postHeight: 0,
      user: { username: "" },
      openPagination: true,
      deletedForumPosts: []
    };
    this.Vintages = React.createRef();
    this.stinker = React.createRef();
    for (let i = 0; i < 14; i++) {
      this["post" + i] = React.createRef();
    }
  }

  getUsers = () => {
    onSnapshot(
      query(collection(firestore, "users"), orderBy("createdAt"), limit(10)),
      (querySnapshot) => {
        let usersInitial = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            usersInitial.push(foo);
          }
        });
        if (
          querySnapshot.docs.length === p &&
          this.state.usersInitial !== usersInitial
        ) {
          this.setState({ usersInitial });
          this.handleUserSources(usersInitial);
        }
      },
      (e) => console.log(e.message)
    );
  };
  handleUserSources = (usersInitial) => {
    var usersInState = this.state.users.filter(
      (user) => !usersInitial.find((parent) => parent.id === user.id)
    );
    this.setState({ users: [...usersInState, ...usersInitial] });
  };

  queryUsers = (query) => {
    onSnapshot(
      query(
        collection(firestore, "users"),
        where("usernameAsArray", "array-contains", query)
      ),
      (querySnapshot) => {
        let users = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            users.push(foo);
          }
        });
        if (querySnapshot.docs.length === p && this.state.users !== users) {
          onSnapshot(
            query(
              collection(firestore, "users"),
              where("nameAsArray", "array-contains", query)
            ),
            (querySnapshot) => {
              let users = [];
              let p = 0;
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  users.push(foo);
                }
              });
              if (
                querySnapshot.docs.length === p &&
                this.state.users !== users
              ) {
                var usersInState = this.state.users.filter(
                  (user) => !users.find((parent) => parent.id === user.id)
                );
                this.setState({ users: [...usersInState, ...users] });
              }
            }
          );
        }
      }
    );
  };
  checkfeas = (now, last) => {
    const paginationReads = [
      "lastPost",
      "undoPost",
      "lastPostOfComment",
      "undoPostOfComment",
      "groupLast",
      "groupUndo",
      "lastCommPost",
      "undoCommPost",
      "lastCommOrd",
      "undoCommOrd",
      "lastCommDept",
      "undoCommDept",
      "lastOldBudget",
      "undoOldBudget",
      "lastOldElections",
      "undoOldElections",
      "lastOldCases",
      "undoOldCases",
      "lastOldClasses",
      "undoOldClasses",
      "lastCommForm",
      "undoCommForm",
      "lastGlobalPost",
      "undoGlobalPost",
      "lastCityPost",
      "undoCityPost"
    ];
    return paginationReads.every((x) => {
      return last[x] === now[x];
    });
  };
  componentDidUpdate = async (prevProps) => {
    if (this.props.width !== prevProps.width) {
      const max = 400;
      /**
       * 
      var columncount = 5; //
      if (width < max + 600) columncount = 4;
      if (width < max + 400) columncount = 3;
      if (width < max + 200) columncount = 2;
      if (width < max) columncount = 1;
       * 
       */
      var columncount = 3; //
      if (this.props.width < max + 1350) columncount = 4;
      if (this.props.width < max + 900) columncount = 3;
      if (this.props.width < max + 450) columncount = 2;
      if (this.state.listplz || this.props.width < max) columncount = 1;
      this.setState({ columncount });
    }
    if (!this.checkfeas(this.props.myStuff, prevProps.myStuff)) {
      this.setState(this.props.myStuff);
    }
    const { loadingMessage, auth } = this.props;
    if (loadingMessage !== prevProps.loadingMessage) {
      var gotComments = loadingMessage.startsWith("getting posts");
      var gotEntities = loadingMessage.startsWith("getting comments");
      console.log(loadingMessage);
      this.setState({
        swipe: gotEntities ? "forum" : gotComments ? "comments" : "home"
      });
    }

    if (this.props.isProfile !== prevProps.isProfile)
      this.setState({ onlyCommunity: "", seeContents: "", opening: "" });

    if (this.props.users !== prevProps.users)
      this.setState(
        {
          users: [
            ...this.props.users.filter(
              (user) => !prevProps.users.find((parent) => parent.id === user.id)
            ),
            ...this.state.users
          ]
        },
        () => this.getUsers()
      );

    if (this.props.community && this.props.community !== prevProps.community)
      this.getBills();

    /*if (
      this.props.scrolling !== prevProps.scrolling &&
      this.props.scrolling &&
      this.state.opening !== ""
    )
      this.setState({ opening: "" });*/
  };
  getBills = (billSubject, pagination) => {
    if (statesForBillsOfOpenStates.includes(this.props.community.message)) {
      var subjectOrNot = null;
      if (billSubject) {
        subjectOrNot = "&subject=" + billSubject;
        this.setState({ billSubject });
      }
      /*const nj = {
        id: "ocd-jurisdiction/country:us/state:nj/government",
        name: "New Jersey",
        classification: "state",
        division_id: "ocd-division/country:us/state:nj",
        url: "http://www.njleg.state.nj.us/"
      };*/
      var stateSet = stateCity.find(
        (x) => x.name === this.props.community.message
      );
      if (pagination === "last") {
        this.setState({ billPagination: this.state.billPagination + 1 });
      } else if (pagination === "undo") {
        this.setState({ billPagination: this.state.billPagination + 1 });
      } else {
        this.state.billPagination !== 1 && this.setState({ billPagination: 1 });
      }
      const openStatesURL =
        `https://v3.openstates.org/bills` +
        `?jurisdiction=ocd-jurisdiction/country:us/state:${stateSet.abbreviation.toLowerCase()}/government` +
        `${subjectOrNot ? subjectOrNot : ""}&sort=latest_action_asc&page=${
          this.state.billPagination +
          (pagination === "last" ? 1 : pagination === "last" ? -1 : 0)
        }&per_page=10` +
        /*`&session=2021&chamber=Senate&updated_since=${"2020-12-01"}`+
        `&sort=latest_action_desc&page=1&per_page=10` +*/
        `&include=abstracts&apikey=f6d51945-d31e-47f6-8e4b-13f8348d5b4a`;

      fetch(openStatesURL)
        .then(async (res) => await res.json())
        .then((result) => {
          var bills = result.results;

          this.setState({ bills });
        })
        .catch((err) => console.log(err.message));
    }
  };
  scrollBackToTheLeft = () => {
    window.scrollTo(0, 0);
    /*if (this.props.columncount > 1) {
      this.stinker &&
        this.stinker.current.scroll({ left: 0, behavior: "smooth" });
    } else {
      this.stinker && this.stinker.current.scrollIntoView("smooth");
    }*/
    // forum.scrollLeft = forum.offsetLeft;
  };
  handlePinch = (e) => {
    var tSX /*touchScreenX*/,
      tSY /**touchScreenY */,
      dS /*disableScroll*/,
      sB = {}; //scrollBounds
    const tT = e.targetTouches[0];
    //e=>handlePinch.eitherFunc(e,document.body)
    const touch = e.touches[0];

    if (!this.state.editingSomeText) {
      var left = touch ? e.touches[0].clientX : e.pageX;
      if (
        (e.target.offsetLeft === 0 && left && left < 100) ||
        this.state.startDrag
      ) {
        !this.state.startDrag && this.setState({ startDrag: true });
        left !== this.state.left &&
          Math.abs(left - this.state.left) > 2 &&
          this.setState({ left });
      }
    }
    clearTimeout(this.endpagedrag);
    this.endpagedrag = setTimeout(() => {
      if (!this.state.editingSomeText) {
        var l = touch ? this.state.left : e.pageX,
          start = touch ? "startTouch" : "startDrag";
        if (
          l > window.innerWidth * 0.8 &&
          this.props.forumOpen &&
          this.state[start]
        ) {
          this.setState({
            [start]: false
          });
          e.target.scrollTo(0, 0);
          this.props.closeForum();
          clearTimeout(this.endTouch);

          this.endTouch = setTimeout(
            () =>
              this.setState({
                left: 0
              }),
            50
          );
        } else
          this.setState({
            startTouch: false,
            left: 0
          });
      }
    }, 2500);
    return {
      touchstart: (e, dB) => {
        //scroll/client
        const tTt = tT.target; //touchTarget
        // a boolean map indicating if the e (or either of e parents, excluding the dB) can be scrolled to the X direction.

        const bDs = (
          //bounDs, (non)iteratedConditional
          e,
          cC //callbackConditional
        ) => (e === dB ? false : cC(e) ? true : bDs(e.parentNode, cC));

        const sw = e.scrollWidth;
        const sh = e.scrollHeight;
        const cw = e.clientWidth;
        const ch = e.clientHeight;
        const st = e.scrollTop;
        const sl = e.scrollLeft;
        sB.left = bDs(tTt, (e) => sl > 0);
        sB.top = bDs(tTt, (e) => st > 0);
        sB.right = bDs(tTt, (e) => sw > cw && sw - cw > sl);
        sB.bottom = bDs(tTt, (e) => sh > ch && sh - ch > st);

        tSX = tTt.screenX; //touchScreenX
        tSY = tTt.screenY; //touchScreenY
        dS = false; //disableScroll
      },
      touchmove: (e) => {
        //move/screen
        const tT = e.targetTouches[0];
        const mSX = tT.screenX; //moveScreenX
        const mSY = tT.screenY; //moveScreenY
        if (dS) return e.preventDefault(); //disableScroll
        if (
          //tight pinch pinching tighten tightening
          mSX < tSX && //moveScreenX < touchScreenX
          sB.left && //scrollBounds
          mSY > tSY && //moveScreenY > touchScreenY
          sB.bottom && //scrollBounds
          mSX > tSX && //moveScreenX > touchScreenY
          sB.right && //scrollBounds
          mSY < tSY && //moveScreenY < touchScreenX
          sB.top //scrollBounds
        ) {
          // disableScroll.
          e.preventDefault();
          dS = true;
        }
      }
    };
  };
  handlePinchStart = (x) => this.handlePinch(x).touchstart(x, document.body);
  handlePinchMove = (x) => this.handlePinch(x).touchmove(x, document.body);

  componentDidMount = () => {
    //window.addEventListener("touchstart", this.handlePinchStart);
    //window.addEventListener("touchmove", this.handlePinchMove);
    this.props.community && this.getBills();
  };
  componentWillUnmount = () => {
    clearTimeout(this.endpagedrag);
    //window.removeEventListener("touchstart", this.handlePinchStart);
    //window.removeEventListener("touchmove", this.handlePinchMove);
    clearTimeout(this.endTouch);
  };
  achatisopen = (x) => {
    this.setState({ achatopen: true });
  };

  openChatWithGroup = (x) => {
    if (!this.state.oktoshowchats) {
      var answer = window.confirm(
        "Are you on a private computer? Firebase chat uses cache to lessen the (down)load. Enter the chat or continue anyway?"
      );
      if (answer) {
        this.showChatsOnce();
      }
    } else
      this.setState(
        {
          threadId: x.threadId,
          achatopen: true,
          chatsopen: true,
          achatisopen: true,
          started: false,
          thisentity: x,
          entityTitle: x.entityTitle,
          entityType: x.entityType,
          entityId: x.entityId,
          recipients: x.recipients.sort(),
          chosenTopic: "*"
          //closeAllStuff: true
        },
        () => this.props.navigate("/")
      );
  };
  showChatsOnce = () => {
    this.showChats();
    this.setState({ oktoshowchats: true });
  };
  showChats = async () => {
    this.props.loadGreenBlue("getting chats...");
    let p = 0;
    const keepalive = 3600000;
    const free = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      [
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid)
      ], //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      33, //limit
      null, //startAfter
      null //endBefore
    ); //worth a shot
    //we can save money! there is a monster!
    //"no monster is real"
    this.setState(
      {
        lastGroup: free.startAfter,
        againGroup: free.endBefore
      },
      async () => {
        let groupchats = [];
        if (free.docs.length === 0) {
          this.props.setForumDocs({ chats: [] });
        } else {
          free.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;

              foo.entity =
                foo.entityId &&
                (await this.props.hydrateEntity(foo.entityId, foo.entityType));
              groupchats.push(foo);
            }
          });
        }
        if (p === free.docs.length) {
          groupchats = await this.handleChatSnapshot(groupchats);
          this.props.unloadGreenBlue();
          this.setState({
            groupchats
          });
        }
      }
    );

    const free1 = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      [
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid)
      ], //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      33, //limit
      null, //startAfter
      null //endBefore
    );
    this.setState(
      {
        lastMessage: free1.startAfter,
        againMessage: free1.endBefore
      },
      async () => {
        let pp = 0;
        let myDocs = [];
        free1.docs.forEach(async (doc) => {
          pp++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            foo.author = await this.props.hydrateUser(foo.authorId);

            if (!foo.gsUrl)
              updateDoc(doc(firestore, "chats", foo.id), {
                gsUrl: false
              });

            myDocs.push(foo);
          }
        });
        if (pp === free1.docs.length && this.state.myDocs !== myDocs) {
          this.setState({
            myDocs
          });
        }
      }
    );
    //docs
    const free2 = await JailClass(
      //for each: foo = {...doc.data(),doc.id}
      [
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid),
        orderBy("gsUrl", "desc")
      ], //optional canIncludes()?
      keepalive,
      { order: "time", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    this.setState(
      {
        lastDoc: free2.startAfter,
        againDoc: free2.endBefore
      },
      async () => {
        let pp = 0;
        let myDocs = [];
        free2.docs.forEach(async (doc) => {
          pp++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            foo.author = await this.props.hydrateUser(foo.authorId);

            myDocs.push(foo);
          }
        });
        if (pp === free2.docs.length && this.state.myDocs !== myDocs) {
          this.setState({
            myDocs
          });
        }
      },
      standardCatch
    );
  };
  render() {
    var {
      highAndTight,
      comments,
      vertical,
      commtype,
      subForum,
      auth,
      user,
      community,
      height,
      postHeight,
      person,
      forumPosts,
      profileEntities,
      displayPreferences,
      ownerOpen,
      //isMember,
      //isMemberMaker
      isFaculty,
      canMember,
      isAdmin,
      isAdminOrFaculty,
      permitted,
      isAuthor,
      coll,
      typeOrder,
      budgetTyped,
      ordinanceTyped,
      classTyped,
      caseTyped,
      departmentTyped,
      electionTyped,
      forumTyped
    } = this.props;
    const { notes } = this.state;
    let noteList = [];
    let noteTitles = [];
    notes &&
      notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    const { backgroundColor } = displayPreferences;
    const {
      columncount,
      swipe,
      chosenForum,
      deletedForumPosts
      /*lastPostOfComment,
      undoPostOfComment,
      lastPost,
      undoPost,
      groupLast,
      groupUndo,
      lastCommOrd,
      undoCommOrd,
      lastCommDept,
      undoCommDept,
      lastOldBudget,
      undoOldBudget,
      lastOldElections,
      undoOldElections,
      lastOldCases,
      undoOldCases,
      lastOldClasses,
      undoOldClasses,
      lastCommForm,
      undoCommForm,
      
    lastComments={lastComments}
    undoComments={undoComments}
    lastPostOfComment={lastPostOfComment}
    undoPostOfComment={undoPostOfComment}
    groupLast={groupLast}
    groupUndo={groupUndo}
    lastPosts={lastPosts}
    lastPost={lastPost}
    undoPosts={undoPosts}
    undoPost={undoPost}
      */
    } = this.state;

    const getpager = (x) => {
      var last = false;
      var undo = false;
      var lastOld = false;
      var undoOld = false;
      if (commtype === "ordinances") {
        last = "lastCommOrd";
        undo = "undoCommOrd";
      } else if (commtype === "departments") {
        last = "lastCommDept";
        undo = "undoCommDept";
      } else if (commtype === "budget") {
        last = "lastBudget";
        undo = "undoBudget";
        //lastOld = "lastOldBudget";
        //undoOld = "undoOldBudget";
      } else if (commtype === "elections") {
        last = "lastElections";
        undo = "undoElections";
        //lastOld = "lastOldElections";
        //undoOld = "undoOldElections";
      } else if (commtype === "cases") {
        last = "lastCases";
        undo = "undoCases";
        //lastOld = "lastOldCases";
        //undoOld = "undoOldCases";
      } else if (commtype === "classes") {
        last = "lastClasses";
        undo = "undoClasses";
        //lastOld = "lastOldClasses";
        //undoOld = "undoOldClasses";
      } else if (commtype === "forms & permits") {
        last = "lastCommForm";
        undo = "undoCommForm";
      }
      return {
        /* last,undo, lastOld, undoOld*/
        lCP: this.props.paginationhandle[last],
        uCP: this.props.paginationhandle[undo]
      };
    };
    const g = getpager();
    var lastComm =
      this.props.isProfile &&
      ["new", "lesson", "show", "game"].includes(commtype)
        ? g.lCP
        : this.props.globeChosen
        ? this.props.lastGlobalPost
        : community
        ? g.lCP
        : this.props.lastCityPost;

    var undoComm =
      this.props.isProfile &&
      ["new", "lesson", "show", "game"].includes(commtype)
        ? g.uCP
        : this.props.globeChosen
        ? this.props.undoGlobalPost
        : community
        ? g.uCP
        : this.props.undoCityPost;

    //var undoCommPost = swipe === "comments" ? lastPostOfComment : lastPost;
    //var lastCommPost = swipe === "comments" ? undoPostOfComment : undoPost;
    const { profile, isProfile, findPost } = person;
    const {
      profileEvents,
      profileJobs,
      profileClubs,
      profileServices,
      profileClasses,
      profileDepartments,
      profileRestaurants,
      profileShops,
      profilePages,
      profileVenues,
      profileHousing,
      profileComments
    } = profileEntities;
    const getfei = (x, y) => (x && x[y] ? x[y] : []);
    var experiences = getfei(profile, "experiences");
    var education = getfei(profile, "education");
    var hobbies = getfei(profile, "hobbies");
    //var hide = !this.state.mounted || this.state.closing;

    var filterUnspecified =
      budgetTyped === "" &&
      ordinanceTyped === "" &&
      classTyped === "" &&
      caseTyped === "" &&
      departmentTyped === "" &&
      electionTyped === "" &&
      forumTyped === "";
    var collectionUnspecified = this.state.collection === "";
    //end profile(person) stuff
    var editingEnabled =
      !this.props.globeChosen &&
      !subForum &&
      this.props.editingCommunity &&
      commtype === "forum";
    let allposters = [];
    comments &&
      comments.map(
        (c) => !allposters.includes(c.authorId) && allposters.push(c.authorId)
      );
    var width = vertical ? this.props.width - 56 : this.props.width;

    //const whatwhen = (w, h) => commtype === w && this.props.openWhen === h;
    var forum =
      //filter on ? filter for
      this.props.globeChosen
        ? this.props.globalForumPosts
        : subForum || commtype === "class" || commtype === "department"
        ? []
        : /*: whatwhen("budget", "expired")
        ? this.props.oldBudget
        : whatwhen("elections", "expired")
        ? this.props.oldElections
        : whatwhen("cases", "expired")
        ? this.props.oldCases*/
        this.props.isProfile
        ? this.state.swipe === "comments"
          ? profileComments
          : this.props.profilePosts //he destroy anything? free hotel
        : forumPosts; //jack of all trades bitch. athersclerotic garbage collection
    //cut the deficit, secure your mind!
    //docket spoof
    //what does trump think about checking bank run?
    //save what? save revenuedata.doi.gov
    //how much for "trumpy bear"
    var cards = this.props.drop
      ? [this.props.drop]
      : /*: this.props.isProfile
      ? forumPosts*/
      this.props.globeChosen
      ? this.props.globalForumPosts
      : subForum
      ? this.props.subForumPosts
      : commtype === "bills"
      ? this.state.bills
      : /*: whatwhen("budget", "expired")
      ? this.props.oldBudget
      : whatwhen("elections", "expired")
      ? this.props.oldElections
      : whatwhen("cases", "expired")
      ? this.props.oldCases
      : commtype === "classes" && this.props.openWhen === "expired"
      ? this.props.oldClasses*/
      isProfile
      ? this.state.swipe === "comments"
        ? profileComments
        : this.props.profilePosts
      : forumPosts;
    //console.log(forumPosts);
    let res = {};
    for (let i = 0; i < 14; i++) {
      res[i] = (i / 14) * 0.3;
    }
    //if checking isn't good for currency, hello bank run

    //U.S. is the most secure so
    let posts = {};
    //you can make 10% by being right
    //personal fiduciary account lmao
    //reposessing my ass is exclusionary
    //plausible NFL seasonal contract
    //find another industry or work for someone to flake on investory
    //I cannot abide to non inflation rate of unemployment "bad"
    //treasury stock currency
    //human action deflates investment. more kuznets; contracts
    //any non inflationary recession is marginal
    //console.log(isProfile, this.state.swipe, forumPosts);
    //gas price canot be gay unless you assume things about gays (with publicity shame)
    //if (!["departments", "classes", "oldClasses"].includes(commtype)) {
    cards.forEach((x) => {
      const chainId = isProfile
        ? x.community
          ? x.community.message
          : x.city
        : x.author
        ? x.author.username
        : x.authorId;
      if (!deletedForumPosts.includes(x.id)) {
        /*if (this.state.onlyCommunity === chainId) {
            if (this.state.onlyPost === "" || this.state.onlyPost === x.shortId)
              posts[x.id] = [x];
          } else if (
            this.state.onlyPost === "" ||
            this.state.onlyPost === x.shortId
          ) {*/
        if (!posts[chainId]) posts[chainId] = [];
        x.chainId = chainId;
        posts[chainId].push(x);
      }
    });

    //console.log(cards); //5 gen in kind
    //would have been taxed probably. in house in kind
    //no ticket
    var nothing = !permitted ? null : cards.length === 0;

    const scrollTop =
      this.stinker &&
      this.stinker.current &&
      this.stinker.current.scrollTop > 150;

    //
    var late = this.props.isProfile
      ? swipe === "comments"
        ? this.props.lastComments
        : this.props.entityId
        ? this.props.lastPostsAs
        : this.props.lastPosts
      : this.props.globeChosen
      ? this.props.lastGlobalForum
      : commtype === "bills" && community
      ? () => this.getBills(this.state.billSubject, "last")
      : community
      ? this.props.lastCommForum
      : this.props.lastCityForum;

    var back = this.props.isProfile
      ? !g.lCP
        ? () => window.alert("no more")
        : swipe === "comments"
        ? this.props.undoComments
        : this.props.entityId
        ? this.props.undoPostsAs
        : this.props.undoPosts
      : this.props.globeChosen
      ? this.props.undoGlobalForum
      : commtype === "bills" && community
      ? () => this.getBills(this.state.billSubject, "undo")
      : community
      ? this.props.undoCommForum
      : this.props.undoCityForum;
    //console.log(swipe);
    const bubbleStyle = {
      transition: ".3s ease-in",
      display: "flex",
      borderRadius: "50px",
      border: "1px solid black",
      position: "absolute"
    };
    //console.log("go");
    var selection = [
      "new",
      "lessons",
      "shows",
      "games",
      "budget",
      "cases",
      "elections",
      "ordinances"
    ];
    //Aren't nonprofits allowed to save tax-exempt business income? Why don't we make everyone a nonprofit?

    const isSubforum = (x) => subForum && this.props.profileTileChosen === x;
    //console.log(this.state.usersPublicable);

    /*console.log(
      Object.values(posts),
      this.state.onlyCommunity,
      this.state.onlyPost
    );*/
    //console.log(posts[this.state.onlyCommunity]);
    // console.log(profile);
    const poster =
      this.state.onlyCommunity !== ""
        ? posts[this.state.onlyCommunity]
        : Object.keys(posts)
            .filter((x) => {
              //console.log(x);
              return x;
              //return x !== "undefined";
            })
            .map((x) => posts[x]);
    //console.log(poster);
    //console.log(this.props.forumPosts);
    //console.log("forumPosts", posts);
    //console.log(this.props.drop);
    return (
      <div
        ref={this.stinker}
        //draggable="true"
        //onDrag={this.onDragForum}
        //onTouchMove={this.onDragForum}
        //onDragEnd={this.onDragEndForum}
        //onTouchEnd={this.onTouchEndForum}
        //onClick={() => this.state.chatsopen && this.props.unlockTop()}
        style={{
          //opacity: !this.props.isTop ? 0.6 : 1,
          backgroundColor: "rgba(0,0,0,.3)",
          position: "relative",
          left: `${vertical ? 56 : 0}px`,
          top: this.props.findheighter ? 56 : 0, // + (this.props.editingCommunity ? 56 : 0),
          transition: "0.3s ease-in",
          width: vertical ? `calc(100% - 56px)` : "100%",
          columnCount: columncount,
          columnGap: "2px"
        }}
      >
        <div
          style={{
            color: "white",
            backgroundColor: "rgba(0,0,20,.4)",
            display: this.state.chatsopen && "none",
            //border: "2px solid",
            breakInside: "avoid"
          }}
        >
          {
            this.props.auth === undefined ? (
              <div>
                <Link
                  style={{
                    color: "white"
                  }}
                  to={"/login"}
                >
                  Login
                </Link>{" "}
                to forge vintages and/or{" "}
                <a
                  style={{
                    color: "white"
                  }}
                  href="https://thumbprint.quora.com/Why-are-pay-as-you-go-transaction-based-marketplace-platforms-forced-to-use-Stripes-money-services-processor"
                >
                  bank
                </a>
              </div>
            ) : null /*(
            <Vintages
              firestore={firestore}
              //ref={{ current: { Vintages: this.Vintages } }}
              Vintages={this.Vintages}
              show={
                true
                /*(!this.stream &&
                openFolder &&
                this.state.openFrom === "Folder") ||
              this.stream* /
              }
              auth={this.props.auth}
              user={this.props.user}
              deviceCollection={"devices"}
              usersPublicable={"users"}
              usersPrivate={"userDatas"}
              setAuth={this.props.setAuth}
            />
            )*/
          }
          {profile && this.props.isProfile ? (
            //isProfile
            <Nav
              city={this.props.city}
              statePathname={this.props.statePathname}
              profile={profile}
              swipe={swipe}
              setSwipe={(parent) => {
                parent.swipe === "city" &&
                  this.props.setData({ isProfile: null, profile: null });
                this.props.helper(null, 0); //closes
                this.setState(
                  this.state.onlyPost !== "" ||
                    this.state.onlyCommunity !== "" ||
                    this.state.seeContents !== ""
                    ? {
                        ...parent,
                        onlyCommunity: "",
                        onlyPost: "",
                        seeContents: ""
                      }
                    : parent
                );
              }}
              width={this.props.width}
            />
          ) : (
            <Topsort
              openForum={() => {
                this.props.openForum("forum");
              }}
              showNew={this.state.showNew}
              triggerNew={() => this.setState({ showNew: !this.state.showNew })}
              openCal={this.state.openCal}
              setForum={(e) => this.setState(e)}
              setFoundation={this.props.setFoundation}
              unreadChatsCount={this.props.unreadChatsCount}
              notes={this.state.notes}
              typeOrder={typeOrder}
              tileChosen={this.props.tileChosen}
              commtype={commtype}
              subForum={subForum}
              type={this.props.type}
              togglePagination={() =>
                this.setState(
                  {
                    openPagination: !this.state.openPagination
                  },
                  () => this.props.setNapkin({ showNew: false })
                )
              }
              backgroundColor={backgroundColor}
              forumOpen={this.props.forumOpen}
              createSliderOpener={this.props.createSliderOpener}
              highAndTight={highAndTight}
              openWhen={this.props.openWhen}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              switchCMapOpener={this.props.switchCMapOpener}
              profileTileChosen={this.props.profileTileChosen}
              eventTypes={this.props.eventTypes}
              openElections={this.props.openElections}
              openDepartments={this.props.openDepartments}
              openClasses={this.props.openClasses}
              openCases={this.props.openCases}
              openOrdinances={this.props.openOrdinances}
              openBudget={this.props.openBudget}
              //
              budgetTyped={this.props.budgetTyped}
              ordinanceTyped={this.props.ordinanceTyped}
              caseTyped={this.props.caseTyped}
              classTyped={this.props.classTyped}
              departmentTyped={this.props.departmentTyped}
              electionTyped={this.props.electionTyped}
              forumTyped={this.props.forumTyped}
              //
              openFilters={this.props.openFilters}
              showFilters={this.props.showFilters}
              openCommunityAdmin={this.props.openCommunityAdmin}
              city={this.props.city}
              auth={auth}
              followingMe={this.props.followingMe}
              width={width}
              listplz={this.state.listplz}
              listplzToggle={this.props.listplzToggle}
              user={this.props.user}
              openGroup={() => this.setState({ openGroupFilter: true })}
              community={community}
              chooseGlobe={this.props.chooseGlobe}
              globeChosen={this.props.globeChosen}
              tilesMapOpen={this.props.tilesMapOpen}
              chatsopen={this.state.chatsopen}
            />
          )}
          {this.state.openCal ? (
            <Monthly queriedDate={new Date()} auth={this.props.auth} />
          ) : (
            <ForumPagination
              fetchForum={this.props.fetchForum}
              isProfile={this.props.isProfile}
              chosenPost={this.props.chosenPost}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              setData={this.props.setData}
              onlyPost={() =>
                this.setState({
                  onlyPost: "",
                  seeContents: "",
                  onlyCommunity: ""
                })
              }
              collection={this.state.collection}
              show={
                this.state.openPagination &&
                //!this.props.editingCommunity &&
                !subForum &&
                postHeight === 0 &&
                !["departments", "ordinances", "forms & permits"].includes(
                  commtype
                ) &&
                !this.state.chatsopen
              }
              openPagination={
                this.props.isProfile ? true : this.state.openPagination
              }
              swipe={swipe}
              editing={this.props.editing}
              clearBillSubject={() =>
                this.setState({ billSubject: null, billPagination: 1 }, () =>
                  this.getBills()
                )
              }
              billSubject={this.state.billSubject}
              getBills={this.getBills}
              bills={this.state.bills}
              commtype={commtype}
              auth={this.props.auth}
              toggleEditing={this.props.toggleEditing}
              profile={profile}
              community={this.props.community}
              city={this.props.city}
              //forumPosts={forumPosts}
              profilePosts={this.props.profilePosts}
              getDrop={this.props.getDrop}
              inTopSort={true}
              editingCommunity={this.props.editingCommunity}
              scrollTop={scrollTop}
              lastCommPost={lastComm}
              undoCommPost={undoComm}
              //
              users={this.props.users}
              late={late}
              back={back}
              forumPosts={forum}
              tagsOpen={this.state.tagsOpen}
              tagResults={this.state.tagResults}
              toggleTags={
                this.state.tagsOpen
                  ? () => this.setState({ tagsOpen: false })
                  : () => this.setState({ tagsOpen: true })
              }
            />
          )}
        </div>
        {/*notes && (
          <Calendar
            noteList={noteList}
            noteTitles={noteTitles}
            notes={notes}
            invites={this.props.invites}
            selfvites={this.props.selfvites}
            user={this.props.user}
            auth={this.props.auth}
            queriedDate={this.props.queriedDate}
            events={this.props.events}
            foundEntity={this.props.foundEntity}
            recipients={this.props.recipients}
            //calendarInitial={true}
            monthCalOpen={this.props.monthCalOpen}
            dayCalOpener={this.props.dayCalOpener}
            monthCalOpener={this.props.monthCalOpener}
            monthCalCloser={this.props.monthCalCloser}
            chats={this.props.chats}
            hiddenMsgs={this.props.hiddenMsgs}
            deletedMsgs={this.props.deletedMsgs}
            onDelete={this.props.onDelete}
            handleSave={this.props.handleSave}
            chooseInvite={this.props.chooseInvite}
            achatwasopen={this.props.achatwasopen}
            recentchatswasopen={this.props.recentchatswasopen}
            chatsopen={this.state.chatsopen}
            nochatopen={this.props.nochatopen}
          />
        )*/}
        <div
          style={{
            display: this.state.chatsopen && "none",
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)"
            //border: "2px solid"
          }}
        >
          {this.props.community &&
            this.props.community.message === "United States of America" && (
              <USBudget width={this.props.width / columncount} />
            )}
        </div>
        <div
          style={{
            display: (true || this.state.chatsopen) && "none",
            breakInside: "avoid",
            width: "calc(100% - 4px)",
            //border: "2px solid",
            height: swipe === "paw" ? "min-content" : "0%",
            backgroundColor: "rgb(230,230,230)"
          }}
        >
          {this.props.isProfile &&
            [
              {
                name: "lessons, games or shows",
                events: this.state.lessonsGamesShows
              },
              { name: "events", events: this.state.events }
            ].map((x, i) => (
              <ListEvents
                key={i}
                events={x.events}
                swipe={swipe}
                name={x.name}
              />
            ))}
        </div>

        <div
          style={{
            display: this.state.chatsopen && "none",
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)"
            //border: "2px solid"
          }}
        >
          {isProfile && (
            <div
              style={{
                padding: swipe === "home" ? "10px" : "0px",
                color: "white",
                backgroundColor: "rgba(230,230,230,.6)",
                height: "min-content"
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(20,20,60,.8)",
                  padding: "10px",
                  height: "min-content"
                }}
              >
                {swipe !== "home" && profile.username}&nbsp;
                <span
                  role="img"
                  aria-label="calendar"
                  onClick={() => {
                    window.location.href =
                      "https://thumbprint.app/" + profile.username;
                    //this.setState({ openCal: !this.state.openCal });
                  }}
                >
                  &#x1f4c5;
                </span>
                <div
                  style={{
                    display: "none",
                    overflow: swipe !== "home" ? "hidden" : "",
                    opacity: swipe === "home" ? "1" : "0",
                    height: swipe === "home" ? "min-content" : "0px",
                    width: "100%",
                    position: "relative",
                    transition: ".3s ease-in"
                  }}
                >
                  {[
                    "profileEvents",
                    "profileClubs",
                    "profileShops",
                    "profileRestaurants",
                    "profileServices",
                    "profileJobs",
                    "profileHousing",
                    "profilePages",
                    "profileVenues",
                    "profileDepartments",
                    "profileClasses"
                  ].map((parent, i) => {
                    var type =
                      parent === "profileEvents"
                        ? "event"
                        : parent === "profileClubs"
                        ? "club"
                        : parent === "profileShops"
                        ? "shop"
                        : parent === "profileRestaurants"
                        ? "restaurant"
                        : parent === "profileServices"
                        ? "service"
                        : parent === "profileJobs"
                        ? "job"
                        : parent === "profileHousing"
                        ? "housing"
                        : parent === "profilePages"
                        ? "page"
                        : parent === "profileVenues"
                        ? "venue"
                        : parent === "profileClasses"
                        ? "class"
                        : parent === "profileDepartments"
                        ? "department"
                        : "event";
                    return (
                      <ByMe
                        key={i}
                        parent={parent}
                        type={type}
                        profileTileChosen={this.props.profileTileChosen}
                        setProfileTile={this.props.setProfileTile}
                        deletedEvts={this.props.deletedEvts}
                        auth={this.props.auth}
                        length={this.props.profileEntities[parent].length}
                        profileEvents={this.props.profileEvents}
                        profileClubs={this.props.profileClubs}
                        profileShops={this.props.profileShops}
                        profileRestaurants={this.props.profileRestaurants}
                        profileServices={this.props.profileServices}
                        profileJobs={this.props.profileJobs}
                        profileHousing={this.props.profileHousing}
                        profilePages={this.props.profilePages}
                        profileVenues={this.props.profileVenues}
                        profileDepartments={this.props.profileDepartments}
                        profileClasses={this.props.profileClasses}
                        communities={this.props.communities}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            display: (true || this.state.chatsopen) && "none",
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)"
            //border: "2px solid"
          }}
        >
          {this.props.isProfile && (
            <Accolades //["home"].includes(swipe)
              swipe={swipe}
              experiences={experiences}
              hobbies={hobbies}
              education={education}
            />
          )}
        </div>
        <div
          style={{
            display: this.state.chatsopen && "none",
            overflow: "hidden",
            breakInside: "avoid",
            height:
              !this.state.chatsopen && !this.props.isProfile
                ? "max-content"
                : "0px",
            width: "calc(100% - 4px)"
            //border: "2px solid"
          }}
        >
          {!this.state
            .showNew ? /* <div
              onClick={() =>
                this.setState({ openPagination: false }, () => {
                  this.props.triggerNew();
                })
              }
              style={{
                fontSize: "20px",
                textAlign: "center",
                width: "100%",
                backgroundColor: "rgb(250,100,200)",
                height: "100px"
              }}
            >
              What's on your mind?
            </div>*/ null : (
            <NewForum
              navigate={this.props.navigate}
              triggerNew={() => this.setState({ showNew: !this.state.showNew })}
              onlyCommunity={this.state.onlyCommunity}
              onlyPost={this.state.onlyPost}
              profileEntities={this.props.profileEntities}
              //
              dropId={this.props.dropId}
              getUserInfo={this.props.getUserInfo}
              communities={this.props.communities}
              showNew={this.state.showNew}
              closeNewForum={() => {
                if (
                  this.state.onlyPost !== "" ||
                  this.state.onlyCommunity !== ""
                ) {
                  this.setState({ onlyPost: "", onlyCommunity: "" });
                } else this.props.setNapkin({ showNew: false });
              }}
              cancelRebeat={this.props.cancelRebeat}
              rebeat={this.props.rebeat}
              commtype={this.props.commtype}
              issues={this.props.issues}
              user={this.props.user}
              users={this.props.users}
              city={this.props.city}
              community={this.props.community}
              auth={this.props.auth}
              myStuff={this.props.myStuff}
              materialDate={this.props.materialDate}
            />
          )}
          {nothing && !editingEnabled && (
            <div
              onClick={() => this.setState({ showNew: !this.state.showNew })}
              style={{
                padding: "4px 0px",
                backgroundColor: "grey",
                color: "white",
                width: "calc(100% - 4px)",
                //border: "2px solid",
                breakInside: "none"
              }}
            >
              <div
                style={{
                  borderRadius: "6px",
                  backgroundColor: "rgb(200,200,200)",
                  padding: "6px",
                  margin: "4px",
                  fontSize: "15px"
                }}
              >
                nothing
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            //this.state.chatsopen &&
            display: "none",
            breakInside: "avoid",
            height: "max-content",
            width: "calc(100% - 4px)"
            //border: "2px solid"
          }}
        >
          {this.props.isProfile && (
            <div
              onClick={(e) => {
                var sel = e.target.id;
                if (chosenForum.includes(sel)) {
                  var foo = chosenForum.filter((x) => x !== sel);
                  this.setState({ chosenForum: foo });
                } else {
                  this.setState({
                    chosenForum: [...chosenForum, sel]
                  });
                }
              }}
              style={{
                padding: "5px 0px",
                flexWrap: "wrap",
                display: "flex",
                width: "calc(100% - 4px)",
                //border: "2px solid",
                height: "min-content",
                backgroundColor: "rgb(20,20,25)"
              }}
            >
              {selection.map((title) => {
                const hasSome = chosenForum.includes(title)
                  ? title === "budget"
                    ? forumPosts.find((x) => ["budget"].includes(x.collection))
                    : ["new", "lessons", "games", "shows"].includes(title)
                    ? forumPosts.find(
                        (x) =>
                          "forum" === x.collection && title === x.newLessonShow
                      )
                    : title === "cases"
                    ? forumPosts.find((x) => ["cases"].includes(x.collection))
                    : title === "ordinances"
                    ? forumPosts.find((x) => "ordinances" === x.collection)
                    : title === "elections"
                    ? forumPosts.find((x) =>
                        ["elections"].includes(x.collection)
                      )
                    : null
                  : null;
                return (
                  <div
                    style={{
                      color: "white",
                      textDecoration: hasSome ? "underline" : "none",
                      padding: "5px 10px"
                    }}
                    id={title}
                    key={title}
                  >
                    {title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {ownerOpen && (
          <UpdateProfilePicture
            editingSomeText={this.state.editingSomeText}
            columncount={columncount}
            postHeight={postHeight}
            chosenPostId={this.props.chosenPostId}
            community={community}
            showpicker2={this.props.showpicker2}
            clearFiles={this.props.clearFiles}
            filePreparedToSend={this.props.filePreparedToSend}
            addPic={this.props.addPic}
            remindPic={this.state.remindPic}
            openDescript={this.state.openDescript}
            contents={this.state.contents}
            s={this.props.s}
            loadGapiAuth={this.props.loadGapiAuth}
          />
        )}
        {ownerOpen && (
          <div
            onClick={() => this.setState({ locOpen: !this.state.locOpen })}
            style={{
              color: "grey",
              width: "calc(100% - 4px)",
              padding: "10px 0px",
              boxShadow: "6px 3px 50px #222",
              backgroundColor: "rgb(200,200,200)",
              borderBottom: "1px solid grey",
              //border: "2px solid",
              position: "relative",
              flexDirection: "column",
              maxHeight: columncount === 1 || postHeight > 0 ? "" : "100%",
              overflowX: "hidden",
              overflowY: columncount === 1 ? "hidden" : "auto",
              display: this.props.editingCommunity ? "flex" : "none"
            }}
          >
            <div
              style={{
                userSelect: this.props.editingCommunity ? "none" : "",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "min-content",
                width: "calc(100% - 4px)",
                //border: "2px solid",
                breakInside: "avoid"
              }}
            >
              {community.place_name}
              <br />
              {community.center && community.center[0]}
              &nbsp;
              {community.center && community.center[1]}
            </div>
          </div>
        )}
        {ownerOpen && <SearchSettings community={community} />}
        {/*ownerOpen && (
          <Addadmin
            editingSomeText={this.state.editingSomeText}
            columncount={columncount}
            postHeight={postHeight}
            chosenPostId={this.props.chosenPostId}
            editingCommunity={this.props.editingCommunity}
            user={this.props.user}
            users={this.props.users}
            community={community}
            auth={auth}
            queryText={(parent) => this.setState(parent)}
            userQuery={this.state.userQuery}
            resetUsers={() => this.handleUserSources(this.state.usersInitial)}
          />
        )}
        {editingEnabled &&
          this.props.editingCommunity &&
          (isAdmin || canMember) && (
            <Addmembers
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              users={this.props.users}
              community={community}
              auth={auth}
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "forum" && (
            <AddMemberMaker
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {community
          ? !this.props.globeChosen &&
            community &&
            !isAdmin && (
              <Addself
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.props.chosenPostId}
                getUserInfo={this.props.getUserInfo}
                user={this.props.user}
                auth={auth}
                community={community}
              />
            )
          : null}
        {!this.props.globeChosen &&
          !subForum &&
          commtype === "forum" &&
          isAdmin &&
          community &&
          (!community.blockedForum ||
            (community.blockedForum &&
              !community.blockedForum.includes("cases"))) && (
            <AddJudge
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          commtype === "forum" &&
          isAdmin && (
            <AddRep
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )}
        {!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "forum" && (
            <Addteach
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )*/}
        {/*!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "forum" &&
          this.props.editingCommunity && (
            <div
              onClick={() =>
                updateDoc(doc(firestore, "communities", community.id), {
                  facultyCanMember: !community.facultyCanMember
                })
              }
              style={{
                padding: "10px",
                backgroundColor: !community.facultyCanMember
                  ? "rgb(0,40,0)"
                  : "rgb(120,120,190)"
              }}
            >
              <div
                style={{
                  color: community.facultyCanMember
                    ? "rgb(0,40,0)"
                    : "rgb(200,200,200)",
                  fontSize: "16px",
                  padding: "10px",
                  margin: "10px",
                  transition: ".3s ease-in",
                  backgroundColor: community.facultyCanMember ? "white" : "",
                  borderRadius: "10px",
                  textDecoration: community.facultyCanMember
                    ? ""
                    : "line-through"
                }}
              >
                Faculty can add/remove members
              </div>
              <div
                style={{
                  fontSize: "16px",
                  margin: "10px",
                  transition: ".3s ease-in",
                  textDecoration: !community.facultyCanMember
                    ? "underline"
                    : "line-through",
                  color: !community.facultyCanMember
                    ? "white"
                    : "rgb(200,200,200)"
                }}
              >
                Only memberMakers, community author and admins can add/remove
                members
              </div>
            </div>
              )*/}
        {/*!this.props.globeChosen &&
          !subForum &&
          isAdmin &&
          commtype === "forum" && (
            <Addforum
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )*/}
        {/*!this.props.globeChosen &&
          !subForum &&
          commtype === "forum" &&
          isAdmin && (
            <Addtiles
              queryText={(parent) => this.setState(parent)}
              userQuery={this.state.userQuery}
              users={this.state.users}
              resetUsers={() => this.handleUserSources(this.state.usersInitial)}
              editingSomeText={this.state.editingSomeText}
              columncount={columncount}
              postHeight={postHeight}
              chosenPostId={this.props.chosenPostId}
              editingCommunity={this.props.editingCommunity}
              user={this.props.user}
              community={community}
              auth={auth}
            />
          )*/}
        {/*editingEnabled &&
          this.props.editingCommunity &&
          (isAdmin || canMember) && (
            <AllowVoting
              columncount={columncount}
              postHeight={postHeight}
              community={community}
              bubbleStyle={bubbleStyle}
            />
          )*/}
        {editingEnabled && this.props.editingCommunity && isAdmin && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              var answer = window.confirm(
                "Would you like to update " +
                  this.props.community.message +
                  ": " +
                  this.props.community.body +
                  " to '" +
                  this.state.editedMessageBody +
                  "'?"
              );
              answer &&
                updateDoc(
                  doc(firestore, "communities", this.props.community.id),
                  {
                    body: this.state.editedMessageBody
                  }
                );
            }}
          >
            <textarea
              style={{ width: "100%" }}
              defaultValue={this.props.community.body}
              onChange={(e) => {
                this.setState({
                  editedMessageBody: e.target.value
                });
              }}
            />
            <button style={{ width: "100%" }}>save</button>
          </form>
        )}
        {!this.props.globeChosen &&
          !subForum &&
          !["classes", "oldClasses"].includes(coll) &&
          (isAdmin || (isFaculty && ["cases", "oldCases"].includes(coll))) && (
            <div
              style={{
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "calc(100% - 4px)",
                //border: "2px solid",
                maxHeight:
                  columncount === 1 || postHeight > 0 ? "" : "calc(100% - 1px)",
                height: `min-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }}
            >
              <NewItem
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.props.chosenPostId}
                cards={cards}
                closeNew={() => this.props.setNapkin({ showNew: false })}
                showNewItem={this.props.showNewItem}
                ordinanceTyped={this.props.ordinanceTyped}
                budgetTyped={this.props.budgetTyped}
                caseTyped={this.props.caseTyped}
                electionTyped={this.props.electionTyped}
                departmentTyped={this.props.departmentTyped}
                classTyped={this.props.classTyped}
                auth={auth}
                preserveAdmin={this.state.preserveAdmin}
                community={community}
                materialDate={this.props.materialDate}
                click1={() => {
                  var parent = null;
                  if (
                    [
                      "classes",
                      "oldClasses",
                      "oldElections",
                      "elections",
                      "oldBudget",
                      "budget"
                    ].includes(coll)
                  ) {
                    parent = "futureOnly";
                  }
                  this.props.materialDateOpener(parent);
                }}
              />
            </div>
          )}
        {!this.props.globeChosen && !subForum && commtype === "classes" ? (
          isAdmin ? (
            <div
              style={{
                breakInside: "avoid",
                zIndex: 6,
                width: "calc(100% - 4px)",
                //border: "2px solid",
                maxHeight:
                  columncount === 1 || postHeight > 0 ? "" : "calc(100% - 1px)",
                height: `min-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }}
            >
              <NewClass
                editingSomeText={this.state.editingSomeText}
                columncount={columncount}
                postHeight={postHeight}
                chosenPostId={this.props.chosenPostId}
                closeNew={() => this.props.setNapkin({ showNew: false })}
                showNew={this.state.showNew}
                classTyped={this.state.classTyped}
                auth={auth}
                community={community}
                materialDate={this.props.materialDate}
                click1={() => {
                  this.props.materialDateOpener("futureOnly");
                }}
              />
            </div>
          ) : (
            <div />
          )
        ) : null}
        {!this.props.globeChosen && commtype === "budget" ? (
          !forumPosts ? (
            <div>No upcoming {this.state.openWhat} budget disbursements</div>
          ) : null
        ) : null}
        {/*community &&
          community.privateToMembers &&
          !(
            (auth && community.authorId === auth.uid) ||
            (auth && community.admin.includes(auth.uid)) ||
            (auth && community.faculty.includes(auth.uid)) ||
            (auth && community.members.includes(auth.uid))
          ) && (
            <div
              style={{
                display: "flex",
                //maxWidth: "300px",
                height: "min-content",
                overflow: "hidden",
                zIndex: "9",
                color: "black",
                flexDirection: "column",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                opacity: "1",
                backgroundColor: "white"
              }}
            >
              This community is private
              <div
                onClick={() =>
                  updateDoc(doc(firestore, "communities", community.id), {
                    requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                      auth.uid
                    )
                  })
                }
                style={{
                  height: "min-content",
                  fontSize: "10px",
                  border: "1px solid",
                  width: "min-content",
                  padding: "2px",
                  borderRadius: "3px"
                }}
              >
                Request
              </div>
            </div>
          )*/}
        {!this.state.chatsopen &&
          poster &&
          poster.map((parent, i) => {
            //console.log(parent);
            if (
              this.state.onlyPost !== "" &&
              !(parent.constructor === Array ? parent : [parent]).find(
                (x) => this.state.onlyPost === x.shortId
              )
            )
              return null;
            var folders = [];
            if (parent.video && !folders.includes(parent.video.folder))
              folders.push(parent.video.folder);

            if (!parent.id) {
              //closeChain
              parent = parent[0];
            }
            if (parent.jurisdiction) {
              return (
                <div
                  key={parent.identifier + parent.title + i}
                  style={{
                    padding: "10px",
                    backgroundColor: "white",
                    breakInside: "avoid",
                    width: "calc(100% - 20px)",
                    height: "min-content"
                  }}
                >
                  <div
                    style={{
                      padding: "0px 10px",
                      paddingBottom: "10px",
                      width: "calc(100% - 20px)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>{parent.identifier}</div>
                    <div style={{ fontSize: "10px", color: "grey" }}>
                      <div style={{ fontSize: "12px" }}>
                        {Math.round(
                          (new Date().getTime() -
                            new Date(parent.updated_at).getTime()) /
                            86400000
                        )}{" "}
                        &nbsp;days ago&nbsp;{" "}
                        {new Date(parent.updated_at).toLocaleDateString()}
                      </div>
                      <div>
                        {new Date(parent.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {parent.title}

                  <div
                    style={{
                      padding: "0px 10px",
                      paddingTop: "10px",
                      width: "calc(100% - 20px)",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center"
                    }}
                  >
                    {parent.subject.map((x) => (
                      <div
                        key={x}
                        onClick={() => this.getBills(x.toUpperCase())}
                        style={{ border: "1px solid" }}
                      >
                        {x[0].toUpperCase() +
                          x.substring(1, x.length).toLowerCase()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              var arrr = (x, y) => x.includes(this.props[y]);
              const goCard =
                commtype === "classes"
                  ? arrr([[parent.classType, ""], classTyped])
                  : commtype === "departments"
                  ? arrr([[parent.departmentType, ""], departmentTyped])
                  : subForum;

              var goPost = arrr(["new", "lesson", "show", "game"], commtype)
                ? arrr([parent.issue, ""], forumTyped)
                : commtype === "budget"
                ? arrr([parent.budgetType, ""], budgetTyped)
                : commtype === "ordinances"
                ? arrr([parent.ordinanceType, ""], ordinanceTyped)
                : commtype === "cases"
                ? arrr([parent.caseType, ""], caseTyped)
                : commtype === "elections"
                ? arrr([parent.electionType, ""], electionTyped)
                : !subForum;
              //nurse cops, deficit accident
              //have some foresight! expected
              //50% is the deal always
              //marginal changes make no absolute change
              var isGood =
                auth !== undefined &&
                user !== undefined &&
                user.under13 &&
                user.showCurses;
              var mTT =
                parent.message && RegisterCurseWords(parent.message, isGood);

              if (parent.time || parent.date) {
                //console.log(show);
                /*const currentchain = poster !== posts[this.state.onlyCommunity];
              //this.state.onlyCommunity === parent.chainId;
              if (
                this.state.onlyCommunity === "" ||
                (currentchain && i < poster.length)
              )*/
                var show = true;
                const key =
                  parent.collection + parent.id + window.location.pathname;
                return (
                  <div
                    ref={this["post" + i]}
                    key={key + "/" + parent.isOfComment}
                    style={{
                      width: "calc(100% - 4px)",
                      //border: "2px solid",
                      breakInside: "avoid",
                      maxHeight:
                        columncount === 1 || postHeight > 0
                          ? ""
                          : "calc(100% - 1px)",
                      zIndex: show ? i + 6 : -9999,
                      height: show ? `min-content` : "0px",
                      color: "black",
                      opacity: show ? "1" : "0",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      overflowX: "hidden",
                      overflowY: columncount === 1 ? "hidden" : "auto"
                    }}
                  >
                    <Card
                      //first={this.state.onlyCommunity!==""?0:i}
                      chainId={parent.chainId}
                      vintageOfKeys={this.props.vintageOfKeys}
                      setNapkin={this.props.setNapkin}
                      rebeat={this.props.rebeat}
                      setRebeat={this.props.setRebeat}
                      videos={this.props.videos}
                      folders={this.props.folders}
                      summary={this.state.seeContents === parent.chainId}
                      onlyCommunity={this.state.onlyCommunity}
                      seeContents={this.state.seeContents}
                      int={this.state.int}
                      opening={this.state.opening}
                      setForum={(x) => this.setState(x)}
                      onlyPost={this.state.onlyPost}
                      isProfile={this.props.isProfile}
                      setChain={(seeContents) => {
                        //this.props.helper();
                        //console.log(parent);
                        this.setState(seeContents);
                      }}
                      cards={
                        this.state.onlyCommunity !== ""
                          ? [posts[this.state.onlyCommunity][i]]
                          : /*Object.keys(posts).map((x) => {
                            return posts[x];
                          })*/
                            Object.values(posts)[i]
                      }
                      forumOpen={this.props.forumOpen}
                      mTT={mTT}
                      key={parent.id}
                      myCommentsPreview={false}
                      res={res}
                      linkDrop={this.props.linkDrop}
                      dropId={this.props.dropId}
                      parent={parent}
                      //
                      goCard={goCard}
                      goPost={goPost}
                      users={this.props.users}
                      editingSomeText={this.state.editingSomeText}
                      postHeight={postHeight}
                      community={community}
                      isAuthor={isAuthor} //in forum of community already found...
                      isAdminOrFaculty={isAdminOrFaculty}
                      i={i}
                      openWhen={this.props.openWhen}
                      isClass={commtype === "classes"}
                      isDepartment={commtype === "departments"}
                      isHousing={isSubforum("housing")}
                      isRestaurant={isSubforum("restaurant")}
                      isService={isSubforum("service")}
                      isShop={isSubforum("shop")}
                      isPage={isSubforum("page")}
                      isVenue={isSubforum("venue")}
                      isJob={isSubforum("job")}
                      user={this.props.user}
                      auth={auth}
                      cityapi={this.props.cityapi}
                      communities={this.props.communities}
                      //
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      loadGreenBlue={this.props.loadGreenBlue}
                      setEditing={(edit) => this.setState(edit)}
                      getUserInfo={this.props.getUserInfo}
                      columncount={columncount}
                      storageRef={this.props.storageRef}
                      issues={this.props.issues}
                      meAuth={this.props.meAuth}
                      getVideos={this.props.getVideos}
                      getFolders={this.props.getFolders}
                      individualTypes={this.props.individualTypes}
                      city={this.props.city}
                      isAdmin={isAdmin}
                      userMe={this.props.user}
                      tileChanger={this.props.tileChanger}
                      commtype={commtype}
                      chosenPostId={this.props.chosenPostId}
                      helper={(x) => {
                        if (!x) return this.props.helper();
                        var postHeight = this["post" + i].current.offsetHeight;
                        //console.log(postHeight);
                        this.props.helper(x, postHeight);
                        this.setState({
                          onlyPost: parent.shortId,
                          onlyCommunity: parent.chainId
                        });
                        this["post" + i].current.scrollIntoView("smooth");
                      }}
                      delete={() =>
                        this.setState({
                          deletedForumPosts: [
                            ...this.state.deletedForumPosts,
                            parent.id
                          ]
                        })
                      }
                      deletedForumPosts={this.state.deletedForumPosts}
                      comments={comments}
                      clear={() => {
                        var answer = window.confirm(
                          "are you sure you want to clear this comment?"
                        );
                        if (answer) {
                          this.setState({ comment: "" });
                        }
                      }}
                      height={height}
                      globeChosen={this.props.globeChosen}
                      chosenPost={this.props.chosenPost}
                      vertical={this.props.vertical}
                      postMessage={this.props.postMessage}
                      width={this.props.width}
                      forumPosts={this.props.forumPosts}
                      closeGroupFilter={this.props.closeGroupFilter}
                      openGroupFilter={this.props.openGroupFilter}
                    />
                  </div>
                );
              } else return JSON.stringify(parent);
            }
          })}
        <Chats
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          setForum={(e) => this.setState(e)}
          getRoomKeys={(x) =>
            this.Vintages.current & this.Vintages.current.getRoomKeys(x)
          }
          vintageOfKeys={this.state.vintageOfKeys}
          setNapkin={this.props.setNapkin}
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
          myStuff={this.props.myStuff}
          thisentity={this.state.thisentity}
          entityTitle={this.state.entityTitle}
          entityType={this.state.entityType}
          entityId={this.state.entityId}
          setTopic={this.state.setTopic}
          threadId={this.state.threadId}
          chosenTopic={this.state.chosenTopic}
          showChatsOnce={this.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={() =>
            this.setState({ filesPreparedToSend: [] })
          }
          filesPreparedToSend={this.state.filesPreparedToSend}
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
          notes={this.state.notes}
          profileOpener={() =>
            this.setState({
              filesPreparedToSend: [],
              profileOpen: !this.state.profileOpen
            })
          }
          profileOpen={this.state.profileOpen}
          chatsopen={this.state.chatsopen}
          chatscloser={() => this.setState({ chatsopen: false })}
          users={this.props.users}
          auth={auth}
          user={this.props.user}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
        />
      </div>
    );
  }
}
//withRouter
export default Forum;

/*
if (
  this.props.filePreparedToSend[0] &&
  this.props.filePreparedToSend[0] !== this.state.lastFiletosend
) {
  var file = this.props.filePreparedToSend[0].embedUrl;

  if (file) {
    var fileid = file.substring(
      file.lastIndexOf("/d/") + 3,
      file.lastIndexOf("/") // /edit or /preview
    );
    var thumbnail = `https://drive.google.com/thumbnail?id=${fileid}`;
    var couple = {};
    couple.content = this.props.filePreparedToSend[0];
    couple.thumbnail = thumbnail;
    couple.id = fileid;
    //console.log(couple);
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: couple,
      photoSrc: file,
      photoThumbnail: thumbnail
    });
  } else {
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: {},
      photoSrc: null,
      photoThumbnail: null
    });
  }
}*/
/**
 * 
if (!this.props.isProfile) {
  if (!posts[x.authorId]) posts[x.authorId] = [];
  return posts[x.authorId].push(x);
} else {
  if (x.communityId) {
    if (!posts[x.communityId]) posts[x.communityId] = [];
    return posts[x.communityId].push(x);
  } else {
    if (!posts[x.city]) posts[x.city] = [];
    return posts[x.city].push(x);
  }
}
 */
