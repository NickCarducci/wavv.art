import React from "react";
import firebase from ".././init-firebase";
import VoterQuery from "./Civics/VoterQuery";
import TV from "./TV";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryingWait: false
    };
  }
  render() {
    const { forumOpen, appHeight, width } = this.props;
    return (
      <div
        style={{
          position: "relative",
          width: "100%"
        }}
      >
        {
          //this.state.queryingWait ? <div className="queryWaitLoading">loading</div> : null
        }
        {this.props.mapOpen && this.props.auth === undefined && (
          <div onClick={this.props.getUserInfo}>
            This community is private. want to login?
          </div>
        )}
        {this.state.openTv && (
          <TV
            profile={this.props.profile}
            getCommunity={this.props.getCommunity}
            hydrateEntity={this.props.hydrateEntity}
            getDrop={this.props.getDrop}
            hydrateUser={this.props.hydrateUser}
            width={width}
            users={this.props.users}
            height={appHeight}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            user={this.props.user}
            auth={this.props.auth}
            communities={this.props.communities}
            globeChosen={this.props.globeChosen}
            setTV={(x) => this.setState(x)}
          />
        )}
        {this.state.showFollowing && (
          <div
            style={{
              zIndex: "2",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              position: "fixed",
              width: "100%",
              height: "100%"
            }}
          >
            {this.props.auth !== undefined ? (
              this.props.user.following.length > 0 ? (
                <div>
                  following
                  {this.props.following.map((z) => {
                    return (
                      <div
                        key={z}
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          backgroundColor: "white",
                          borderRadius: "50px",
                          width: "min-content"
                        }}
                      >
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "flex-end"
                          }}
                          to={`/at/${z.username}`}
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                              borderTopLeftRadius: "50px",
                              borderBottomLeftRadius: "50px"
                            }}
                            src={z.photoThumbnail}
                            alt={z.username}
                          />
                          {z.name}@{z.username}
                        </Link>
                        <div
                          onClick={() => {
                            var answer1 = window.confirm(
                              `want to follow ${z.name}@${z.username}?`
                            );

                            if (answer1) {
                              updateDoc(
                                doc(firestore, "users", this.props.auth.uid),
                                {
                                  following: firebase.firestore.FieldValue.arrayUnion(
                                    z.id
                                  )
                                }
                              ).catch((err) => console.log(err.message));
                            }
                          }}
                          style={
                            this.props.user &&
                            this.props.user.following &&
                            this.props.following.includes(z.id)
                              ? {
                                  display: "flex",
                                  left: "10px",
                                  zIndex: "9999",
                                  border: "navy"
                                }
                              : {
                                  display: "flex",
                                  left: "10px",
                                  zIndex: "9999"
                                }
                          }
                        >
                          {z.smiley}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null /*(
        <div>
          start following some people
          <br />
          {suggested.map((z) => {
            var x = this.props.users.find((y) => y.id === z);
            return (
              <Profiler
                user={this.props.user}
                x={x}
                auth={this.props.auth}
              />
            );
          })}
          {communitiesThatPartOf.length === 0 && (
            <div>
              &bull;&nbsp;you arent part of any communities
              <br /> Want to join one of these?{" "}
              {this.props.communties &&
                this.props.communties.map((x) => {
                  return (
                    <div>
                      {x.message}
                      {this.state.community.requestingMembership(
                        this.props.auth.uid
                      ) ? (
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              "recind request for membership?"
                            );
                            if (answer) {
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.state.community.id)
                                .update({
                                  requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                                    this.props.auth.uid
                                  )
                                });
                            }
                          }}
                        >
                          Requesting...
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              "request membership?"
                            );
                            if (answer) {
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.state.community.id)
                                .update({
                                  requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                                    this.props.auth.uid
                                  )
                                });
                            }
                          }}
                        >
                          Join
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )*/
            ) : (
              <div
                onClick={this.props.getUserInfo} //to="/login"
              >
                login to join
              </div>
            )}
          </div>
        )}
        <div
          onClick={() => this.setState({ showFollowing: false })}
          style={{
            zIndex: "2",
            color: "blue",
            justifyContent: "center",
            alignItems: "center",
            display: this.state.showFollowing ? "flex" : "none",
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "56px",
            height: "56px",
            borderRadius: "45px",
            border: "5px solid #78f8fff2",
            backgroundColor: "white",
            transition: "ease-in .3s"
          }}
        >
          &times;
        </div>
        {window.location.pathname === "/" &&
          !this.props.chatsopen &&
          !forumOpen &&
          !this.props.switchCityOpen && (
            <VoterQuery
              openTvgo={() => this.setState({ openTv: true })}
              openTv={this.state.openTv}
              officialResults={this.props.officialResults}
              officialLevel={this.props.officialLevel}
              selectOfficialLevel={this.props.selectOfficialLevel}
              officialRole={this.props.officialRole}
              selectOfficialRole={this.props.selectOfficialRole}
              clearErrorVoter={this.props.clearErrorVoter}
              errorVoter={this.props.errorVoter}
              voterResults={this.props.voterResults}
              handleVoterQuery={this.props.handleVoterQuery}
            />
          )}
      </div>
    );
  }
}
export default Links;
