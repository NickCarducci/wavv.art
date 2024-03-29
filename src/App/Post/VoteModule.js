import React from "react";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import firebase from "../.././init-firebase.js";
import VoteModuleResults from "./VoteModuleResults.js";
import { Link } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { standardCatch } from "../../components/Forum/New/index.js";

export const randomString = (length, chars) => {
  var mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  var result = "";
  for (var i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
};
const optsForPouchDB = {
  //revs_limit: 1, //revision-history
  //auto_compaction: true //zipped...
};
//const deletion = (d, db) => db.remove(d).catch(standardCatch);
const destroy = (db) => db.destroy();
const set = async (db, c) =>
  await db //has upsert plugin from class constructor
    .upsert(c._id, (copy) => {
      copy = { ...c }; //pouch-db \(construct, protocol)\
      return copy; //return a copy, don't displace immutable object fields
    })
    .then(
      () => null /*"success"*/
      /** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);  
          */
    )
    .catch(standardCatch);
const read = async (db, notes /*={}*/) =>
  //let notes = {};
  await db
    .allDocs({ include_docs: true })
    .then(
      (
        allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
      ) =>
        Promise.all(
          allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
        )
      // && and .then() are functionally the same;
    )
    .catch(standardCatch);
class AVIDB {
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "anonymousVotingIds";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  deleteAnonymousVotingId = async (note) =>
    await this.db.remove(note).catch(standardCatch);

  destroy = () => destroy(this.db);
  storeAnonymoustVotingId = async (key) => await set(this.db, key);
  readAnonymousVotingIds = async (notes = {}) =>
    //let notes = {};
    await read(this.db, notes);
}

const firestore = getFirestore(firebase);
class VoteModule extends React.Component {
  constructor(props) {
    super(props);
    let avidb = new AVIDB();
    this.state = {
      avidb,
      votes: [],
      closeFilter: true,
      availableEntities: [],
      chosenCommunity: { message: "" },
      city: "",
      chosenEntity: null,
      p: 0,
      deletedVotes: [],
      lastDeletedVotes: [],
      noLink: false
    };
  }
  voteNow = async (up) => {
    const { parent, auth, user } = this.props;
    const { vote, abstractAuthorId } = this.state;
    const notExpired = true; // !["oldBudget", "oldCases"].includes(parent.subtype);
    if (
      auth !== undefined &&
      user !== undefined &&
      notExpired &&
      (await this.canIVote(true))
    ) {
      //vote event ok

      if (vote) {
        //remove to make room and undo return, if necessary
        return deleteDoc(doc(firestore, "votes", vote.id))
          .then(() =>
            updateDoc(doc(firestore, "forum", parent.id), {
              voted: arrayRemove(auth.uid),
              [vote.way ? "upvotes" : "downvotes"]: arrayRemove(
                vote.eitherAuthorId
              )
            })
              .then(() => {
                this.setState({ vote: null });
                console.log("undid vote");
              })
              .catch(standardCatch)
          )
          .catch(standardCatch);
      }
      var newVote = {};
      const eitherAuthorId = user.publicAuthorId ? auth.uid : abstractAuthorId;
      newVote[up ? "upvotes" : "downvotes"] = arrayUnion(eitherAuthorId);
      if (!newVote.voted || !newVote.voted.includes(auth.uid))
        newVote.voted = arrayUnion(auth.uid);
      console.log("working", abstractAuthorId);
      updateDoc(doc(firestore, "forum", parent.id), newVote)
        .then(() => {
          const dc = {
            eitherAuthorId,
            //reference:
            //parent.budgetType + "/" + parent.message + "/" + parent.body,
            postId: parent.id,
            authorId: user.publicAuthorId ? this.props.auth.uid : false,
            magicVoterId: abstractAuthorId,
            party: user.party ? user.party : "",
            experiences: user.experiences ? user.experiences : [],
            education: user.education ? user.education : [],
            hobbies: user.hobbies ? user.hobbies : [],
            way: up
          };
          if (vote) {
            updateDoc(doc(firestore, "votes", vote.id), dc);
          } else addDoc(collection(firestore, "votes"), dc);
        })
        .catch(standardCatch);
    }
  };
  componentDidUpdate = (prevProps) => {
    /* if (
      this.state.chosenEntity &&
      this.state.chosenEntity !== this.state.lastChosenEntity
    ) {
      if (!this.state.chosenEntity) {
        this.setState({
          votes: this.state.fullVotes,
          lastChosenEntity: this.state.chosenEntity
        });
      } else {
        var votes = this.state.votes.filter(
          (parent) =>
            (this.state.chosenEntity.members &&
              this.state.chosenEntity.members.includes(parent.authorId)) ||
            (this.state.chosenEntity.admin &&
              this.state.chosenEntity.admin.includes(parent.authorId)) ||
            (this.state.chosenEntity.faculty &&
              this.state.chosenEntity.faculty.includes(parent.authorId))
        );
        this.setState({
          votes,
          fullVotes: votes,
          lastChosenEntity: this.state.chosenEntity
        });
      }
    }*/
    if (
      this.props.auth !== undefined &&
      this.props.parent !== prevProps.parent &&
      this.state.abstractAuthorId !== this.state.lastAbstractAuthorId
    ) {
      this.setState({ lastAbstractAuthorId: this.state.abstractAuthorId }, () =>
        this.didIVote(this.state.abstractAuthorId)
      );
    }
  };
  didIVote = (abstractAuthorId) => {
    /*var answer = window.confirm(
      "good choice! (we say this for everyone). Would "+
    "you like to vote publicly?")*/
    const { parent, auth } = this.props;
    onSnapshot(
      query(
        collection(firestore, "votes"),
        where("authorId", "==", auth.uid),
        where("postId", "==", parent.id)
      ),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.docs.forEach((doc) => {
            if (doc.exists()) {
              var vote = doc.data();
              vote.id = doc.id;
              this.setState({ vote });
            }
          });
        } else {
          //"no-proud-vote"
          onSnapshot(
            query(
              collection(firestore, "votes"),
              where("magicVoterId", "==", abstractAuthorId),
              where("postId", "==", parent.id)
            ),
            (querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists()) {
                    var vote = doc.data();
                    vote.id = doc.id;
                    this.setState({ vote });
                  }
                });
              } else {
                //"no-vote"
                this.setState({ vote: null });
              }
            },
            (e) => console.log(e.message)
          );
        }
      },
      (e) => console.log(e.message)
    );
  };
  registerVoter = () => {
    const abstractAuthorId = randomString(30, "aA#");
    /*const userDatas = firebase.firestore().collection("userDatas");
    const createAVI = (abstractAuthorId) =>
      userDatas.doc(this.props.auth.uid).update({
        abstractAuthorId
      });
    userDatas
      .where("abstractAuthorId", "==", abstractAuthorId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          userDatas
            .where("abstractAuthorId", "==", abstractAuthorId)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                window.alert(
                  "please notify nick@thumbprint.us if this problem persists" +
                    " (key is not random enough)"
                );
              } else createAVI(abstractAuthorId);
            });
        } else createAVI(abstractAuthorId);
      });*/
    this.state.avidb.storeAnonymoustVotingId({
      _id: this.props.auth.uid,
      abstractAuthorId
    });
    //firestore should still be able to see the auth used to vote, in logs.
    //While the content-addressable abstractAuthorId vote is used for the way,
    //the content-addressable auth is used for impotentcy
  };
  componentDidMount = () => {
    this.canIVote();
  };
  canIVote = async (registerIfNot) => {
    /*if (this.props.user.party) {
      const partyList = politicalParties.map(
        (x, i) => `${x}${i !== politicalParties.length && ", "}`
      );
      var answer = window.prompt(
        "please type your party to vote, this is not shared by default: " +
          partyList +
          `.  Google will be able to see it, as we use Firebase Auth ` +
          `without Google Functions as we start-up (saving about $50/mo)`
      );
      if (answer) {
        const party = politicalParties.find(
          (x) => x === answer.charAt(0).toUpperCase() + answer.slice(1)
        );
        if (party)
          firebase
            .firestore()
            .collection("userDatas")
            .doc(this.props.auth.uid)
            .update({
              party
            })
            .then(() => {})
            .catch(standardCatch);
      }
      return false;
    } else*/
    return await this.state.avidb.readAnonymousVotingIds().then((obj) => {
      const anonVotingIds = Object.values(obj);
      if (anonVotingIds) {
        const thisAccountAVID = anonVotingIds.find(
          (x) => x._id === this.props.auth.uid
        );
        if (!thisAccountAVID) {
          if (registerIfNot) {
            window.alert("forging your magically anonymous ID");
            this.registerVoter();
          }
          return false;
        } else {
          this.setState({ abstractAuthorId: thisAccountAVID.abstractAuthorId });
          return true;
        }
      }
    });
  };
  render() {
    const { parent, isMember, user } = this.props;
    const { abstractAuthorId } = this.state;

    var downvoted, upvoted;
    if (
      (user !== undefined &&
        user.publicAuthorId &&
        this.props.auth !== undefined) ||
      abstractAuthorId
    ) {
      downvoted =
        parent.downvotes &&
        parent.downvotes.length > 0 &&
        (parent.downvotes.includes(this.props.auth.uid) ||
          parent.downvotes.includes(abstractAuthorId));
      upvoted =
        parent.upvotes &&
        parent.upvotes.length > 0 &&
        (parent.upvotes.includes(this.props.auth.uid) ||
          parent.upvotes.includes(abstractAuthorId));
    }
    var downvotesNumber = parent.downvotes ? parent.downvotes.length : 0;
    var upvotesNumber = parent.upvotes ? parent.upvotes.length : 0;
    var totalVotes = downvotesNumber + upvotesNumber;
    var downCalc = downvotesNumber / totalVotes;
    var percentageDown = !isNaN(downCalc) ? Math.round(downCalc) : 0;

    var upCalc = upvotesNumber / totalVotes;
    var percentageUp = !isNaN(upCalc) ? Math.round(upCalc) : 0;

    return (
      <div style={{ display: "inline-block" }}>
        {!this.props.closeDrop ? null : this.props.closeFilter ? (
          <div
            onClick={() => this.props.setShowing({ closeFilter: false })}
            style={{
              justifyContent: "center",
              display: "flex",
              width: "100%",
              height: "26px"
              //backgroundColor: "rgb(220,170,130)"
            }}
          >
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
              <div
                style={{
                  justifyContent: "flex-start",
                  position: "relative",
                  display: "flex",
                  width: "50%",
                  height: "100%"
                }}
              >
                <div
                  style={{
                    padding: "2px",
                    borderRadius: "4px",
                    borderTopLeftRadius: "2px",
                    borderBottomLeftRadius: "2px",
                    borderBottom: "1px solid",
                    borderRight: "1px solid",
                    boxShadow: "1px 1px 1px .1px black",
                    backgroundColor: "red",
                    position: "absolute",
                    color: "white",
                    display: "flex",
                    width: "max-content",
                    height: "min-content"
                  }}
                >
                  {downvotesNumber}&nbsp;{percentageDown * 100}%
                </div>
                <div
                  style={{
                    right: "0px",
                    transform: "rotate(180deg)",
                    width: `calc(100% * ${percentageDown})`,
                    backgroundColor: "red",
                    height: "100%"
                  }}
                ></div>
              </div>
              <div
                style={{
                  justifyContent: "flex-end",
                  position: "relative",
                  display: "flex",
                  width: "50%",
                  height: "100%"
                }}
              >
                <div
                  style={{
                    padding: "2px",
                    borderRadius: "4px",
                    borderTopRightRadius: "2px",
                    borderBottomRightRadius: "2px",
                    borderBottom: "1px solid",
                    borderLeft: "1px solid",
                    boxShadow: "-1px 1px 1px .1px black",
                    backgroundColor: "blue",
                    position: "absolute",
                    color: "white",
                    display: "flex",
                    width: "max-content",
                    height: "min-content"
                  }}
                >
                  {upvotesNumber}&nbsp;{percentageUp * 100}%
                </div>
                <div
                  style={{
                    width: `calc(100% * ${percentageUp})`,
                    backgroundColor: "blue",
                    height: "100%"
                  }}
                ></div>
              </div>
            </div>
            <div
              style={{
                borderBottomRightRadius: "3px",
                borderBottomLeftRadius: "3px",
                padding: "2px 3px",
                position: "absolute",
                color: "white",
                backgroundColor: "rgb(220,170,130)"
              }}
            >
              votes
            </div>
          </div>
        ) : (
          <div>
            {parent.date && (
              <div
                style={{
                  right: "0px",
                  padding: "2px",
                  borderRadius: "4px",
                  borderTopRightRadius: "2px",
                  borderBottomRightRadius: "2px",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  boxShadow: "-1px 1px 1px .1px black",
                  backgroundColor: "blue",
                  color: "white",
                  display: "flex",
                  width: "min-content",
                  height: "min-content",
                  position: "absolute",

                  fontSize: "15px"
                }}
              >
                {new Date(parent.date.seconds * 1000).toLocaleDateString()}
                {["oldBudget", "oldCases"].includes(this.props.collection) &&
                  " - expired"}
              </div>
            )}
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                position: "relative",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                alignItems: "center",
                opacity: ["oldBudget", "oldCases"].includes(
                  this.props.collection
                )
                  ? "1"
                  : ".7"
              }}
            >
              <VoteModuleResults
                parent={parent}
                closeFilter={this.props.closeFilter}
                setShowing={this.props.setShowing}
                availableEntities={this.state.availableEntities}
                selectEntity={(e) =>
                  this.setState({ chosenEntity: e.target.id })
                }
                choosecity={(prediction) =>
                  this.setState({
                    find: null,
                    city: prediction.place_name,
                    center: prediction.center,
                    locOpen: false,
                    chosenEntity: null,
                    chosenCommunity: { message: "" }
                  })
                }
                chosenTile={this.state.chosenTile}
                selectTiletype={(e) => {
                  var chosenTile = e.target.value;
                  this.setState(
                    { chosenTile },
                    () =>
                      this.state.find &&
                      onSnapshot(
                        query(
                          collection(firestore, chosenTile),
                          where(
                            ...(this.state.find === "community"
                              ? [
                                  "communityId",
                                  "==",
                                  this.state.chosenCommunity.id
                                ]
                              : ["city", "==", this.state.city])
                          )
                        ),
                        (querySnapshot) => {
                          let q = 0;
                          let availableEntities = [];
                          querySnapshot.docs.forEach((doc) => {
                            q++;
                            if (doc.exists()) {
                              var foo = doc.data();
                              foo.id = doc.id;
                              availableEntities.push(foo);
                            }
                            if (querySnapshot.docs.length === q) {
                              this.setState({ availableEntities });
                            }
                          });
                        },
                        (e) => console.log(e.message)
                      )
                  );
                }}
                city={this.state.city}
                chosenCommunity={this.state.chosenCommunity}
                communities={this.props.communities}
                selectFind={(e) =>
                  this.setState({
                    find: e.target.value,
                    chosenCommunity: { message: "" },
                    chosenEntity: null
                  })
                }
                find={this.state.find}
                selectCommunity={(e) => {
                  var value = e.target.value;
                  var chosenCommunity = this.props.communities.find(
                    (parent) => parent.message === value
                  );
                  chosenCommunity &&
                    this.setState({
                      chosenCommunity,
                      chosenEntity: null,
                      city: ""
                    });
                }}
                individualTypes={this.props.individualTypes}
                percentageDown={percentageDown}
                percentageUp={percentageUp}
              />
              {this.props.auth !== undefined ? (
                !this.props.community || isMember ? (
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      flexDirection: "column",
                      height: "100%",
                      alignItems: "center",
                      padding: "0px 30px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        zIndex: "9999",
                        color: upvoted ? "black" : "grey"
                      }}
                      onClick={() => this.voteNow(true)}
                    >
                      Up
                    </div>
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        zIndex: "9999",
                        color: downvoted ? "black" : "grey"
                      }}
                      onClick={() => this.voteNow(false)}
                    >
                      Down
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/${this.props.community.message}/`}
                    style={{
                      left: "0px",
                      display: "flex",
                      position: "relative",
                      flexDirection: "column",
                      height: "100%",
                      width: "3%",
                      border: "1px solid black",
                      alignItems: "center",
                      padding: "0px 30px",
                      fontSize: "12px"
                    }}
                  >
                    Request membership to vote
                  </Link>
                )
              ) : (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    flexDirection: "column",
                    height: "100%",
                    alignItems: "center",
                    padding: "0px 0px",
                    fontSize: "12px"
                  }}
                  onClick={this.props.getUserInfo}
                  //to="/login"
                >
                  must login to vote
                </div>
              )}
            </div>
          </div>
        )}
        <div>{parent.voted && parent.voted.length} voted</div>
      </div>
    );
  }
}
export default VoteModule;
