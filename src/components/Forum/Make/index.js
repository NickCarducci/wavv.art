import React from "react";
import dayjs from "dayjs";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  list,
  updateMetadata,
  getMetadata,
  deleteObject
} from "firebase/storage";
import firebase, { firebaseConfig } from "../../.././init-firebase";
import evilfirebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as geofirestore from "geofirestore";
import settings from "../../.././settings.png";
import Confirm from "./Confirm";

import "./Make.css";
import "./imagelist.css";

import "../.././Calendar/DatepickerBackdrop.css";
import "../.././Calendar/PouchDBpages/plansettings.css";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where
} from "firebase/firestore";
import { specialFormatting, standardCatch } from "../../../widgets/Sudo";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Locate from "./Locate";
import { PDB } from "../Tools/Cal";

export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};
const planInitial = {
  term: null,
  saving: false,
  time: new Date(),
  planDateOpen: true,
  planSettingsOpen: false,
  center: "",
  location: [34.0522, -118.2437],
  makeEnterTitle: false
};
const socialInit = {
  places: [],
  images: [],
  search: "",
  lsearch: "",
  eventDateOpen: true,
  unmounted: false,
  ratings: []
};
const eventInitial = {
  ...socialInit,
  seatsioOpen: false,
  addTicketsOpen: false,
  allCharts: [],
  clientDesignerKey: "",
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: "",
  unmounted: false,
  ticketCategories: [],
  ticketName: "",
  ticketQuant: "",
  ticketPrice: "",
  vendorId: null,
  ratings: [],
  profile: { type: null, key: null }
};
const jobInitial = {
  ...socialInit,
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: ""
};
const clubInitial = {
  ...socialInit,
  seatsioOpen: false,
  addTicketsOpen: false,
  allCharts: [],
  clientDesignerKey: "",
  place_name: "",
  location: [{ lat: 34.0522, lng: -118.2436 }],
  center: "",
  stype: [],
  unmounted: false,
  canMakePayment: false,
  paymentRequest: true
};
const storage = getStorage(firebase);
const firestore = getFirestore(firebase);
class Make extends React.PureComponent {
  constructor(props) {
    super(props);
    var thing =
      this.props.initial === "plan"
        ? planInitial
        : this.props.initial === "event"
        ? eventInitial
        : this.props.initial === "job"
        ? jobInitial
        : this.props.initial === "housing"
        ? jobInitial
        : this.props.initial === "club"
        ? clubInitial
        : this.props.initial === "restaurant"
        ? clubInitial
        : this.props.initial === "service"
        ? clubInitial
        : this.props.initial === "shop"
        ? clubInitial
        : this.props.initial === "venue"
        ? clubInitial
        : this.props.initial === "ordinance"
        ? clubInitial
        : this.props.initial === "budget"
        ? clubInitial
        : this.props.initial === "class"
        ? clubInitial
        : this.props.initial === "department"
        ? clubInitial
        : null;
    thing.checkIn = false;
    thing.recipients = []; //props.recipients;
    thing.recipientSuggestionsProfiled = [];
    thing.topicSuggestions = ["*"];
    thing.lastRecipients = [];
    thing.entityId = null;
    thing.entityType = "users";
    thing.locationType = "city";
    this.state = {
      ...thing,
      eventDate: new Date(),
      lastMessage: "",
      body: "",
      subtype: [],
      newPhoto: {
        folder: "eventPhotos",
        type: "",
        title: "",
        blob: new Blob()
      },
      title: "",
      pathReference:
        this.props.auth !== undefined &&
        `personalCaptures/${this.props.auth.uid}/*`,
      //files: []
      rangeChosen: 1,

      db: new PDB()
    };
    this.portal = React.createRef();
  }

  componentWillUnmount = () => {
    /*
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }*/
    this.unmounted = true;
    clearTimeout(this.timezout);
  };
  queryPexels = async () => {
    const { title } = this.state;
    if (this.state.noPexels || this.state.chosenPhoto) return null;
    console.log("queryPexels", title);
    //(this.props.initial==="plan" && this.props.location.state) ||

    const done = title.split(" ").join("+");
    const url = `https://api.pexels.com/v1/search?query=${done}&per_page=9&page=1`;
    //return res.send(url)
    if (title !== "")
      await fetch(url, {
        headers: {
          Authorization:
            "563492ad6f91700001000001702cdbab8c46478a86694c18d3e1bc6b"
        }
      })
        .then(async (response) => await response.json())
        .then((results) => {
          //let images = []
          console.log(results);
          //images.push(results)
          this.setState({ images: results.photos });
        })
        .catch((err) => {
          console.log(err);
        });
  };
  planSubmit = () => {
    const { recipients } = this.state;
    if (false && recipients.length > 0 && this.state.subtype === "") {
      return (
        !this.state.pauseNeedTopic && this.setState({ pauseNeedTopic: true })
      );
    } else {
      let rec = recipients.constructor === Array ? recipients : [recipients];
      rec.push(this.props.auth.uid);
      var note = {
        title: this.state.title,
        body: this.state.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        date: this.state.eventDate,
        rangeChosen: this.state.rangeChosen,
        time: this.state.time,
        center: this.state.center,
        location: this.state.location,
        recipients: recipients,
        subtype: this.state.subtype,
        place_name: this.state.place_name,
        communityId: this.state.community && this.state.community.id
      };
      if (this.state.recipients.length > 0) {
        addDoc(collection(firestore, "chats"), {
          threadId:
            this.state.entityType + this.state.entityId + recipients.sort(),
          recipients: rec,
          topic: this.state.subtype,
          entityType: this.state.entityType,
          entityId: this.state.entityId,
          title: this.state.title,
          body: this.state.body,
          authorId: this.props.auth.uid,
          time: new Date(),
          date: this.state.eventDate,
          rangeChosen: this.state.rangeChosen,
          authoritarianTopic: false
        })
          .then(
            (docRef) => {
              console.log("Document written with ID: ", docRef.id);
              note._id = docRef.id;
              this.handleSave(note, "createNote");

              setDoc(doc(firestore, "calendar", docRef.id), {
                rangeChosen: this.state.rangeChosen,
                authorId: this.props.auth.uid,
                date: this.state.eventDate
              });
              this.props.navigate.push("/");
            },
            (e) => console.log(e.title)
          )
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        note.authorId = //authorId if in chat, it's an array
          recipients.length > 0
            ? rec
            : this.props.auth !== undefined
            ? this.props.auth.uid
            : "";
        note.chosenPhoto = this.state.chosenPhoto;
        addDoc(collection(firestore, "chats"), {
          threadId: "",
          recipients:
            this.props.auth !== undefined ? [this.props.auth.uid] : [],
          topic: "",
          entityType: "",
          entityId: "",
          title: "",
          body: "",

          authorId: this.props.auth !== undefined ? this.props.auth.uid : "",
          time: "",
          date: "",
          authoritarianTopic: false
        })
          .then(
            (docRef) => {
              console.log("Document written with ID: ", docRef.id);
              note._id = docRef.id;
              this.handleSave(note, "createNote");

              setDoc(doc(firestore, "calendar", docRef.id), {
                rangeChosen: this.state.rangeChosen,
                authorId:
                  this.props.auth !== undefined ? this.props.auth.uid : "",
                date: this.state.eventDate
              });
              this.props.navigate.push("/");
            },
            (e) => console.log(e.title)
          )
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    }
  };
  async handleSave(note, method) {
    var foo = await this.state.db[method](note);
    return foo;
  }
  makeEntityEvent = (coll) => {
    this.setState({ images: [] });
    const GeoFirestore = geofirestore.initializeApp(
        evilfirebase.initializeApp(firebaseConfig).firestore()
      ),
      geocollection = GeoFirestore.collection(coll),
      geopoint = new evilfirebase.firestore.GeoPoint(
        Number(this.state.center[0]),
        Number(this.state.center[1])
      );
    var array = [];
    const c = this.state.title.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      array.push(c.substring(0, i));
    }
    var dataobj = {
      collection: this.props.initial,
      entityId: this.state.entityId,
      entityType: this.state.entityType,
      coordinates: geopoint,
      //rangeChosen: this.state.rangeChosen,
      title: this.state.title,
      titleAsArray: array,
      body: this.state.body,
      chosenPhoto:
        this.state.file ||
        this.state.chosenPhoto.src
          .medium /*{
        large: this.state.chosenPhoto.src.large,
        medium: this.state.chosenPhoto.src.medium,
        small: this.state.chosenPhoto.src.small,
        photographer: this.state.chosenPhoto.photographer,
        photographer_url: this.state.chosenPhoto.photographer_url
      }*/,
      date: this.state.eventDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtype: this.state.subtype,
      authorId: this.props.auth.uid,
      //admin: [],
      //vendorID
      //entityId: this.props.entity.id ? this.props.entity.id : null,
      //profile: this.state.profile,
      place_name: this.state.place_name,
      center: this.state.center,
      communityId: this.state.community ? this.state.community.id : null,
      city: this.state.city
    };
    if (!["job", "housing", "event"].includes(coll)) delete dataobj.rangeChosen;
    geocollection
      .add(dataobj)
      .then((res) => {
        const resp = res.id;
        if (coll === "event")
          this.state.ticketCategories.length > 0 &&
            geocollection.doc(resp).update({
              ticketCategories: this.state.ticketCategories
            });
        this.setState({ loadingSubmitted: false, success: true }, () => {
          this.props.navigate("/");
          setTimeout(() => this.setState({ success: false }), 5000);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getFolders = async (folderReference) =>
    await this.props.storageRef
      .child(folderReference)
      .listAll()
      .then((res) => {
        console.log("folders in: ");
        console.log(folderReference);
        //console.log(res); //{prefixes: Array(0), items: Array(1)}
        let folders = [];
        let p = 0;
        res._delegate.prefixes.forEach((reference) => {
          p++;
          // All the items under listRef.
          var food = reference._location.path_;
          //console.log(food);
          var foo = food.split(`personalCaptures/${window.meAuth.uid}/`)[1];
          folders.push(foo);
        });
        if (res.prefixes.length === p) {
          //console.log(folders);
          this.setState({ folders });
        }
      })
      .catch(standardCatch);
  getFiles = async (pathReference, pageToken) => {
    await list(ref(storage, pathReference), { maxResults: 20, pageToken })
      .then((res) => {
        let p = 0;
        console.log(res);
        this.setState({
          pageToken: res.nextPageToken
        });
        //res._delegate.prefixes.forEach((folderRef) => folderRef.listAll());
        Promise.all(
          res /*._delegate*/.items
            .map(async (reff) => {
              const reference = ref(storage, reff.fullPath);
              const metadata = await getMetadata(reference).catch((e) =>
                  console.log(e, "file metadata")
                ),
                gsUrl = await getDownloadURL(reference);
              //metadata, ref
              return new Promise(async (r) => {
                const done =
                  metadata &&
                  gsUrl &&
                  JSON.stringify({
                    ref: reference,
                    gsUrl,
                    metadata
                  });
                return done && r(done);
              });
            })
        )
          .then((files) => files.map((x) => JSON.parse(x)))
          .then((files) => {
            console.log(files.length + " files downloaded ", files);
            //this.unloadGreenBlue();
            this.setState({ files });
          });
      })
      .catch(standardCatch);
  };
  componentDidMount = async () => {
    if (this.props.auth !== undefined) {
      //this.getFiles(this.state.pathReference);
      if (this.props.planInitial) {
        var recipients =
          this.props.location.state && this.props.location.state.recipients
            ? new Set([...this.props.location.state.recipients])
            : this.props.recipients;
        recipients = this.props.recipients.filter(
          (b) => b !== this.props.auth.uid
        );
        await Promise.all(
          recipients.map(async (x) => await this.props.hydrateUser(x))
        ).then((recipientSuggestionsProfiled) => {
          this.setState({ recipientSuggestionsProfiled });
        });

        if (this.props.location.state) {
          var sendTitlePlan = this.props.location.state.sendTitlePlan;
          var title = specialFormatting(sendTitlePlan);

          var entityId = this.props.location.state.entityId;
          var entityType = this.props.location.state.entityType;
          this.setState({
            recipients,
            title,
            entityId,
            entityType,
            topicSuggestions: [...this.props.location.state.topics]
          });
        } else {
          var person = window.location.pathname.split("/bk/")[1];
          if (person) {
            var date1 = person.split("/")[1];
            var hours1 = 0;
            //var hours = 0;
            var minutes1 = 0;
            var profile = await this.props.hydrateUserFromUserName(person);
            this.setState({ recipients: [profile.id] });
            if (date1) {
              hours1 = date1.split("/")[1];
              if (hours1) {
                date1 = date1.split("/")[0];
                minutes1 = hours1.split(":")[1];
                if (minutes1) {
                  //hours = hours1.split(":")[0];
                  this.setState({
                    eventDate: new Date(
                      new Date(date1.replace(/-/g, "/")).setHours(
                        hours1,
                        minutes1,
                        0,
                        0
                      )
                    )
                  });
                } else {
                  this.setState({
                    eventDate: new Date(
                      new Date(date1.replace(/-/g, "/")).setHours(
                        hours1,
                        0,
                        0,
                        0
                      )
                    )
                  });
                }
              } else {
                this.setState({
                  eventDate: new Date(
                    new Date(date1.replace(/-/g, "/")).setHours(12, 0, 0, 0)
                  )
                });
              }
            }
          }
          if (this.props.location.state) {
            if (window.location.pathname === "/") {
              if (this.props.location.state.fromMap && this.props.forumOpen) {
                this.setState({
                  forumOpen: false,
                  started: false
                });
              }
            }
          }
        }
      }
    }
  };
  render() {
    const { eventDate } = this.state;
    const numberEntered = /^[\d]/;
    const entityTypeChosen = [
      "club",
      "shop",
      "restaurant",
      "service",
      "page",
      "venue"
    ].includes(this.props.initial);

    const eventTypeChosen = ["housing", "event", "job", "plan"].includes(
      this.props.initial
    );
    function renderTime(eventDate) {
      let d = dayjs(eventDate);
      return d.format("h:mm a");
    }
    function renderDate(eventDate) {
      let d = dayjs(eventDate);
      return d.format("MMMM D YYYY");
    }
    const { pleaseNewClubname, noPexels } = this.state;
    var datenotime = new Date();
    datenotime.setHours(eventDate.getHours(), eventDate.getMinutes(), 0, 0);
    eventDate.setSeconds(0);
    eventDate.setMilliseconds(0);
    var diffDays = Math.round(
      (datenotime.getTime() - eventDate.getTime()) / 86400000
    );
    var is_negative = diffDays < 0;
    const typer = this.state.subtype.length === 0;
    const makeFancy = (d, sh = "/") => {
      //console.log(d);
      return isNaN(d)
        ? ""
        : d.getMonth() + 1 + `${sh + d.getDate() + sh + d.getFullYear()}`;
    };
    const space = " ",
      namecheck = (city, coll) => {
        //const firestore = firebase.firestore();
        console.log(city, coll);
        let empty = [];
        const colle = entityTypeChosen ? "entity" : "event";
        getDocs(
          query(
            collection(firestore, colle),
            where("city", "==", city),
            where(
              "titleAsArray",
              "array-contains",
              this.state.title.toLowerCase()
            )
          )
        )
          .then(
            (querySnapshot) => {
              if (querySnapshot.empty) {
                console.log("citycheck");
                return this.makeEntityEvent(colle);
              } else {
                console.log("city has");
                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists()) {
                    const foo = doc.data();
                    foo.id = doc.id;
                    console.log("city has");
                    this.setState({
                      pleaseNewClubname: this.state.place_name,
                      checkIn: false
                    });
                  }
                });
              }
            },
            (e) => console.log(e)
          )
          .catch((e) => console.log(e));
      },
      citycheck = async (place_name) => {
        console.log("place_name", place_name, this.state.title);
        await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${place_name}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
        )
          .then(async (response) => await response.json())
          .then((body) => {
            var prediction = body.features[0];
            this.setState(
              {
                city: prediction.place_name //.replace(/, /g, " ")
              },
              () => {
                console.log("city", prediction.place_name);

                const colle = entityTypeChosen ? "entity" : "event";
                if (!entityTypeChosen) return this.makeEntityEvent(colle);
                namecheck(prediction.place_name, this.props.initial);
              }
            );
          })
          .catch((err) => console.log(err));
      },
      checkComms = (communityId) => {
        const { initial } = this.props,
          firestore = firebase.firestore();
        //const GeoFirestore = geofirestore.initializeApp(firestore);
        console.log(initial);
        var thisone = this.props.communities.find((x) => x.id === communityId);
        const isEntity = [
          "club",
          "shop",
          "restaurant",
          "service",
          "page",
          "venue"
        ].includes(this.props.initial);
        if (isEntity)
          //housing,job,event
          return this.makeEvent(this.props.initial);
        getDocs(
          query(
            collection(firestore, "entity"),
            where("communityId", "==", communityId),
            where(
              "titleAsArray",
              "array-contains",
              this.state.title.toLowerCase()
            )
          )
        ).then(
          (querySnapshot) => {
            if (querySnapshot.empty) {
              console.log("empty");
              //empty.push("empty");
              //if (empty.length === 5) {
              return citycheck(this.state.place_name);
              //} else return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  console.log("comm has");
                  this.setState({
                    pleaseNewClubname: thisone.title,
                    checkIn: false
                  });
                }
              });
            }
          },
          (e) => console.log(e.title)
        );
      };
    //console.log("coords", this.state.center);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const chosenPhoto = this.state.fileUrl
            ? this.state.fileUrl
            : this.state.chosenPhoto;
          if (this.props.initial !== "plan" && !chosenPhoto) return null;

          if (
            this.state.place_name ||
            this.state.community ||
            this.props.initial === "plan"
          ) {
            var title = this.state.title;
            if (this.props.initial !== "plan" && !this.state.checkIn)
              return this.setState({
                images: [],
                checkIn: true,
                createdAt: new Date()
              });
            var answer = window.confirm(
              "Want to call the " + this.props.initial + " " + title + "?"
            );
            if (!answer) {
              title = window.prompt("Title");
              if (!title) return null;
              return this.setState({
                title: specialFormatting(title)
              });
            }
            if (this.props.auth === undefined)
              return window.alert("please sign in");
            if (this.props.initial === "plan") {
              return this.planSubmit();
            }
            if (this.state.communityId)
              return checkComms(this.state.communityId);
            if (this.state.place_name) return citycheck(this.state.place_name);
            console.log("no location");
          } else window.alert("Please provide an event address");
        }}
        style={{
          //display: this.props.materialDateOpen ? "none" : "block",
          position: "relative",
          transition: ".3s ease-in",
          width: "100%"
        }}
      >
        {eventTypeChosen && (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DemoContainer components={["DatePicker"]}>
              <DateTimePicker
                label="Find your Date"
                value={dayjs(this.state.eventDate)}
                onChange={(newValue) =>
                  this.setState({ eventDate: new Date(newValue) })
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        )}
        {/*<ReactDatePicker
          //customInput={<Calendar />}
          //showIcon
          className="inputdatepicker"
          //ref={this.portal}
          placeholderText="Will Call"
          selected={eventDate}
          onCalendarClose={() => this.setState({ proposal: null })}
          dateFormat="MMMM d, yyyy h:mm aa"
          onChange={(date) => {
            //console.log(new Date(date).getTime());
            this.setState(
              {
                eventDate: date
              },
              () => {
                if (!this.props.isAdmin) return null;
                const dt = new Date(date);
                //console.log(this.props.makeFancy(dt));
                const answer = window.confirm(
                  "update will call to " +
                    makeFancy(dt) +
                    " for the same price of " +
                    this.state.proposal.cost +
                    "?"
                );
                answer &&
                  updateDoc(
                    doc(firestore, "proposals", this.state.proposal.id),
                    {
                      eventDate: new Date(date).getTime() / 1000
                    }
                  ).then((proposal) => this.setState({ proposal: null }));
              }
            );
          }}
          //inline
          //withPortal
          //portalId="root-portal"
        />*/}
        <div
          style={{
            position: "relative",
            alignItems: "center",
            width: "100%",
            //minHeight: "356px",
            backgroundColor:
              this.props.initial === "plan" ? "#2fbaff" : "#be52ff",
            color: `rgba(255, 255, 255, ${this.props.success ? 0.644 : 1})`,
            fontSize: "26px"
          }}
        >
          {["plan", "event"].includes(this.props.initial) && "hours:"}
          {space}
          {["plan", "event"].includes(this.props.initial) && (
            <input
              step=".1"
              type="number"
              style={{
                width: "50px",
                height: "18px",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px"
              }}
              onChange={(e) => {
                const rangeChosen = e.target.value;
                rangeChosen > 0 && this.setState({ rangeChosen });
              }}
              value={this.state.rangeChosen}
            />
          )}
          {/*this.props.success
            ? `${this.props.title} created!`
          : this.props.initial*/}
          <img
            src={settings}
            style={{
              zIndex: 1,
              position: "absolute",
              right: "0px",
              margin: "8px",
              height: "18px"
            }}
            onClick={() => {
              this.setState({ openDetails: !this.state.openDetails });
            }}
            alt="settings"
          />
        </div>
        {this.state.noPexels && (
          <input
            key={this.state.clear ? 0 : 1}
            style={{
              margin: "3px",
              maxWidth: "calc(100% - 6px)",
              width: "min-content",
              borderRadius: "2px"
              //border: "3px solid blue"
            }}
            type="file"
            onChange={(event) => {
              // Update the state
              // const fileReader = new window.FileReader();
              var answer = window.confirm("begin upload?");
              if (answer) {
                const { pathReference } = this.state;
                var file = event.target.files[0];
                if (file) {
                  const { type } = file;
                  console.log("file " + type, file);
                  if (
                    type === "image"
                    //["application/pdf", "video"].includes(type)
                  ) {
                    const blob = new Blob([file], {
                        type //"video/mp4"
                      }),
                      url = this.URL.createObjectURL(blob);
                    console.log("blob url", url);
                    this.setState({ file, url, blob }, () => {
                      //const { newPhoto } = this.state;
                      if (!file.title) return null;
                      if (file.title.includes("/"))
                        return window.alert("/ forbidden in title");
                      console.log("newPhoto type", file.type);
                      var filename = file.title; //+ x.type.split("/")[1].toLowerCase();
                      var itemRef = this.storageRef.child(
                        pathReference + "/" + filename
                      );
                      itemRef
                        .put(file.blob)
                        .then((snapshot) => {
                          console.log(snapshot);
                          console.log(
                            `${filename}.${file.type.split("/")[1]}` +
                              " added to " +
                              pathReference
                          );
                          if (
                            this.props.videos &&
                            this.props.videos.length > 0
                          ) {
                            //var folderReference = `personalCaptures/${this.props.auth.uid}/*`;

                            this.getFolders(pathReference);
                          }
                          this.getFiles(pathReference);
                        })
                        .catch((err) => console.log(err.title));
                    });
                  } else return window.alert(`unsupported file type ${type}`);
                }
              }
            }}
          />
        )}
        {this.state.noPexels && (
          <div style={{ columnCount: "3" }}>
            {this.state.files &&
              this.state.files.map((file) => {
                const revert = (x) => {
                    updateMetadata(x.ref, {
                      customMetadata: {
                        public: false
                      },
                      metadata: {
                        description: "no description",
                        modified: new Date()
                      }
                    })
                      .then(() => this.props.unloadGreenBlue())
                      .catch((err) => console.log(err.message));
                  },
                  confirmRating = (x) => {
                    updateMetadata(x.ref, {
                      customMetadata: {
                        ageAppropriate: true
                      },
                      metadata: {
                        description: "no description",
                        modified: new Date()
                      }
                    })
                      .then(() => {
                        this.props.unloadGreenBlue();
                        var folderReference = `personalCaptures/${this.props.auth.uid}`;
                        //this.props.getFolders(folderReference);
                        var pathReference = `${folderReference}/${"*"}`;
                        this.getFiles(pathReference);
                      })
                      .catch((err) => console.log(err.message));
                  },
                  applyApropos = (x) => {
                    this.props.loadGreenBlue("sending to deepai for rating...");
                    //return console.log(x);

                    updateMetadata(x.ref, {
                      customMetadata: {
                        public: true
                      },
                      metadata: {
                        description: "no description",
                        modified: new Date()
                      }
                    })
                      .then(async () => {
                        if (
                          !x.metadata ||
                          !x.metadata.customMetadata ||
                          !x.metadata.customMetadata.ageAppropriate
                        ) {
                          this.deepai = window.deepai;
                          this.deepai.setApiKey(
                            "fbc3602b-4af4-4b5e-81fb-8a4407b75eab"
                          );
                          var output = await this.deepai.callStandardApi(
                            "content-moderation",
                            {
                              image: x.gsUrl
                            }
                          );
                          var result = output.output;
                          if (result) {
                            console.log(result);
                            console.log(
                              "deepai nudity score " + result.nsfw_score
                            );
                            if (result.nsfw_score > 0.7) {
                              window.alert(
                                "we cannot store this video, it does not pass our nudity test"
                              );
                              //move to pouchdb
                              //delete from cloud storage
                            } else if (result.nsfw_score) {
                              confirmRating(x);
                            } else {
                              revert(x);
                              return window.alert(result);
                            }
                          } else {
                            revert(x);
                            return window.alert(
                              "file moderation analysis error, will not add ageAppropriate tag"
                            );
                          }
                        } else {
                          confirmRating(x);
                        }
                      })
                      .catch((err) => console.log(err.message));
                  };
                return file.type === "video" ? (
                  <video></video>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div
                      //airplane air plane
                      //className="fa fa-send-o"
                      style={{
                        fontWeight: "border",
                        zIndex: "9999",
                        color:
                          file.metadata &&
                          file.metadata.customMetadata &&
                          file.metadata.customMetadata.ageAppropriate
                            ? "lightskyblue"
                            : "white",
                        borderRadius: "6px",
                        padding: "2px",
                        left: "8px",
                        top: "8px",
                        fontSize: "12px",
                        position: "absolute",
                        backgroundColor: "rgb(20,20,30)",
                        border: "2px solid"
                      }}
                      onClick={
                        !file.metadata ||
                        !file.metadata.customMetadata ||
                        !file.metadata.customMetadata.public
                          ? () => applyApropos(file)
                          : () =>
                              this.setState({
                                noPexels: false,
                                fileUrl: file.gsUrl
                              })
                      }
                    >
                      {"^"}
                    </div>
                    <div
                      //airplane air plane
                      //className="fa fa-send-o"
                      style={{
                        fontWeight: "border",
                        zIndex: "9999",
                        color:
                          file.metadata &&
                          file.metadata.customMetadata &&
                          file.metadata.customMetadata.ageAppropriate
                            ? "lightskyblue"
                            : "white",
                        borderRadius: "6px",
                        padding: "2px",
                        right: "8px",
                        top: "8px",
                        fontSize: "12px",
                        position: "absolute",
                        backgroundColor: "rgb(20,20,30)",
                        border: "2px solid"
                      }}
                      onClick={() => {
                        const desertRef = ref(storage, file.metadata.fullPath);
                        var answer = window.confirm("Delete?");
                        answer &&
                          deleteObject(desertRef)
                            .then(() => {
                              // File deleted successfully
                            })
                            .catch((error) => {
                              // Uh-oh, an error occurred!
                            });
                      }}
                    >
                      &times;
                    </div>
                    <img
                      src={file.gsUrl}
                      alt={file.name}
                      style={{ width: "100%" }}
                    />
                  </div>
                );
              })}
          </div>
        )}
        <div
          style={{
            display: this.state.files && this.state.noPexels ? "flex" : "none",
            justifyContent: "space-around"
          }}
        >
          <div
            style={{
              padding: "10px"
            }}
            onClick={() => {
              this.getFiles(this.state.pathReference);
            }}
          >
            {"<"}
          </div>
          <div
            style={{
              padding: "10px"
            }}
            onClick={() => {
              this.getFiles(this.state.pathReference, this.state.pageToken);
            }}
          >
            {">"}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          {this.state.typing ? (
            <div
              style={{
                zIndex: "1",
                position: "absolute",
                backgroundColor: "#999",
                width: "100%",
                height: "100px"
              }}
            >
              <div className="loadingAuthScreen1">
                <div />
              </div>
            </div>
          ) : null}
          <div className="pexelsmemo">
            Photos provided by <a href="https://www.pexels.com/">Pexels</a>
          </div>
          {this.state.chosenPhoto && (
            <div
              style={{
                color: "white",
                zIndex: "1",
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "20px"
              }}
              onClick={() =>
                this.setState({
                  title: "",
                  chosenPhoto: null,
                  images: []
                })
              }
            >
              &times;
            </div>
          )}
          {!this.state.noPexels && (
            <input
              //type="text"
              value={this.state.title}
              name="title"
              id="title"
              maxLength="24"
              /*className={
                !this.props.planInitial || noPexels
                  ? "titleofevento"
                  : "titleofeventp"
                }*/
              placeholder="Title"
              //autoFocus={true}
              autoComplete="off"
              //onFocus={() => window.scrollTo(0, 0)}
              //onClick={this.focus}
              required
              autoCorrect="off"
              onChange={(e) => {
                this.setState(
                  {
                    typing:
                      !this.state.fileUrl &&
                      !this.state.chosenPhoto &&
                      this.props.initial !== "plan",
                    pleaseNewClubname: false,
                    title: specialFormatting(e.target.value)
                  },
                  () => {
                    if (this.state.title === "")
                      return this.setState({ typing: false });
                    clearTimeout(this.timezout);
                    this.timezout = setTimeout(() => {
                      this.setState({ typing: false });
                      if (this.state.fileUrl) return null;
                      console.log("searching...", this.state.title);
                      this.props.initial !== "plan" && this.queryPexels();
                    }, 3000);
                  }
                );
              }}
              //onKeyUp={this.props.keyUp}
              style={{
                zIndex: "1",
                position: "absolute",
                width: "100%",
                border: "none",
                borderBottom: "1px dashed",
                background:
                  "linear-gradient(rgba(5,5,10,.6), rgba(250,250,250,0),rgba(250,250,250,0),rgba(250,250,250,0))",

                backgroundColor: "rgba(0, 0, 0, 0.7)",
                fontSize: "26px",
                color:
                  !this.props.initial !== "plan" || noPexels
                    ? "white"
                    : "rgb(150,150,150)"
              }}
            />
          )}
          {this.props.initial !== "plan" && (
            <div
              onClick={() => {
                if (this.props.auth === undefined)
                  return window.alert("please login to view your files");
                if (!this.state.files) this.getFiles(this.state.pathReference);
                this.setState(
                  { noPexels: !this.state.noPexels, fileUrl: null, images: [] },
                  () => {}
                );
              }}
              style={{
                right: "0px",
                borderRadius: "10px",
                border: `${noPexels ? 1 : 0}px solid white`,
                display: "flex",
                zIndex: "1",
                position: "absolute",
                color: noPexels ? "white" : "rgb(150,150,150)",
                top: "0px",
                paddingRight: "15px",
                paddingTop: "15px",
                paddingLeft: "4px",
                height: "21px",
                width: "45px"
              }}
            >
              +Pic
            </div>
          )}
          {eventTypeChosen ? (
            <div
              style={{
                color: "white",
                bottom: "10px",
                display: "flex",
                zIndex: "1",
                position: "absolute",
                left: "15px"
              }}
            >
              {diffDays === 0
                ? `${WEEK_DAYS[eventDate.getDay()]} ${renderDate(eventDate)}`
                : diffDays === -1
                ? `${WEEK_DAYS[eventDate.getDay()]} ${renderDate(eventDate)}`
                : diffDays === 1
                ? `${WEEK_DAYS[eventDate.getDay()]} ${renderDate(eventDate)}`
                : is_negative
                ? `${WEEK_DAYS[eventDate.getDay()]} ${renderDate(eventDate)}`
                : `${WEEK_DAYS[eventDate.getDay()]} ${renderDate(eventDate)}`}
              <br />
              {
                diffDays === 0 ? renderTime(eventDate) : renderTime(eventDate) //note.date.toLocaleString([], { hour12: true })
              }
              ,&nbsp;
              {diffDays === 0
                ? `TODAY`
                : diffDays === -1
                ? `TOMORROW`
                : diffDays === 1
                ? `YESTERDAY`
                : is_negative
                ? `in ${Math.abs(diffDays)} days`
                : `${diffDays} days ago`}
            </div>
          ) : null}
          {this.state.chosenPhoto || this.state.fileUrl ? (
            <img
              style={{
                color: "white",
                position: "relative",
                height: "auto",
                width: "100%"
              }}
              src={
                this.state.chosenPhoto
                  ? this.state.chosenPhoto.src.large
                  : this.state.fileUrl
              }
              alt={this.state.fileUrl ? this.state.fileUrl : "pexels"}
            />
          ) : (
            <div
              style={{
                display: "flex",
                position: "relative",
                textAlign: "center",
                width: "100%",
                height: "170px",
                bottom: "0%",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 1)",
                border: "none",
                fontSize: "26px"
              }}
            />
          )}
        </div>
        <div
          style={{
            background: "linear-gradient(black,rgba(0,0,0,.1))",
            backgroundColor: "rgb(5,5,10)",
            //minHeight: "150px",
            display: "block",
            position: "relative",
            width: "100%",

            columnCount: "3",
            columnGap: "0"
            //gridTemplateColumns: "1fr 1fr 1fr"
          }}
        >
          {this.state.images ? (
            this.state.images.map((image, i) => {
              //console.log(image);
              return (
                <img
                  key={i}
                  onClick={() =>
                    this.setState({
                      chosenPhoto: image,
                      images: []
                    })
                  }
                  style={{
                    position: "relative",
                    width: "100%",
                    WebkitColumnBreakInside: "avoid",
                    pageBreakInside: "avoid",
                    breakInside: "avoid"
                  }}
                  src={image.src.medium}
                  alt="error"
                />
              );
            })
          ) : (
            <div>nothing for this title</div>
          )}
        </div>
        {pleaseNewClubname && (
          <div style={{ color: "white" }}>
            Please choose another {this.props.initial} title, or make it
            elsewhere than {pleaseNewClubname}
          </div>
        )}
        {this.props.initial !== "plan" && (
          <Locate
            place_name={this.state.place_name}
            setCommunity={(x) => this.setState(x)}
            auth={this.props.auth}
            communityId={this.state.communityId}
            selectAddress={(prediction) => {
              this.setState({
                community: prediction.message && prediction,
                place_name: prediction.place_name,
                center: [prediction.center[1], prediction.center[0]]
              });
            }}
            clearlocation={() => this.setState({ place_name: "", center: [] })}
            initial={this.props.initial}
          />
        )}
        <textarea
          type="search"
          name="body"
          id="body"
          rows="2"
          cols="20"
          wrap="hard"
          style={{
            width: "100%"
          }}
          onChange={(e) => {
            this.setState({
              body: e.target.value
            });
          }}
          placeholder="Write details here"
          autoComplete="off"
          onFocus={() => window.scrollTo(0, 0)}
        />
        {this.props.initial === "event" && (
          <div
            style={{
              display: "inline-block",
              margin: "5px",
              fontSize: "15px",
              position: "relative",
              height: "min-content",
              color: "grey",
              justifyContent: "center"
            }}
          >
            Add tickets{space}
            <i>from event-edit page</i>
            {space}after you post{space}
            <b>subtype-entity</b> item.
            <br />
            <span
              style={{
                fontSize: "12px"
              }}
            >
              Access this event page from your profile, or search for it by
              name.
            </span>
          </div>
        )}
        <div
          style={{
            width: "100%",
            position: "relative"
          }}
        >
          {(this.state.place_name || this.props.initial === "plan") &&
            this.state.checkIn && (
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  padding: "30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "85%",
                  marginBottom: "5px",
                  borderColor: "10px #999 solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: "0px",
                  backgroundColor: "#333",
                  border: "10px rgba(255, 255, 255, 0.381) solid",
                  color: "white",
                  fontSize: "23px",
                  borderRadius: "20px"
                }}
              >
                {typer ? "Choose a type" : "Submit"}
              </div>
            )}
        </div>
        {this.props.allow && (
          <button
            style={{
              transform: "translateY(40px)",
              borderRadius: "12px",
              bottom: "0px",
              userSelect: "none",
              display: "flex",
              position: "absolute",
              right: "5px",
              padding: "0px 10px",
              margin: "10px",
              height: "36px",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "blue",
              color: "white",
              zIndex: "6"
            }}
            type="submit"
          >
            Send
          </button>
        )}
        {this.state.checkIn && (
          <Confirm
            initial={this.props.initial}
            subtype={this.state.subtype}
            back={() =>
              this.setState({
                checkIn: false
              })
            }
            setType={(x) => this.setState(x)}
            auth={this.props.auth}
            users={this.props.users}
            topicSuggestions={this.state.topicSuggestions}
            entityType={this.state.entityType}
            entityId={this.state.entityId}
            setEntity={(x) => this.setState(x)}
            recipientSuggestionsProfiled={
              this.state.recipientSuggestionsProfiled
            }
            setRecipients={(x) => this.setState(x)}
            recipients={this.state.recipients}
            numberEntered={numberEntered}
            setPoster={(x) => this.setState(x)}
            myClubs={this.props.myClubs}
            myShops={this.props.myShops}
            myServices={this.props.myServices}
            myClasses={this.props.myClasses}
            myPages={this.props.myPages}
            myRestaurants={this.props.myRestaurants}
            myDepartments={this.props.myDepartments}
          />
        )}
      </form>
    );
  }
}
export default Make;

/*<Unsplash expand /*keywords={title} photoID={this.state.chosenPhoto} />*/
/*<form
  onSubmit={
    /*this.state.images === [] &&
    !this.state.chosenPhoto &&
    this.props.initial !== "plan"
      ? (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.state.title !== this.state.lastTitle) {
            this.setState({ lastTitle: this.state.title });
            this.queryPexels();
          }
          //
        }
      : * /

    !this.state.chosenPhoto && !this.props.initial !== "plan"
      ? (e) => {
          e.preventDefault();
          e.stopPropagation();
          var c = window.confirm("please choose a photo");
          c && window.focus();
          c && window.scrollTo(0, 0);
        }
      : (e) => this.handleSubmit(e)
  }
  style={{
    display: "flex",
    position: "relative"
  }}
>
{eventTypeChosen && chosenPhoto && !this.state.checkIn ? (
  <div
    onClick={() =>
      this.setState({
        title: "",
        chosenPhoto: null,
        images: []
      })
    }
  >
    &times;
  </div>
) : null}*/
