import React from "react";
//Isn't a parallel property, adjacent?
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  setDoc,
  deleteDoc,
  orderBy,
  startAfter,
  limit,
  getDocs,
  getDoc,
  endBefore,
  limitToLast
} from "firebase/firestore";
import firebase, { firebaseConfig } from "./init-firebase";
import oldfirebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Folder from "./folder";
import * as geofirestore from "geofirestore";
import { JailClass, Jail, WakeSnapshot, matchy } from "./fuffer";
import { standardCatch } from "./components/Forum/New";
import { Pouchredux } from "./widgets/authdb";

const profileDirectory = [
  {
    currentComments: "forumcomments",
    currentCollection: "forum",
    last: "lastPost",
    undo: "undoPost"
  }
  /*{
    currentComments: "ordinancecomments",
    currentCollection: "ordinances",
    last: "lastOrdinance",
    undo: "undoOrdinance"
  },
  {
    oldCollection: "oldBudget",
    oldComments: "budgetcommentsexpired",
    currentComments: "budgetcommentsnew",
    currentCollection: "budget",
    last: "lastBudget",
    undo: "undoBudget"
  },
  {
    oldCollection: "oldCases",
    oldComments: "casecommentexpired",
    currentComments: "casecommentsnew",
    currentCollection: "cases",
    last: "lastCase",
    undo: "undoCase"
  },
  {
    oldCollection: "oldElections",
    oldComments: "electioncommentsexpired",
    currentComments: "electioncommentsnew",
    currentCollection: "elections",
    last: "lastElection",
    undo: "undoElection"
  },
  {
    oldCollection: "budget",
    oldComments: "budgetcommentsnew",
    currentComments: "budgetcommentsexpired",
    currentCollection: "oldBudget",
    last: "lastOldBudget",
    undo: "undoOldBudget"
  },
  {
    oldCollection: "cases",
    oldComments: "casecommentsnew",
    currentComments: "casecommentexpired",
    currentCollection: "oldCases",
    last: "lastOldCase",
    undo: "undoOldCase"
  },
  {
    oldCollection: "elections",
    oldComments: "electioncommentsnew",
    currentComments: "electioncommentsexpired",
    currentCollection: "oldElections",
    last: "lastOldElection",
    undo: "undoOldElection"
  }*/
];
const profileCommentsDirectory = [
  {
    currentComments: "forumcomments",
    commentsSource: "forum",
    last: "lastForumComment",
    undo: "undoForumComment"
  }
  /*{
    currentComments: "ordinancecomments",
    commentsSource: "ordinances",
    last: "lastOrdinanceComment",
    undo: "undoOrdinanceComment"
  },
  {
    currentComments: "budgetcommentsnew",
    commentsSource: "budget",
    last: "lastBudgetComment",
    undo: "undoBudgetComment"
  },
  {
    currentComments: "casecommentsnew",
    commentsSource: "court cases",
    last: "lastCaseComment",
    undo: "undoCaseComment"
  },
  {
    currentComments: "electioncommentsnew",
    commentsSource: "elections",
    last: "lastElectionComment",
    undo: "undoElectionComment"
  },
  {
    currentComments: "budgetcommentsexpired",
    commentsSource: "oldBudget",
    last: "lastOldBudgetComment",
    undo: "undoOldBudgetComment"
  },
  {
    currentComments: "casecommentsexpired",
    commentsSource: "oldCases",
    last: "lastOldCaseComment",
    undo: "undoOldCaseComment"
  },
  {
    currentComments: "electioncommentsexpired",
    commentsSource: "oldElections",
    last: "lastOldElectionComment",
    undo: "undoOldElectionComment"
  }*/
];
const yes = (auth, foo, community) => {
  var isManager =
    foo &&
    auth !== undefined &&
    ((foo.members && foo.members.includes(auth.uid)) ||
      (foo.admin && foo.admin.includes(auth.uid)) ||
      foo.authorId === auth.uid);
  var isOwner =
    auth !== undefined &&
    ((community.members && community.members.includes(auth.uid)) ||
      (community.faculty && community.faculty.includes(auth.uid)) ||
      (community.admin && community.admin.includes(auth.uid)) ||
      community.authorId === auth.uid);
  return isOwner || isManager;
};
export const canIView = (auth, foo, community) =>
  !community ||
  !(community.privateToMembers || (foo && foo.privateToCommunity)) ||
  yes(auth, foo, community);
export const shortHandCollection = (collection) =>
  ["forum", "oldBudget"].includes(collection)
    ? collection
    : collection === "oldCases"
    ? "oldCases"
    : collection === "oldElections"
    ? "oldElection"
    : collection === "elections"
    ? "elections"
    : collection === "cases"
    ? "cases"
    : collection === "budget"
    ? "budget"
    : "forum";
export const shortHandId = (parent) => {
  return shortHandCollection(parent.collection) + parent.id;
};
const reverst = (foo, oldCollection, geo) =>
  geo
    ? geo
        .firestore()
        .collection(foo.collection)
        .doc(foo.id)
        .set(foo)
        .then(() =>
          geo
            .firestore()
            .collection(oldCollection)
            .doc(foo.id)
            .delete()
            .then(() =>
              console.log(
                `document moved to ${foo.collection} collection ` + foo.id
              )
            )
            .catch(standardCatch)
        )
        .catch(standardCatch)
    : setDoc(doc(firestore, foo.collection, foo.id), foo)
        .then(() =>
          deleteDoc(doc(firestore, oldCollection, foo.id))
            .then(() =>
              console.log(
                `document moved to ${foo.collection} collection ` + foo.id
              )
            )
            .catch(standardCatch)
        )
        .catch(standardCatch);

const fillQuery = (commtype) => {
  var coll = "forum";
  var NewcommentsName = false;
  var ExpiredcommentsName = false;
  var filterTime = false;
  var name = "";
  var isForms = false;
  var old = false;
  var last = false;
  var undo = false;
  var lastOld = false;
  var undoOld = false;
  if (["new", "lesson", "show", "game"].includes(commtype)) {
    coll = "forum";
    name = "forumPosts";
    last = "lastCommPost";
    undo = "undoCommPost";
    NewcommentsName = "forumcomments";
  } else if (commtype === "ordinance") {
    coll = "ordinances";
    name = "ordinances";
    last = "lastCommOrd";
    undo = "undoCommOrd";
    NewcommentsName = "ordinancecomments";
  } else if (commtype === "departments") {
    coll = "departments";
    name = "departments";
    last = "lastCommDept";
    undo = "undoCommDept";
  } else if (commtype === "budget") {
    coll = "budget";
    name = "budget";
    filterTime = true;
    old = "oldBudget";
    last = "lastBudget";
    undo = "undoBudget";
    lastOld = "lastOldBudget";
    undoOld = "undoOldBudget";
    NewcommentsName = "budgetcommentsnew";
    ExpiredcommentsName = "budgetcommentsexpired";
  } else if (commtype === "elections") {
    coll = "elections";
    name = "elections";
    filterTime = true;
    old = "oldElections";
    last = "lastElections";
    undo = "undoElections";
    lastOld = "lastOldElections";
    undoOld = "undoOldElections";
    NewcommentsName = "electioncommentsnew";
    ExpiredcommentsName = "electioncommentsexpired";
  } else if (commtype === "cases") {
    coll = "cases";
    filterTime = true;
    name = "cases";
    old = "oldCases";
    last = "lastCases";
    undo = "undoCases";
    lastOld = "lastOldCases";
    undoOld = "undoOldCases";
    NewcommentsName = "casecommentsnew";
    ExpiredcommentsName = "casecommentsexpired";
  } else if (commtype === "classes") {
    coll = "classes";
    filterTime = true;
    name = "classes";
    last = "lastClasses";
    undo = "undoClasses";
    old = "oldClasses";
    lastOld = "lastOldClasses";
    undoOld = "undoOldClasses";
  } else if (commtype === "forms & permits") {
    isForms = true;
    last = "lastCommForm";
    undo = "undoCommForm";
  }
  return {
    coll,
    NewcommentsName,
    ExpiredcommentsName,
    filterTime,
    name,
    isForms,
    old,
    last,
    undo,
    lastOld,
    undoOld
  };
};
const firestore = getFirestore(firebase);
class Data extends React.Component {
  constructor(props) {
    //Why would disability be awarded if you can do what you previously did?
    //Why would disability be awarded if you can do what you previously did? What kind of mental disability other than that of trauma like PTSD is realized to prohibit you from your previous work?
    //Are both PTSD and developmental disabilities or is mental illness disability fraud? Isn't Social Security Disability Insurance based on past work while Supplemental Security Income is based on either the inability to speak or a birth defect?

    super(props);

    const current = new Date().setHours(0, 0, 0, 0);
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
    var tileOnce = {};
    myLabels.forEach((x) => {
      tileOnce[x] = [];
    });
    this.state = {
      ...tileOnce,
      earSideways: !isNaN(props.width) ? props.width - 70 : 0,
      earUpwards: !isNaN(props.appHeight) ? props.appHeight - 70 : 0,
      deletedclasses: [],
      closes: [],
      alivefors: [],
      updatedclasses: [],
      jailclasses: [],
      freedocs: [],
      resnaps: [],
      queriedDate: current,
      current,
      current1: new Date(current + 86400000 * 7),
      range: 604800000,
      //
      lastEntity: "",
      pathname: "/",
      postHeight: 0,
      edmStore: {},
      //
      favoriteCities: [],
      cityapisLoaded: [],
      following: [],
      lastUsers: [],
      lastCommunities: [],
      lastEntities: [],
      lastDroppedPosts: [],
      postsWithChatMetas: {},
      recordedPostChatMetas: [],
      chats: [],
      selfvites: [],
      invites: [],
      recordedDroppedPosts: [],
      droppedPosts: [],
      recordedCommunities: [],
      communities: [],
      recordedCommunityNames: [],
      recordedEntityNames: [],
      recordedEntities: [],
      entities: [],
      //commentedPosts: [],
      recordedPostComments: [],
      gottenUsers: [],
      recordedUsers: [],
      users: [],
      //
      city: "",
      community: null,
      myDocs: [],
      recordedUserNames: [],
      profileClubs: [],
      profileEvents: [],
      profileJobs: [],
      profileRestaurants: [],
      profilePages: [],
      profileVenues: [],
      profileShops: [],
      profileClasses: [],
      profileHousing: [],
      profileDepartments: [],
      profileServices: [],
      forumPosts: [],
      lastProfilePosts: [],
      profilePosts: [],
      event: [],
      together: [],
      commtype: "forum"
    };
    this.handleCommentSet.closer = this.handleCommentSet.bind(this);
    this.handleDropId.closer = this.handleDropId.bind(this);
    //closer - hydrate user/community
    this.hydratePostChatMeta.closer = this.hydratePostChatMeta.bind(this);
    this.hydrateEntity.closer = this.hydrateEntity.bind(this);
    this.hydrateEntityFromName.closer = this.hydrateEntityFromName.bind(this);
    this.hydrateUser.closer = this.hydrateUser.bind(this);
    this.hydrateUserFromUserName.closer = this.hydrateUserFromUserName.bind(
      this
    );
    this.getCommunity.closer = this.getCommunity.bind(this);
    this.getCommunityByName.closer = this.getCommunityByName.bind(this);
    //
    /**
     *
     */
    this.handleCommentSet.promise = this.handleCommentSet.bind(this);
    this.handleDropId.promise = this.handleDropId.bind(this);
    //promise - hydrate user/community
    this.hydratePostChatMeta.meta = this.hydratePostChatMeta.bind(this);
    this.hydrateEntity.entity = this.hydrateEntity.bind(this);
    this.hydrateEntityFromName.entity = this.hydrateEntityFromName.bind(this);
    this.hydrateUser.user = this.hydrateUser.bind(this);
    this.hydrateUserFromUserName.user = this.hydrateUserFromUserName.bind(this);
    this.getCommunity.community = this.getCommunity.bind(this);
    this.getCommunityByName.community = this.getCommunityByName.bind(this);
    //

    this.fuffer = React.createRef();
    this.ear = React.createRef();
    //this.RTCPeerConnection = new RTCPeerConnection();
    //const firestore = firebase.firestore();
    this.GeoFirestore = geofirestore.initializeApp(
      oldfirebase.initializeApp(firebaseConfig).firestore()
    );
    this.recheck = [];
    this.freetime = {};
    this.stopFreedocs = {};
    this.newPostingsClass = {
      lastCommPost: null,
      undoCommPost: null,
      lastCommOrd: null,
      undoCommOrd: null,
      lastCommDept: null,
      undoCommDept: null,
      lastOldBudget: null,
      undoOldBudget: null,
      lastOldElections: null,
      undoOldElections: null,
      lastOldCases: null,
      undoOldCases: null,
      lastOldClasses: null,
      undoOldClasses: null,
      lastCommForm: null,
      undoCommForm: null
    };
    this.newPostingsClassLatest = {
      budget: [],
      oldBudget: [],
      forumPosts: [],
      ordinances: [],
      elections: [],
      oldElections: [],
      cases: [],
      oldCases: [],
      classes: [],
      oldClasses: [],
      departments: []
    };
  }

  fetchEvents = async (location, distance, city, coll) => {
    this.setState({ city, distance, entity: [] });

    const old =
      coll === "event"
        ? "oldEvent" // + coll.charAt(0).toUpperCase() + coll.substring(1)
        : false;

    console.log("fetchEvents", location[0], location[1], coll);
    //Why work for a forced investment?
    //Is occupying Wall Street gothic? Isn't gothica the doppelgänger of vampirism?

    const keepalive = 3600000;
    //for each: foo = {...doc.data(),doc.id}
    //sort && near cannot be true (coexist, orderBy used by geohashing)
    ///Isn't game-made risk better than life?
    //Doesn't defying chances redefine chance?
    //isnt a gambling payout advantage given to often losers
    //Isn't overtime what sports' betting spreads are made of?
    //Isn’t craps a defensive, long term expectation game
    //I didn’t need to take stats at JHU Econ program because I did too well in AB
    //too bad bitch
    //The sunk cost fallacy is a probability fallacy
    //facilitate the cinks for competitions
    //facilitate the sinks for deflation
    //not lidia sales thos
    //no that's a labor contract
    //wawoweba
    //I want fedcash to do list!
    const event = ["event", "job", "housing"].includes(coll);
    const query = this.GeoFirestore.collection(
      coll === "oldEvent" ? coll : event ? "event" : "entity"
    )
      .where("collection", "==", coll)
      .near({
        center: new oldfirebase.firestore.GeoPoint(location[1], location[0]),
        radius: distance
      });
    //console.log("HHEEEEELP");
    // Get query (as Promise)
    query
      .get()
      .then((value) => {
        //console.log("success");
        if (value.docs.length === 0)
          return console.log("empty fetchEvents", coll);
        this.setState({
          event: value.docs
            .map((doc) => {
              return doc.exists && { ...doc.data(), id: doc.id };
            })
            .filter((x) => x)
        });
        // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      })
      .catch((e) => console.log(e, "event"));
    /*const jailclass = {
      uuid: "fetchEvents", //forumPosts
      docsOutputLabel: "event",
      stateAfterLabel: "lastCityPost",
      endBeforeLabel: "undoCityPost",
      state: {
        //events/entities, not comments
        oldCollection: "oldEvent",
        currentCollection: "event" // "entity"
      },
      //enjoy this. human action ("peanuts")
      snapshotQuery: /*["event", "job", "housing"].includes(coll)
        ? this.GeoFirestore.collection("entity")
            .where("collection", "==", coll)
            .where("date", ">", new Date())
        :* / this.GeoFirestore.collection(
        "entity"
      ).where("collection", "==", coll), //optional canIncludes()?
      //where("date",">",new Date())
      keepalive,
      sort: null, //sort firestore orderBy { order: "time", by: "desc" }
      near: {
        center: new evilfirebase.firestore.GeoPoint(location[1], location[0]),
        radius: distance
      }, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };
    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "fetchEvents"),
        jailclass
      ]
    });*/
  }; //I'm done boycotting credit. Just going to make tax spoof prep software

  fetchCommEvents = async (community, coll) => {
    this.setState({
      entity: [],
      event: [],
      together: [],
      forumPosts: []
    });
    const event = ["event", "job", "housing"].includes(coll);
    onSnapshot(
      query(
        collection(
          firestore,
          coll === "oldEvent" ? coll : event ? "event" : "entity"
        ),
        where("collection", "==", coll),
        where("communityId", "==", community.id)
      ),
      (querySnapshot) => {
        let entity = [];
        querySnapshot.docs.forEach((doc) => {
          if (doc.exists()) {
            entity.push({ ...doc.data(), id: doc.id });
          }
        });
        if (entity.length === querySnapshot.docs.length) {
          //console.log(entity);
          this.setState({ entity });
        }
      }
    );
  };
  fetchForum = (
    city = this.state.city,
    commtype = this.state.commtype,
    noLoad
  ) => {
    this.setState({
      ...this.newPostingsClass,
      community: null,
      city,
      commtype,
      ...this.newPostingsClassLatest
    });
    !noLoad && this.props.loadGreenBlue("forum fetch for " + city);
    console.log(
      noLoad
        ? "just gonna send thaat " + city
        : "forum fetch for " + city + " ~~loadGreenBlue"
    );

    const keepalive = 3600000;
    //for each: foo = {...doc.data(),doc.id}
    //sort && near cannot be true (coexist, orderBy used by geohashing)
    const jailclass = {
      uuid: "fetchForum", //forumPosts
      docsOutputLabel: "forumPosts",
      stateAfterLabel: "lastCityPost",
      endBeforeLabel: "undoCityPost",
      state: { currentComments: "forumcomments" },
      //
      snapshotQuery: [
        collection(firestore, "forum"),
        where("city", "==", city)
        //where("commtype", "==", this.state.commtype)
      ], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
      //​Do the 8% without health insurance in the U.S. choose not to get it?
    };
    let { jailclasses } = this.state;
    //console.log("jailclasss", matchy(jailclass.snapshotQuery));
    let j = [
      ...jailclasses.filter(
        (x) =>
          // x.uuid !== "fetchForum" &&
          matchy(jailclass.snapshotQuery) !== matchy(x.snapshotQuery)
      ),
      jailclass
    ];

    this.setState({ currentJail: jailclass, jailclasses: j }, () => {
      //console.log("j", this.state.jailclasses);
      this.prepPagination(); //spam over fraud; it was significant and expected
    });
  }; //20% to go public lol... fiduciary or wha. white label
  //promises you bet. coralle principal and interest inventory or scale, marks and work fors
  //payable flatten liabiity
  //flatten liable payables of stolen purchases
  //treasury has collateral. loan advances (reverse foreclosure

  //monthly pilot reward or duct schedule
  //cut the deficits it's not a mistake, entrepreneur before business income)
  componentWillUnmount = () => {
    /*this.state.freedocs.map(
      (x) =>
        this.stopFreedocs[x.uuid] && clearTimeout(this.stopFreedocs[x.uuid])
    );*/

    this.stopFreedocs && clearTimeout(this.stopFreedocs);
    this.state.freedocs.map(
      (x) => this.freetime[x.id] && clearTimeout(this.freetime[x.id])
    );
    this.recheck && this.recheck.map((x) => clearInterval(x));
    clearTimeout(this.easy);
    clearInterval(this.count);
    clearTimeout(this.hoverear);
    clearTimeout(this.gonnaOpen);
    clearTimeout(this.slowPager);
    clearInterval(this.paused);
    this.state.gottenUsers.map(
      (userId) => this[userId] && clearInterval(this[userId])
    );
    this.handleCommentSet.closer();
    this.handleDropId.closer();
    this.hydratePostChatMeta.closer();
    this.hydrateEntity.closer();
    this.hydrateEntityFromName.closer();
    this.hydrateUser.closer();
    this.hydrateUserFromUserName.closer();
    this.getCommunity.closer();
    this.getCommunityByName.closer();
  };
  fetchCommForum = async (
    community = this.state.community,
    commtype = this.state.commtype
  ) => {
    const {
      coll,
      NewcommentsName,
      ExpiredcommentsName,
      filterTime,
      name,
      isForms,
      old,
      last,
      undo
      //lastOld,
      //undoOld
    } = fillQuery(commtype);
    this.setState({ forumPosts: [] });
    var message = "fetching " + coll + " for " + community.message;
    this.props.loadGreenBlue(message);
    console.log("fetchCommForum", commtype);
    const keepalive = 3600000;
    const jailclass1 = {
      uuid: "fetchCommForum", //forumPosts
      docsOutputLabel: "forumPosts",
      stateAfterLabel: "lastCommPost",
      endBeforeLabel: "undoCommPost",
      state: {
        currentComments: NewcommentsName,
        oldComments: ExpiredcommentsName,
        oldCollection: "oldForum",
        currentCollection: "forum"
      },
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: [
        collection(firestore, "forum"),
        commtype === "forum"
          ? where("commtype", "in", [
              "new",
              "class",
              "department",
              "election",
              "case",
              "ordinance"
            ])
          : where("commtype", "==", commtype),
        //where("collection", "==", commtype), //coll
        where("communityId", "==", community.id)
      ], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommForum"),
        jailclass1
      ]
    });
  };
  handleTooltipMove = (ev) => {
    if (this.state.holdingEar) {
      this.paused && clearInterval(this.paused);
      this.paused = setInterval(() => {
        this.setState({ holdingEar: false, counterEar: null }, () => {
          clearTimeout(this.gonnaOpen);
          this.count && clearInterval(this.count);
        });
      }, 300);
    } else
      this.setState({ holdingEar: true }, () => {
        var count = 3;
        this.count && clearInterval(this.count);
        this.count = setInterval(() => {
          count = count - 1;
          this.setState({ counterEar: count });
          //console.log("opening in: " + count);
        }, 1000);
        this.gonnaOpen = setTimeout(
          () =>
            this.setState({ openAnyway: true }, () =>
              clearInterval(this.count)
            ),
          3300
        );
      });
    var left = ev.touches ? ev.touches[0].clientX : ev.pageX;
    var top = ev.touches ? ev.touches[0].clientY : ev.pageY;
    const dx = Math.abs(this.state.earSideways - left) > 5;
    const dy = Math.abs(this.state.earUpwards - top) > 5;
    if (dx || dy) {
      this.easy && clearTimeout(this.easy);
      //this.gonnaOpen && clearTimeout(this.gonnaOpen);
      this.easy = setTimeout(() => {
        this.setState({
          earSideways: left,
          earUpwards: top
        });
      }, 20);
      //this redundancy actually gives buffering without animation framing et al
    }
  };
  resetTooltip = (ev) =>
    this.setState(
      { holdingEar: false, counterEar: null /*openAnyway: false*/ },
      () => {
        //clearTimeout(this.debounce);
        clearTimeout(this.gonnaOpen);
        this.count && clearInterval(this.count);
        const e = ev.touches ? ev.touches[0] : ev;
        const moveLongitudially = (y) => this.setState(y);
        const moveLaterally = (x) => this.setState(x);

        const sd = e.pageX;
        const up = e.pageY;
        const offScreenX = (pX, reset) =>
          moveLaterally({
            earSideways:
              reset || this.props.width * 0.5 < pX ? this.props.width - 70 : 20
          });

        const offScreenRight = this.props.width < sd;
        const onScreenTop = this.props.appHeight * 0.5 > up;
        if (onScreenTop) {
          return offScreenX(sd); //if then return
        } else offScreenX(sd, offScreenRight);

        const onScreenLeft = this.props.width * 0.5 > sd;
        const offScreenBottom = this.props.appHeight < up;
        const offScreenY = (pY, reset) =>
          moveLongitudially({
            earUpwards:
              reset || this.props.appHeight * 0.5 < pY
                ? this.props.appHeight - 70
                : 20
          });
        if (onScreenLeft) {
          offScreenY(up);
        } else offScreenY(up, offScreenBottom);
        return null; /*offScreenRight
      ? offScreenX(sd, true)
      : offScreenBottom
      ? offScreenY(up, true)
      : null;*/
      }
    );
  hydrateCase = async (foo) => {
    var ma = {};
    [
      ("judges", "prosecution", "defense", "jury", "testimonies", "consults")
    ].map(async (m) => {
      ma[m] =
        foo[m] &&
        (await Promise.all(
          foo[m].map(async (requestId) => {
            var perp = await this.hydrateUser(requestId).user();
            return perp && JSON.parse(perp);
          })
        ));
    });
    return { ...ma };
  };
  handleCommSnapshot = async (hp, coll, isDropped) =>
    await Promise.all(
      hp.map(async (f, i) => {
        var foo = { ...hp[i] };
        return await new Promise(async (resolve) => {
          const videos = await this.hydratePostChatMeta(foo).meta();
          foo.videos && JSON.parse(videos);
          if (["election"].includes(foo.commtype)) {
            const hydrateElection = async (foo) => {
              var candidateRequestsProfiled =
                foo.candidateRequests &&
                (await Promise.all(
                  foo.candidateRequests.map(async (requestId) => {
                    var perp = await this.hydrateUser(requestId).user();
                    return perp && JSON.parse(perp);
                  })
                ));

              var candidatesProfiled =
                foo.candidates &&
                (await Promise.all(
                  foo.candidates.map(async (requestId) => {
                    var perp = await this.hydrateUser(requestId).user();
                    return perp && JSON.parse(perp);
                  })
                ));
              return { candidateRequestsProfiled, candidatesProfiled };
            };
            const {
              candidatesProfiled,
              candidateRequestsProfiled
            } = await hydrateElection(foo);
            foo.candidatesProfiled = candidatesProfiled;
            foo.candidateRequestsProfiled = candidateRequestsProfiled;
          } else if (["case"].includes(coll)) {
            const {
              prosecution,
              defense,
              jury,
              testimonies,
              consults,
              judges
            } = await this.hydrateCase(foo);
            foo.prosecution = prosecution;
            foo.defense = defense;
            foo.jury = jury;
            foo.testimonies = testimonies;
            foo.consults = consults;
            foo.judges = judges;
          }
          if (!isDropped && foo.droppedId) {
            console.log(foo.id + " has dropped " + foo.droppedId);
            const droppedPost = await this.handleDropId(
              foo.droppedId
            ).promise();
            if (droppedPost) {
              foo.droppedPost = JSON.parse(droppedPost);
            }
          }
          const community =
            foo.communityId &&
            (await this.getCommunity(foo.communityId).community());
          foo.community = community && JSON.parse(community);
          const entity =
            foo.entityId &&
            (await this.hydrateEntity(foo.entityId, foo.entityType).entity());
          foo.entity = entity && JSON.parse(entity);
          const author = await this.hydrateUser(foo.authorId).user();
          foo.author = author && JSON.parse(author);
          if (
            foo.author &&
            (isDropped || !foo.droppedId || foo.droppedPost) &&
            (!foo.communityId || foo.community) &&
            (!foo.entityId || foo.entity)
          ) {
            resolve(foo);
          }
        });
      })
    );

  lastGlobalForum = (globall, commtype) => {
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map((x) => {
      return onSnapshot(
        query(
          collection(firestore, "forum"),
          where("authorId", "==", x),
          where("newLessonShow", "==", commtype), //collection
          orderBy("time", "desc"),
          startAfter(this.state.lastGlobalPost),
          limit(14)
        ),
        async (querySnapshot) => {
          let globalForumPosts = [];
          let q = 0;
          let allIssues = [];
          querySnapshot.docs.forEach(async (doc) => {
            q++;
            if (doc.exists()) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.collection = "forum";
              globalForumPosts.push(foo);
            }
          });
          if (querySnapshot.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);
            var lastGlobalPost =
              querySnapshot.docs[querySnapshot.docs.length - 1];
            var undoGlobalPost = querySnapshot.docs[0];
            this.setState({
              issues,
              globalForumPosts,
              lastGlobalPost,
              undoGlobalPost
            });
          }
        },
        standardCatch
      );
    });
  };

  undoGlobalForum = (globall, commtype) => {
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let globalForumPosts = [];
      let allIssues = [];
      let q = 0;
      const keepalive = 3600000;
      const free = await Jail(
        //for each: foo = {...doc.data(),doc.id}
        [
          collection(firestore, "forum"),
          where("authorId", "==", x),
          where("newLessonShow", "==", commtype)
        ], //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        14, //limit
        null, //startAfter
        null //endBefore
      );

      return this.setState(
        {
          lastGlobalPost: free.startAfter,
          undoGlobalPost: free.endBefore
        },
        async () => {
          free.docs.forEach(async (foo) => {
            q++;

            foo && globalForumPosts.push(foo);
          });
          if (free.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);
            this.setState({
              issues,
              globalForumPosts
            });
          } else return null;
        },
        standardCatch
      );
    });
  };
  getGlobalForum = async (globall, commtype) => {
    (globall
      ? [""]
      : this.props.user !== undefined && this.state.following
      ? this.state.following
      : []
    ).map(async (x) => {
      let globalForumPosts = [];
      let allIssues = [];
      let q = 0;
      const keepalive = 3600000;
      const free = await Jail(
        //for each: foo = {...doc.data(),doc.id}
        [
          collection(firestore, "forum"),
          where("authorId", "==", x),
          where("newLessonShow", "==", commtype)
        ], //optional canIncludes()?
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        14, //limit
        null, //startAfter
        null //endBefore
      );
      return this.setState(
        {
          lastGlobalPost: free.startAfter,
          undoGlobalPost: free.endBefore
        },
        async () => {
          free.docs.forEach(async (foo) => {
            q++;

            foo && globalForumPosts.push(foo);
          });
          if (free.docs.length === q) {
            globalForumPosts = await this.handleCommSnapshot(
              globalForumPosts,
              "forum"
            );
            globalForumPosts.forEach(async (foo) => {
              foo.currentComments = "forumcomments";
              foo.issue && allIssues.push(foo.issue);
              if (foo.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                foo.droppedPost = postt && JSON.parse(postt);
              }
            });
            var issues = new Set(allIssues);

            this.setState({
              issues,
              globalForumPosts
            });
          } else return null;
        }
      );
    });
    this.props.auth !== undefined && this.setState({ gotGlobe: true });
  };
  handleProfileCommentSnapshot = (comments) =>
    Promise.all(
      comments.map(async (foo) => {
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);

        return foo.author && foo;
      })
    );
  getDrop = async (id) => {
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      var drop = p && JSON.parse(p);
      if (drop) {
        var buff = await this.handleCommSnapshot([drop], drop.collection);
        if (buff) {
          drop = buff[0];
        }
        if (drop.droppedId) {
          var postt = await this.handleDropId(drop.droppedId).promise();
          drop.droppedPost = postt && JSON.parse(postt);
        }
        if (
          drop.author &&
          (!drop.communityId || drop.community) &&
          (!drop.entityId || drop.entity)
        ) {
          this.props.unloadGreenBlue();
          return drop && drop;
        }
      }
    }
  };
  dropId = async (droppedId, parent) => {
    if (droppedId) {
      this.props.loadGreenBlue("attaching rebeat...");
      if (droppedId.includes(".") || droppedId.includes("/"))
        return window.alert("invalid id (three dots, bottom-right");
      var post = await this.handleDropId(droppedId).promise();
      var droppedPost = post && JSON.parse(post);
      droppedPost &&
        updateDoc(doc(firestore, parent.collection, parent.id), {
          message: parent.message === "" ? droppedId : parent.message,
          droppedId
        })
          .then(() => {
            this.props.unloadGreenBlue();
            window.alert(droppedPost.message + " on " + parent.message);
          })
          .catch(standardCatch);
    }
  };
  timeFilterJobs = (e) => {
    let dol = [];
    e.map((ev) => {
      if (
        new Date(ev.datel).setHours(0, 0, 0, 0) > this.state.queriedDate &&
        new Date(ev.datel).setHours(0, 0, 0, 0) <
          this.state.queriedDate + this.state.range
      ) {
        dol.push(ev);
      }
      dol.sort((a, b) => b.datel - a.datel);
      return this.setState({ jobs: dol });
    });
  };
  timeFilterEvents = (a) => {
    const { event: events } = this.state;
    if (!events) return console.log("events timeFilterEvents", events);
    let dol = [];
    events.map((ev) => {
      if (
        new Date(ev.datel).setHours(0, 0, 0, 0) > this.state.queriedDate &&
        new Date(ev.datel).setHours(0, 0, 0, 0) <
          this.state.queriedDate + this.state.range
      ) {
        dol.push(ev);
      }

      return null;
    });
    this.setState({
      together: a ? [...a, ...dol].sort((a, b) => b.datel - a.datel) : dol
    });
  };

  againBackDocs = () =>
    this.state.againDoc &&
    onSnapshot(
      query(
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid),
        where("gsUrl", ">", ""),
        orderBy("gsUrl"),
        orderBy("time", "desc"),
        startAfter(this.state.againDoc),
        limit(20)
      ),
      async (querySnapshot) => {
        let p = 0;
        let myDocs = [];
        querySnapshot.docs.forEach(async (doc) => {
          p++;
          if (doc.exists()) {
            var foo = doc.data();
            foo.id = doc.id;

            myDocs.push(foo);
          }
        });
        if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
          myDocs = await this.handleChatSnapshot(myDocs);
          var lastDoc = myDocs[myDocs.length - 1];
          var againDoc = myDocs[0];
          this.setState({
            myDocs,
            lastDoc: lastDoc ? lastDoc : null,
            againDoc: againDoc ? againDoc : null
          });
        }
      },
      standardCatch
    );

  moreDocs = () =>
    this.state.lastDoc &&
    onSnapshot(
      query(
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid),
        where("gsUrl", ">", ""),
        orderBy("gsUrl"),
        orderBy("time", "desc"),
        startAfter(this.state.lastDoc),
        limit(20)
      ),
      async (querySnapshot) => {
        let p = 0;
        let myDocs = [];
        querySnapshot.docs.forEach(async (doc) => {
          p++;
          if (doc.exists()) {
            var foo = doc.data();
            foo.id = doc.id;

            myDocs.push(foo);
          }
        });
        if (p === querySnapshot.docs.length && this.state.myDocs !== myDocs) {
          myDocs = await this.handleChatSnapshot(myDocs);
          var lastDoc = myDocs[myDocs.length - 1];
          var againDoc = myDocs[0];
          this.setState({
            myDocs,
            lastDoc: lastDoc ? lastDoc : null,
            againDoc: againDoc ? againDoc : null
          });
        }
      },
      standardCatch
    );

  handleChatSnapshot = async (chats) =>
    Promise.all(
      chats.map(async (foo) => {
        foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
        var author = await this.hydrateUser(foo.authorId).user();
        foo.author = author && JSON.parse(author);
        return foo;
      })
    );
  hydrateUsers = async (users) =>
    await Promise.all(
      users.map(async (recipientId) => {
        var recipient = await this.hydrateUser(recipientId).user();
        return recipient && JSON.parse(recipient);
      })
    );
  againBackMessages = () => {
    this.state.againMessage &&
      onSnapshot(
        query(
          collection(firestore, "chats"),
          where("recipients", "array-contains", this.props.auth.uid),
          orderBy("time", "desc"),
          startAfter(this.state.againMessage),
          limit(33)
        ),
        (querySnapshot) => {
          let p = 0;
          let chats = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists()) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              chats.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.chats !== chats) {
            var lastMessage = chats[chats.length - 1];
            var againMessage = chats[0];
            this.setState({
              chats,
              lastMessage: lastMessage ? lastMessage : null,
              againMessage: againMessage ? againMessage : null
            });
          }
        },
        standardCatch
      );
  };
  moreMessages = () => {
    this.state.lastMessage &&
      onSnapshot(
        query(
          collection(firestore, "chats"),
          where("recipients", "array-contains", this.props.auth.uid),
          orderBy("time", "desc"),
          startAfter(this.state.lastMessage),
          limit(33)
        ),
        (querySnapshot) => {
          let p = 0;
          let chats = [];
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists()) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.recipientsProfiled = await this.hydrateUsers(foo.recipients);
              var entity =
                foo.entityId &&
                (await this.hydrateEntity(
                  foo.entityId,
                  foo.entityType
                ).entity());
              foo.entity = entity && JSON.parse(entity);
              var author = await this.hydrateUser(foo.authorId).user();
              foo.author = author && JSON.parse(author);

              chats.push(foo);
            }
          });
          if (p === querySnapshot.docs.length && this.state.chats !== chats) {
            var lastMessage = chats[chats.length - 1];
            var againMessage = chats[0];
            this.setState({
              chats,
              lastMessage: lastMessage ? lastMessage : null,
              againMessage: againMessage ? againMessage : null
            });
          }
        },
        standardCatch
      );
  };
  componentDidMount = async () => {
    /*onSnapshot(
      query(
        collection(firestore, "forumcomments")
        // limit(10)
        //where("forumpostId", "==", post.id),
        //orderBy("time", "desc")
      ),
      async (querySnapshot) => {
        if (querySnapshot.empty) {
        } else {
          let comments = [];
          let p = 0;
          querySnapshot.docs.map(async (dc) => {
            p++;
            if (dc.exists()) {
              var foo = dc.data();
              foo.id = dc.id;
              /*!foo.forumpostId.startsWith("forum") &&
                updateDoc(doc(firestore, "forumcomments", foo.id), {
                  forumpostId: "forum" + foo.forumpostId
                })
                  .then((e) => console.log("ok"))
                  .catch(standardCatch);* /
            }
          });
        }
      }
    );*/
  };
  componentDidUpdate = async (prevProps) => {
    const { entityPosts, profilePosts } = this.state;

    if (entityPosts !== this.state.lastEntityPosts)
      this.setState({
        lastEntityPosts: entityPosts,
        entityPosts: entityPosts.sort(
          (a, b) =>
            (b.date ? b.date : b.time).seconds -
            (a.date ? a.date : a.time).seconds
        )
      });

    /*if (functions !== this.state.functions) {
      const itobj = functions.map((x) => {
        return { ["docs" + x.id]: window.fuffer.dbFUFFER[x.id] };
      });
      this.setState({ functions, ...itobj }, () => {
        functions.map((x) => {
          return console.log(this.state["docs" + x.id]);
        });
      });
    }*/
    if (this.props.user !== undefined && this.props.user !== prevProps.user) {
      if (this.props.user.faveComm) {
        let favComm = [...this.props.user.faveComm];
        Promise.all(
          favComm.map(async (x) => {
            var community = await this.getCommunity(x).community();

            return community && JSON.parse(community);
          })
        )
          .then((favComm) => {
            var favcit = this.props.user.favoriteCities
              ? this.props.user.favoriteCities
              : [];
            var favoriteCities = favcit.concat(favComm);
            this.setState({ favoriteCities });
          })
          .catch((e) => console.log(e));
        this.props.user.following &&
          Promise.all(
            this.props.user.following.map(async (x) => {
              var user = await this.hydrateUser(x).user();
              return user && JSON.parse(user);
            })
          ).then((following) => {
            this.setState({ following });
          });
      }
    }
    // reset, update privateKeysEncryptedByPublicKeys
    // device identifier copy
    /*if (
      this.state.users !== this.state.lastUsers ||
      this.state.communities !== this.state.lastCommunities ||
      this.state.postsWithChatMetas !== this.state.lastPostsWithChatMetas
    ) {
      this.setState(
        {
          lastUsers: this.state.users,
          lastCommunities: this.state.communities,
          lastPostsWithChatMetas: this.state.postsWithChatMetas
        },
        () => {
          let set = {};
          [
            "forumPosts",
            "classes",
            "departments",
            ...profileDirectory.map((g) => g.currentCollection),
            "profilePosts"
          ].forEach((g) => {
            if (this.props[g]) {
              set[g] = [];
              let i = 0;
              this.props[g].forEach((y) => {
                i++;
                var x = { ...y };
                var community = this.state.communities.find(
                  (a) => a.id === x.communityId
                );
                x.community = community ? community : x.community;
                var videos = this.state.postsWithChatMetas[shortHandId(x)];

                x.videos = videos ? videos : x.videos;
                var user = this.state.users.find((a) => a.id === x.authorId);
                x.author = user ? user : x.author;

                set[g].push(x);
              });
              if (this.props[g].length === i) {
                if (!this.state.isProfile && this.props.community) {
                  var community = this.state.communities.find(
                    (x) => x.id === this.props.community.id
                  );
                  this.setState({ community });
                }
                 this.setState({ [g]: set[g] });
              }
            }
          });
        }
      );
    }*/
    /*if (this.state.jailclasses !== this.state.lastjailclasses) {
      this.setState({ lastjailclasses: this.state.jailclasses }, () => {});
      console.log("jailclasses", this.state.jailclasses);
      this.setState({
        lastPost: profileDirectory.find((type) => this.state[type.last]),
        undoPost: profileDirectory.find((type) => this.state[type.undo]),
        lastPostOfComment: profileDirectory.find(
          (type) => this.state[type.last]
        ),
        undoPostOfComment: profileDirectory.find(
          (type) => this.state[type.undo]
        )
      });
    }*/
  };
  prepPagination = () => {
    this.setState({
      lastPost: profileDirectory.find((type) => this.state[type.last]),
      undoPost: profileDirectory.find((type) => this.state[type.undo]),
      lastPostOfComment: profileDirectory.find((type) => this.state[type.last]),
      undoPostOfComment: profileDirectory.find((type) => this.state[type.undo])
    });
  };
  hydratePostChatMeta = (parent) => {
    let fine = true;
    const { recordedPostChatMetas } = this.state;
    return {
      meta: async () => {
        const shortId = shortHandId(parent);
        if (!recordedPostChatMetas.includes(shortId)) {
          this.setState({
            recordedPostChatMetas: [...recordedPostChatMetas, shortId]
          });
          var close = onSnapshot(
            query(
              collection(firestore, "chatMeta"),
              where("threadId", "==", shortId)
            ),
            (querySnapshot) => {
              var videos = [];
              var existing = [];

              querySnapshot.docs.forEach((doc) => {
                if (doc.exists()) {
                  var newVideo = doc.data();
                  newVideo.id = doc.id;
                  newVideo.folder = newVideo.folder ? newVideo.folder : "*";
                  existing.push(newVideo);
                }
              });
              const rested = this.state.postsWithChatMetas[shortId];
              var rest = rested ? Object.values(rested) : [];
              existing.forEach(
                (newVideo) => (rest = rest.filter((x) => x.id !== newVideo.id))
              );
              videos = [...rest, ...existing];
              var copy = { ...this.state.postsWithChatMetas };
              delete copy[shortId];
              this.setState({
                postsWithChatMetas: { ...copy, [shortId]: videos }
              });
            },
            (e) => {
              console.log("chatMeta", e.message);
            }
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!parent) {
              reject(shortId);
            }
            getDocs(
              query(
                collection(firestore, "chatMeta"),
                where("threadId", "==", shortId)
              )
            )
              .then((querySnapshot) => {
                var videos = [];
                var existing = [];

                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists()) {
                    var newVideo = doc.data();
                    newVideo.id = doc.id;
                    newVideo.folder = newVideo.folder ? newVideo.folder : "*";
                    existing.push(newVideo);
                  }
                });
                const rested = this.state.postsWithChatMetas[shortId];
                var rest = rested ? Object.values(rested) : [];
                existing.forEach(
                  (newVideo) =>
                    (rest = rest.filter((x) => x.id !== newVideo.id))
                );
                videos = [...rest, ...existing];
                var copy = { ...this.state.postsWithChatMetas };
                delete copy[shortId];
                this.setState(
                  { postsWithChatMetas: { ...copy, [shortId]: videos } },
                  () => resolve(JSON.stringify(videos))
                );
              })
              .catch((e) => {
                console.log("chatMeta", e.message);
                return resolve("[]");
              });
            if (!parent) {
              close();
            }
          });
        } else {
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            //const tmt = setInterval(() => {
            var videos = this.state.postsWithChatMetas[shortId];
            if (videos) {
              //clearInterval(tmt);
              resolve(JSON.stringify(videos));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateUserFromUserName = (profileUserName) => {
    let fine = true;
    const { recordedUserNames } = this.state;
    return {
      user: async () => {
        if (!recordedUserNames.includes(profileUserName)) {
          this.setState({
            recordedUserNames: [...recordedUserNames, profileUserName]
          });
          var close = onSnapshot(
            query(
              collection(firestore, "users"),
              where("username", "==", profileUserName)
            ),
            (querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists()) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  var users = [...rest, user];
                  this.setState({ users });
                }
              });
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDocs(
              query(
                collection(firestore, "users"),
                where("username", "==", profileUserName)
              )
            )
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  resolve("{}");
                } else {
                  querySnapshot.docs.forEach(async (doc) => {
                    if (doc.exists()) {
                      var user = doc.data();
                      user.id = doc.id;

                      var skills = [
                        ...(user.experiences ? user.experiences : []),
                        ...(user.education ? user.education : []),
                        ...(user.hobbies ? user.hobbies : [])
                      ];
                      user.skills = skills.map(
                        (x) => x.charAt(0).toUpperCase() + x.slice(1)
                      );

                      var rest = this.state.users.filter(
                        (x) => x.id !== user.id
                      );
                      this.setState({ users: [...rest, user] });
                      return resolve(JSON.stringify(user));
                    } else return resolve("{}");
                  });
                }
              })
              .catch((e) => {
                console.log(e.message);
                return resolve(null);
              });
            if (!profileUserName) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            console.log("again profile", profileUserName);
            //const tmt = setInterval(() => {
            var user = this.state.users.find(
              (x) => x.username === profileUserName
            );

            if (user) {
              console.log("again", user);
              // clearInterval(tmt);
              resolve(JSON.stringify(user));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };

  hydrateUser = (userId) => {
    let fine = true;
    const { recordedUsers } = this.state;

    return {
      user: async () => {
        if (!userId) return null;
        if (!recordedUsers.includes(userId)) {
          this.setState({
            recordedUsers: [...recordedUsers, userId]
          });
          var close = onSnapshot(
            doc(firestore, "users", userId),
            async (doc) => {
              if (!userId) close();
              if (doc.exists()) {
                var user = doc.data();
                user.id = doc.id;

                var skills = [
                  ...(user.experiences ? user.experiences : []),
                  ...(user.education ? user.education : []),
                  ...(user.hobbies ? user.hobbies : [])
                ];
                user.skills = skills.map(
                  (x) => x.charAt(0).toUpperCase() + x.slice(1)
                );

                var rest = this.state.users.filter((x) => x.id !== user.id);

                this.setState({ users: [...rest, user] });
              }
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDoc(doc(firestore, "users", userId))
              .then(async (doc) => {
                if (doc.exists()) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  this.setState({ users: [...rest, user] });
                  return user && resolve(JSON.stringify(user));
                } else return resolve("{}");
              })
              .catch(standardCatch);
            if (!userId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);

            //const tmt = setInterval(() => {
            var user = this.state.users.find((x) => x.id === userId);

            if (user) {
              //clearInterval(tmt);
              resolve(JSON.stringify(user));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  getInvites = async () => {
    let invites = [];
    let p = 0;
    const keepalive = 3600000;
    const free = await Jail(
      //for each: foo = {...doc.data(),doc.id}
      [
        collection(firestore, "chats"),
        where("recipients", "array-contains", this.props.auth.uid),
        where("date", ">=", new Date().getTime())
      ], //optional canIncludes()?
      keepalive,
      { order: "date", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    free.docs.forEach(async (foo) => {
      p++;
      var author = await this.hydrateUser(foo.authorId).user();
      foo.author = author && JSON.parse(author);

      invites.push(foo);
    });
    if (p === free.docs.length) {
      this.setState({
        invites
      });
    }
    let selfvites = [];
    let pp = 0;
    const free1 = await Jail(
      //for each: foo = {...doc.data(),doc.id}
      [
        collection(firestore, "chats"),
        where("recipients", "==", [this.props.auth.uid]),
        where("date", ">=", new Date().getTime())
      ], //optional canIncludes()?
      keepalive,
      { order: "date", by: "desc" }, //sort gsURL
      null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      20, //limit
      null, //startAfter
      null //endBefore
    );
    free.docs.forEach(async (foo) => {
      pp++;
      var author = await this.hydrateUser(foo.authorId).user();
      foo.author = author && JSON.parse(author);

      selfvites.push(foo);
    });
    if (pp === free1.docs.length) {
      /*var selfvites = f.filter(
              (x) => x.date && !Object.keys(this.state.notes).includes(x.id)
            );*/
      this.setState({
        selfvites
      });
    }
  };
  hydrateEntityFromName = (
    entityCollection,
    nameUnparsed,
    communityNameUnparsed
  ) => {
    let fine = true;
    const { recordedEntityNames } = this.state;
    return {
      entity: async () => {
        var communityName = communityNameUnparsed.replace(/_/g, " ");
        var name = nameUnparsed.replace(/_/g, " ");
        if (!recordedEntityNames.includes(name + communityNameUnparsed)) {
          this.setState({
            recordedEntityNames: [
              ...recordedEntityNames,
              name + communityNameUnparsed
            ]
          });
          const eventTypeChosen = ["housing", "event", "job", "plan"].includes(
            entityCollection
          );
          var close = onSnapshot(
            query(
              collection(eventTypeChosen ? "event" : "entity"),
              where("collection", "==", entityCollection),
              where("messageLower", "==", name.toLowerCase())
            ),
            (querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists()) {
                  var entity = doc.data();
                  entity.id = doc.id;
                  entity.collection = entityCollection;
                  var community =
                    entity.communityId &&
                    (await this.getCommunity(entity.communityId).community());
                  entity.community = community && JSON.parse(community);
                  var adminArray = entity.admin ? entity.admin : [];
                  var memberArray = entity.members ? entity.members : [];
                  var recipientArray = [
                    entity.authorId,
                    ...adminArray,
                    ...memberArray
                  ];
                  entity.recipients = Promise.all(
                    recipientArray.map(async (recipientId) => {
                      var recipient = await this.hydrateUser(
                        recipientId
                      ).user();
                      return recipient && JSON.parse(recipient);
                    })
                  );
                  if (entity.recipients) {
                    var rest = this.state.entities.filter(
                      (x) =>
                        x.id !== entity.id && x.entityType !== entity.entityType
                    );
                    var entities = [...rest, entity];
                    this.setState({ entities });
                  }
                }
              });
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDocs(
              query(
                collection(eventTypeChosen ? "event" : "entity"),
                where("collection", "==", entityCollection),
                where("messageLower", "==", name.toLowerCase())
              )
            )
              .then((querySnapshot) => {
                querySnapshot.docs.forEach(async (doc) => {
                  if (doc.exists()) {
                    var entity = doc.data();
                    entity.id = doc.id;
                    entity.collection = entityCollection;
                    var community =
                      entity.communityId &&
                      (await this.getCommunity(entity.communityId).community());
                    entity.community = community && JSON.parse(community);
                    var adminArray = entity.admin ? entity.admin : [];
                    var memberArray = entity.members ? entity.members : [];
                    var recipientArray = [
                      entity.authorId,
                      ...adminArray,
                      ...memberArray
                    ];
                    entity.recipients = Promise.all(
                      recipientArray.map(async (recipientId) => {
                        var recipient = await this.hydrateUser(
                          recipientId
                        ).user();
                        return recipient && JSON.parse(recipient);
                      })
                    );
                    if (entity.recipients) {
                      var rest = this.state.entities.filter(
                        (x) =>
                          x.id !== entity.id &&
                          x.collection !== entity.collection
                      );

                      this.setState({ entities: [...rest, entity] });
                      return entity && resolve(JSON.stringify(entity));
                    }
                  } else return resolve("{}");
                });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!name) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!name) {
              reject(!name);
            }
            var com = await this.getCommunityByName(communityName).community();
            var community = com && JSON.parse(com);
            if (Object.keys(community).length !== 0) {
              const tmt = setInterval(() => {
                var entity = this.state.entities.find(
                  (x) =>
                    x.message.toLowerCase() === name.toLowerCase() &&
                    x.communityId === community.id
                );

                if (entity) {
                  clearInterval(tmt);
                  resolve(JSON.stringify(entity));
                }
              }, 2000);

              this.recheck.push(tmt);
            } else {
              //const tmt = setInterval(() => {
              var entity = this.state.entities.find(
                (x) =>
                  (x.message ? x.message : x.title).toLowerCase() ===
                    name.toLowerCase() && x.communityId === community.id
              );

              if (entity) {
                //clearInterval(tmt);
                resolve(JSON.stringify(entity));
              } else resolve("{}");
              //}, 1000);
              //this.recheck.push(tmt);
            }
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateEntity = (entityId, entityType) => {
    let fine = true;
    const { recordedEntities } = this.state;
    return {
      entity: async () => {
        if (!recordedEntities.includes(entityType + entityId)) {
          this.setState({
            recordedEntities: [...recordedEntities, entityType + entityId]
          });
          const event = ["event", "plan", "job", "housing"].includes(
            entityType
          );
          var close = onSnapshot(
            doc(
              firestore,
              entityType === "oldEvent"
                ? entityType
                : event
                ? "event"
                : "entity",
              entityId
            ),
            (async (doc) => {
              if (doc.exists()) {
                var entity = doc.data();
                entity.id = doc.id;
                entity.collection = entityType;
                var community =
                  entity.communityId &&
                  (await this.getCommunity(entity.communityId).community());
                entity.community = community && JSON.parse(community);
                var adminArray = entity.admin ? entity.admin : [];
                var memberArray = entity.members ? entity.members : [];
                var recipientArray = [
                  entity.authorId,
                  ...adminArray,
                  ...memberArray
                ];
                entity.recipients = Promise.all(
                  recipientArray.map(async (recipientId) => {
                    var recipient = await this.hydrateUser(recipientId).user();
                    return recipient && JSON.parse(recipient);
                  })
                );
                if (entity.recipients) {
                  var rest = this.state.entities.filter(
                    (x) =>
                      x.id !== entity.id && x.collection !== entity.collection
                  );
                  var entities = [...rest, entity];
                  this.setState({ entities });
                }
              }
            },
            standardCatch)
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDoc(
              doc(
                firestore,
                entityType === "oldEvent"
                  ? entityType
                  : event
                  ? "event"
                  : "entity",
                entityId
              )
            )
              .then(async (doc) => {
                if (doc.exists()) {
                  var entity = doc.data();
                  entity.id = doc.id;
                  entity.collection = entityType;
                  var community =
                    entity.communityId &&
                    (await this.getCommunity(entity.communityId).community());
                  entity.community = community && JSON.parse(community);
                  var adminArray = entity.admin ? entity.admin : [];
                  var memberArray = entity.members ? entity.members : [];
                  var recipientArray = [
                    entity.authorId,
                    ...adminArray,
                    ...memberArray
                  ];
                  entity.recipients = Promise.all(
                    recipientArray.map(async (recipientId) => {
                      var recipient = await this.hydrateUser(
                        recipientId
                      ).user();
                      return recipient && JSON.parse(recipient);
                    })
                  );
                  if (entity.recipients) {
                    var rest = this.state.entities.filter(
                      (x) =>
                        x.id !== entity.id && x.collection !== entity.collection
                    );

                    this.setState({ entities: [...rest, entity] });
                    return entity && resolve(JSON.stringify(entity));
                  }
                } else return resolve("{}");
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!fine) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!entityId) {
              reject(!entityId);
            }
            //const tmt = setTimeout(() => {
            var entity = this.state.entities.find(
              (x) => x.id === entityId && x.collection !== entityType
            );

            if (entity) {
              //clearTimeout(tmt);
              resolve(JSON.stringify(entity));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };

  getProfileFutureEvents = async (profile) => {
    const keepalive = 3600000;
    const jailclass = {
      uuid: "getProfileFutureEvents", //forumPosts
      docsOutputLabel: "event",
      stateAfterLabel: "eventsProfileLast",
      endBeforeLabel: "eventsProfileUndo",
      state: {},
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: [
        collection(firestore, "entity"),
        where("authorId", "==", profile.id),
        where("date", ">", new Date())
      ], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 5, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter(
          (x) => x.uuid !== "getProfileFutureEvents"
        ),
        jailclass
      ]
    });
  };

  paginateProfilePosts = async (profile, way) => {
    //console.log(this.state[way + "Post"]);
    if (!this.state[way + "Post"]) {
      //skipped [type[way]]
    } else {
      //getting more... type[way]
      var fbbb = false;
      if (way === "last") {
        //end before this.state[type.undo].id
        fbbb = [
          collection(firestore, "forum"),
          where("authorId", "==", profile.id),
          orderBy("time", "desc"),
          startAfter(this.state[way + "Post"]),
          limit(14)
        ];
      } else {
        //start after this.state[type.last].id
        fbbb = [
          collection(firestore, "forum"),
          where("authorId", "==", profile.id),
          orderBy("time", "desc"),
          endBefore(this.state[way + "Post"]),
          limit(14)
        ];
      }
      onSnapshot(query(...fbbb), (snapshotQuery) => {
        this.props.unloadGreenBlue();
        this.setState({
          lastPost: snapshotQuery.docs[snapshotQuery.docs.length - 1],
          undoPost: snapshotQuery.docs[0],
          profilePosts: snapshotQuery.docs
            .map((doc) => {
              return (
                doc.exists() && {
                  ...doc.data(),
                  id: doc.id,
                  shortId: "forum" + doc.id
                }
              );
            })
            .filter((x) => x)
        });
      });
      return null;
      const keepalive = 3600000;
      const jailclass = {
        uuid: "paginateProfilePosts", // + type.collection, //forumPosts
        docsOutputLabel: "profilePosts",
        stateAfterLabel: "lastPost", // type.last,
        endBeforeLabel: "undoPost", // type.undo,
        state: {
          currentComments: "forumcomments" // type.oppositeCommentsName
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: fbbb, //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 8, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter(
            (x) => x.uuid !== "paginateProfilePosts"
          ),
          jailclass
        ]
      });
      /**
        foo.collection = type.oldCollection;
        foo.currentComments = type.oppositeCommentsName;
        reverst(foo, type.collection);
       */
    }
  };
  getPostsAs = async (chosenEntity) => {
    this.setState({
      entityPosts: []
    });

    const keepalive = 3600000;
    const jailclass = {
      uuid: "getPostsAs", //forumPosts
      docsOutputLabel: "entityPosts",
      stateAfterLabel: "groupLast",
      endBeforeLabel: "groupUndo",
      state: {},
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: [
        collection(firestore, "forum"),
        where("entityId", "==", chosenEntity.id),
        where("entityType", "==", chosenEntity.entityType)
      ], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };

    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => x.uuid !== "getPostsAs"),
        jailclass
      ]
    });
  };

  getPosts = (profile) => {
    //const jailclasses =
    var jailclasses = [];
    //  var copy = [...this.state.jailclasses];
    //const copy = profileDirectory.map((type) => {
    //console.log(type);
    const keepalive = 3600000;
    const jailclass = {
      uuid: "getPosts", // + type.currentCollection, //forumPosts
      docsOutputLabel: "profilePosts",
      stateAfterLabel: "lastPost", //type.last,
      endBeforeLabel: "undoPost", //type.undo,
      state: {
        currentComments: "forumcomments" //type.currentComments
      },
      //for each: foo = {...doc.data(),doc.id}
      snapshotQuery: [
        collection(firestore, "forum"), // type.currentCollection),
        where("authorId", "==", profile.id)
      ], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: false, //verbose
      whenOn: false //whenOn
    };
    //return jailclass;
    //console.log(jailclass);
    // this.setState({
    /*jailclasses = [
        ...copy.filter((x) => x.uuid !== "getPosts" + type.currentCollection),
        jailclass
      ];*/
    //});
    //return jailclass;
    //});
    //console.log(copy);
    /*this.setState({
      jailclasses
    });*/
    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) => "getPosts" !== x.uuid),
        jailclass
      ]
    });
    /*this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter((x) =>
          jailclasses.map((y) => "getPosts" + y.currentCollection !== x.uuid)
        ),
        ...jailclasses
      ]
    });*/
  };
  lastCityForum = async (city, commtype) => {
    if (!this.state.lastCityPost) {
      window.alert("no more");
    } else {
      var message = "fetching forum for " + city;
      this.props.loadGreenBlue(message);

      this.setState({ forumPosts: [] });
      onSnapshot(
        query(
          collection(firestore, "forum"),
          where("city", "==", city),
          orderBy("time", "desc"),
          startAfter(this.state.lastCityPost),
          limit(14)
        ),
        async (snapshotQuery) => {
          this.props.unloadGreenBlue();
          this.setState({
            lastCityPost: snapshotQuery.docs[snapshotQuery.docs.length - 1],
            undoCityPost: snapshotQuery.docs[0],
            forumPosts: await Promise.all(
              snapshotQuery.docs.map(
                async (doc) =>
                  await new Promise(async (r) => {
                    if (!doc.exists()) return r(null);
                    const foo = doc.data();
                    //console.log(foo);
                    const done = JSON.stringify({
                      ...foo,
                      id: doc.id,
                      collection: "forum",
                      shortId: "forum" + doc.id,
                      author: JSON.parse(
                        await this.hydrateUser(foo.authorId).user()
                      ),
                      droppedPost:
                        foo.droppedId &&
                        JSON.parse(
                          await this.handleDropId(foo.droppedId).promise()
                        ),
                      videos: JSON.parse(
                        await this.hydratePostChatMeta(foo).meta()
                      ),
                      community:
                        foo.communityId &&
                        JSON.parse(
                          await this.getCommunity(foo.communityId).community()
                        ),
                      entity:
                        foo.entityId &&
                        JSON.parse(
                          await this.hydrateEntity(
                            foo.entityId,
                            foo.entityType
                          ).entity()
                        )
                    });
                    return r(done);
                  })
              )
            ).then((docs) => docs.filter((x) => x).map((a) => JSON.parse(a)))
          });
        }
      );
      return null;
      const keepalive = 3600000;
      const jailclass = {
        uuid: "fetchForum", //forumPosts
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          currentComments: "forumcomments"
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: [
          collection(firestore, "forum"),
          where("city", "==", city)
        ], //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: this.state.lastCityPost, //startAfter
        endBefore: this.state.undoCityPost, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
      });
    }
  };
  undoCityForum = async (city, commtype) => {
    if (!this.state.undoCityPost) {
      window.alert("nothing new");
    } else {
      var message = "fetching forum for " + city;
      this.props.loadGreenBlue(message);

      this.setState({ forumPosts: [] });
      onSnapshot(
        query(
          collection(firestore, "forum"),
          where("city", "==", city),
          orderBy("time", "desc"),
          endBefore(this.state.undoCityPost),
          limit(14)
        ),
        async (snapshotQuery) => {
          this.props.unloadGreenBlue();
          this.setState({
            lastCityPost: snapshotQuery.docs[snapshotQuery.docs.length - 1],
            undoCityPost: snapshotQuery.docs[0],
            forumPosts: await Promise.all(
              snapshotQuery.docs.map(
                async (doc) =>
                  await new Promise(async (r) => {
                    if (!doc.exists()) return r(null);
                    const foo = doc.data();
                    //console.log(foo);
                    const done = JSON.stringify({
                      ...foo,
                      id: doc.id,
                      collection: "forum",
                      shortId: "forum" + doc.id,
                      author: JSON.parse(
                        await this.hydrateUser(foo.authorId).user()
                      ),
                      droppedPost:
                        foo.droppedId &&
                        JSON.parse(
                          await this.handleDropId(foo.droppedId).promise()
                        ),
                      videos: JSON.parse(
                        await this.hydratePostChatMeta(foo).meta()
                      ),
                      community:
                        foo.communityId &&
                        JSON.parse(
                          await this.getCommunity(foo.communityId).community()
                        ),
                      entity:
                        foo.entityId &&
                        JSON.parse(
                          await this.hydrateEntity(
                            foo.entityId,
                            foo.entityType
                          ).entity()
                        )
                    });
                    return r(done);
                  })
              )
            ).then((docs) => docs.filter((x) => x).map((a) => JSON.parse(a)))
          });
        }
      );
      return null;
      const keepalive = 3600000;
      const jailclass = {
        uuid: "fetchForum", //forumPosts
        docsOutputLabel: "forumPosts",
        stateAfterLabel: "lastCityPost",
        endBeforeLabel: "undoCityPost",
        state: {
          currentComments: "forumcomments"
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: [
          collection(firestore, "forum"),
          where("city", "==", city)
        ], //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: this.state.lastCityPost, //startAfter
        endBefore: this.state.undoCityPost, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
      });
    }
  };
  paginateCommForum = async (post, postOld) => {
    const { community, commtype } = this.state;
    const {
      coll,
      NewcommentsName,
      ExpiredcommentsName,
      filterTime,
      name,
      isForms,
      old,
      last,
      undo,
      lastOld,
      undoOld
    } = fillQuery(commtype);
    if (!this.state[{ last, undo }[post]]) {
      window.alert("no more");
    } else {
      var message = "fetching more " + coll + " for " + community.message;
      let fbbb = [];
      this.props.loadGreenBlue(message);
      this.setState({ forumPosts: [] });
      if (post === "last") {
        //end before this.state[type.undo].id
        fbbb = [
          collection(firestore, "forum"),

          commtype === "forum"
            ? where("commtype", "in", [
                "new",
                "class",
                "department",
                "election",
                "case",
                "ordinance"
              ])
            : where("commtype", "==", commtype),

          where("communityId", "==", community.id),
          orderBy("time", "desc"),
          startAfter(this.state["lastCommPost"]),
          limit(14)
        ];
      } else {
        //start after this.state[type.last].id
        fbbb = [
          collection(firestore, "forum"),

          commtype === "forum"
            ? where("commtype", "in", [
                "new",
                "class",
                "department",
                "election",
                "case",
                "ordinance"
              ])
            : where("commtype", "==", commtype),
          where("communityId", "==", community.id),
          orderBy("time", "desc"),
          endBefore(this.state["undoCommPost"]),
          limit(14)
        ];
      }
      onSnapshot(query(...fbbb), async (snapshotQuery) => {
        this.props.unloadGreenBlue();
        this.setState({
          lastCommPost: snapshotQuery.docs[snapshotQuery.docs.length - 1],
          undoCommPost: snapshotQuery.docs[0],
          forumPosts: await Promise.all(
            snapshotQuery.docs.map(
              async (doc) =>
                await new Promise(async (r) => {
                  if (!doc.exists()) return r(null);
                  const foo = doc.data();
                  //console.log(foo);
                  const done = JSON.stringify({
                    ...foo,
                    id: doc.id,
                    collection: "forum",
                    shortId: "forum" + doc.id,
                    author: JSON.parse(
                      await this.hydrateUser(foo.authorId).user()
                    ),
                    droppedPost:
                      foo.droppedId &&
                      JSON.parse(
                        await this.handleDropId(foo.droppedId).promise()
                      ),
                    videos: JSON.parse(
                      await this.hydratePostChatMeta(foo).meta()
                    ),
                    community:
                      foo.communityId &&
                      JSON.parse(
                        await this.getCommunity(foo.communityId).community()
                      ),
                    entity:
                      foo.entityId &&
                      JSON.parse(
                        await this.hydrateEntity(
                          foo.entityId,
                          foo.entityType
                        ).entity()
                      )
                  });
                  return r(done);
                })
            )
          ).then((docs) => docs.filter((x) => x).map((a) => JSON.parse(a)))
        });
      });
      return null;
      const keepalive = 3600000;
      const jailclass = {
        uuid: "fetchCommForum", //forumPosts
        docsOutputLabel: name,
        stateAfterLabel: last,
        endBeforeLabel: undo,
        state: {
          currentComments: NewcommentsName,
          oldComments: ExpiredcommentsName,
          oldCollection: "oldForum",
          currentCollection: "forum"
        },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: [
          collection(firestore, "forum"),
          //where("collection", "==", commtype),
          where("communityId", "==", community.id)
        ], //optional canIncludes()?
        keepalive,
        sort: { order: "time", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 14, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };

      this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchCommForum"),
          jailclass
        ]
      });
    }
  };
  getCommunity = (communityId) => {
    let fine = true;
    const { recordedCommunities } = this.state;
    return {
      community: async () => {
        //console.log("try", communityId);
        if (!recordedCommunities.includes(communityId)) {
          this.setState({
            recordedCommunities: [...recordedCommunities, communityId]
          });
          var close = onSnapshot(
            doc(firestore, "communities", communityId),
            async (doc) => {
              if (doc.exists()) {
                var community = doc.data();
                community.id = doc.id;
                var rest = this.state.communities.filter(
                  (x) => x.id !== community.id
                );
                var communities = [...rest, community];
                this.setState({ communities });
              }
            },
            (e) => {
              console.log("getCommunity", e.message);
            }
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!communityId) {
              reject(!communityId);
            }
            getDoc(doc(firestore, "communities", communityId))
              .then(async (doc) => {
                if (doc.exists()) {
                  var community = doc.data();
                  community.id = doc.id;
                  var rest = this.state.communities.filter(
                    (x) => x.id !== community.id
                  );

                  this.setState({ communities: [...rest, community] });
                  return community && resolve(JSON.stringify(community));
                } else return resolve("{}");
              })
              .catch((e) => {
                console.log("getCommunity", e.message);
                return resolve("{}");
              });
            if (!communityId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!communityId) {
              reject(!communityId);
            }
            //console.log("again", communityId);
            //const tmt = setInterval(() => {
            var community = this.state.communities.find(
              (x) => x.id === communityId
            );

            if (community) {
              //console.log("again community", community.message);
              //clearInterval(tmt);
              resolve(JSON.stringify(community));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  getCommunityByName = (communityName) => {
    let fine = true;
    const { recordedCommunityNames } = this.state;

    return {
      community: async () => {
        //console.log("try", communityName);
        if (!recordedCommunityNames.includes(communityName)) {
          this.setState({
            recordedCommunityNames: [...recordedCommunityNames, communityName]
          });
          var close = onSnapshot(
            query(
              collection(firestore, "communities"),
              where("messageLower", "==", communityName.toLowerCase())
            ),
            (querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists()) {
                  var community = doc.data();
                  community.id = doc.id;
                  /*var messageLower = community.message.toLowerCase();
                    if (community.messageLower !== messageLower)
                      firebase
                        .firestore()
                        .collection("communities")
                        .doc(community.id)
                        .update({ messageLower });*/
                  var rest = this.state.communities.filter(
                    (x) => x.id !== community.id
                  );
                  var communities = [...rest, community];
                  this.setState({ communities });
                }
              });
            },
            standardCatch
          );
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            getDocs(
              query(
                collection(firestore, "communities"),
                where("messageLower", "==", communityName.toLowerCase())
              )
            )
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  return resolve("{}");
                } else
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists()) {
                      var community = doc.data();

                      community.id = doc.id;

                      var rest = this.state.communities.filter(
                        (x) => x.id !== community.id
                      );
                      this.setState({ communities: [...rest, community] });
                      return community && resolve(JSON.stringify(community));
                    } else return resolve("{}");
                  });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!communityName) {
              close();
            }
          });
        } else {
          return await new Promise((resolve, reject) => {
            !fine && reject(!fine);
            //console.log("again", communityName);
            //const tmt = setInterval(() => {
            var community = this.state.communities.find(
              (x) => x.message.toLowerCase() === communityName.toLowerCase()
            );

            if (community) {
              //console.log("again community", community.message);
              //clearInterval(tmt);
              resolve(JSON.stringify(community));
            } else resolve("{}");
            //}, 2000);

            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  getProfileEntities = (profile) => {
    //this.getComments(profile);
    //return null;
    let q = 0;
    const types = [
      { collection: "clubs", name: "profileClubs" },
      { collection: "shops", name: "profileShops" },
      { collection: "restaurants", name: "profileRestaurants" },
      { collection: "services", name: "profileServices" },
      { collection: "classes", name: "profileClasses" },
      { collection: "departments", name: "profileDepartments" },
      { collection: "pages", name: "profilePages" },
      { collection: "jobs", name: "profileJobs" },
      { collection: "venues", name: "profileVenues" },
      { collection: "housing", name: "profileHousing" },
      { collection: "event", name: "profileEvents" }
    ];
    /*const copy = types
      .map((type) => {
        q++;

        var coll = type.collection;
        //console.log(q);

        return this.getEntityQuery(coll, "admin", profile, type);
      })
      .concat(
        types.map((type) => {
          q++;

          var coll = type.collection;
          //console.log(q);

          return this.getEntityQuery(coll, "authorId", profile, type);
        })
      );*/
    const jailclass = this.getEntityQuery("authorId", profile);
    this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter(
          (x) => x.uuid !== jailclass.uuid // "getEntityQuery" + y.coll + y.role)
        ),
        jailclass
      ]
    });
    this.getComments(profile);
    this.props.loadGreenBlue("getting comments from " + profile.username);
  };

  getEntityQuery = (role, profile) =>
    /*this.setState({
      jailclasses: [
        ...this.state.jailclasses.filter(
          (x) => x.uuid !== "getEntityQuery" + coll + role
        ),*/
    {
      return {
        uuid: "getEntityQuery", // + coll + role, //forumPosts
        docsOutputLabel: "entity",
        stateAfterLabel: "last",
        endBeforeLabel: "undo",
        state: { role },
        //for each: foo = {...doc.data(),doc.id}
        snapshotQuery: [
          collection(firestore, "entity"),
          where(role, "==", profile.id)
        ], //optional canIncludes()?
        keepalive: 3600000,
        sort: { order: "createdAt", by: "desc" }, //sort
        near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        limit: 8, //limit
        startAfter: null, //startAfter
        endBefore: null, //endBefore
        verbose: false, //verbose
        whenOn: false //whenOn
      };
      //]
    }; //);

  paginateGroupPosts = async (chosenEntity, way) => {
    var wayCode = way.slice(0, way.length);
    if (wayCode === "last") {
      wayCode = "groupLast";
    } else {
      wayCode = "groupUndo";
    }
    if (!this.state[wayCode]) {
      // console.log("skipped " + [type[way]]);
    } else {
      this.props.loadGreenBlue(
        "getting more of " + this.state.profile.username
      );
      //console.log(way + ": getting more..." + type[way]);
      var fbbb = false;
      if (way === "last") {
        fbbb = query(
          collection(firestore, "forum"),
          where("entityId", "==", chosenEntity.id),
          where("entityType", "==", chosenEntity.entityType)
        );
      } else
        fbbb = query(
          collection(firestore, "forum"),
          where("entityId", "==", chosenEntity.id),
          where("entityType", "==", chosenEntity.entityType)
        );

      const keepalive = 3600000;
      const free = await Jail(
        //for each: foo = {...doc.data(),doc.id}
        fbbb,
        keepalive,
        { order: "time", by: "desc" }, //sort
        null, //sort && near cannot be true (coexist, orderBy used by geohashing)
        //near for geofirestore { center: near.center, radius: near.distance }
        8, //limit
        null, //startAfter
        null, //endBefore
        true
      );
      if (free) {
        this.setState(
          {
            groupLast: free.startAfter,
            groupUndo: free.endBefore
          },
          () => {
            if (free.docs.length === 0) {
              this.props.unloadGreenBlue();
              if (way === "last") {
                this.setState({
                  groupLast: null
                });
              } else {
                this.setState({
                  groupUndo: null
                });
              }
            } else {
              free.docs.forEach(async (foo) => {
                foo.currentComments = "forumcomments";
                var community =
                  foo.communityId &&
                  (await this.getCommunity(foo.communityId).community());
                foo.community = community && JSON.parse(community);
                var canView = !community
                  ? true
                  : canIView(this.props.auth, foo, community);
                if (canView) {
                  var entity =
                    foo.entityId &&
                    (await this.hydrateEntity(
                      foo.entityId,
                      foo.entityType
                    ).entity());

                  foo.entity = entity && JSON.parse(entity);
                  foo.author = await this.hydrateUser(foo.authorId).user();

                  var videos = await this.hydratePostChatMeta(foo).meta();
                  foo.videos = videos && JSON.parse(videos);

                  var rest = this.props.entityPosts.filter(
                    (post) =>
                      foo.id !== post.id || foo.collection !== post.collection
                  );
                  this.setState({
                    entityPosts: [...rest, foo]
                  });
                }
                this.props.unloadGreenBlue();
              });
            }
          }
        );
      }
    }
  };
  lastPostsAs = (chosenEntity) => {
    this.setState({
      entityPosts: []
    });
    this.paginateGroupPosts(chosenEntity, "last");
  };

  undoPostsAs = (chosenEntity) => {
    this.setState({
      entityPosts: []
    });
    this.paginateGroupPosts(chosenEntity, "undo");
  };

  lastPosts = () => {
    this.props.loadGreenBlue("getting more of " + this.state.profile.username);
    this.setState({ profilePosts: [] });
    //profileDirectory.forEach((type, i) =>
    this.paginateProfilePosts(this.state.profile, "last");
    //);
  };

  undoPosts = () => {
    this.props.loadGreenBlue(
      "getting more recent stuff of " + this.state.profile.username
    );
    this.setState({ profilePosts: [] });
    //profileDirectory.forEach((type, i) =>
    this.paginateProfilePosts(this.state.profile, "undo");
    //);
  };

  handleComments = async (post, i) => {
    //console.log(post);
    const { lastChosenPost } = this.state;
    if (!post) {
      this.setState({
        postHeight: 0,
        comments: null,
        lastChosenComments: this.state.comments,
        lastChosenPost: this.state.chosenPost,
        lastPostHeight: this.state.postHeight,
        postMessage: "",
        chosenPost: null
      });
    } else if (lastChosenPost && lastChosenPost.id === post.id) {
      this.setState({
        postHeight: this.state.lastPostHeight,
        comments: this.state.lastChosenComments,
        postMessage: lastChosenPost.message,
        chosenPostId: lastChosenPost.id,
        chosenPost: lastChosenPost
      });
    } else {
      this.props.loadGreenBlue("getting comments");
      /*var forumTypecomm =
        post.collection === "budget"
          ? "budgetcommentsnew"
          : post.collection === "elections"
          ? "electioncommentsnew"
          : post.collection === "cases"
          ? "casecommentsnew"
          : post.collection === "oldBudget"
          ? "budgetcommentsexpired"
          : post.collection === "oldElections"
          ? "electioncommentsexpired"
          : post.collection === "oldCases"
          ? "casecommentsexpired"
          : post.collection === "ordinances"
          ? "ordinancecomments"
          : "forumcomments";*/
      //Go die is not as bad as crossing my fingers”
      //Former might not even be terrorism, it is not threat though, just the statement that it is on the table. Still your whole-choice, no tricks

      //mf insurance is more terrorist by prisoners' dilemma to labor contract than a threat asking the hostage for something.
      onSnapshot(
        query(
          collection(firestore, "forumcomments"),
          where("forumpostId", "==", post.collection + post.id),
          orderBy("time", "desc")
        ),
        async (querySnapshot) => {
          if (querySnapshot.docs.length === 0) {
            //window.alert("be the first to comment");
            console.log("post", post, "no comments");
            this.setState({
              chosenPostId: post.id,
              postMessage: post.message,
              chosenPost: post,
              comments: [],
              lastChosenComments: [],
              lastChosenPost: post,
              lastPostHeight: this.state.postHeight
            });
            this.props.unloadGreenBlue();
          } else {
            let comments = [];
            let p = 0;
            querySnapshot.docs.map(async (doc) => {
              p++;
              if (doc.exists()) {
                var foo = doc.data();
                /*!foo.forumpostId.startsWith(post.collection) &&
                  updateDoc(doc(firestore, "forumcomments", foo.id), {
                    forumpostId: post.collection + post.id
                  });*/
                foo.id = doc.id;
                comments.push(foo);
              }
            });
            if (querySnapshot.docs.length === p) {
              comments = await this.handleProfileCommentSnapshot(comments);

              comments.sort(
                (a, b) =>
                  (this.props.user !== undefined &&
                    this.state.following.includes(a.authorId)) -
                  (this.props.user === undefined ||
                    !this.state.following.includes(b.authorId))
              );
              console.log(comments);
              this.setState({
                /*commentedPosts: [
                  ...this.state.commentedPosts.filter(
                    (x) => x.collection + x.id === post.collection + post.id
                  ),
                  post
                ],*/
                chosenPostId: post.id,
                postMessage: post.message,
                chosenPost: post,
                comments,
                lastChosenComments: comments,
                lastChosenPost: post,
                lastPostHeight: this.state.postHeight
              });
              this.props.unloadGreenBlue();
            }
          }
        },
        standardCatch
      );
    } /* && this.state.postHeight !== 0*/
    /*if (this.state.postHeight === 0) {
      this.setState({ chosenPostId: null });
    } else */
  };
  handleCommentSet = (type, profile, paginate) => {
    var fine = true;
    return {
      promise: async () =>
        await new Promise((resolve, reject) => {
          if (!fine) reject(!fine);
          let comments = [];
          var close = false;
          if (paginate) {
            if (this.state[type[paginate]]) {
              if (paginate === "last") {
                close = [
                  collection(firestore, type.currentComments),
                  where("authorId", "==", profile.id),
                  orderBy("time", "desc"),
                  endBefore(this.state[type.last]),
                  limitToLast(14)
                ];
              } else {
                close = [
                  collection(type.currentComments),
                  where("authorId", "==", profile.id),
                  orderBy("time", "desc"),
                  startAfter(this.state[type.undo]),
                  limit(14)
                ];
              }
            }
          } else {
            close = [
              collection(firestore, type.currentComments),
              where("authorId", "==", profile.id),
              orderBy("time", "desc"),
              limit(14)
            ];
          }
          close &&
            getDocs(query(...close))
              .then((querySnapshot) => {
                let o = 0;
                if (querySnapshot.empty) {
                  this.setState({
                    [type[paginate]]: null
                  });
                  resolve("none");
                } else {
                  querySnapshot.forEach((doc) => {
                    o++;
                    if (doc.exists()) {
                      var foo = doc.data();
                      foo.id = doc.id;
                      foo.collection = type.commentsSource;
                      foo.currentComments = type.currentComments;
                      comments.push(foo);
                    }
                    if (querySnapshot.docs.length === o) {
                      var lastPost =
                        querySnapshot.docs[querySnapshot.docs.length - 1];
                      var undoPost = querySnapshot.docs[0];
                      this.setState({
                        [type.last]: lastPost,
                        [type.undo]: undoPost
                      });
                      resolve(JSON.stringify(comments));
                    }
                  });
                }
              })
              .catch(standardCatch);

          if (!fine) {
            close();
          }
        }),
      closer: () => (fine = false)
    };
  };
  handleDropId = (droppedId) => {
    let fine = true;
    const { recordedDroppedPosts } = this.state;
    var coll = "forum";
    var id = "";
    var start = "";
    if (droppedId) {
      if (droppedId.startsWith("forum")) {
        coll = "forum";
        start = "forum";
      } else if (droppedId.startsWith("oldForum")) {
        coll = "oldForum";
        start = "oldForum";
      }
      id = droppedId.split(start)[1];
    }
    //console.log(collection, id);
    return {
      promise: async () => {
        if (!recordedDroppedPosts.includes(collection + id)) {
          this.setState({
            recordedDroppedPosts: [...recordedDroppedPosts, collection + id]
          });

          var close = onSnapshot(
            doc(firestore, coll, id),
            async (doc) => {
              if (doc.exists()) {
                var droppedPost = doc.data();
                droppedPost.id = doc.id;
                //console.log(droppedPost);
                droppedPost.collection = coll;

                this.setState({
                  droppedPosts: [
                    ...this.state.droppedPosts.filter(
                      (x) =>
                        x.id !== droppedPost.id &&
                        x.collection !== droppedPost.collection
                    ),
                    droppedPost
                  ]
                });
              }
            },
            (e) => console.log("handleDrop", e)
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            await getDoc(doc(firestore, coll, id))
              .then(async (doc) => {
                //console.log(doc);
                if (doc.exists()) {
                  var droppedPost = doc.data();
                  droppedPost.id = doc.id;
                  //console.log(droppedPost);
                  droppedPost.collection = coll;
                  this.setState({
                    droppedPosts: [
                      ...this.state.droppedPosts.filter(
                        (x) =>
                          x.id !== droppedPost.id &&
                          x.collection !== droppedPost.collection
                      ),
                      droppedPost
                    ]
                  });
                  var string = JSON.stringify(droppedPost);
                  resolve(string);
                } else resolve("");
              })
              .catch((e) => {
                console.log("handleDrop", e.message);
                return resolve("{}");
              });
            if (!fine) {
              close(!droppedId);
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!droppedId) {
              reject(!droppedId);
            }
            //const tmt = setInterval(() => {
            var droppedPost = this.state.droppedPosts.find(
              (x) => x.id === id && x.collection === collection
            );

            if (droppedPost) {
              //clearInterval(tmt);
              resolve(JSON.stringify(droppedPost));
            } else resolve("{}");
            //}, 2000);

            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => {
        fine = false;
      }
    };
  };

  findPost = async (id) => {
    //console.log(id);
    if (id) {
      this.props.loadGreenBlue("finding post...");
      var p = await this.handleDropId(id).promise();
      //console.log(p);
      var drop = p && JSON.parse(p);
      if (drop) {
        //console.log(drop);
        var buff = await this.handleCommSnapshot([drop], drop.collection);
        if (buff) {
          drop = buff[0];
        }
        if (drop.droppedId) {
          var postt = await this.handleDropId(drop.droppedId).promise();
          drop.droppedPost = postt && JSON.parse(postt);
        }
        if (
          drop.author &&
          (!drop.communityId || drop.community) &&
          (!drop.entityId || drop.entity)
        ) {
          this.props.unloadGreenBlue();
          return drop && drop;
        }
      }
    }
  };
  handleProfileComments = (profile, paginate) => {
    if (paginate) {
      this.props.loadGreenBlue("loading more commented posts");
      this.setState({ profilePostsSorted: [] });
      this.props.clearProfile(true); //clear comments
    }
    Promise.all(
      profileCommentsDirectory.map(async (type, i) => {
        return await this.handleCommentSet(type, profile, paginate).promise();
      })
    ).then((comm) => {
      let cs = comm.map((x) => x !== "none" && JSON.parse(x)).filter((x) => x);
      var commentsCombined = [];
      for (let x = 0; x < cs.length; x++) {
        commentsCombined = commentsCombined.concat(cs[x]);
      }
      var forumpostIds = [];
      var comments = [];
      commentsCombined.forEach((com) => {
        //console.log(com);
        if (!forumpostIds.includes(com.forumpostId)) {
          forumpostIds.push(com.forumpostId);
          comments.push(com);
        }
      });
      //console.log(forumpostIds);
      var pa = {};
      //var arrFiltered = arr.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
      //https://stackoverflow.com/a/52273941/11711280
      /*const posts = comments.filter((next) => {
        console.log(next);
        return (
          !pa[next.collection + next.id] &&
          (pa[next.collection + next.id] = true)
        );
      });*/

      Promise.all(
        forumpostIds
          /*.reduce((arr, next) => {
            const already = arr.find(
              (x) => x.collection === next.collection && x.id === next.id
            );
            if (!already) arr.push(next);
            return arr;
          }, pa)*/
          /*.filter((next) => {
            const already = arr.find(
              (x) => x.collection === next.collection && x.id === next.id
            );
            if (!already) arr.push(next);
            return arr;
          }, pa)*/
          .map(async (post) => {
            //console.log("profilePosts", post);
            return await new Promise(async (resolve) => {
              var foo = await this.findPost(post);
              if (!foo) return resolve("");
              //foo.collection = post.collection;
              //foo.currentComments = post.currentComments;
              var buff = await this.handleCommSnapshot([foo], foo.collection);
              var bar = buff[0];
              if (bar.droppedId) {
                var postt = await this.handleDropId(foo.droppedId).promise();
                bar.droppedPost = postt && JSON.parse(postt);
              }
              //console.log("PERMISSIONS");
              bar.comments = comments.filter(
                (x) => x.forumpostId === foo.forumpostId
              );
              bar.author = profile; //JSON.parse(author);
              bar.isOfComment = true;
              bar.shortId = shortHandId(bar);
              bar &&
                (!bar.droppedId || bar.droppedPost) &&
                resolve(JSON.stringify(bar));
            });
          })
      ).then((pp) => {
        //console.log(pp);
        const profileComments = pp
          .map((x) => x !== "" && JSON.parse(x))
          .filter((x) => x);
        /*const old = this.state.profilePosts.filter(
          (post) =>
            !profilePosts.find((x) => x.forumpostId === post.forumpostId)
        );*/
        console.log("profileComments", profileComments);
        //console.log(old);
        this.setState({
          profileComments // [...old, ...profilePosts]
          //profilePosts: [...old, ...profilePosts]
        });
      });
      if (paginate) {
        this.props.unloadGreenBlue();
      } else {
        //console.log(profile);
        this.getPosts(profile);
        this.props.loadGreenBlue("getting posts from " + profile.username);
      }
    });
  }; //if people knew the difference between universal healthcare and medicare for all
  //the former would win non voters... jc and putin give up

  lastComments = (profile) => this.handleProfileComments(profile, "last");
  undoComments = (profile) => this.handleProfileComments(profile, "undo");
  getComments = (profile) => this.handleProfileComments(profile);

  finFetchForum = (product) => {
    //console.log(product);
    const stasis = !product.docs
      ? null
      : product.docs.length === 0
      ? "continue"
      : "handle";
    if (!stasis) {
      window.alert("react-fuffer must have failed to complete, sorry!");
    } else if (stasis === "continue") {
      this.props.unloadGreenBlue();
    } else if (stasis === "handle") {
      //console.log(product.docs); //this.finFetchForum(product)
      let p = 0;
      let forumPosts = [];
      //console.log(product.docs);
      Promise.all(
        product.docs.map(async (f, i) => {
          var foo = { ...f };
          //console.log("foo", foo);
          foo.videos = foo.videos ? foo.videos : [];
          /*updateDoc(doc(firebase, "forum", foo.id), {
            commtype: "forum"
          });*/
          if (
            this.props.auth !== undefined &&
            product.state &&
            product.state.oldCollection
          ) {
            var datel =
              product.docsOutputLabel === "classes"
                ? foo.endDate.seconds * 1000
                : foo.date && foo.date.seconds * 1000;
            foo.datel = datel && new Date(datel);
            var other,
              revers = null;
            if (
              !["oldForum", "oldEvent"].includes(foo.collection) &&
              foo.datel < new Date()
            ) {
              revers = true;
              other = product.state.oldCollection;
              foo.currentComments = product.state.oldComments;
            } else if (
              ["oldForum", "oldEvent"].includes(foo.collection) &&
              foo.datel > new Date()
            ) {
              revers = true;
              other = foo.collection;
              foo.currentComments = product.state.currentComments;
            }
            revers &&
              reverst(
                foo,
                other,
                product.state.uuid === "fetchEvents" && this.GeoFirestore
              );
          }

          var buff = await this.handleCommSnapshot([foo], foo.collection);
          if (buff) {
            foo = buff[0];
          }

          foo.shortId = shortHandId(foo);
          return await new Promise(
            (resolve) =>
              foo.author &&
              (!foo.droppedId || foo.droppedPost) &&
              (!foo.communityId || foo.community) &&
              (!foo.entityId || foo.entity) &&
              resolve(foo)
          );
          //buff && forumPosts.push(buff[0]);
          //});
        })
      ).then((forumPosts) => {
        //console.log("finFetchForums " + product.docsOutputLabel, forumPosts);
        // console.log(p);
        //if (p === product.docs.length) {
        //forumPosts = forumPosts.forEach((foo) => JSON.parse(foo));
        //console.log("forumPosts", product.docsOutputLabel, forumPosts);
        this.props.unloadGreenBlue();
        const coll = forumPosts[0] && forumPosts[0].collection;
        if (this.state.isProfile) {
          if (["oldForum", "forum"].includes(coll)) {
            const old = this.state.profilePosts.filter(
              (post) =>
                !forumPosts.find(
                  (x) => x.collection + x.id === post.collection + post.id
                )
            );
            //console.log(coll, old, forumPosts);
            this.setState({
              profilePosts: [...old, ...forumPosts]
            });
          } else {
            //console.log(collection + product.state.role, forumPosts);
            this.setState({
              [product.docsOutputLabel]: forumPosts,
              lastcity: this.state.city
            });
          }
        } else {
          this.setState({
            [product.docsOutputLabel]: forumPosts
          });
        }

        //}
      });
    }
  };
  render() {
    const {
      item,
      appHeight,
      containerStyle,
      width,
      loadingHeight,
      isProfile
    } = this.props;
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
    var paginationhandle = {};
    paginationReads.forEach((x) => {
      paginationhandle[x] = this.state[x];
    });
    const {
      openWhen,
      jailclasses,
      updatedclasses,
      deletedclasses
    } = this.state;
    const profileEntities = {
      profileEvents: this.state.profileEvents,
      profileJobs: this.state.profileJobs,
      profileClubs: this.state.profileClubs,
      profileServices: this.state.profileServices,
      profileClasses: this.state.profileClasses,
      profileDepartments: this.state.profileDepartments,
      profileRestaurants: this.state.profileRestaurants,
      profileShops: this.state.profileShops,
      profilePages: this.state.profilePages,
      profileVenues: this.state.profileVenues,
      profileHousing: this.state.profileHousing,
      profilePosts: this.state.profilePosts,
      profileComments: this.state.profileComments
    };

    //console.log("isprofile " + this.state.isProfile);
    const counterPlz = this.state.counterEar && this.state.counterEar !== 0;
    //console.log(this.state.profilePosts);
    //console.log(jailclasses);
    //console.log(profileEntities);
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
    var tileOnce = {};
    myLabels.forEach((x) => {
      tileOnce[x] = this.state[x];
    });
    //console.log(this.state.event);
    return (
      <div>
        <div
          style={{
            display: "none",
            zIndex: "11",
            position: "fixed"
          }}
        >
          <div
            onMouseEnter={() =>
              this.setState({ hoveredear: true }, () => {
                clearTimeout(this.hoverear);
                this.hoverear = setTimeout(
                  () => this.setState({ hoveredear: false }),
                  3000
                );
              })
            }
            draggable={true}
            ref={this.ear}
            //onMouseMove={this.handleTooltipMove}
            onDrag={this.handleTooltipMove}
            //onMouseUp
            onDragEnd={this.resetTooltip}
            onTouchMove={this.handleTooltipMove}
            onTouchEnd={this.resetTooltip}
            style={{
              backgroundColor: !this.state.holdingEar ? "" : "white",
              borderRadius: "23px",
              overflow: "hidden",
              height: "46px",
              width: "46px",
              display: this.props.loadingMessage ? "none" : "flex",
              alignItems: "center",
              justifyContent: !counterPlz ? "center" : "space-between",
              position: "absolute",
              left: this.state.openAnyway ? "20px" : this.state.earSideways,
              top: this.state.openAnyway ? "20px" : this.state.earUpwards,
              zIndex: "11",
              //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
              transition: "1s ease-in"
            }}
          >
            {!counterPlz ? (
              <div
                style={{
                  border: !this.state.openAnyway ? "0px solid" : "3px solid",
                  fontSize: !this.state.openAnyway ? "0px" : "14px",
                  transition: ".6s ease-in",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: this.state.holdingEar
                    ? "rgb(250,250,190)"
                    : "white",
                  height: this.state.openAnyway ? "56px" : "0px",
                  width: this.state.openAnyway ? "56px" : "0px"
                }}
                onClick={() => this.setState({ openAnyway: false })}
              >
                &times;
              </div>
            ) : (
              <div
                style={{
                  transition: ".2s ease-in",
                  fontSize:
                    this.state.counterEar === 3
                      ? "0px"
                      : this.state.counterEar === 1
                      ? "24px"
                      : "18px"
                }}
              >
                {this.state.counterEar}
              </div>
            )}
            <img
              alt="firestore snapshot listeners icon"
              style={{
                transition: ".7s ease-in",
                fontSize: counterPlz ? "10px" : "0px",
                backgroundColor: this.state.holdingEar
                  ? "rgb(250,250,190)"
                  : "white",
                height:
                  counterPlz || !this.state.openAnyway
                    ? this.state.counterEar === 2
                      ? "44px"
                      : this.state.counterEar === 1
                      ? "33px"
                      : "56px"
                    : "0px",
                width:
                  counterPlz || !this.state.openAnyway
                    ? this.state.counterEar === 2
                      ? "44px"
                      : this.state.counterEar === 1
                      ? "33px"
                      : "56px"
                    : "0px"
              }}
              src="https://www.dropbox.com/s/pcko3nxl8arakkw/listeners%20icon%20%281%29.png?raw=1"
            />
          </div>
        </div>
        {deletedclasses.length > 0 &&
          this.state.hoveredear &&
          !this.state.holdingEar &&
          !this.state.openAnyway && (
            <div
              onMouseEnter={() => this.setState({ hoverearquick: true })}
              onMouseLeave={() => this.setState({ hoverearquick: false })}
              onClick={() => this.setState({ openAnyway: true })}
              style={{
                fontSize: "40px",
                border: "1.5px solid",
                backgroundColor: "white",
                borderRadius: "6px",
                color: this.state.hoverearquick ? "blue" : "grey",
                position: "absolute",
                padding: "4px",
                left: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earSideways,
                top: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earUpwards,
                zIndex: "10",
                //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
                transition: `${this.state.hoverearquick ? 0.1 : 1}s ease-in`,
                transform: "translate(30px,-30px)"
              }}
            >
              &bull;
            </div>
          )}
        {deletedclasses.length > 0 &&
          this.state.hoveredear &&
          !this.state.holdingEar &&
          !this.state.openAnyway && (
            <div
              onMouseEnter={() => this.setState({ hovereartrashed: true })}
              onMouseLeave={() => this.setState({ hovereartrashed: false })}
              className="fas fa-trash"
              onClick={() => this.setState({ deletedclassesopen: true })}
              style={{
                border: "1.5px solid",
                backgroundColor: "white",
                borderRadius: "6px",
                color:
                  !this.state.holdingEar && this.state.hovereartrashed
                    ? "red"
                    : "grey",
                position: "absolute",
                padding: "4px",
                left: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earSideways,
                top: this.state.deletedclassesopen
                  ? "20px"
                  : this.state.earUpwards,
                zIndex: "10",
                //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
                transition: `${this.state.hovereartrashed ? 0.1 : 1}s ease-in`,
                transform: "translate(30px,30px)"
              }}
            />
          )}
        {this.state.deletedclassesopen && (
          <div
            onClick={() => this.setState({ deletedclassesopen: false })}
            style={{
              position: "fixed",
              zIndex: "9",
              width: "100%",
              backgroundColor: "rgba(20,20,20,.7)",
              height: "100%"
            }}
          />
        )}
        {this.state.deletedclassesopen && (
          <div
            style={{
              border: "1.5px solid",
              backgroundColor: "white",
              borderRadius: "6px",
              position: "absolute",
              padding: "4px",
              left: this.state.deletedclassesopen
                ? "20px"
                : this.state.earSideways,
              top: this.state.deletedclassesopen
                ? "20px"
                : this.state.earUpwards,
              zIndex: "10",
              //transform: `translate(${this.state.earSideways}px,${this.state.earUpwards}px)`,
              transition: `${this.state.hovereartrashed ? 0.1 : 1}s ease-in`,
              transform: "translate(30px,30px)"
            }}
          >
            <div
              onClick={() => this.setState({ deletedclassesopen: false })}
              style={{
                width: "max-content",
                borderRadius: "10px",
                border: "1px solid",
                padding: "4px 10px"
              }}
            >
              close deleted
            </div>
            {deletedclasses.map((x) => {
              return (
                <div key={x.id}>
                  {x.id}
                  <div
                    //className="fas fa-trash"
                    className="fas fa-rocket"
                    style={{
                      borderRadius: "10px",
                      border: "1px solid",
                      padding: "4px 10px",
                      color:
                        !this.state.holdingEar && this.state.hovereartrashed
                          ? "red"
                          : "grey"
                    }}
                    /*onClick={() =>
                      this.setState({
                        deletedclasses: this.props.deletedclasses.filter(
                          (u) => u.id !== x.id
                        )
                      })
                    }*/
                    onClick={() => {
                      const thisresnap = this.state.resnaps.find(
                        (y) => y[x.id]
                      );
                      this.setState({
                        deletedclasses: this.state.deletedclasses.filter(
                          (y) => x.id !== y.id
                        ),
                        jailclasses: [
                          ...this.state.jailclasses,
                          thisresnap[x.id]
                        ],
                        resnaps: this.state.resnaps.filter((y) => !y[x.id])
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
        <JailClass
          firestore={firestore}
          fuffer={this.fuffer} //known risks, humanharvest.info
          //no forced investment and right to try peeps are abused
          //73% banking and institutional confidence in retrorade
          jailclasses={jailclasses}
          updateLiberty={(product, ids) => {
            product = ids
              ? this.state.freedocs.find(
                  (x) => x.id === matchy(this.state.currentJail.snapshotQuery)
                ) //ids.includes(x.id))
              : product;
            console.log("stateAfterLabel", product.stateAfter);
            console.log("endBeforeLabel", product.endBefore);
            this.setState(
              {
                freedocs: [
                  ...this.state.freedocs.filter((x) => x.id !== product.id),
                  product
                ],
                [product.stateAfterLabel]: product.startAfter,
                [product.endBeforeLabel]: product.endBefore
              },
              () => this.finFetchForum(product)
              /*,
                () => {
                  //console.log(product);
                  clearTimeout(this.stopFreedocs); //[productFuffer.uuid]);
                  this.stopFreedocs /*[productFuffer.uuid]* / = setTimeout(
                    () =>
                      //this.state.freedocs.forEach(
                      //(product) =>
                      //product &&
                      this.setState(
                        {
                          [product.stateAfterLabel]: product.startAfter,
                          [product.endBeforeLabel]: product.endBefore
                        },
                        () => this.finFetchForum(product)
                      ),
                    //)
                    0 //800
                  );
                }*/
            );
          }}
          updatedclasses={updatedclasses}
          setJail={(x) => this.setState(x)}
          alivefors={this.state.alivefors}
          closes={this.state.closes}
          //={this.state.immutableRegister}
          resnaps={this.state.resnaps}
          freedocs={this.state.freedocs}
        />
        {/*<WakeSnapshot
          jailclasses={jailclasses}
          deletedclasses={deletedclasses}
          setJail={(x) => this.setState(x)}
          updatedclasses={updatedclasses}
          freedocs={this.state.freedocs}
          loadingHeight={loadingHeight}
          isProfile={isProfile}
          openAnyway={this.state.openAnyway}
          remount={(x, func) => {
            /*clearTimeout(this.freetime[func.id]);
              this.freetime[func.id] = setTimeout(
                () =>* /
            this.setState({
              ...x,
              freedocs: [
                ...this.state.freedocs.filter((x) => x.id !== func.id),
                func
              ]
            });
            // 200);is invading ukraine a threat? just give up
          }}
          alivefors={this.state.alivefors}
          closes={this.state.closes}
          resnaps={this.state.resnaps}
        />*/}
        <Folder
          event={this.state.event.concat(this.state.together)}
          entity={this.state.entity}
          onMapEntities={this.props.onMapEntities}
          ref={{
            current: {
              pa: this.props.pa,
              gui: this.props.gui
            }
          }}
          myStuff={this.props.myStuff}
          navigate={this.props.navigate}
          getUserInfo={this.props.getUserInfo}
          setAuth={this.props.setAuth}
          profilePosts={this.state.profilePosts}
          profileComments={this.state.profileComments}
          setToUser={this.props.setToUser}
          unmountFirebase={this.props.unmountFirebase}
          width={width}
          commtype={this.state.commtype}
          history={this.props.history}
          getProfileEntities={this.getProfileEntities}
          getPostsAs={this.getPostsAs}
          item={item}
          containerStyle={containerStyle}
          appHeight={appHeight}
          apple={this.props.apple}
          location={this.props.location}
          statePathname={this.props.statePathname}
          setIndex={this.props.setIndex}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          //
          chosenEntity={this.state.chosenEntity}
          forumPosts={this.state.forumPosts}
          setForumDocs={this.setState}
          pathname={this.props.pathname}
          postHeight={this.state.postHeight}
          chosenPostId={this.state.chosenPostId}
          community={this.state.community}
          //
          //
          tileOnce={tileOnce}
          setCommunity={(e) => this.setState(e)}
          following={this.state.following}
          getProfile={this.getProfile}
          openOptions={this.state.openOptions}
          openEntity={
            this.state.openOptions
              ? () => this.setState({ openOptions: false })
              : () => this.setState({ openOptions: true })
          }
          chooseCity={(prediction) => {
            var city = prediction.place_name;

            var center = [prediction.center[1], prediction.center[0]];
            this.setState({ city, center, locOpen: false });
            this.props.dropCityIssues(city);
          }}
          issues={this.state.issues}
          dropCityIssues={(city) =>
            onSnapshot(doc(firestore, "cities", city), (doc) => {
              if (doc.exists()) {
                var foo = doc.data();
                foo.id = doc.id;
                return this.setState({ issues: [...foo.issues] });
              }
            })
          }
          setData={(e) => this.setState(e, console.log("state", e))}
          isProfile={this.state.isProfile}
          profile={this.state.profile}
          openWhen={openWhen}
          city={this.state.city}
          setCommtype={this.props.setCommtype}
          //
          favoriteCities={this.state.favoriteCities}
          parents={this.props.parents}
          storageRef={this.props.storageRef}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          saveAuth={this.props.saveAuth}
          //
          myDocs={this.state.myDocs}
          moreDocs={this.moreDocs}
          againBackDocs={this.againBackDocs}
          tickets={this.props.tickets}
          myCommunities={this.props.myCommunities}
          profileEntities={profileEntities}
          auth={this.props.auth}
          user={this.props.user}
          //
          iAmCandidate={this.props.iAmCandidate}
          iAmJudge={this.props.iAmJudge}
          iAmRepresentative={this.props.iAmRepresentative}
          followingMe={this.props.followingMe}
          //
          getFolders={this.props.getFolders}
          getVideos={this.props.getVideos}
          folders={this.props.folders}
          videos={this.props.videos}
          oktoshowchats={this.state.oktoshowchats}
          stripeKey={this.props.stripeKey}
          setGoogleLoginRef={this.props.loginButton}
          spotifyAccessToken={this.props.spotifyAccessToken}
          deleteScopeCode={this.props.deleteScopeCode}
          setScopeCode={this.props.setScopeCode}
          accessToken={this.props.accessToken}
          twitchUserAccessToken={this.props.twitchUserAccessToken}
          communities={this.state.communities}
          loaded={this.props.loaded}
          //
          filePreparedToSend={this.props.filePreparedToSend}
          picker={this.props.picker}
          picker1={this.props.picker1}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          //

          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          individualTypes={this.props.individualTypes}
          db={this.state.db}
          loadGreenBlue={this.props.loadGreenBlue}
          unloadGreenBlue={this.props.unloadGreenBlue}
          //
          comments={this.state.comments}
          postMessage={this.state.postMessage}
          chosenPost={this.state.chosenPost}
          helper={(e, postHeight) => {
            this.handleComments(e);
            //console.log(postHeight);
            postHeight &&
              this.setState({
                postHeight
                //chosenPostId: e.id
              });
          }}
          /*helper={async (c) => {
            var comments = c && (await this.handleComments(c).promise());
            return comments && JSON.parse(comments);
          }}*/
          parent={this.state.parent}
          getDrop={this.getDrop}
          findPost={this.findPost}
          dropId={this.dropId}
          chats={this.state.chats}
          invites={this.state.invites}
          selfvites={this.state.selfvites}
          fetchForum={this.fetchForum}
          fetchCommForum={this.fetchCommForum}
          lastComments={() => this.lastComments(this.state.profile)}
          undoComments={() => this.undoComments(this.state.profile)}
          lastPosts={
            this.state.chosenEntity
              ? () => this.lastPostsAs(this.state.chosenEntity)
              : this.lastPosts
          }
          undoPosts={
            this.state.chosenEntity
              ? () => this.undoPostsAs(this.state.chosenEntity)
              : this.undoPosts
          }
          //
          lastGlobalForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              this.lastGlobalForum(false, "new");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoGlobalForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");
              //
              //clearTimeout(this.slowPager);
            } else {
              this.undoGlobalForum(false, "new");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          //
          lastCityForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("last");
              this.lastCityForum(this.state.city, this.state.commtype);
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoCityForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("undo");
              this.undoCityForum(this.state.city, this.state.commtype);
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          //
          paginationhandle={paginationhandle}
          lastCommForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("last");
              this.paginateCommForum("last", "lastOld");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          undoCommForum={() => {
            this.setState({ slowPager: true });
            if (this.state.slowPager) {
              window.alert("woah there champ");

              //clearTimeout(this.slowPager);
            } else {
              console.log("undo");
              this.paginateCommForum("undo", "undoOld");
              this.slowPager = setTimeout(() => {
                this.setState({ slowPager: false });
              }, 2000);
            }
          }}
          fetchCommEvents={this.fetchCommEvents}
          fetchEvents={this.fetchEvents}
          timeFilterEvents={this.timeFilterEvents}
          timeFilterJobs={this.timeFilterJobs}
          range={this.state.range}
          queriedDate={this.state.queriedDate}
          getCommunity={async (x) => {
            var community = x && (await this.getCommunity(x).community());
            return community && JSON.parse(community);
          }}
          getCommunityByName={async (x) => {
            var community = x && (await this.getCommunityByName(x).community());
            return community && JSON.parse(community);
          }}
          hydrateUserFromUserName={async (username) => {
            var userResult =
              username && (await this.hydrateUserFromUserName(username).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateUser={async (userId) => {
            var userResult = userId && (await this.hydrateUser(userId).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateEntity={async (id, collection) => {
            var entity = await this.hydrateEntity(id, collection).entity();
            return entity && JSON.parse(entity);
          }}
          hydrateEntityFromName={async (collection, name, communityName) => {
            var entity = await this.hydrateEntityFromName(
              collection,
              name,
              communityName
            ).entity();
            return entity && JSON.parse(entity);
          }}
          cityapisLoaded={this.state.cityapisLoaded}
          edmStore={this.state.edmStore}
          cityapi={this.state.cityapi}
          stateapi={this.state.stateapi}
          getGlobalForum={this.getGlobalForum}
          onDelete={(id) => this.handleDelete(id)}
          handleSave={(note) => this.handleSave(note, "createNote")}
          loadingMessage={this.props.loadingMessage}
          //
          current={this.state.current}
          current1={this.state.current1}
          lastProfilePosts={this.props.lastProfilePosts}
        />
      </div>
    );
  }
} //<div>welcome to Thumbprint.us - Social Calendar</div>;
export default React.forwardRef((props, ref) => (
  <Data {...props} {...ref.current} />
));

/*if (match) {
  const dataChannel = window.dC[match];
  /*dataChannel={send: ƒ send() {}
  label: "forum/city,newLessonShow"
  ordered: true
  maxPacketLifeTime: null
  maxRetransmits: null
  protocol: ""
  negotiated: false
  id: null
  readyState: "connecting"
  bufferedAmount: 0
  bufferedAmountLowThreshold: 0
  onopen: ƒ () {}
  onbufferedamountlow: null
  onerror: null
  onclosing: null
  onclose: ƒ () {}
  onmessage: ƒ () {}
  binaryType: "arraybuffer"
  reliable: true
  close: ƒ close() {}
  addEventListener: ƒ addEventListener() {}
  dispatchEvent: ƒ dispatchEvent() {}
  removeEventListener: ƒ removeEventListener() {}
  <constructor>: "RTCDataChannel"}*
  //console.log(dataChannel);
  //ondatachannel
  dataChannel.onopen((ev) => {
    console.log(ev);
    rC = ev.channel; //RTCDataChannelEvent.channel;

    rC.onopen = (event) => console.log(event);
    rC.onclose = (event) => console.log(event);
    rC.onmessage = (result) => {*/
//console.log(res + " result");

/*if (!free.UPDATABLE) {
        return (async () =>
          await landerInterval(queryWithFixins, match, keepalive))();
      } else {
        UPDATABLE = true;
        return { docs, startAfter, endBefore, close,UPDATABLE };
      }*/
