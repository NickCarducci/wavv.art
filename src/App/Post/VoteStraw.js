import React from "react";
import firebase from "../.././init-firebase.js";
import VoteModuleResults from "./VoteModuleResults.js";
import { Link } from "react-router-dom";
import VoteModuleFilter from "./VoteModuleFilter.js";
import imagesl from ".././standardIMG.jpg";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { individualTypes } from "../Community/arraystrings.js";
//Is Trudeau's government scared of Canadians with guns?

const firestore = getFirestore(firebase);
class VoteStraw extends React.Component {
  state = {
    supports: [],
    chosenStature: "all",
    chosenIndividualType: "",
    by: "entity",
    availableEntities: [],
    chosenCommunity: { message: "" },
    city: "",
    chosenEntity: null,
    asktoRemove: "",
    p: 0,
    deletedVotes: [],
    lastDeletedVotes: [],
    noLink: false,
    candidacyRequestsIds: [],
    candidates: []
  };
  handleChangeSupport = (parent, way, candidate) => {
    const thisone = this.state.supports.find(
      (x) => x.candidateId === candidate.id
    );
    console.log(this.state.supports, thisone);
    if (thisone) {
      updateDoc(doc(firestore, "supports", thisone.id), {
        postId: parent.id,
        candidateId: candidate.id,
        authorId: this.props.auth.uid,
        way
      });
    } else {
      addDoc(collection(firestore, "supports"), {
        postId: parent.id,
        candidateId: candidate.id,
        authorId: this.props.auth.uid,
        way
      });
      if (way === true) {
        return this.handleTrue(candidate);
      } else if (way === false) {
        return this.handleFalse(candidate);
      } else if (way === null) {
        return this.handleNull(candidate);
      } else return null;
    }
  };
  handleTrue = (candidate) => {
    if (
      !this.props.parent["upvotes" + candidate.id] ||
      !this.props.parent["upvotes" + candidate.id].includes(this.props.auth.uid)
    ) {
      return updateDoc(doc(firestore, "forum", this.props.parent.id), {
        ["upvotes" + candidate.id]: arrayUnion(this.props.auth.uid)
      });
    } else return null;
  };
  handleFalse = (candidate) => {
    if (
      !this.props.parent["downvotes" + candidate.id] ||
      !this.props.parent["downvotes" + candidate.id].includes(
        this.props.auth.uid
      )
    ) {
      return updateDoc(doc(firestore, "forum", this.props.parent.id), {
        ["downvotes" + candidate.id]: arrayUnion(this.props.auth.uid)
      });
    } else return null;
  };
  handleNull = (candidate) => {
    if (
      (this.props.parent["upvotes" + candidate.id] &&
        this.props.parent["upvotes" + candidate.id].includes(
          this.props.auth.uid
        )) ||
      (this.props.parent["downvotes" + candidate.id] &&
        this.props.parent["downvotes" + candidate.id].includes(
          this.props.auth.uid
        ))
    ) {
      return updateDoc(doc(firestore, "forum", this.props.parent.id), {
        [(this.props.parent["upvotes" + candidate.id] &&
        this.props.parent["upvotes" + candidate.id].includes(
          this.props.auth.uid
        )
          ? "upvotes"
          : "downvotes") + candidate.id]: arrayRemove(this.props.auth.uid)
      });
    } else return null;
  };
  getVotesForEachCandidate = (candidateId) => {
    onSnapshot(
      query(
        collection(firestore, "supports"),
        where("authorId", "==", this.props.auth.uid),
        where("candidateId", "==", candidateId),
        where("postId", "==", this.props.parent.id)
      ),
      (querySnapshot) => {
        let q = 0;
        let supports = [];
        querySnapshot.docs.forEach((doc) => {
          q++;
          if (doc.exists()) {
            var support = doc.data();
            support.id = doc.id;
            supports.push(support);
          }
        });
        if (querySnapshot.docs.length === q) {
          console.log("supports", supports);
          this.setState({ supports }, () =>
            supports.map((support) => {
              return null;
            })
          );
        }
      },
      (e) => console.log(e.message)
    );
  };
  getCandidates = () => {
    let candidates = [];
    let q = 0;
    console.log("candidates", this.props.parent.candidates);
    this.props.parent.candidates.map(
      (candidateId) => this.getVotesForEachCandidate(candidateId)

      /*onSnapshot(
        doc(firestore, "candidates", candidateId),
        (doc) => {
          q++;
          if (doc.exists()) {
            var foo = doc.data();
            foo.id = doc.id;
            this.setState({
              candidates: candidates.push(this.getVotesForEachCandidate(foo.id))
            });
          }
        },
        (e) => console.log(e.message)
      )*/
    );
  };
  //componentDidMount = () =>
  //this.props.parent.candidates && this.getCandidates();
  render() {
    const { parent, isMember } = this.props;
    if (this.props.community) {
      return (
        <div style={{ display: "flex" }}>
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
                supports
              </div>
            </div>
          ) : (
            <div style={{ margin: "10px", width: "calc(100% - 20px)" }}>
              <div
                style={{
                  fontSize: "15px"
                }}
              >
                {/*new Date(parent.date.seconds * 1000).toLocaleDateString()*/}
              </div>
              {this.props.auth !== undefined &&
              this.props.parent.commtype === "election" ? (
                this.props.auth.uid === this.props.community.authorId ||
                (this.props.community.admin &&
                  this.props.community.admin.includes(this.props.auth.uid)) ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      //console.log(this.state.newCandidate);
                      var subs = this.state.newCandidate; //.split(this.props.parent.id)[1];
                      updateDoc(doc(firestore, "forum", this.props.parent.id), {
                        candidates: arrayUnion(subs),
                        candidateRequests: arrayRemove(subs)
                      })
                        .then(() => {
                          console.log(
                            "added candidate " +
                              subs +
                              " to " +
                              this.props.parent.id
                          );
                          this.setState({ newCandidate: "" });
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    {parent.candidateRequests &&
                      parent.candidateRequests.length > 0 && (
                        <div
                          style={{
                            flexDirection: "column",
                            margin: "4px",
                            marginLeft: "4px",
                            color: "black",
                            fontSize: "12px",
                            border: "1px solid black",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            right: "0px",
                            wordBreak: "break-all",
                            paddingRight: "3px"
                          }}
                        >
                          add candidates
                          <select
                            value={this.state.newCandidate}
                            onChange={(e) => {
                              this.setState({ newCandidate: e.target.value });
                            }}
                          >
                            <option value=""></option>
                            {parent.candidateRequestsProfiled.map((parent) => {
                              return (
                                <option key={parent.id} value={parent.id}>
                                  {parent.username}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    <div style={{ color: "grey", fontSize: "12px" }}>
                      they have to request candidacy
                    </div>
                    {this.state.newCandidate && (
                      <button type="submit">add to "ballot"</button>
                    )}
                  </form>
                ) : parent.candidateRequests &&
                  parent.candidateRequests.includes(this.props.auth.uid) ? (
                  <div
                    onClick={() => {
                      updateDoc(
                        doc(
                          firestore,
                          this.props.parent.collection,
                          this.props.parent.id
                        ),
                        {
                          candidateRequests: arrayRemove(this.props.auth.uid)
                        }
                      )
                        .then(() => {
                          window.alert(
                            "removed candidacy request " +
                              this.props.parent.id +
                              this.props.auth.uid +
                              " you may need to refresh to reapply"
                          );
                        })
                        .catch((e) => console.log(e.message));
                    }}
                  >
                    adding your candidacy...
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      updateDoc(
                        doc(
                          firestore,
                          this.props.parent.collection,
                          this.props.parent.id
                        ),
                        {
                          candidateRequests: arrayUnion(this.props.auth.uid)
                        }
                      )
                        .then(() => {
                          console.log(
                            "requesting candidacy " +
                              this.props.parent.id +
                              this.props.auth.uid
                          );
                        })
                        .catch((e) => console.log(e.message));
                    }}
                  >
                    add your candidacy
                  </div>
                )
              ) : null}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                    zIndex: "6"
                  }}
                  onClick={() =>
                    this.props.setShowing({
                      closeFilter: true
                    })
                  }
                >
                  &times;
                </div>
              </div>
              {false && (
                <select
                  value={this.state.by}
                  onChange={(e) => this.setState({ by: e.target.value })}
                >
                  <option>entity</option>
                  <option>individual</option>
                </select>
              )}

              {false && this.state.by === "entity" ? (
                //appelate, appeals, federal habeus corpus
                <VoteModuleFilter
                  availableEntities={this.state.availableEntities}
                  selectEntity={(e) =>
                    this.setState({ chosenEntity: e.target.id })
                  }
                  choosecity={(prediction) => {
                    var city = prediction.place_name;
                    this.setState({
                      find: null,
                      city,
                      center: [prediction.center[1], prediction.center[0]],
                      locOpen: false,
                      chosenEntity: null,
                      chosenCommunity: { message: "" }
                    });
                    //ByEntity
                    //[city,community]
                    //entity-type
                    //ByIndividual
                    //name of entity
                    //[experience,education,hobby]
                    //name of vector
                  }}
                  chosenTile={this.state.chosenTile}
                  selectTiletype={(e) => {
                    var chosenTile = e.target.value;
                    this.setState({ chosenTile });
                    var whre = ["", "", ""];
                    if (this.state.find === "community") {
                      whre = [
                        "communityId",
                        "==",
                        this.state.chosenCommunity.id
                      ];
                    } else if (this.state.find === "city") {
                      whre = ["city", "==", this.state.city];
                    } else {
                      whre = null;
                    }
                    if (whre) {
                      onSnapshot(
                        query(
                          collection(firestore, "entity"),
                          where("subtype", "array-contains", chosenTile),
                          where(...whre)
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
                      );
                    } else
                      return console.log(
                        "no find option for VoteModuleFilter.js"
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
                    this.setState({
                      chosenCommunity,
                      chosenEntity: null,
                      city: ""
                    });
                  }}
                />
              ) : this.state.by === "individual" ? (
                <div>
                  <select>
                    {individualTypes.map((parent) => (
                      <option key={parent}>{parent}</option>
                    ))}
                  </select>

                  {this.state.chosenIndividualType !== "" && (
                    <select
                      value={this.state.chosenStature}
                      onChange={(e) =>
                        this.setState({ chosenStature: e.target.value })
                      }
                    >
                      {["all", "experience", "education", "hobby"].map(
                        (parent) => {
                          return <option key={parent}>{parent}</option>;
                        }
                      )}
                    </select>
                  )}
                </div>
              ) : null}
              {["election"].includes(this.props.parent.commtype) &&
              parent.candidates &&
              parent.candidates.length > 0 ? (
                parent.candidatesProfiled.map((candidate) => {
                  var downvotesNumber = this.props.parent[
                    "downvotes" + candidate.id
                  ]
                    ? this.props.parent["downvotes" + candidate.id].length
                    : 0;
                  var upvotesNumber = this.props.parent[
                    "upvotes" + candidate.id
                  ]
                    ? this.props.parent["upvotes" + candidate.id].length
                    : 0;
                  var downvoted =
                    downvotesNumber !== 0 &&
                    this.props.auth !== undefined &&
                    this.props.parent["downvotes" + candidate.id].includes(
                      this.props.auth.uid
                    );
                  var upvoted =
                    upvotesNumber !== 0 &&
                    this.props.auth !== undefined &&
                    this.props.parent["upvotes" + candidate.id].includes(
                      this.props.auth.uid
                    );
                  var totalVotes = downvotesNumber + upvotesNumber;
                  var downCalc = downvotesNumber / totalVotes;
                  var percentageDown = !isNaN(downCalc) ? downCalc : 0;

                  var upCalc = upvotesNumber / totalVotes;
                  var percentageUp = !isNaN(upCalc) ? upCalc : 0;
                  return (
                    <div key={candidate.id}>
                      {this.props.auth !== undefined &&
                        (this.props.auth.uid ===
                          this.props.community.authorId ||
                          (this.props.community.admin &&
                            this.props.community.admin.includes(
                              this.props.auth.uid
                            ))) && (
                          <div
                            onMouseEnter={() =>
                              this.setState({ hoveredd: true })
                            }
                            onMouseLeave={() =>
                              this.setState({ hoveredd: false })
                            }
                            style={{
                              margin: "4px",
                              marginLeft: "4px",
                              color:
                                this.state.asktoRemoveOk || this.state.hoveredd
                                  ? "black"
                                  : "grey",
                              fontSize: "12px",
                              border: "1px solid",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              height: "14px",
                              right: "0px",
                              wordBreak: "break-all",
                              paddingRight: "3px"
                            }}
                            onClick={() => {
                              if (this.state.asktoRemoveOk) {
                                this.setState({ asktoRemoveOk: false });
                              } else {
                                var answer = window.confirm(
                                  `are you sure you'd like to remove ${candidate.name}@${candidate.username} from the ballot?`
                                );
                                if (answer) {
                                  this.setState({ asktoRemoveOk: true });
                                }
                              }
                            }}
                          >
                            remove
                          </div>
                        )}
                      {this.state.asktoRemoveOk && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (
                              this.state.asktoRemove.toLowerCase() === "remove"
                            ) {
                              updateDoc(
                                doc(
                                  firestore,
                                  "elections",
                                  this.props.parent.id
                                ),
                                {
                                  candidates: arrayRemove(this.props.auth.uid)
                                }
                              )
                                .then(() => {
                                  console.log("removed candidate " + parent);
                                })
                                .catch((err) => console.log(err));
                            }
                          }}
                        >
                          <input
                            placeholder="remove"
                            className="input"
                            value={this.state.asktoRemove}
                            onChange={(e) =>
                              this.setState({ asktoRemove: e.target.value })
                            }
                          />
                        </form>
                      )}
                      <div
                        style={{
                          flexDirection: "row",
                          top: "10px",
                          marginBottom: "10px",
                          left: "0px",
                          display: "flex",
                          position: "relative",
                          height: "100%",
                          alignItems: "center"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            height: "60px",
                            overflowX: "auto",
                            overflowY: "hidden"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              position: "relative",
                              height: "80px",
                              overflowX: "auto",
                              overflowY: "hidden"
                            }}
                          >
                            <Link
                              to={`/${candidate.username}`}
                              style={{
                                display: "flex",
                                position: "relative",
                                width: "max-content",
                                maxWidth: "30%",
                                right: "0px",
                                fontSize: "25px",
                                textDecoration: "none"
                              }}
                            >
                              <img
                                src={
                                  candidate.photoThumbnail
                                    ? candidate.photoThumbnail
                                    : imagesl
                                }
                                alt="error"
                                style={{ height: "40px", width: "40px" }}
                              />
                              {candidate.name}
                              <br />@{candidate.username}
                            </Link>
                          </div>
                        </div>
                        <VoteModuleResults
                          parent={parent}
                          isElection={true}
                          availableEntities={this.state.availableEntities}
                          percentageDown={percentageDown}
                          percentageUp={percentageUp}
                        />
                        {this.props.auth !== undefined ? (
                          isMember ? (
                            <div
                              style={{
                                left: "0px",
                                display: "flex",
                                position: "relative",
                                flexDirection: "column",
                                height: "100%",
                                width: "3%",
                                border: "1px solid black",
                                alignItems: "center",
                                padding: "0px 30px"
                              }}
                            >
                              <div
                                style={{
                                  width: "max-content",
                                  display: "flex",
                                  position: "relative",
                                  flexDirection: "column",
                                  height: "100%",
                                  alignItems: "center",
                                  zIndex: "9999",
                                  color: upvoted ? "black" : "grey"
                                }}
                                onClick={() => {
                                  if (upvoted) {
                                    console.log("up remove");
                                    this.handleChangeSupport(
                                      parent,
                                      null,
                                      candidate
                                    );
                                  } else {
                                    console.log("up");
                                    this.handleChangeSupport(
                                      parent,
                                      true,
                                      candidate
                                    );
                                  }
                                }}
                              >
                                Up
                              </div>
                              <div
                                style={{
                                  width: "max-content",
                                  display: "flex",
                                  position: "relative",
                                  flexDirection: "column",
                                  height: "100%",
                                  alignItems: "center",
                                  zIndex: "9999",
                                  color: downvoted ? "black" : "grey"
                                }}
                                onClick={() => {
                                  if (downvoted) {
                                    console.log("down removed");
                                    this.handleChangeSupport(
                                      parent,
                                      null,
                                      candidate
                                    );
                                  } else {
                                    console.log("down");
                                    // upvote - this event's user's profile
                                    this.handleChangeSupport(
                                      parent,
                                      false,
                                      candidate
                                    );
                                  }
                                }}
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
                                padding: "0px 30px"
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
                  );
                })
              ) : (
                <div style={{ color: "grey" }}>
                  no candidates
                  {this.props.auth === undefined && (
                    <div
                      style={{
                        color: "grey",
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        padding: "0px 30px"
                      }}
                      onClick={this.props.getUserInfo}
                      //to="/login"
                    >
                      must login to vote
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default VoteStraw;
/**
 * 
  componentDidUpdate = (prevProps) => {
    if (
      this.state.chosenEntity &&
      this.state.chosenEntity !== this.state.lastChosenEntity
    ) {
      if (!this.state.chosenEntity) {
        this.setState({
          supports: this.state.fullVotes,
          lastChosenEntity: this.state.chosenEntity
        });
      } else {
        var supports = this.state.supports.filter(
          (parent) =>
            (this.state.chosenEntity.members &&
              this.state.chosenEntity.members.includes(parent.authorId)) ||
            (this.state.chosenEntity.admin &&
              this.state.chosenEntity.admin.includes(parent.authorId)) ||
            (this.state.chosenEntity.faculty &&
              this.state.chosenEntity.faculty.includes(parent.authorId))
        );
        this.setState({
          supports,
          fullVotes: supports,
          lastChosenEntity: this.state.chosenEntity
        });
      }
    }
    if (this.props.parent.candidates !== prevProps.parent.candidates) {
      //this.getCandidates();
    }
  };
 */
