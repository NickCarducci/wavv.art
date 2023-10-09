import React from "react";
import Post from "../.";

export const RegisterCurseWords = (mT, isGood) => {
  var curses = ["bitch", "cunt", "pussy", "pussies", "fuck", "shit"];
  if (isGood) {
    return mT;
  } else {
    const newerText = (curse, index) => {
      var hyphen = "-";
      for (let x = 0; x < curse.length - 1; x++) {
        hyphen = hyphen + "-";
      }
      return mT.replace(mT.substring(index, index + curse.length), hyphen);
    };
    var set = curses.map((c) => {
      var index = 0;
      if (mT.toLowerCase().includes(c)) {
        var curses = [];
        mT.split(/\W+/).map(
          (cc) => cc.toLowerCase().includes(c) && curses.push(cc)
        );
        var set = curses.map((curse) => {
          index = mT.lastIndexOf(curse);
          return (mT = newerText(curse, index));
        });
        return set[set.length - 1];
      } else return mT;
    });
    return set[set.length - 1];
  }
};

class EmbeddedRebeat extends React.Component {
  state = {};
  render() {
    const { comments, isDroppedIn, onlyPost } = this.props;
    if (!isDroppedIn || isDroppedIn.message)
      //console.log("isDroppedIn", isDroppedIn, this.props.parent);
      var mTTT =
        isDroppedIn &&
        isDroppedIn.message &&
        isDroppedIn.message.substring(0, isDroppedIn.message.length);

    var isGood =
      this.props.auth !== undefined &&
      this.props.user !== undefined &&
      !this.props.user.under13 &&
      this.props.user.showCurses;
    var mTT = mTTT && RegisterCurseWords(mTTT, isGood);
    return (
      isDroppedIn &&
      isDroppedIn.message && (
        <div
          style={{
            backgroundColor: "rgb(210,210,230)",
            flexDirection: "column",
            display: onlyPost ? "flex" : "none",
            color: "black",
            width: "99%",
            marginBottom: "2px",
            borderLeft: "3px solid",
            borderBottom: "1px solid"
          }}
        >
          {(this.props.isNew ||
            (this.props.auth !== undefined &&
              this.props.auth.uid === isDroppedIn.authorId)) && (
            <div
              style={{
                justifyContent: "space-between",
                wordBreak: "break-word",
                height: "min-content",
                alignItems: "center",
                display: "flex"
              }}
            >
              <div
                onClick={() => {
                  var answer = window.confirm("remove drop?");
                  if (answer) {
                    if (
                      this.props.auth !== undefined &&
                      this.props.auth.uid === isDroppedIn.authorId
                    ) {
                      this.setState({ confirmRemoveDrop: true });
                    } /**if(this.props.isNew) */ else {
                      this.props.setDelete();
                    }
                  }
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRight: "1px solid",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                &times;
              </div>
              {this.state.confirmRemoveDrop ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (this.state.removedrop.toLowerCase() === "remove drop") {
                      this.props.setDelete();
                    } else {
                      window.alert(`please enter "remove drop" to delete`);
                      this.setState({ confirmRemoveDrop: false });
                    }
                  }}
                >
                  <input
                    className="input"
                    style={{
                      border: "none",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      textIndent: "10px"
                    }}
                    placeholder="remove drop"
                    value={this.state.removedrop}
                    onChange={(e) =>
                      this.setState({ removedrop: e.target.value })
                    }
                  />
                </form>
              ) : (
                isDroppedIn.collection + isDroppedIn.id
              )}
            </div>
          )}
          {/*<div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "260px",
                  backgroundColor: "rgba(20,20,20,.4)"
                }}
              />*/}
          <Post
            mTT={mTT}
            res={{}}
            i={0}
            parent={isDroppedIn}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            isDroppedIn={true}
            city={isDroppedIn.city}
            commtype={
              ["budget", "oldBudget"].includes(isDroppedIn.collection)
                ? "budget"
                : ["elections", "oldElections"].includes(isDroppedIn.collection)
                ? "election"
                : ["cases", "oldCases"].includes(isDroppedIn.collection)
                ? "court case"
                : ["ordinances"].includes(isDroppedIn.collection)
                ? "ordinance"
                : "forum"
            }
            openWhen={
              ["oldElections", "oldCases", "oldBudget"].includes(
                isDroppedIn.collection
              )
                ? "expired"
                : "new"
            }
            user={this.props.user}
            auth={this.props.auth}
            community={this.props.community} //
            chosenPostId={this.props.chosenPostId}
            //helper={this.props.helper}
            delete={this.props.delete}
            comments={comments}
            clear={this.props.clear}
            height={this.props.height}
            globeChosen={this.props.globeChosen}
            communities={this.props.communities}
          />
        </div>
      )
    );
  }
}
export default EmbeddedRebeat;
