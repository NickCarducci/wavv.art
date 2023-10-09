import React from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import firebase from "../.././init-firebase";
import VoteModule from "./VoteModule";
import VoteStraw from "./VoteStraw";
import Helper from "./Helper";
import CaseSwitch from "./Court/CaseSwitch";
import imagesl from ".././standardIMG.jpg";
import EmbeddedRebeat from "./PeanutGallery/EmbeddedRebeat";
import NotProfile from "./NotProfile";
import NotCommForum from "./NotCommForum";
import Title from "./Media/Title";
import Media from "./Media";
import PeanutGallery from "./PeanutGallery/index";
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import TwitterTweetEmbed from "../.././TwitterTweetEmbed";
import { arrayMessage } from "./Media/EditTitle";
import { canIView } from "../.././data";

//Are online banking services always allowed to be fraudulent by the Consumer Finance Protection Bureau without competition beyond CFR 12.1.5 sponsorship?
//What kind of medical science questions don't belong on skeptics?

const firestore = getFirestore(firebase);
class EditTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingTitle: props.editingTitle };
    this.textBoxTitle = React.createRef();
  }
  componentDidMount = () => this.size();
  size = () => {
    if (this.textBoxTitle && this.textBoxTitle.current) {
      var textBoxHeight = this.textBoxTitle.current.offsetHeight;
      this.setState({
        textBoxHeight
      });
    }
  };
  render() {
    const { editingTitle } = this.state;
    const { parent } = this.props;

    return (
      <form
        style={{
          borderTop: "1px solid rgb(160,160,160)",
          top: "0px",
          display: "flex",
          position: "relative",
          width: "100%",
          minHeight: "30px",
          color: "black",
          flexDirection: "column",
          fontSize: "15px"
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (editingTitle !== parent.message) {
            var answer = window.confirm(
              "submit edit? no going back: " + editingTitle
            );
            if (answer) {
              var messageAsArray = arrayMessage(editingTitle);
              updateDoc(doc(firestore, parent.collection, parent.id), {
                messageAsArray,
                message: editingTitle
              })
                .then(() => {
                  this.props.setEditing({
                    editingTitle: null
                  });
                })
                .catch((err) => console.log(err.message));
            }
          } else {
            this.props.setEditing({ editingTitle: null });
          }
        }}
      >
        <div
          ref={this.textBoxTitle}
          style={{
            padding: "0px 5px",
            border: "2px solid",
            minHeight: "30px",
            width: "calc(100% - 14px)",
            position: "absolute",
            zIndex: "-9999"
          }}
        >
          {editingTitle
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((item, i) => (
              <span style={{ fontSize: "14px" }} key={i}>
                {item}
                <br />
              </span>
            ))}
          <br />
          <br />
          <br />
        </div>
        <textarea
          defaultValue={parent.message}
          value={this.state.editingTitle}
          onChange={(e) => {
            var editingTitle = e.target.value;
            if (
              editingTitle !== "" &&
              !["oldElections", "oldCases", "oldBudget"].includes(
                parent.collection
              )
            ) {
              this.setState({ editingTitle }, this.size);
            }
          }}
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",

            width: "calc(100% - 14px)",
            padding: "0px 5px",
            border: "2px solid",
            height: this.state.textBoxHeight,
            position: "relative",
            resize: "none"
          }}
        />
        <div>
          <div
            style={{
              padding: "10px",
              backgroundColor: "rgb(150,200,250)"
            }}
            onClick={() => this.props.setEditing({ editingTitle: null })}
          >
            &times;
          </div>
          <button type="submit">save</button>
        </div>
      </form>
    );
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    //const { parent, summary } = props;
    //var cards = summary ? props.cards : [parent];
    this.state = {
      deletedForumPosts: [],
      opening: "",
      scroller: 0,
      closeFilter: true,
      closeDrop: true,
      confirmInput: ""
    };
    this.size = {};
    this.textBoxBody = React.createRef();
    //cards.map((x, i) => (this.size[i] = React.createRef()));
  }
  componentDidMount = () => {
    this.setState({ mounted: true });
  };
  wannaEditTitle = (parent, isDroppedIn, auth) => {
    if (!isDroppedIn) {
      if (auth !== undefined && parent.authorId === auth.uid) {
        var answer = window.confirm(
          `${parent.collection + parent.id}
            : would you like to edit?`
        );
        if (answer) {
          this.setState(
            {
              editingTitle: parent.message
            },
            () => {
              this.props.setChain({
                onlyPost: parent.shortId,
                onlyCommunity: parent.chainId
              });
              this.props.setEditing({
                editingSomeText: true
              });
              if (this.textBoxTitle && this.textBoxTitle.current) {
                var textBoxHeight = this.textBoxTitle.current.offsetHeight;
                this.setState({
                  textBoxHeight
                });
              }
            }
          );
        } /*else
          window.alert(parent.collection + parent.id + ": " + parent.message);*/
      } else {
        const warn = (input) => {
          if (input) {
            window.alert(input + parent.id + ": " + parent.message);
          } else
            window.alert(
              "error collection " + parent.collection + ": " + parent.message
            );
        };
        warn(parent.collection);
      }
    }
  };
  componentWillUnmount = () => {
    clearInterval(this.int);
    clearTimeout(this.clearTimeout);
    clearTimeout(this.holding);
    this.setState({ mounted: false });
  };
  render() {
    const { opening, mounted, showId } = this.state;
    const {
      rebeat,
      comments,
      isDroppedIn,
      chosenPostId,
      parent,
      budgetTypes,
      ordinanceTypes,
      caseTypes,
      electionTypes,
      i,
      res,
      mTT,
      summary,
      deletedForumPosts,
      auth,
      cards,
      commtype,
      onlyCommunity,
      onlyPost
    } = this.props;
    const isCase = ["oldCases", "cases"].includes(parent.collection);
    const entity = parent.entity;
    const user = parent.author ? parent.author : {};
    const num = 1 - res[i];
    //console.log(user);
    const spaceColor = !chosenPostId
      ? `rgb(${220 * num},${220 * num},${240 * num}`
      : chosenPostId === parent.id
      ? `rgba(230,230,255,${num}`
      : `rgba(210,210,220,${num}`;
    const on = (this.state.mounted && this.props.forumOpen) || isDroppedIn;
    const showRebeats =
      !isDroppedIn &&
      !this.state.videoRecorderOpen &&
      !this.state[`showConfirmInput+${parent.id}`];
    var openingThisOne =
      parent.author && this.state.openingProfile === parent.author.id;
    const beat = {
      transform: `rotate(${rebeat ? "0" : "25"}deg)`,
      height: "2px",
      width: "6px",
      margin: "2px",
      backgroundColor: "grey",
      transition: `.1s ${rebeat ? "ease-in" : "ease-out"}`
    };
    const expiredOrNot = ["oldBudget", "oldCases", "oldElections"].includes(
      parent.collection
    )
      ? "expired "
      : ["budget", "cases", "elections", ""].includes(parent.collection)
      ? "due "
      : "";
    const time =
      ["budget", "election", "court case"].includes(commtype) ||
      parent.budgetType ||
      parent.caseType ||
      parent.electionType
        ? parent.date
        : parent.time
        ? parent.time
        : { seconds: new Date() };
    const reactplayers = [
      "https://youtube.com",
      "https://soundcloud.com",
      "https://facebook.com",
      "https://vimeo.com",
      "https://twitch.com",
      "https://streamable.com",
      "https://wistia.com",
      "https://dailymotion.com",
      "https://mixcloud.com",
      "https://vidyard.com"
    ];
    const relationString = parent.community
      ? parent.community.authorId === parent.authorId
        ? "owns"
        : parent.community.admin &&
          parent.community.admin.includes(parent.authorId)
        ? "is admin of"
        : parent.community.faculty &&
          parent.community.faculty.includes(parent.authorId)
        ? "is faculty of"
        : parent.community.members &&
          parent.community.members.includes(parent.authorId)
        ? "is a member of"
        : "visited"
      : "visited";
    //console.log("chosenPostId",this.props.chosenPostId);
    //console.log("parnt", parent.message, this.props.onlyPost);
    //console.log("posts", this.props.cards);
    return (
      <div
        /*onMouseEnter={() =>
          mounted &&
          this.setState(
            {
              hoveringthisone: true
            },
            () => {
              clearTimeout(this.hoveringtimeout);
              this.hoveringtimeout = setTimeout(
                () => this.setState({ hoveringthisone: false }),
                2000
              );
            }
          )
        }*/
        style={{
          backgroundColor:
            /* openingThisOne
            ? "rgb(20,40,50)"
            :*/ "rgb(240,240,250)",
          userSelect: on ? "none" : "",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${on ? "0%" : "-100%"})`,
          height: "min-content",
          width: "100%",
          transition: `${openingThisOne ? 2 : on ? 0.3 : 1.4}s ease-${
            openingThisOne ? "out" : "in"
          }`
          //overflow: "hidden",
        }}
      >
        {onlyPost === "" && (
          <div
            onClick={() => {
              this.props.helper();
              this.props.setChain({
                onlyCommunity: "",
                seeContents: "",
                onlyPost: ""
              });
            }}
            style={{
              overflow: "hidden",
              display: "flex",
              height:
                onlyCommunity === parent.chainId && i === 0 // && !isDroppedIn
                  ? "min-content"
                  : "0px",
              backgroundColor: "grey",
              color: "white",
              width: "calc(100% - 4px)",
              border: "2px solid",
              breakInside: "none",
              transition: ".3s ease-in"
            }}
          >
            <NotProfile
              city={parent.place_name}
              community={parent.community}
              relationString={relationString}
              color={"white"}
              user={user}
              userMe={this.props.userMe}
              parent={parent}
              isProfile={!(this.props.isProfile || onlyCommunity !== "")}
              openingThisOne={openingThisOne}
            />

            <div
              style={{
                boxShadow: "0px 0px 10px 3px grey",
                textAlign: "center",
                color: "white",
                padding: !isDroppedIn ? "8px 10px" : "4px 10px",
                margin: "8px 10px",
                backgroundColor: "rgb(100,150,255)",
                borderRadius: "10px"
              }}
            >
              &times;
              {
                //({onlyCommunity})
              }
            </div>
          </div>
        )}
        <NotCommForum
          user={user}
          parent={parent}
          isDroppedIn={isDroppedIn}
          onlyPost={onlyPost}
          setChain={this.props.setChain}
          relationString={relationString}
        />
        {/*<NotProfile
          user={user}
          userMe={this.props.userMe}
          parent={parent}
          isProfile={this.props.isProfile || onlyCommunity !== ""}
          openingThisOne={openingThisOne}
          openingSet={() =>
            this.setState({ openingProfile: parent.author.id }, () => {
              clearTimeout(this.holding);
              this.holding = setTimeout(() => {
                this.setState({ openingProfile: "" }, () => {
                  //window.open(parent.shortId);
                });
              }, 3000);
            })
          }
          openingClear={() =>
            this.setState({ openingProfile: "" }, () =>
              clearTimeout(this.holding)
            )
          }
        />*/}
        {summary && commtype === "budget" && (
          <div
            style={{
              fontSize: "12px",
              top: "76px",
              left: "77px",
              display: "flex",
              position: "absolute",
              color: "white",
              width: "min-content",
              padding: "5px",
              borderRadius: "20px",
              backgroundColor: "rgb(250,100,100)"
            }}
          >
            ${parent.price}
          </div>
        )}
        {(isDroppedIn ? [parent] : cards).map((parent, y) => {
          /*if (
            this.props.onlyCommunity !== "" &&
           
            //this.props.onlyCommunity !== parent.chainId
          )
            return null;*/
          if (
            this.props.onlyPost !== "" &&
            this.props.onlyPost !== parent.shortId
          )
            return null;
          const opener =
            // onlyPost === "" &&
            //
            ((y === 0 && onlyCommunity === "") ||
              (i === 0 && onlyCommunity !== "") ||
              this.state.opening === parent.shortId ||
              onlyPost === parent.shortId) &&
            !isDroppedIn; //&& onlyCommunity === ""
          if (y < 3 || summary) {
            //console.log("parent", this.props.onlyPost, y, parent);
            const isMember = auth && canIView(auth, parent, parent.community);
            var readAsTwitter = null;
            if (
              parent.message &&
              parent.message.includes("https://twitter.com/")
            ) {
              if (parent.message.includes("/status/")) {
                readAsTwitter = parent.message.split("/status/")[1];
                readAsTwitter = readAsTwitter
                  ? readAsTwitter.includes("/")
                    ? readAsTwitter.split("/")[0]
                    : readAsTwitter.includes("?")
                    ? readAsTwitter.split("?")[0]
                    : readAsTwitter
                  : readAsTwitter;
              } else {
                readAsTwitter = parent.message.split("https://twitter.com/")[1];
                readAsTwitter =
                  "profile/" +
                  (readAsTwitter.includes("?")
                    ? readAsTwitter.split("?")[0]
                    : readAsTwitter);
              }
            }
            const issue = parent.budgetType
              ? parent.budgetType
              : parent.caseType
              ? parent.caseType
              : parent.electionType
              ? parent.electionType
              : parent.ordinanceType
              ? parent.ordinanceType
              : parent.issue
              ? parent.issue
              : "Miscellaneous";

            const readAsSpotify =
              parent.message &&
              parent.message.includes("https://open.spotify.com/embed?uri=");
            const spotifyEnding =
              readAsSpotify &&
              parent.message.split("https://open.spotify.com/embed?uri=")[1];
            const spotifyURI = spotifyEnding && spotifyEnding.split(" ")[0];
            //console.log(parent.videos);
            return (
              <div
                ref={this.size[i]}
                key={parent.id + summary + i}
                style={{
                  borderTop: `1px dotted`,
                  flexDirection: "column",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  height: "min-content",
                  fontSize: "16px",
                  wordBreak: "break-word"
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "min-content"
                  }}
                >
                  {this.state.changeIssue &&
                    parent.newLessonShow === "new" &&
                    parent.collection === "forum" && (
                      <div
                        style={{
                          display: "flex",
                          marginLeft: "3px",
                          marginTop: "3px"
                        }}
                      >
                        <div
                          onClick={() => this.setState({ changeIssue: false })}
                          style={{
                            height: "33px",
                            width: "33px",
                            border: "1px solid",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          &times;
                        </div>
                        <select
                          onChange={(e) =>
                            this.setState({ changeIssue: e.target.value })
                          }
                        >
                          {(["budget", "oldBudget"].includes(parent.collection)
                            ? budgetTypes
                            : parent.collection === "ordinances"
                            ? ordinanceTypes
                            : ["cases", "oldCases"].includes(parent.collection)
                            ? caseTypes
                            : ["elections", "oldElections"].includes(
                                parent.collection
                              )
                            ? electionTypes
                            : parent.newLessonShow === "new" &&
                              parent.collection === "forum"
                            ? this.props.issues
                            : this.props.issues
                          ).map((parent) => {
                            return <option>{parent}</option>;
                          })}
                        </select>
                      </div>
                    )}
                </div>
                <div
                  style={{
                    overflow: "auto",
                    padding: "10px",
                    display: "flex",
                    width: "max-content"
                  }}
                >
                  <span
                    onClick={this.props.setRebeat}
                    style={{
                      display: "none",
                      padding: "2px",
                      width: "min-content",
                      borderRadius: "3px",
                      border: "1px solid"
                    }}
                  >
                    <div style={beat} />
                    <div style={beat} />
                    <div style={beat} />
                  </span>
                  <span
                    onClick={() => this.setState({ changeIssue: true })}
                    style={{ color: "grey", display: "none" }}
                  >
                    {issue}
                  </span>
                  &nbsp;
                  {/*new Date(time.seconds * 1000).toLocaleDateString()*/}
                  {showId && showId === parent.shortId ? (
                    <Link style={{ color: "grey" }} to={`/${showId}`}>
                      {showId}
                    </Link>
                  ) : (
                    <span style={{ fontSize: "12px" }}>
                      {expiredOrNot}
                      {Math.round(
                        (new Date().getTime() / 1000 - parent.time.seconds) /
                          86400
                      )}
                      &nbsp;days
                    </span>
                  )}
                </div>
                <div
                  key={parent.shortId + i}
                  style={{
                    zIndex: "9999",
                    width: "100%",
                    height: "0px"
                  }}
                >
                  {parent.videos && (
                    <div
                      style={{
                        borderTop: `${
                          parent.videos.length > 0 ? 1 : 0
                        }px dashed grey`,
                        top: "-8px",
                        display: "flex",
                        position: "absolute",
                        right: "0px"
                      }}
                    >
                      {parent.videos.length > 0 && (
                        <b
                          style={{
                            width: "max-content",
                            textAlign: "right",
                            fontSize: "10px",
                            top: "-8px",
                            position: "absolute",
                            right: "120%"
                          }}
                        >
                          {parent.videos.length}&nbsp;videos
                        </b>
                      )}
                      {parent.videos.length > 0 && (
                        <div
                          style={{
                            marginRight: "4px",
                            marginTop: "20px",
                            color: "rgb(120,250,190)"
                          }}
                          className="fas fa-video"
                        ></div>
                      )}
                      <div
                        onClick={() =>
                          this.setState({ showId: parent.shortId }, () =>
                            this.wannaEditTitle(parent, isDroppedIn, auth)
                          )
                        }
                        /*to={{
                          pathname: isDroppedIn
                            ? `/${parent.collection}`
                            : window.location.pathname,
                          state: { from: window.location.pathname }
                        }}*/
                        style={{
                          translate: "rotate(45deg)",
                          borderTop: "1px solid",
                          borderLeft: "2px solid",
                          borderTopLeftRadius: "30px",
                          fontWeight: "bolder",
                          marginRight: "4px",
                          marginTop: "10px",
                          textDecoration: "none",
                          fontSize: this.state.touchHover ? "0px" : "20px",
                          transition: ".3s ease-in"
                        }}
                      >
                        ..
                      </div>
                    </div>
                  )}
                </div>
                {this.state.editingTitle ? (
                  <EditTitle
                    parent={parent}
                    editingTitle={this.state.editingTitle}
                    setEditing={(editingTitle) => this.setState(editingTitle)}
                  />
                ) : (
                  <div
                    onMouseEnter={() => {
                      if (isDroppedIn) return null;
                      //this.props.onlyPost === parent.shortId &&
                      //this.props.onlyCommunity === "" &&
                      //this.state.opening !== parent.shortId &&
                      //let i = 0;
                      this.setState({ opening: parent.shortId });
                      /*this.int = setTimeout(() => {
                        /*console.log(
                              this.state.opening,
                              parent.shortId,
                              this.props.onlyPost
                            );* /
                        //i++;
                        //for (let i = 0; i < 3; i++) {
                        if (i === 3) {
                          this.setState({
                            opening: ""
                          });
                          //}
                          clearInterval(this.int);
                        }
                      }, 1000);*/
                    }}
                    onMouseLeave={() => {
                      /*clearTimeout(this.clearTimeout);
                      this.clearTimeout = setTimeout(
                        () =>*/
                      //console.log(i);
                      this.setState(
                        {
                          opening: "",
                          int: 3
                        } /*,
                            () => {
                              clearInterval(this.int);
                              clearTimeout(this.holding);
                            }
                          ),
                        500*/
                      );
                    }}
                    style={{ display: "block" }}
                  >
                    {parent.commtype === "class" && (
                      <div
                        style={{
                          textDecoration: "underline",
                          padding: "4px 10px"
                        }}
                        onClick={() => {
                          window.location.href =
                            "https://thumbprint.app/sd/class/" + parent.id;
                        }}
                      >
                        View schedule
                      </div>
                    )}
                    <div
                      onClick={() => {
                        //this.props.helper(parent);
                        if (this.props.isDroppedIn) return null;
                        this.props.setChain({
                          onlyCommunity: parent.chainId,
                          onlyPost: parent.shortId
                        });
                      }}
                      style={{ display: "flex" }}
                    >
                      <Title
                        shorten={this.state.shorten}
                        setPost={(e) => this.setState(e)}
                        onlyCommunity={onlyCommunity}
                        onlyPost={onlyPost}
                        int={this.state.int}
                        i={i}
                        parent={parent}
                        auth={auth}
                        isDroppedIn={isDroppedIn}
                        mTT={mTT}
                        setForum={(e) =>
                          this.setState(e, () => {
                            this.props.helper();
                            this.props.setChain({
                              //onlyCommunity: "",
                              onlyPost: ""
                            });
                          })
                        }
                        opening={opening}
                      />
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.helper(parent);
                          this.setState({
                            shorten: parent.shortId
                          });
                        }}
                        style={{
                          width: "max-content",
                          height: "min-content",

                          alignItems: "center",
                          textIndent: "10px",
                          paddingRight: "15px",
                          position: "relative"
                        }}
                      >
                        <div
                          className="far fa-comments"
                          style={{
                            right: "7px",
                            display: "flex",
                            position: "absolute",
                            top: "0px",
                            height: "46px",
                            color: "grey",
                            fontSize: "15px" // "rgb(40,40,40)"
                          }}
                        />
                        <br />
                        {parent.commentCount ? parent.commentCount : 0}
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        this.setState({ shorten: "" });
                        if (this.props.postHeight !== 0) {
                          //this.props.setChain({ onlyPost: "" });
                          return this.props.helper();
                        }
                        this.props.setChain(
                          onlyCommunity === ""
                            ? { onlyCommunity: parent.chainId }
                            : onlyPost === ""
                            ? { onlyPost: parent.shortId }
                            : {
                                //onlyCommunity: "",
                                onlyPost: ""
                              }
                        );
                      }}
                      style={
                        {
                          fontSize: opener ? "" : "0px",
                          borderTop: `${!onlyPost ? 1 : 0}px dotted`,
                          transition: ".3s ease-in",
                          textAlign: "center",
                          padding: opener && "4px 10px",
                          margin: opener && "8px 10px",
                          width: "calc(100% - 40px)",
                          borderRadius: "2px"
                        } /*{
                            transition: ".3s ease-in",
                            boxShadow: "0px 0px 10px 3px grey",
                            textAlign: "center",
                            color: "white",
                            padding: "4px 10px",
                            margin: "8px 10px",
                            width: "calc(100% - 40px)",
                            backgroundColor: onlyPost
                              ? "rgb(20,20,40)"
                              : "rgb(100,150,255)",
                            borderRadius: "10px"
                          }*/
                      }
                    >
                      {
                        onlyPost === parent.shortId
                          ? `close`
                          : onlyCommunity === ""
                          ? `${parent.chainId} (${cards.length})`
                          : (i === 0 ||
                              this.state.opening === parent.shortId) &&
                            "open" /*onlyPost === "" ?:onlyCommunity*/
                      }
                    </div>
                  </div>
                )}
                {spotifyURI && (
                  <iframe
                    title="spotify iframe"
                    src={`https://open.spotify.com/embed?uri=${spotifyURI}`}
                    width="300"
                    height="380"
                    frameborder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                )}
                {parent.body && parent.body !== "" && this.state.editingBody ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      var answer = window.confirm(
                        "submit edit? no going back: " + this.state.editingBody
                      );
                      if (answer) {
                        updateDoc(
                          doc(firestore, parent.collection, parent.id),
                          { body: this.state.editingBody }
                        )
                          .then(() => {
                            this.setState({ editingBody: null });
                          })
                          .catch((err) => console.log(err.message));
                      }
                    }}
                  >
                    <div
                      ref={this.textBoxBody}
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        minHeight: "30px",
                        border: "2px solid",
                        width: "calc(100% - 14px)",
                        position: "absolute",
                        zIndex: "-9999",
                        overflowWrap: "break-word"
                      }}
                    >
                      {this.state.editingBody
                        .replace(/(\r\n|\r|\n)/g, "\n")
                        .split("\n")
                        .map((item, i) => (
                          <span style={{ fontSize: "14px" }} key={i}>
                            {item}
                            <br />
                          </span>
                        ))}
                    </div>
                    <input
                      onChange={(e) => {
                        var editingBody = e.target.value;
                        if (
                          editingBody !== "" &&
                          !["oldElections", "oldCases", "oldBudget"].includes(
                            parent.collection
                          )
                        ) {
                          this.setState({ editingBody }, () => {
                            if (this.textBoxBody && this.textBoxBody.current) {
                              var textBoxHeight = this.textBoxBody.current
                                .offsetHeight;
                              this.setState({
                                textBoxHeight
                              });
                            }
                          });
                        }
                      }}
                      placeholder={parent.body}
                      value={this.state.editingBody}
                    />
                    <div onClick={() => this.setState({ editingBody: null })}>
                      &times;
                    </div>
                  </form>
                ) : (
                  <div
                    key={parent.body}
                    onClick={() => this.setState({ editingBody: "" })}
                    onMouseEnter={() =>
                      this.setState({ hoverBody: parent.shortId })
                    }
                    onMouseLeave={() => this.setState({ hoverBody: null })}
                    style={{
                      borderRadius: "3px",
                      color: "rgb(20,20,25)",
                      textDecoration: isDroppedIn ? "underlined" : "none",
                      height: "min-content",
                      padding: "5px",
                      margin: "0px 5px",
                      fontSize: "16px",
                      /*background:
                        this.state.hoverBody === parent.shortId || isDroppedIn
                          ? "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.6))"
                          : "",*/
                      width: "calc(100% - 20px)",
                      transition: ".3s ease-in"
                    }}
                  >
                    {parent.body}
                  </div>
                )}
                <Media
                  isDroppedIn={isDroppedIn}
                  videoRecorderOpen={this.state.videoRecorderOpen}
                  vintageOfKeys={this.props.vintageOfKeys}
                  setNapkin={this.props.setNapkin}
                  user={this.props.user}
                  auth={auth}
                  shortId={parent.shortId}
                  parent={parent}
                  onlyPost={onlyPost === parent.shortId}
                  //
                  collection={"chatMeta"}
                  unloadGreenBlue={this.props.unloadGreenBlue}
                  loadGreenBlue={this.props.loadGreenBlue}
                  getUserInfo={this.props.getUserInfo}
                  storageRef={this.props.storageRef}
                  topic={this.state.selectedFolder}
                  getVideos={this.props.getVideos}
                  getFolders={this.props.getFolders}
                  folders={this.props.folders}
                  videos={this.props.videos}
                  isPost={true}
                  room={this.props.room}
                  threadId={this.props.threadId}
                  setPost={(x) => this.setState(x)}
                  entityType={this.props.entityType}
                  entityId={this.props.entityId}
                />
                {commtype === "new" && //Does academia tend to plagiarize those that happen to make discoveries outside of their fields to fix the price of education?
                  [parent.twitterString, readAsTwitter].map(
                    (x) =>
                      x &&
                      x !== "" && (
                        <TwitterTweetEmbed
                          key={
                            parent.shortId + "'s tweet" + i === 0
                              ? ""
                              : " in-text"
                          }
                          isProfile={x.includes("/")}
                          tweetId={x.includes("/") ? x.split("/")[1] : x}
                        />
                      )
                  )}
                {parent.settedURL &&
                  reactplayers.find((r) => parent.settedURL.includes(r)) && (
                    <div
                      style={{
                        top: "10px",
                        flexDirection: "column",
                        display: "flex",
                        position: "relative",
                        width: "80%",
                        maxWidth: "90%",

                        height: "min-content"
                      }}
                    >
                      <ReactPlayer
                        width={Math.min("90vw", "700px")}
                        url={parent.settedURL}
                      />
                    </div>
                  )}
                {/*parent.eventId ? (
                      <div>
                        <PlanObject
                          notes={this.props.notes}
                          auth={auth}
                          edmInitial={note && note.name}
                          eventInitial={note && !isNaN(note.date)}
                          eventsInitial={this.props.eventsInitial}
                          chooseInvite={this.props.chooseInvite}
                          forMessage={true}
                          //ref={this[index]}
                          //id={`${note._id}_ref`}
                          onDelete={this.props.onDelete}
                          handleSave={this.props.handleSave}
                          noteList={noteList}
                          noteTitles={noteTitles}
                          note={message}
                          users={this.props.users}
                          height={this.props.height}
                          onlyPost={this.state.onlyPost}
                          open={(parent) => {
                            this.setState({ onlyPost: parent });
                          }}
                        />
                      </div>
                    ) : */}
                {!isDroppedIn &&
                  (["ordinance", "case"].includes(parent.commtype) ||
                    parent.isPoll) &&
                  parent.community && (
                    <VoteModule
                      user={this.props.user}
                      getUserInfo={this.props.getUserInfo}
                      closeDrop={this.state.closeDrop}
                      closeFilter={this.state.closeFilter}
                      setShowing={(parent) => this.setState(parent)}
                      individualTypes={this.props.individualTypes}
                      parent={parent}
                      auth={auth}
                      isMember={isMember}
                      isCase={isCase}
                    />
                  )}
                {!isDroppedIn &&
                  !this.props.globeChosen &&
                  isCase &&
                  auth !== undefined &&
                  parent.judges &&
                  parent.judges.includes(auth.uid) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        var collection =
                          "oldCases" === parent.collection
                            ? "judgementsOld"
                            : "judgements";
                        setDoc(doc(firestore, collection, parent.id), {
                          time: new Date(),
                          defendant: parent.defendant,
                          guilty: true,
                          statute: this.state.statuteSet,
                          levy: this.state.levySet,
                          dissention: this.state.dissention
                        });
                      }}
                    >
                      <div>write your judgement</div>
                      <label>guilty</label>
                      <input type="checkbox" />
                      <input placeholder="statute" />
                      <input placeholder="levy" />
                      <input placeholder="dissention" />
                    </form>
                  )}
                {!isDroppedIn &&
                  !this.props.globeChosen &&
                  "cases" === parent.collection && (
                    <CaseSwitch
                      getUserInfo={this.props.getUserInfo}
                      parent={parent}
                      community={parent.community}
                      auth={auth}
                      collection={parent.collection}
                    />
                  )}
                {["election"].includes(parent.commtype) ? (
                  <VoteStraw
                    user={this.props.user}
                    onlyPost={onlyPost}
                    getUserInfo={this.props.getUserInfo}
                    closeDrop={this.state.closeDrop}
                    closeFilter={this.state.closeFilter}
                    setShowing={(parent) => this.setState(parent)}
                    community={parent.community}
                    parent={parent}
                    auth={auth}
                    isMember={isMember}
                  />
                ) : null}
                {showRebeats && parent.droppedPost && (
                  <EmbeddedRebeat
                    isDroppedIn={parent.droppedPost}
                    onlyPost={onlyPost}
                    linkDrop={this.props.linkDrop}
                    dropId={this.props.dropId}
                    getCommunity={this.props.getCommunity}
                    issues={this.props.issues}
                    setDelete={() => {
                      updateDoc(doc(firestore, parent.collection, parent.id), {
                        droppedId: null
                      }).catch((e) => console.log(e.message));
                    }}
                    userMe={this.props.user}
                    auth={auth}
                    community={this.props.community} //
                    chosenPostId={this.props.chosenPostId}
                    //helper={() => this.props.helper(parent.droppedPost)}
                    delete={this.props.delete}
                    deletedForumPosts={deletedForumPosts}
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
              </div>
            );
          } else return null;
        })}
        {!isDroppedIn && (
          <Helper
            videoRecorderOpen={this.state.videoRecorderOpen}
            setParent={(x) => this.setState(x)}
            keyBoxes={this.props.keyBoxes}
            setNapkin={this.props.setNapkin}
            deviceName={this.state.deviceName}
            setPost={(x) => this.setState(x)}
            vintageName={this.props.vintageName}
            showRebeats={showRebeats}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            openDrop={(parent) => {
              this.setState(parent);
            }}
            width={this.props.width}
            onlyCommunity={onlyCommunity}
            onlyPost={onlyPost}
            user={this.props.user}
            unloadGreenBlue={this.props.unloadGreenBlue}
            loadGreenBlue={this.props.loadGreenBlue}
            getUserInfo={this.props.getUserInfo}
            storageRef={this.props.storageRef}
            topic={this.state.selectedFolder}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            folders={parent.folders}
            videos={this.props.videos}
            isPost={true}
            auth={auth}
            room={{ id: `${parent.shortId}` }}
            threadId={`${parent.shortId}`}
            entityType={parent.entityType}
            entityId={parent.entityId}
            //
            delete={this.props.delete}
            rebeat={rebeat}
            setRebeat={this.props.setRebeat}
            //isDroppedIn={isDroppedIn}
            commtype={commtype}
            closeDrop={this.state.closeDrop}
            closeFilter={this.state.closeFilter}
            myCommentsPreview={this.props.myCommentsPreview}
            clear={this.props.clear}
            height={this.props.height}
            postHeight={this.props.postHeight}
            helper={() => this.props.helper(parent)}
            comments={comments}
            length={
              this.props.myCommentsPreview
                ? this.props.myCommentsPreview
                : this.props.chosenPostId === parent.id &&
                  comments &&
                  comments.length
            }
            parent={parent}
            chosenPostId={this.props.chosenPostId}
            droppedCommentsOpen={this.props.droppedCommentsOpen}
          />
        )}
        {/*(this.props.globeChosen || !this.props.forumOpen) && (
          <div
            style={{
              height: "min-content",
              //boxShadow: "inset 50px 0px 30px -20px",
              display: "flex",
              position: "relative",
              borderBottom: "1px black dashed",
              borderRight: "1px black solid",
              justifyContent: "flex-end",
              width: "100%",
              right: "1px",
              color: "grey",
              fontSize: "14px"
            }}
          >
            posted in{" "}
            {(parent.community || parent.city) &&
              (parent.community
                ? parent.community.id
                : parent
                ? parent.city
                : ""
              ).substr(0, 33)}
          </div>
              )*/}

        {entity && (
          <Link
            to={
              ["classes", "oldClasses"].includes(parent.collection)
                ? new Date(entity.endDate.seconds * 1000) < new Date()
                  ? `/oldClass/${entity.id}`
                  : `/class/${entity.message}/${
                      entity.community ? entity.community.message : entity.city
                    }`
                : `/${parent.entityType}/${entity.message}/${
                    entity.community ? entity.community.message : entity.city
                  }`
            }
            style={{
              textDecoration: "none",
              display: "flex",
              position: "relative",
              height: "46px",
              color: "black"
            }}
          >
            <img
              style={{
                marginLeft: "10px",
                display: "flex",
                position: "relative",
                width: "46px",
                height: "46px",
                top: "5px"
              }}
              src={entity.chosenPhoto ? entity.chosenPhoto.small : imagesl}
              alt="error"
            />
            <div
              style={{
                display: "flex",
                position: "relative",
                height: "46px",
                left: "11px",
                top: "5px",
                flexDirection: "column"
              }}
            >
              <div>
                <b>{entity.message}</b>
                <i>{entity.body}</i>
              </div>
            </div>
          </Link>
        )}
        <div
          style={{
            height: "0px",
            width: "100%",
            backgroundColor: spaceColor
          }}
        />

        <PeanutGallery
          chosenPost={this.props.chosenPost}
          chosenPostId={this.props.chosenPostId}
          getUserInfo={this.props.getUserInfo}
          vertical={this.props.vertical}
          height={this.props.height}
          postHeight={this.props.postHeight}
          postMessage={this.props.postMessage}
          comments={this.props.comments}
          commentType={this.props.commentType}
          width={this.props.width}
          forumPosts={this.props.forumPosts}
          user={this.props.user}
          auth={this.props.auth}
          helper={this.props.helper}
          closeGroupFilter={this.props.closeGroupFilter}
          openGroupFilter={this.props.openGroupFilter}
        />
      </div>
    );
  }
}
export default Post;
