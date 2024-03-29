import React from "react";
import firebase from "../../.././init-firebase";
import Recorder, { Videos } from "./Recorder";
import RollFiles from "./RollFiles";
import { deleteObject, ref } from "firebase/storage";
import { arrayRemove, doc, getFirestore, updateDoc } from "firebase/firestore";

const firestore = getFirestore(firebase);
class Media extends React.Component {
  state = {
    selectedFolder: "*"
  };
  render() {
    const { parent, shortId, videoRecorderOpen, isDroppedIn } = this.props;
    const isAuthor =
      this.props.auth !== undefined && parent.authorId === this.props.auth.uid;
    const onlyPost = this.props.onlyPost && !isDroppedIn && videoRecorderOpen;
    return (
      <div
        style={{
          overflow: "hidden",
          transition: ".3s ease-in",
          backgroundColor: "rgb(220,190,180)",
          display: "flex",
          position: "relative",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: onlyPost ? "6px" : "0px",
          height: onlyPost ? "min-content" : "0px"
        }}
      >
        {
          parent.videos &&
            parent.videos.length > 0 &&
            parent.videos.map((x) => {
              return (
                <div>
                  {this.props.auth !== undefined &&
                    this.props.auth.uid === parent.authorId && (
                      <div
                        style={{ position: "absolute", right: "20px" }}
                        onClick={() => {
                          var answer = window.confirm("Delete?");
                          answer &&
                            updateDoc(doc(firestore, "forum", parent.id), {
                              videos: arrayRemove(x)
                            });
                        }}
                      >
                        &times;
                      </div>
                    )}
                  <img
                    alt={x}
                    src={x}
                    style={{
                      width: "calc(100% - 10px)"
                    }}
                  />
                </div>
              );
            })
          /*<RollFiles
            user={this.props.user}
            auth={this.props.auth}
            isAuthor={isAuthor}
            meAuth={this.props.meAuth}
            getUserInfo={this.props.getUserInfo}
            videos={parent.videos}
            selectedFolder={this.state.selectedFolder}
            shortId={`${shortId}`}
            unloadGreenBlue={this.props.unloadGreenBlue}
            getVideos={this.props.getVideos}
          />*/
        }
        {this.props.auth !== undefined &&
          parent.authorId === this.props.auth.uid &&
          videoRecorderOpen && (
            <Recorder
              parent={parent}
              vintageOfKeys={this.props.vintageOfKeys}
              setNapkin={this.props.setNapkin}
              user={this.props.user}
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
              auth={this.props.auth}
              room={this.props.room}
              threadId={this.props.threadId}
              setPost={this.props.setPost}
              entityType={this.props.entityType}
              entityId={this.props.entityId}
            />
          )}
      </div>
    );
  }
}
export default Media;
