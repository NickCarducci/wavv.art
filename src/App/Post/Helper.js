import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import firebase from "../.././init-firebase.js";
import { standardCatch } from "../../components/Forum/New/index.js";
import NewDrop from "./NewDrop.js";

const firestore = getFirestore(firebase);
class Helper extends React.Component {
  state = { fire: false };
  takeOutTheTrash = (parent) => {
    const { confirmDelete } = this.state;
    if (confirmDelete) {
      this.setState({
        confirmDelete: null
      });
    } else {
      var answer = window.confirm(
        `want to really delete ${
          this.props.commtype === "new" ? "post" : this.props.commtype
        } ${parent.message} and all comments therein? you cannot undo this!`
      );
      if (answer) {
        this.setState({
          confirmDelete: ""
        });
      }
    }
  };
  editReaction = (reactions, reaction) =>
    this.setState(
      {
        reaction: reactions[reactions.lastIndexOf(reaction) + 1]
      },
      (reaction) => {
        const { parent } = this.props;
        const newReaction = reactions[reactions.lastIndexOf(reaction) + 1];
        clearTimeout(this.reactionaryFunction);
        this.reactionaryFunction = setTimeout(
          () =>
            updateDoc(doc(firestore, "users", parent.authorId), {
              newReaction
            })
              .then(() => {
                if (this.props.auth !== undefined) {
                  updateDoc(doc(firestore, parent.collection, parent.id), {
                    reactions: !newReaction
                      ? firebase.firestore.FieldValue.arrayRemove(
                          this.props.auth.uid
                        )
                      : firebase.firestore.FieldValue.arrayUnion(
                          this.props.auth.uid
                        )
                  })
                    .then(() => {
                      const reactionObject = {
                        authorId: this.props.auth.uid,
                        parentAuthorId: parent.authorId,
                        parentCollection: parent.collection,
                        parentId: parent.id,
                        reaction: newReaction,
                        time: new Date()
                      };
                      getDocs(
                        query(
                          collection(firestore, "reactions"),
                          where("authorId", "==", this.props.auth.uid),
                          where("parentId", "==", parent.id),
                          where("parentCollection", "==", parent.collection)
                        )
                      ).then((querySnapshot) => {
                        querySnapshot.docs.forEach((doc) => {
                          if (doc.exists) {
                            if (newReaction) {
                              updateDoc(
                                doc(firestore, "reactions", doc.id),
                                reactionObject
                              ).catch(standardCatch);
                            } else {
                              deleteDoc(
                                doc(firestore, "reactions", doc.id)
                              ).catch(standardCatch);
                            }
                          } else {
                            if (newReaction)
                              addDoc(
                                doc(firestore, "reactions", doc.id),
                                reactionObject
                              ).catch(standardCatch);
                          }
                        });
                      });
                    })
                    .catch(standardCatch);
                } else {
                  clearTimeout(this.notified);
                  this.notified = setTimeout(
                    () =>
                      window.alert(
                        "they'll get the message, but you'll have to login to keep them notified"
                      ),
                    5555
                  );
                }
              })
              .catch(standardCatch),
          8888
        );
      }
    );
  yesDelete = (e) => {
    e.preventDefault();
    const { confirmDelete } = this.state;
    const { parent } = this.props;
    const deleteReactions = () => {
      getDocs(
        query(
          collection(firestore, "reactions"),
          where("parentId", "==", parent.id),
          where("parentCollection", "==", parent.collection)
        )
      )
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log(
              "no reactions to delete for " +
                parent.collection +
                " " +
                parent.message
            );
          } else
            querySnapshot.docs.forEach((doc) => {
              if (doc.exists) {
                deleteDoc(doc(firestore, "reactions", doc.id)).catch(
                  standardCatch
                );
              }
            });
        })
        .catch(standardCatch);
    };
    const deleteComments = () => {
      getDocs(
        query(
          collection(firestore, parent.commentsName),
          where("forumpostId", "==", parent.id)
        )
      )
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log(
              "no comments to delete for " +
                parent.collection +
                " " +
                parent.message
            );
          } else
            querySnapshot.docs.forEach((doc) => {
              deleteDoc(doc(firestore, parent.commentsName, doc.id)).catch(
                standardCatch
              );
            });
          deleteReactions();
        })
        .catch(standardCatch);
    };
    const deleteVideos = () => {
      //var thisone = this.props.commtype;
      getDocs(
        query(
          collection(firestore, "chatMeta"),
          where("threadId", "==", parent.collection + parent.id)
        )
      ).then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log(
            "no videos to delete for " +
              parent.collection +
              " " +
              parent.message
          );
        } else
          querySnapshot.docs.forEach((doc) => {
            deleteDoc(doc(firestore, "chatMeta", doc.id)).catch(standardCatch);
          });
        deleteComments();
      });
    };
    if (confirmDelete.toLowerCase() === "delete") {
      this.setState(
        {
          confirmDelete: false
        },
        () => {
          deleteDoc(doc(firestore, parent.collection, parent.id))
            .then(() =>
              getDocs(
                query(
                  collection(firestore, "issues"),
                  where("title", "==", parent.issue)
                )
              ).then((querySnapshot) => {
                querySnapshot.docs.forEach(
                  (doc) =>
                    doc.exists &&
                    updateDoc(doc(firestore, "issues", doc.id), {
                      issueCount: firebase.firestore.FieldValue.increment(-1)
                    })
                      .then(() => {
                        var o = null;
                        if (this.props.community) {
                          o = updateDoc(
                            doc(
                              firestore,
                              "communities",
                              this.props.community.id
                            ),
                            {
                              ["issue" +
                              parent.issue]: firebase.firestore.FieldValue.increment(
                                -1
                              )
                            }
                          );
                        } else {
                          o = updateDoc(
                            doc(firestore, "cities", this.props.city),
                            {
                              ["issue" +
                              parent.issue]: firebase.firestore.FieldValue.increment(
                                -1
                              )
                            }
                          );
                        }
                        o.then(() => {
                          this.props.delete(parent.id);
                          console.log("deleted post" + parent.id);
                          deleteVideos();
                        }).catch(standardCatch);
                      })
                      .catch(standardCatch)
                );
              })
            )
            .catch(standardCatch);
        }
      );
    }
  };
  render() {
    const { confirmDelete } = this.state;
    const { parent, onlyPost, videoRecorderOpen } = this.props;
    const lit =
      "https://www.dropbox.com/s/756f3108r08yerc/lit%20icon%20%282%29.png?raw=1";
    const shocked =
      "https://www.dropbox.com/s/vfm52e6kcelapdz/Shocked%20icon.png?raw=1";
    const laughing =
      "https://www.dropbox.com/s/zznekjklhmhnw9o/Laughing%20icon%20%281%29.png?raw=1";
    const contempt =
      "https://www.dropbox.com/s/ash7v6zps0e9cag/Contempt%20icon.png?raw=1";
    const love =
      "https://www.dropbox.com/s/o3s4bag8xmorigh/Love%20icon.png?raw=1";

    const reactions = ["lit", "shocked", "laughing", "contempt", "love"];
    const show = onlyPost === parent.shortId && !videoRecorderOpen;
    //console.log("confirmDelete", confirmDelete);
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: show ? "min-content" : "0px",
          width: "100%"
        }}
      >
        <div
          style={{
            height: "min-content",
            fontSize: "15px",
            width: "100%",
            color: "grey",
            alignItems: "center",
            justifyContent: "space-around",
            display: "flex"
          }}
        >
          {confirmDelete || confirmDelete === "" ? (
            <form
              style={{
                position: "relative"
              }}
              onSubmit={this.yesDelete}
            >
              <input
                style={{
                  width: "50px"
                }}
                placeholder="delete"
                className="input"
                //value={this.state[`confirmDelete+${parent.id}`]}
                value={this.state[`confirmDelete`]}
                onChange={(e) =>
                  this.setState({
                    confirmDelete: e.target.value
                  })
                }
              />
            </form>
          ) : (
            ""
          )}
          {(this.props.auth === undefined ||
            this.props.auth.uid !== parent.authorId) && (
            <div
              style={{ width: "40px", height: "40px", position: "relative" }}
            >
              {this.state.reaction ? (
                reactions.map((reaction) => {
                  var reactionSrc =
                    reaction === "lit"
                      ? lit
                      : reaction === "shocked"
                      ? shocked
                      : reaction === "laughing"
                      ? laughing
                      : reaction === "contempt"
                      ? contempt
                      : reaction === "love"
                      ? love
                      : null;
                  return (
                    <img
                      key={reaction}
                      onClick={() => this.editReaction(reactions, reaction)}
                      style={{
                        width:
                          this.state.reaction === reaction ? "40px" : "0px",
                        height:
                          this.state.reaction === reaction ? "40px" : "0px",
                        transition: ".3s ease-in"
                      }}
                      src={reactionSrc}
                      alt={`reaction ${reaction}`}
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    height: "min-content",
                    textAlign: "center"
                  }}
                  onClick={() => this.setState({ reaction: "lit" })}
                >
                  o
                </div>
              )}
            </div>
          )}

          {/*this.props.comment !== "" && (
          <div
            onClick={this.props.clear}
            style={{
              display: "flex",
              position: "relative",
              top: "0px",
              height: "46px",
              justifyContent: "flex-start",
              alignItems: "center",
              textIndent: "10px",
              color: "grey",
              flexDirection: "row",
              fontSize: "15px"
            }}
          >
            Clear
          </div>
          )*/}
          {this.props.showRebeats &&
            !parent.droppedPost &&
            this.props.auth !== undefined &&
            this.props.auth.uid === parent.authorId && (
              <NewDrop
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                parent={parent}
                droppedCommentsOpen={this.props.droppedCommentsOpen}
                getUserInfo={this.props.getUserInfo}
                openDrop={this.props.openDrop}
                closeDrop={this.props.closeDrop}
                auth={this.props.auth}
                height={this.props.height}
                width={this.props.width}
                user={this.props.user}
              />
            )}
          {this.props.auth !== undefined &&
            parent.authorId === this.props.auth.uid &&
            this.props.closeDrop &&
            this.props.closeFilter && (
              <div
                onMouseEnter={() => this.setState({ hoverTrash: true })}
                onMouseLeave={() => this.setState({ hoverTrash: false })}
                onClick={() => this.takeOutTheTrash(parent)}
                //trash
                style={{
                  display: "flex",
                  color: "grey",
                  opacity: this.state.hoverTrash ? "1" : ".3",
                  transition: ".1s ease-in"
                }}
              >
                &#128465;
              </div>
            )}
          {!this.props.isDroppedIn &&
            this.props.auth !== undefined &&
            parent.authorId === this.props.auth.uid && (
              <div
                style={{
                  zIndex: "7",
                  color: "black",
                  height: "15px",
                  border: "1px solid",
                  width: "min-content"
                }}
                onClick={() => this.props.setPost({ videoRecorderOpen: true })}
              >
                +
              </div>
            )}
          {this.props.chosenPostId !== parent.id ||
          this.props.postHeight === 0 ||
          (this.props.chosenPostId !== parent.id &&
            this.props.postHeight > 0) ? null : (
            <div
              onClick={() => this.props.helper()}
              style={{
                display: this.props.postHeight === 0 ? "none" : "flex",
                position: "relative",
                width:
                  this.props.chosenPostId === parent.id &&
                  this.props.postHeight > 0
                    ? ""
                    : "0px",
                minWidth: "30px",
                padding: "5px",
                paddingTop: "8px",
                color: "grey",
                fontSize: "15px",
                transition: "width .3s ease-in",
                border:
                  this.props.chosenPostId === parent.id &&
                  this.props.postHeight > 0
                    ? "1px black solid"
                    : "none",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999"
              }}
            >
              &times;
            </div>
          )}
          <div
            style={{
              border: "1px solid",
              display: "none",
              justifyContent: "center",
              alignItems: "center",
              color: "grey",
              height: "min-content",
              width: "min-content",
              borderRight: "1px solid"
            }}
          >
            <Link
              to={{ pathname: "/doc", state: { parent } }}
              style={{
                position: "relative",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "grey",
                width: "min-content",
                margin: "5px",
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderRight: "1px solid"
              }}
            >
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
              <div
                style={{
                  height: "1px",
                  width: "9px",
                  margin: "2px",
                  backgroundColor: "grey"
                }}
              />
            </Link>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                width: "38px",
                borderLeft: "1px solid"
              }}
            >
              <i
                className="fas fa-phone"
                style={{
                  color: "grey",
                  position: "absolute"
                }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Helper;
