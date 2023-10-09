import React from "react";
import { withRouter } from "react-router-dom";
import Data from "./data";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import firebase from "./init-firebase.js";
import PromptAuth from "./widgets/PromptAuth.js"; //default export would require no '{}' braces
import { standardCatch } from "./components/Forum/New";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signOut
} from "firebase/auth";
import { getStorage, listAll, ref } from "firebase/storage";

const storage = getStorage(firebase);
const firestore = getFirestore(firebase);
class Auth extends React.Component {
  constructor(props) {
    super(props);
    var storedAuth = undefined;
    window.meAuth = undefined;
    this.state = {
      auth: undefined,
      user: undefined,
      meAuth: {},
      storedAuth,
      tickets: [],
      myCommunities: [],
      folders: [],
      storableAuth: []
    };
    this.ra = React.createRef();
    this.pa = React.createRef();
    this.gui = React.createRef();
    this.Vintages = React.createRef();
  }
  componentDidMount = () => {
    this.pa.current && this.pa.current.click();
  };
  componentDidUpdate = () => {
    if (window.meAuth !== this.state.lastAuth) {
      //console.log("window.meAuth", window.meAuth);
      this.setState({ lastAuth: window.meAuth }, () => {
        //console.log("this.state.lastAuth", this.state.lastAuth);
        if (window.meAuth !== undefined && this.props.rediret) {
          this.props.navigate(this.props.rediret);
        }
      });
    }
  };

  getEntities = (meAuth) => {
    const runRoles = () => {
      let iAmRepresentative = [];
      let iAmJudge = [];
      let iAmCandidate = [];
      onSnapshot(
        query(
          collection(firestore, "communities"),
          where("representatives", "array-contains", meAuth.uid)
        ),
        (querySnapshot) =>
          querySnapshot.docs.forEach((doc, i) => {
            var foo = doc.data();
            foo.id = doc.id;
            if (querySnapshot.docs.length === i) iAmRepresentative.push(foo);
          }),
        standardCatch
      );
      onSnapshot(
        query(
          collection(firestore, "communities"),
          where("judges", "array-contains", meAuth.uid)
        ),
        (querySnapshot) =>
          querySnapshot.docs.forEach((doc, i) => {
            var foo = doc.data();
            foo.id = doc.id;
            if (querySnapshot.docs.length === i) iAmJudge.push(foo);
          }),
        standardCatch
      );
      onSnapshot(
        query(
          collection(firestore, "elections"),
          where("candidates", "array-contains", meAuth.uid)
        ),
        (querySnapshot) =>
          querySnapshot.docs.forEach((doc, i) => {
            var foo = doc.data();
            foo.id = doc.id;
            if (querySnapshot.docs.length === i) iAmCandidate.push(foo);
          }),
        standardCatch
      );
      //snapshots cannot return without 'state', which uses DOM, or props:{}
    };
    onSnapshot(
      query(
        collection(firestore, "communities"),
        where("authorId", "==", meAuth.uid)
      ),
      (querySnapshot) => {
        let p = 0;
        let myCommunities = [];
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            if (foo.authorId === meAuth.uid) myCommunities.push(foo);
          }
        });
        if (p === querySnapshot.docs.length)
          onSnapshot(
            query(
              collection(firestore, "communities"),
              where("admin", "array-contains", meAuth.uid)
            ),
            (querySnapshot) => {
              let pp = 0;
              querySnapshot.docs.forEach((doc) => {
                pp++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  if (foo.authorId === meAuth.uid) {
                    myCommunities.push(foo);
                  }
                }
              });
              if (pp === querySnapshot.docs.length)
                this.setState({
                  myCommunities
                });
            },
            standardCatch
          );
      },
      standardCatch
    );

    onSnapshot(
      query(
        collection(firestore, "tickets"),
        where("admittees", "array-contains", meAuth.uid)
      ),
      (querySnapshot) => {
        let tickets = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            tickets.push(foo);
          }
        });
        if (querySnapshot.docs.length === p) this.setState({ tickets });
      },
      standardCatch
    );

    runRoles();
  };
  getFolders = async (folderReference) =>
    await listAll(ref(storage, folderReference))
      .then((res) => {
        console.log("folders in: " + folderReference, res);
        //console.log(res); //{prefixes: Array(0), items: Array(1)}
        let folders = [];
        let p = 0;
        res.prefixes.forEach((reference) => {
          p++;
          // All the items under listRef.
          var food = reference._location.path_;
          //console.log(food);
          var foo = food.split(`personalCaptures/${window.meAuth.uid}/`)[1];
          folders.push(foo);
        });
        if (res.prefixes.length === p) {
          //console.log(folders);
          this.setState({ folders });
        }
      })
      .catch(standardCatch);
  //How many Italian Americans were fishmongers in the 18th century?
  addUserDatas = (meAuth, b) => {
    onSnapshot(
      doc(firestore, "userDatas", meAuth.uid),
      (doc) => {
        var userDatas = undefined;
        if (doc.exists) {
          userDatas = doc.data();
          if (userDatas.email && userDatas.email === meAuth.email) {
            userDatas.doc(meAuth.uid).update({
              email: null,
              confirmedEmails: firebase.firestore.FieldValue.arrayUnion(
                meAuth.email
              ),
              defaultEmail: userDatas.defaultEmail
                ? userDatas.defaultEmail
                : meAuth.email
            });
            b.email = null;
          }
          if (userDatas.banked)
            onSnapshot(
              query(
                collection(firestore, "banks"),
                where("owner", "==", meAuth.uid)
              ),
              (querySnapshot) => {
                let q = 0;
                let banks = [];
                querySnapshot.docs.forEach((doc) => {
                  q++;
                  if (doc.exists) {
                    var bank = doc.data();
                    bank.id = doc.id;
                    banks.push(bank);
                  }
                });
                if (querySnapshot.docs.length === q) {
                  userDatas.banks = banks;
                }
              },
              standardCatch
            );

          if (this.state.userDatas !== userDatas) {
            delete b.defaultEmail;
            this.setState(
              {
                user: { ...b, ...userDatas },
                userDatas
              },
              () => this.getEntities(meAuth)
            );
          }
        }
      },
      standardCatch
    );
  };
  render() {
    const {
      forumPosts,
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      lastProfilePosts,
      appHeight,
      containerStyle,
      width,
      loadingHeight
    } = this.props;
    const myLabels = [
      "myEvents",
      "myJobs",
      "myCommunities",
      "myClubs",
      "myServices",
      "myClasses",
      "myDepartments",
      "myRestaurants",
      "myShops",
      "myPages",
      "myVenues",
      "myHousing"
    ];
    var myStuff = {};
    myLabels.forEach((x) => {
      myStuff[x] = this.state[x];
    });
    //console.log(window.meAuth);

    const hiddenUserData = (ath) => {
        //console.log("hiddenuserdata");
        onSnapshot(
          doc(firestore, "userDatas", ath.uid),
          (doc) => {
            var userDatas = undefined;
            if (doc.exists()) {
              var u = this.state.user;
              userDatas = doc.data(); //{...,doc.id}
              if (userDatas.email && userDatas.email === ath.email) {
                userDatas.doc(ath.uid).update({
                  email: null,
                  confirmedEmails: firebase.firestore.FieldValue.arrayUnion(
                    ath.email
                  ),
                  defaultEmail: userDatas.defaultEmail
                    ? userDatas.defaultEmail
                    : ath.email
                });
                u.email = null;
              }

              //delete u.defaultEmail;
              const user = {
                ...u,
                ...userDatas,
                userDatas: true
              };
              this.setState(
                {
                  user,
                  userDatas
                }
                //() => this.getEntities(meAuth)
              );
            } else
              console.log(
                `user: ${
                  this.state.user.username //+ " " + ath.uid
                }, has no hidden data`
              );
          },
          standardCatch
        );
      },
      logoutofapp = (yes) => {
        var answer = yes || window.confirm("Are you sure you want to log out?");
        if (!answer) {
          //this.ra.current.click();
          return this.gui.current.click();
        } //ra;//null;
        signOut(getAuth())
          .then(async () => {
            console.log("logged out");
            await setPersistence(getAuth(), browserSessionPersistence);
            this.setState({
              user: undefined,
              auth: undefined
            });
            this.ra.current.click();
          })
          .catch((err) => {
            console.log(err);
          });
      };
    return (
      <div>
        <PromptAuth
          ref={{
            current: {
              pa: this.pa,
              gui: this.gui,
              ra: this.ra
            }
          }}
          //storableAuth={this.state.storableAuth}
          //clearAuth={() => this.setState({ storableAuth: [] })}
          //pa={this.props.pa}
          //gui={this.props.gui}
          onPromptToLogin={() => this.props.navigate("/login")}
          verbose={false}
          onStart={() => {
            //if (window.meAuth !== undefined) return this.props.navigate("/");
            window.alert("loading authentication...");
          }}
          onEnd={() => {
            //window.alert("loading authentication...");
          }}
          windowKey={"meAuth"} //window.meAuth
          hydrateUser={(me, reload, isStored) => {
            if (me && me.constructor === Object) {
              if (isStored) return console.log("isStored: ", me); //all but denied

              if (me.isAnonymous) return console.log("anonymous: ", me);

              if (!me.uid)
                return this.setState({
                  user: undefined,
                  auth: undefined
                });
              //console.log("me", me);
              //this.pa.current.click();

              onSnapshot(
                doc(firestore, "users", me.uid),
                (doc) =>
                  doc.exists() &&
                  this.setState(
                    {
                      user: { ...doc.data(), id: doc.id },
                      loaded: true
                    },
                    () => hiddenUserData(me)
                  )
              );
              return reload && window.location.reload();
            }
            console.log("me", me);
          }} //detract alternative, kurt carface bank
          onFinish={() => {}}
          meAuth={window.meAuth === undefined ? null : window.meAuth}
        />

        <Data
          onMapEntities={this.props.onMapEntities}
          ref={{
            current: {
              pa: this.pa,
              gui: this.gui
            }
          }}
          navigate={this.props.navigate}
          setAuth={(auth) => this.setState(auth, () => this.pa.current.click())}
          meAuth={window.meAuth}
          getUserInfo={
            () => {
              this.gui.current.click();
            }
            //this.getUserInfo()}
          } //
          saveAuth={(x, hasPermission) => {
            this.setState(
              { storableAuth: [x, true, hasPermission] },
              () => this.pa.current.click()
              // setTimeout(() => this.pa.current.click(), 200)
            );
          }}
          logoutofapp={
            logoutofapp
            /* var answer = window.confirm("Are you sure you want to log out?");
            if (answer) {
              await firebase
                .auth()
                .setPersistence(firebase.auth.Auth.Persistence.SESSION);
              firebase
                .auth()
                .signOut()
                .then(() => {
                  console.log("logged out");
                  this.pa.current.click({}, true);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.setState({ resetAuth: true }, () =>
                this.gui.current.click()
              );
              // this.getUserInfo();
            }*/
          }
          loadingHeight={loadingHeight}
          unmountFirebase={this.props.unmountFirebase}
          containerStyle={containerStyle}
          appHeight={appHeight}
          width={width}
          apple={this.props.apple}
          history={this.props.history}
          location={this.props.location}
          statePathname={this.props.statePathname}
          setIndex={this.props.setIndex}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          setToUser={(key) =>
            this.setState({ user: { ...this.state.user, ...key } })
          }
          isPost={this.props.isPost}
          lastProfilePosts={lastProfilePosts}
          entityPosts={this.props.entityPosts}
          stateCity={this.props.stateCity}
          entityName={this.props.entityName}
          pathname={this.props.pathname}
          setPath={this.props.setPath}
          item={this.props.item}
          setCommunity={this.props.setCommunity}
          setCommtype={this.props.setCommtype}
          forumOpen={this.props.forumOpen}
          chosenPlace={this.props.chosenPlace}
          setPlace={this.props.setPlace}
          parents={this.state.parents}
          storageRef={this.props.storageRef}
          myDocs={this.state.myDocs}
          moreDocs={this.moreDocs}
          againBackDocs={this.againBackDocs}
          tickets={this.state.tickets}
          myStuff={myStuff}
          auth={this.state.lastAuth}
          user={this.state.user}
          //
          iAmCandidate={this.state.iAmCandidate}
          iAmJudge={this.state.iAmJudge}
          iAmRepresentative={this.state.iAmRepresentative}
          followingMe={this.state.followingMe}
          //
          getFolders={this.getFolders}
          getVideos={this.props.getVideos}
          folders={this.state.folders}
          videos={this.props.videos}
          //

          stripeKey={this.props.stripeKey}
          setGoogleLoginRef={this.props.loginButton}
          spotifyAccessToken={this.props.spotifyAccessToken}
          deleteScopeCode={this.props.deleteScopeCode}
          setScopeCode={this.props.setScopeCode}
          accessToken={this.props.accessToken}
          twitchUserAccessToken={this.props.twitchUserAccessToken}
          loaded={this.props.loaded}
          //
          filePreparedToSend={this.props.filePreparedToSend}
          picker={this.props.picker}
          picker1={this.props.picker1}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          //

          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          individualTypes={this.props.individualTypes}
          db={this.props.db}
          loadGreenBlue={this.props.loadGreenBlue}
          unloadGreenBlue={this.props.unloadGreenBlue}
          //
          setForumDocs={this.props.setForumDocs}
          forumPosts={forumPosts}
          ordinances={ordinances}
          budget={budget}
          cases={cases}
          elections={elections}
          oldBudget={oldBudget}
          oldCases={oldCases}
          oldElections={oldElections}
          //
          departments={this.props.departments}
          classes={this.props.classes}
          oldClasses={this.props.oldClasses}
          together={this.props.together}
          clubs={this.props.clubs}
          jobs={this.props.jobs}
          venues={this.props.venues}
          services={this.props.services}
          restaurants={this.props.restaurants}
          shops={this.props.shops}
          pages={this.props.pages}
          housing={this.props.housing}
          //
          loadingMessage={this.props.loadingMessage}
          //
          clearProfile={this.props.clearProfile}
        />
      </div>
    );
  }
}
export default Auth;
