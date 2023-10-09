import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import React from "react";
import firebase from ".././init-firebase.js";
import { specialFormatting, standardCatch } from "../widgets/Sudo.js";

class Filter extends React.Component {
  state = { newIssue: "" };
  render() {
    let i = 0;
    const { newIssue } = this.state;
    const {
      subtype,
      onlyPost,
      isAdmin,
      isMember,
      field,
      coll,
      commtype,
      departmentTyped,
      community,
      city,
      auth
    } = this.props;
    var isOpen = community && !community.privateToMembers;
    if (subtype && (!community || isOpen || isMember || isAdmin)) {
      return (
        <div
          style={{
            position: "absolute",
            bottom: "0px"
          }}
        >
          {onlyPost && (
            <div
              onClick={() => this.props.func("")}
              style={{
                display: "flex",
                width: "calc(100% - 40px)",
                background: "linear-gradient(rgba(20,20,20,0),rgb(20,20,20))",
                color: "white",
                height: "min-content",
                padding: "10px 20px"
              }}
            >
              &times;
            </div>
          )}
          {commtype === "forum" &&
            !this.props.isPerson &&
            !this.props.globeChosen &&
            (!community || isOpen || isAdmin || isMember) && (
              <form
                onSubmit={(e) => {
                  const set = (issue) =>
                    this.setState({ newIssue: "" }, () => {
                      var o = null;
                      if (community) {
                        o = updateDoc(
                          doc(firestore, "communities", community.id),
                          {
                            ["issue" +
                            issue]: firebase.firestore.FieldValue.increment(1)
                          }
                        );
                      } else {
                        o = updateDoc(
                          doc(firestore, "cities", this.props.city),
                          {
                            ["issue" +
                            issue]: firebase.firestore.FieldValue.increment(1)
                          }
                        );
                      }
                    });
                  const add = (issue) => {
                    var query = null;
                    var obj = {
                      issueCount: firebase.firestore.FieldValue.increment(1),
                      time: new Date(),
                      title: this.state.chosenIssue
                    };
                    //increment prevalence
                    if (community) {
                      obj.communityId = community.id;
                      query = query(
                        collection(firestore, "issues"),
                        where("communityId", "==", community.id),
                        where("title", "==", issue)
                      );
                    } else {
                      obj.city = city;
                      query = query(
                        collection(firestore, "issues"),
                        where("city", "==", city),
                        where("title", "==", issue)
                      );
                    }
                    getDocs(query).then((querySnapshot) => {
                      querySnapshot.docs.forEach((doc) =>
                        doc.exists
                          ? coll
                              .update(obj)
                              .then(() => set(issue))
                              .catch(standardCatch)
                          : coll
                              .add(obj)
                              .then(() => set(issue))
                              .catch(standardCatch)
                      );
                    });
                  };

                  e.preventDefault();
                  if (auth === undefined) {
                    var answer5 = window.confirm("sign in?");
                    if (answer5) {
                      this.props.getUserInfo();
                    }
                  } else if (canIView(auth, null, community)) {
                    var answer = window.confirm(
                      `add ${newIssue} to ${
                        community ? community.message : city
                      }'s issues?`
                    );
                    if (answer) {
                      add(newIssue);
                    }
                  }
                }}
              >
                <input
                  maxLength="17"
                  value={newIssue}
                  onChange={(e) =>
                    this.setState({
                      newIssue: specialFormatting(e.target.value)
                    })
                  }
                  placeholder="new issue"
                  style={{
                    border: "none",
                    display: "flex",
                    width: "100%",
                    backgroundColor: "rgb(20,20,20)",
                    color: "white",
                    padding: "10px 0px",
                    fontSize: "16px",
                    height: "min-content"
                  }}
                />
              </form>
            )}
          {(community ? subtype : []).map((x) => {
            const na = specialFormatting(x);
            i++;
            var thisone = {};
            thisone[na] = [];
            this.props.theLotOfPosts.map(
              (b) => na === b[typeName] && thisone[na].push(x.id)
            );
            if (onlyPost) {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "rgb(20,20,20)",
                    color: "white",
                    height: "min-content"
                  }}
                >
                  <div
                    onClick={() => this.props.func(na)}
                    style={{
                      color: x === chosen ? "" : "grey",
                      fontSize: "16px",
                      margin: "10px 10px",
                      display: "flex",
                      width: "calc(100% - 20px)",
                      justifyContent: "space-between"
                    }}
                  >
                    {na}&nbsp;{thisone[na].length}
                  </div>
                  {isAdmin &&
                    ["election", "classes", "departments"].includes(
                      this.props.commtype
                    ) && (
                      <div
                        onClick={() => {
                          var answer = window.confirm(
                            "delete this filter? elections will move into Miscellaneous"
                          );
                          if (answer) {
                            var doc = community ? community.id : city;
                            var col = community ? "communities" : "cities";
                            updateDoc(doc(firestore, col, doc), {
                              [field]: firebase.firestore.FieldValue.arrayRemove(
                                na
                              )
                            })
                              .then(() => {
                                if (community) {
                                  getDocs(
                                    query(
                                      collection(firestore, coll),
                                      where("communityId", "==", community.id),
                                      where([field], "==", na)
                                    )
                                  )
                                    .then((querySnapshot) => {
                                      querySnapshot.docs.forEach((doc) => {
                                        if (doc.exists) {
                                          doc.update({
                                            [typeName !== "issues"
                                              ? typeName
                                              : "issue"]: "Miscellaneous"
                                          });
                                        }
                                      });
                                    })
                                    .catch(standardCatch);
                                } else {
                                  getDocs(
                                    query(
                                      collection(firestore, "forum"),
                                      where("authorId", "==", auth.uid),
                                      where("city", "==", city),
                                      where("issue", "==", na)
                                    )
                                  )
                                    .then((querySnapshot) => {
                                      querySnapshot.docs.forEach((doc) => {
                                        if (doc.exists) {
                                          doc.update({
                                            issue: "Miscellaneous"
                                          });
                                        }
                                      });
                                    })
                                    .catch(standardCatch);
                                }
                              })
                              .catch(standardCatch);
                          }
                        }}
                        style={{
                          position: "relative",
                          top: "0px",
                          color: "white",
                          zIndex: "9999",
                          marginRight: "25px",
                          display: "flex",
                          height: "56px",
                          width: "60px",
                          wordBreak: "none"
                        }}
                      >
                        (-)
                      </div>
                    )}
                </div>
              );
            } else if (chosen === "" && i === 1) {
              return (
                <div
                  key={i}
                  onClick={open}
                  style={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "rgb(20,20,20)",
                    color: "white",
                    height: "min-content"
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      margin: "10px 10px",
                      display: "flex",
                      width: "calc(100% - 20px)",
                      justifyContent: "space-between"
                    }}
                  >
                    {this.props.theLotOfPosts.length}&nbsp;in&nbsp;
                    {subtype.length} categories
                  </div>
                </div>
              );
            } else if (na === chosen) {
              return (
                <div
                  key={i}
                  onClick={open}
                  style={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "rgb(20,20,20)",
                    color: "white",
                    height: "min-content"
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      margin: "10px 10px",
                      display: "flex",
                      width: "calc(100% - 20px)",
                      justifyContent: "space-between"
                    }}
                  >
                    {na}&nbsp;^
                  </div>
                </div>
              );
            } else return null;
          })}
          {chosen !== "" && (
            <div
              onClick={() => {
                this.props.func("");
              }}
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                color: "white",
                zIndex: "9999",
                display: "flex",
                fontSize: "10px",
                width: "56px"
              }}
            >
              &times;&nbsp;{chosen.substr(0, 4)}
            </div>
          )}
          {["classes", "budget", "election", "cases"].includes(commtype) && (
            <div
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "rgb(20,20,20)",
                color: "white",
                height: "min-content",
                breakInside: "avoid"
              }}
            >
              <div
                style={{
                  margin: "10px 0px",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-evenly"
                }}
              >
                <div
                  onClick={() => this.props.setWhen({ openWhen: "new" })}
                  style={{
                    display: "flex",
                    position: "relative",
                    borderBottom: `${
                      this.props.openWhen === "new" ? 4 : 0
                    }px solid white`
                  }}
                >
                  new
                </div>
                <div
                  onClick={() => this.props.setWhen({ openWhen: "expired" })}
                  style={{
                    display: "flex",
                    position: "relative",
                    borderBottom: `${
                      this.props.openWhen === "expired" ? 4 : 0
                    }px solid white`
                  }}
                >
                  expired
                </div>
              </div>
            </div>
          )}
          {["classes", "budget", "election", "cases"].includes(commtype) && (
            <div
              style={{
                display: "flex",
                //maxWidth: "300px",
                height: "min-content",
                overflow: "hidden",
                color: "black",
                flexDirection: "column",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                opacity: ".8",
                backgroundColor: "white"
              }}
            >
              see {this.props.openWhen === "expired" ? "older" : "current"}{" "}
              {["budget", "election", "cases"].includes(commtype)
                ? `${commtype}s`
                : commtype}
            </div>
          )}
          {["new", "lesson", "show", "game", "departments"].includes(
            commtype
          ) && (
            <div
              style={{
                display: "flex",
                //maxWidth: "300px",
                height: "min-content",
                overflow: "hidden",
                color: "black",
                flexDirection: "column",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                opacity: ".8",
                backgroundColor: "white"
              }}
            >
              see {departmentTyped !== "" ? departmentTyped : "all"}{" "}
              {["departments"].includes(commtype) ? `${commtype}s` : ""}
              {["new"].includes(commtype) ? "forum posts" : ""}
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default Filter;
