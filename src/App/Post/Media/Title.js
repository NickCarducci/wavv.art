import React from "react";
import { RegisterCurseWords } from "../PeanutGallery/EmbeddedRebeat";

class Title extends React.Component {
  state = {};
  render() {
    const {
      parent,
      /*summary, mTT,*/
      opening,
      onlyCommunity,
      int,
      isDroppedIn,
      onlyPost,
      shorten,
      postHeight
    } = this.props;
    //console.log(onlyCommunity, onlyPost);
    const specificallyShortTableChain =
      onlyCommunity === parent.chainId && onlyPost !== parent.shortId; //opening === parent.shortId&&
    return (
      <div
        onClick={
          () =>
            postHeight === 0 &&
            this.props.onlyPost === parent.shortId &&
            !isDroppedIn &&
            this.props.setPost(
              { shorten: !this.props.shorten && parent.shortId },
              () => {
                //if(this.state.shorten)this.props.setForum
              }
            ) //all expectations are significant or important? "maybe here, yep [time is moving fast]"
          //every second count (authorized committee ISP-dad)
          //two accounts  of separation, industry or work for a job
          //alll the shitty people, for the world
        }
        style={{
          zIndex: "1000",

          userSelect: "all",
          opacity: shorten ? 0.6 : 1,
          backgroundColor: "rgb(250,250,255)",
          borderRadius: "3px",
          color: "rgb(20,20,25)",
          textDecoration: "none",
          height: "min-content",
          padding: "5px",
          //boxShadow: `0px 0px 2px 1px rgba(0,0,0,${ opening === parent.shortId ? 1 : 0.3})`,
          margin: "0px 5px",
          border: "1px dotted white",
          fontSize: "16px",
          background:
            shorten === parent.shortId
              ? "rgb(180,200,200)"
              : this.props.isDroppedIn
              ? "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.3),rgba(0,0,60,.3))"
              : `rgba(250,250,255,${opening === parent.shortId ? 1 : 0.6})`,
          width: "calc(100% - 40px)",
          transition: ".1s ease-in"
        }}
      >
        {
          /*!summary ?  mTT && String(mTT):*/ RegisterCurseWords(parent.message)
            .substring(
              0,
              !isDroppedIn && shorten !== "" && shorten === parent.shortId
                ? 10
                : parent.message.length
            ) //message
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((line, i) => (
              <span
                className={
                  parent.collection === "ordinances"
                    ? "Charmonman"
                    : ["elections", "oldElections"].includes(parent.collection)
                    ? "MeriendaCursive"
                    : ["cases", "oldCases"].includes(parent.collection)
                    ? "Rokkitt"
                    : ["budget", "oldBudget"].includes(parent.collection)
                    ? "Merienda"
                    : ""
                }
                key={i}
              >
                {line}
                {shorten === parent.shortId && "..."}
                <br />
              </span>
            ))
        }
        <div
          style={{
            textAlign: "center",
            color: opening !== parent.shortId ? "black" : "rgb(210,210,225)",
            right: onlyPost !== parent.shortId ? "" : "40px",
            opacity:
              opening === parent.shortId || onlyPost === parent.shortId ? 1 : 0,
            backgroundColor:
              opening === parent.shortId
                ? "rgba(40,40,80,1)"
                : "rgba(40,40,80,.4)",
            position: "absolute",
            width:
              onlyPost === parent.shortId
                ? "calc(60% - 10px)"
                : specificallyShortTableChain
                ? "0px"
                : "calc(max-content + 10px)",
            transition: `${opening === parent.shortId ? 0.3 : 0}s ease-in`,
            minWidth: "max-content"
          }}
        >
          {parent.videos && parent.videos.length > 0
            ? `opening in ${int}`
            : `no videos here`}
        </div>
        {onlyPost && <br />}
      </div>
    );
  }
}
export default Title;
