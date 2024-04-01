import React from "react";
import firebase from "../../.././init-firebase";
import Linker from "./toolkit/Linker";
import NewDrop from "../../.././App/Post/NewDrop";
import UseEntity from "./UseEntity";
import SaveDrafts from "./toolkit/SaveDrafts";
import EmbeddedRebeat from "../../../App/Post/PeanutGallery/EmbeddedRebeat";
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
import { arrayMessage } from "../../../widgets/Sudo";
import { standardCatch } from ".";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const firestore = getFirestore(firebase);
export default class NewPost extends React.Component {
  state = {
    closeDrop: true,
    setURL: "",
    settedURL: "",
    message: "",
    optionsToPost: [],
    twitterString: "",
    eventDate: new Date()
  };
  componentDidUpdate = async (prevProps) => {
    if (this.props.rebeat && this.props.rebeat !== prevProps.rebeat) {
      this.setState({
        droppedPost: this.props.rebeat
      });
    }
    if (this.state.message !== this.state.lastMessage) {
      this.setState({ lastMessage: this.state.message }, () => {
        if (this.state.message !== "" && this.props.auth !== undefined) {
          clearTimeout(this.saveDraft);
          this.saveDraft = setTimeout(() => {
            !this.props.user.dontSaveDrafts &&
              this.state.message.length - this.props.user.savedDraft > 3 &&
              updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
                savedDraft: this.state.message
              })
                .then(() => this.setState({ savedDraft: this.state.message }))
                .catch(standardCatch);
          });
        }
      });
    }
    if (
      this.state.settedURL !== this.state.lastSettedURL &&
      this.state.settedURL
    ) {
      this.setState({ lastSettedURL: this.state.settedURL });
      var thisIsATweet =
        this.state.settedURL.includes("https://twitter.com") ||
        this.state.settedURL.includes("https://www.twitter.com");
      if (thisIsATweet) {
        var twitterString = `${
          this.state.settedURL.split("/status/")[1].split("?")[0]
        }`;
        this.setState({ twitterString }, () => {});
        //this.tweetEmbed(string)

        var result = this.state.settedURL.replace(/:/g, "%3A");
        result = result.replace(/\//g, "%2F");
        await fetch(`https://publish.twitter.com/oembed?url=${result}`, {
          mode: "no-cors",
          headers: {
            Accept: "jsonp",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          //.then(async (res) => await res.json())
          .then((x) => {
            const element = document.createElement(twitterString);
            element.type = "text/html";
            element.async = true;
            element.innerHTML = x.html;
            window.twttr.widgets.createTweet(
              "20",
              document.getElementById(twitterString),
              {
                theme: "dark"
              }
            );
            document.getElementById(twitterString).append(element);
            document.getElementById(twitterString).style.width = `100%`;
            document.getElementById(twitterString).style.position = `relative`;
          })
          .catch((e) => console.log(e.message));
      }
    }
  };
  componentWillUnmount = () => {
    if (this.state.droppedPost) {
      this.handleDelete();
    }
    this.props.cancelRebeat({ rebeat: null });
    this.setState({ droppedPost: null, closeDrop: true });
    clearTimeout(this.resizeTimer);
  };
  handleDelete = () => {
    const { droppedPost } = this.state;
    deleteDoc(doc(firestore, "forum", droppedPost.id))
      .then(() => {
        this.props.cancelRebeat({ rebeat: null });
        this.setState({
          droppedPost: null,
          closeDrop: true
        });
        console.log("deleted progress");
      })
      .catch((e) => console.log(e.message));
  };
  handleNewDroppedPost = () => {
    var add = { authorId: "" };
    if (this.props.auth !== undefined) add = { authorId: this.props.auth.uid };

    addDoc(collection(firestore, "forum"), add)
      .then((doc) => {
        console.log("droppedPost made " + JSON.stringify(add));
        this.setState({ droppedPost: { id: doc.id, ...add } });
        onSnapshot(
          doc(firestore, "forum", doc.id),
          (doc) => {
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              foo.collection = "forum";
              this.setState({ droppedPost: foo });
            }
          },
          (e) => console.log(e.message)
        );
      })
      .catch((e) => console.log(e.message));
  };
  openDrop = (x) => {
    const { droppedPost } = this.state;
    this.setState(x);
    if (!droppedPost) {
      this.handleNewDroppedPost();
    } else if (droppedPost) {
      console.log("droppedPost deleted");
      this.handleDelete();
    } else {
      window.alert("unhandled");
    }
  };
  handleSubmit = (e) => {
    const { community } = this.props;
    const { droppedPost } = this.state;
    e.preventDefault();
    if (this.props.auth === undefined) {
      var answer = window.confirm("Please sign in");
      answer && this.props.getUserInfo();
    } else {
      if (
        !community ||
        (community &&
          (!community.privateToMembers ||
            (this.props.auth !== undefined &&
              (community.authorId === this.props.auth.uid ||
                (community.admin &&
                  community.admin.includes(this.props.auth.uid)) ||
                (community.faculty &&
                  community.faculty.includes(this.props.auth.uid)) ||
                (community.members &&
                  community.members.includes(this.props.auth.uid)))))) ||
        (this.props.chosenEntity &&
          community &&
          this.props.chosenEntity.communityId === community.id)
      ) {
        var answer2 = window.confirm(
          `Are you sure you want to post?: "${this.state.message}" to ${
            community ? community.message : this.props.city
          }${
            this.props.chosenEntity
              ? ` as ${this.props.chosenEntity.message}`
              : ""
          }` +
            ` in ${
              this.props.chosenIssue ? this.props.chosenIssue : "Miscellaneous"
            }`
        );
        if (answer2) {
          //.replace(/[^\w\s0-9]/g, " ")//
          //.toLowerCase()
          var messageAsArray = arrayMessage(this.state.message);

          var add = {
            eventDate: this.state.eventDate,
            droppedId: droppedPost ? droppedPost.id : null,
            //eventId: this.state.eventId ? this.state.eventId : null,
            //newLessonShow: this.props.commtype,
            issue: this.props.chosenIssue,
            settedURL:
              this.state.settedURL !== "" &&
              this.state.settedURL.startsWith("https://")
                ? this.state.settedURL
                : null,
            twitterString: this.state.twitterString,
            communityId: community ? community.id : "",
            city: this.props.city ? this.props.city : null,
            message: this.state.message,
            authorId: this.props.auth.uid,
            entityId: this.props.entityId ? this.props.entityId : null,
            entityType: this.props.entityType ? this.props.entityType : null,
            commtype: this.props.initial,
            time: new Date(),
            messageAsArray
          };
          !community && delete add.communityId;
          this.props.initial !== "class" && delete add.eventDate;
          addDoc(collection(firestore, "forum"), add)
            .then((doc) => {
              this.setState({ droppedPost: null }, () => {
                var foo = { ...add };
                console.log("posted " + foo.message);
                foo.id = doc.id;
                this.props.cancelRebeat({ rebeat: null });
                this.updateIssues(foo);
              });
            })
            .catch(standardCatch);
        } else {
          this.props.closeNewForum();
        }
      }
    }
  };
  handleClose = () => {
    const { droppedPost } = this.props;
    if (droppedPost && !droppedPost.time) {
      var answer = window.confirm(
        "all progress will be lost for " + JSON.stringify(droppedPost)
      );
      if (answer) {
        this.handleDelete();
      }
    }
    this.setState(
      {
        droppedPost: null,
        lastDropped: null,
        lastParent: null,
        deletedDrop: null
      },
      () => {
        this.props.cancelRebeat({ rebeat: null });
        this.props.closeNewForum();
      }
    );
  };
  updateIssues = (foo) => {
    const { community } = this.props;
    var query = null;
    var cityOrComm = null;
    if (community) {
      cityOrComm = { communityId: community.id };
      query = [
        collection(firestore, "issues"),
        where("communityId", "==", community.id),
        where("title", "==", this.props.chosenIssue)
      ];
    } else {
      cityOrComm = { city: this.props.city };
      query = [
        collection(firestore, "issues"),
        where("city", "==", this.props.city),
        where("title", "==", this.props.chosenIssue)
      ];
    }
    getDocs(...query).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        if (doc.exists) {
          return updateDoc(doc(firestore, "issues", doc.id)).update({
            ...cityOrComm, //[Object.keys(cityOrComm)]:Object.values(cityOrComm),
            time: new Date(),
            title: this.props.chosenIssue
          });
        } else {
          return addDoc(collection(firestore, "issues"), {
            ...cityOrComm,
            time: new Date(),
            title: this.props.chosenIssue
          });
        }
      });
    });

    if (!["lesson", "show", "game"].includes(this.props.commtype)) {
      this.setState({
        message: "",
        height: 0,
        optionsToPost: [],
        twitterString: ""
      });
      this.props.closeNewForum();
    } else {
      window.alert(`${foo.message} posted, you can now begin streaming`);
    }
  };
  render() {
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
      profileHousing
    } = this.props.profileEntities;
    const { allow, comments, community, droppedPost } = this.props;
    var turnOnPlayer =
      this.state.settedURL &&
      [
        "https://youtube.com",
        "https://soundcloud.com",
        "https://facebook.com",
        "https://vimeo.com",
        "https://twitch.com",
        "https://streamable.com",
        "https://wistia.com",
        "https://dailymotion.com",
        "https://mixcloud.com",
        "https://vidyard.com",
        //
        "https://www.youtube.com",
        "https://www.soundcloud.com",
        "https://www.facebook.com",
        "https://www.vimeo.com",
        "https://www.twitch.com",
        "https://www.streamable.com",
        "https://www.wistia.com",
        "https://www.dailymotion.com",
        "https://www.mixcloud.com",
        "https://www.vidyard.com"
      ].find((x) => this.state.settedURL.includes(x));
    return (
      <form
        onSubmit={this.handleSubmit}
        style={{
          paddingBottom: "7px",
          display: "flex",
          position: "relative",
          width: "100%",
          height: "min-content",
          backgroundColor: "white",
          flexDirection: "column"
        }}
      >
        <UseEntity
          openOptions={this.props.openOptions}
          profileEvents={profileEvents}
          profileJobs={profileJobs}
          profileClubs={profileClubs}
          profileServices={profileServices}
          profileClasses={profileClasses}
          profileDepartments={profileDepartments}
          profileRestaurants={profileRestaurants}
          profileShops={profileShops}
          profilePages={profilePages}
          profileVenues={profileVenues}
          profileHousing={profileHousing}
          submit={(x) => this.setState(x)}
        />
        {allow && (
          <Linker
            setUrl={(x) => this.setState(x)}
            turnOnPlayer={turnOnPlayer}
            settedURL={this.state.settedURL}
            twitterString={this.state.twitterString}
            handleClose={this.handleClose}
          />
        )}
        <div
          style={{
            borderTop: "1px solid rgb(160,160,160)",
            top: "0px",
            padding: "20px",
            display: allow ? "flex" : "none",
            position: "relative",
            width: "calc(100% - 40px)",
            minHeight: "30px",
            color: "black",
            flexDirection: "column",
            fontSize: "15px"
          }}
        >
          {/**for size (hidden from user) */}
          <div
            ref={this.textBox}
            style={{
              minHeight: "30px",
              width: "100%",
              position: "absolute",
              zIndex: "-9999",
              wordBreak: "break-all"
            }}
          >
            {this.state.message.split("\n").map((item, i) => (
              <span key={i}>
                {item}
                <br />
              </span>
            ))}
            <br />
            <br />
          </div>
          {this.props.initial === "class" && (
            <div
              style={{
                zIndex: "1"
              }}
            >
              <DateTimePicker
                className="react-datetime-picker"
                onChange={(newValue) =>
                  this.setState({ eventDate: new Date(newValue) })
                }
                value={this.state.eventDate}
                disableCalendar={true}
                disableClock={true}
              />
            </div>
          )}
          <textarea
            value={this.state.message}
            onChange={(e) => {
              this.setState({ message: e.target.value }, () => {
                if (this.textBox && this.textBox.current) {
                  var textBoxHeight = this.textBox.current.offsetHeight;
                  this.setState({
                    textBoxHeight
                  });
                }
              });
            }}
            style={{
              border: "none",
              height: this.state.textBoxHeight,
              minHeight: "30px",
              width: "100%",
              position: "relative",
              resize: "none",
              wordBreak: "break-all",
              display: "flex",
              backgroundColor: "white",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "16px"
            }}
            placeholder="what's happening?"
            maxLength="500"
            required
          />
        </div>
        {!this.state.videoRecorderOpen && droppedPost && (
          <EmbeddedRebeat
            isNew={true}
            showStuff={true}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            rebeat={droppedPost}
            getCommunity={this.props.getCommunity}
            issues={this.props.issues}
            setDelete={() => {
              var answer = window.confirm("remove drop?");
              if (answer) this.setState({ droppedPost: null });
            }}
            userMe={this.props.user}
            auth={this.props.auth}
            community={community} //
            etypeChanger={this.props.etypeChanger}
            chosenPostId={this.props.chosenPostId}
            //helper={() => this.props.helper(droppedPost.droppedPost)}
            delete={() =>
              this.setState({
                deletedForumPosts: [
                  ...this.state.deletedForumPosts,
                  droppedPost.id
                ]
              })
            }
            comments={comments}
            clear={() => {
              var answer = window.confirm(
                "are you sure you want to clear this comment?"
              );
              if (answer) {
                this.setState({ comment: "" });
              }
            }}
            height={this.props.height}
            postHeight={this.props.postHeight}
            globeChosen={this.props.globeChosen}
            user={this.props.user}
          />
        )}
        <div style={{ display: "flex" }}>
          {/*this.props.auth === undefined && (
            <div
              style={{
                display: "flex",
                position: "absolute",
                width: "100%",
                height: "56px",
                backgroundColor: "rgba(200,200,255,.5)",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  userSelect: "none",
                  display: "flex",
                  width: "max-content",
                  height: "36px",
                  backgroundColor: "rgb(250,250,250)",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0px 20px",
                  alignItems: "center",
                  borderRadius: "50px"
                }}
                //to="/login"
                onClick={this.props.getUserInfo}
              >
                Please login to post
              </div>
            </div>
              )*/}
          {!this.state.videoRecorderOpen && !droppedPost && (
            <NewDrop
              linkDrop={this.props.linkDrop}
              dropId={this.props.dropId}
              parent={droppedPost}
              openDrop={this.openDrop}
              closeDrop={this.state.closeDrop}
              auth={this.props.auth}
              height={this.props.height}
              width={this.props.width}
              users={this.props.users}
              user={this.props.user}
              communities={this.props.communities}
            />
          )}
          {this.props.user !== undefined && allow && (
            <SaveDrafts
              message={this.state.message}
              user={this.props.user}
              auth={this.props.auth}
            />
          )}
        </div>
        {allow && (
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
      </form>
    );
  }
}
