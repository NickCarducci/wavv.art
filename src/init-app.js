import React from "react";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
//​a significant expected plant
//​institutional confidence cut deficit tax planning next
//5 generations in-kind might be amortizable too
//reverse account payable (fringe, contribution connected affiliated)
import firebase from "./init-firebase";
//without a ticket/paddle
//mimetic fraud.
//"take human action" make
import {
  getStorage,
  ref,
  listAll,
  getMetadata,
  getDownloadURL
} from "firebase/storage";
import Auth from "./auth";
import { SDB } from "./App/foundation";
import { suggestions } from "./App/SwitchCity/Suggest";
import { Pouchredux, pouchredux } from "./widgets/authdb";
import { standardCatch } from "./components/Forum/New";
const storage = getStorage(firebase);
//Isn't a metastasizing real income growth in any sector a public safety crisis?
//Do we get to pay for business services and food tax exempt automatically out of our personal venmo accounts? Can't accounts automatically be reconciled?
//Do we get to pay for business services and food tax exempt automatically out of our personal Venmo accounts? Can't accounts automatically be reconciled with other adjacent money service processors?
const signOut = () =>
  (window.location.href =
    "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://wavepoint.la");

const handlePinch = (e) => {
  var tSX /*touchScreenX*/,
    tSY /**touchScreenY */,
    dS /*disableScroll*/,
    sB = {}; //scrollBounds
  const tT = e.targetTouches[0];
  //e=>handlePinch.eitherFunc(e,document.body)
  return {
    touchstart: (e, dB) => {
      //scroll/client
      const tTt = tT.target; //touchTarget
      // a boolean map indicating if the e (or either of e parents, excluding the dB) can be scrolled to the X direction.

      const bDs = (
        //bounDs, (non)iteratedConditional
        e,
        cC //callbackConditional
      ) => (e === dB ? false : cC(e) ? true : bDs(e.parentNode, cC));

      const sw = e.scrollWidth;
      const sh = e.scrollHeight;
      const cw = e.clientWidth;
      const ch = e.clientHeight;
      const st = e.scrollTop;
      const sl = e.scrollLeft;
      sB.left = bDs(tTt, (e) => sl > 0);
      sB.top = bDs(tTt, (e) => st > 0);
      sB.right = bDs(tTt, (e) => sw > cw && sw - cw > sl);
      sB.bottom = bDs(tTt, (e) => sh > ch && sh - ch > st);

      tSX = tTt.screenX; //touchScreenX
      tSY = tTt.screenY; //touchScreenY
      dS = false; //disableScroll
    },
    touchmove: (e) => {
      //move/screen
      const tT = e.targetTouches[0];
      const mSX = tT.screenX; //moveScreenX
      const mSY = tT.screenY; //moveScreenY
      if (dS) return e.preventDefault(); //disableScroll
      if (
        //tight pinch pinching tighten tightening
        mSX < tSX && //moveScreenX < touchScreenX
        sB.left && //scrollBounds
        mSY > tSY && //moveScreenY > touchScreenY
        sB.bottom && //scrollBounds
        mSX > tSX && //moveScreenX > touchScreenY
        sB.right && //scrollBounds
        mSY < tSY && //moveScreenY < touchScreenX
        sB.top //scrollBounds
      ) {
        // disableScroll.
        e.preventDefault();
        dS = true;
      }
    }
  };
};
class DODB {
  //Display Preferences
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "displayOptions";
    const map = new Pouchredux();
    Object.keys(map).map((x) => {
      return (this[x] = map[x]);
    });
    this.db = new PouchDB(title, this.optsForPouchDB);
  }
  deleteKeys = () => this.destroy(this.db);
  setPreferences = (key) => this.set(this.db, key);
  readPreferences = async (notes = {}) =>
    //let notes = {};
    await this.read(this.db, this.notes);
}
//Why is 401k favored to the leisure to prefer from competition?
//Do tragedians use pitfalls to eludidate their good product to use in right by others
//on a frugal basis for exclusionary profits' safety-at-least indemnity
//const storage = getStorage(firebase);
class InitApp extends React.Component {
  constructor(props) {
    super(props);
    let sdb = new SDB();
    let dodb = new DODB();
    var item = suggestions[Math.floor(Math.random() * suggestions.length)];
    const city = item.place_name;
    this.state = {
      //profile: {},
      displayPreferences: { backgroundColor: [255, 255, 255] },
      item,
      city,
      commtype: "new",
      onMapEntities: [],
      chosenPlace: "glad ur here!",
      forumDoc: [],
      msg: "",
      recordedUsers: [],
      sdb,
      dodb,
      lastNotes: [],
      filesPreparedToSend: [],
      stripeKey: "pk_test_O3ea7BxFONiG5rAzTdEer2mA00scCjg6i4", //process.env.STRIPE_KEY

      budget: [],
      ordinances: [],
      elections: [],
      cases: [],
      classes: [],
      departments: [],
      jobs: [],
      clubs: [],
      events: [],
      together: [],
      shops: [],
      restaurants: [],
      services: [],
      housing: [],
      pages: []
    };
    //var bucket = "gs://thumbprint-1c31n.appspot.com";
    //var storage = firebase.storage(); //firebase.app().storage(bucket);
    //this.storageRef = ref(storage);//storage.ref()
    this.loginButton = React.createRef();
  }

  getVideos = async (pathReference) => {
    this.loadGreenBlue("getting videos");
    //var listRef = this.storageRef.child(pathReference);

    await listAll(ref(storage, pathReference))
      .then((res) => {
        let p = 0;
        //res._delegate.prefixes.forEach((folderRef) => folderRef.listAll());
        Promise.all(
          res /*._delegate*/.items
            .map(async (reference) => {
              return new Promise((r) =>
                getMetadata(reference)
                  .then(async (metadata) => {
                    //var gsUrl = await reference.getDownloadURL();
                    const gsUrl = await getDownloadURL(reference);

                    if (gsUrl)
                      return r({ ...reference, ...metadata, gsUrl, ref });
                    // Metadata now contains the metadata for 'images/forest.jpg'
                  })
                  .catch(standardCatch)
              );
            })
        ).then((videos) => {
          console.log(videos.length + " videos downloaded ", videos);
          this.unloadGreenBlue();
          this.setState({ videos });
        });
      })
      .catch(standardCatch);
  };

  spotifyCallback = (x) => {
    console.log(x);
    this.setState({ spotifyAccessToken: x.code });
  };
  mountApiKeys = async () => {
    const key = await this.state.sdb.readKey();
    this.setState({ scopecode: key });
    const displayPreferences = await this.state.dodb.readPreferences();
    displayPreferences &&
      displayPreferences.length > 0 &&
      this.setState({ displayPreferences });
    const pathname = window.location.pathname;
    const d = pathname.split("https://wavepoint.la/oauth2callback?code=4/")[1];
    var error = pathname.split("https://wavepoint.la/callback#code=")[1];
    if (error) console.log(error);
    if (d) console.log(d);
    if (d) this.setState({ twitchUserAccessToken: d });
    const dx = pathname.split("https://wavepoint.la/spotifyCallback?code=")[1];
    var errorx = pathname.split(
      "https://wavepoint.la/spotifyCallback#error=4/"
    )[1];
    if (errorx) console.log(error);
    if (dx) console.log(d);
    if (dx) this.setState({ spotifyAccessToken: dx });
    if (dx)
      await fetch("https://accounts.spotify.com/token", {
        Authorization: `Basic a28add4bf14e40b69dd95c6b696c85b8:0839e542509f46a9b26eac3fd2fae04c`,
        body: {
          code: dx,
          grant_type: "authorization_code",
          redirect_uri: "https://wavepoint.la"
        }
      })
        .then(async (res) => await res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err.message));
  };
  handlePinchStart = (x) => handlePinch(x).touchstart(x, document.body);
  handlePinchMove = (x) => handlePinch(x).touchmove(x, document.body);
  componentWillUnmount = () => {
    clearTimeout(this.cLTW);
    window.removeEventListener("touchstart", this.handlePinchStart);
    window.removeEventListener("touchmove", this.handlePinchMove);
  };
  componentDidMount = async () => {
    this.mountApiKeys();

    //handlePinch
    window.addEventListener("touchstart", this.handlePinchStart);
    window.addEventListener("touchmove", this.handlePinchMove);
    /**
       * 
        data.photoThumbnail = data.photoThumbnail
          ? data.photoThumbnail
          : "https://www.dropbox.com/s/wef09yq3mgu8eif/profile1%20%281%29.png?raw=1";
        data.profilergb = data.profilergb
          ? data.profilergb
          : "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      */

    //this.loadGoogleApi();//google drive start
    /*await this.state.vdb.getAllNotes().then((prenotes) => {
      let videos = Object.values(prenotes);

      videos.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.setState({
        videos
      });
    });*/
    this.setState({ stop: true, loaded: true });
  };

  loadGreenBlue = (msg) => {
    //if (!this.cLTW)

    clearTimeout(this.cLTW);
    //cancelLoadingTimeWarning
    this.cLTW = setTimeout(
      () => this.setState({ loadingForAWhile: true }),
      8800
    );
    msg !== this.state.msg && this.setState({ msg });
  };
  unloadGreenBlue = () =>
    this.setState({ msg: "", loadingForAWhile: false }, () =>
      clearTimeout(this.cLTW)
    );

  render() {
    const { msg, loadingForAWhile, profilePosts } = this.state;
    const { showPWAprompt } = this.props;
    /*const instanceLocator = "v1:us1:5f5bd833-ed4f-483a-95ea-b8622c401a3d";
    const tokenProvider = new TokenProvider({
      url:
        "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/5f5bd833-ed4f-483a-95ea-b8622c401a3d/token"
    });

    if (this.state.this.props.auth && this.state.this.props.auth.uid) {
      return (
        <ChatkitProvider
          instanceLocator={instanceLocator}
          tokenProvider={tokenProvider}
          userId={
            this.state.loaded && this.state.this.props.auth.uid
              ?this.props.auth.uid
              : null
          }
        >
          <App
            this.props.auth={this.state.this.props.auth}
            user={this.state.user}
            loaded={this.state.loaded}
          />
        </ChatkitProvider>
      );
    } else {*/

    /*var colors = [
      { sharp: 0.0, color: { r: 0, g: 0, b: 200 } },
      { sharp: 0.5, color: { r: 0, g: 0, b: 150 } },
      { sharp: 1.0, color: { r: 0, g: 0, b: 100 } }
    ];
    var perc2color = (sharp) => {
      for (var i = 1; i < colors.length - 1; i++) {
        if (sharp < colors[i].sharp) {
          break;
        }
      }
      var pallette = colors[i].sharp - colors[i - 1].sharp;
      var sharpRight = (sharp - colors[i - 1].sharp) / pallette;
      var sharpLeft = 1 - sharpRight;
      var output =
        "rgb(" +
        [
          Math.floor(
            colors[i - 1].color.r * sharpLeft + colors[i].color.r * sharpRight
          ),
          Math.floor(
            colors[i - 1].color.g * sharpLeft + colors[i].color.g * sharpRight
          ),
          Math.floor(
            colors[i - 1].color.b * sharpLeft + colors[i].color.b * sharpRight
          )
        ].join(",") +
        ")";
      return output;
    };*/
    if (this.state.loaded) {
      const containerStyle = {
        width: "100%",
        // transition: ".3s ease-in",
        position: "relative"
        //minHeight: appHeight
      };
      const loadingHeight = `100%`;
      //console.log(this.state.profileComments);
      //console.log(this.state.forumPosts);
      return (
        <div
          style={{
            ...containerStyle
          }}
        >
          <div
            className="loadGreenBlue"
            style={{
              overflow: "hidden",
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
              overflowWrap: "break-word",
              zIndex: "10",
              display: "flex",
              position: "relative",
              justifyContent: "center",
              height: this.state.msg !== "" ? loadingHeight : "0%",
              width: "100%",
              transition: `${this.state.msg !== "" ? 1 : 0.3}s ease-in`,
              transform: this.state.msg === "" ? "scale(1,-1)" : "scale(1,1)",
              color: "white",
              fontSize: this.state.msg === "" ? "0px" : "24px"
            }}
          >
            <div
              onClick={() => this.unloadGreenBlue()}
              style={{
                display: msg !== "" ? "flex" : "none",
                position: "absolute",
                right: "10px",
                top: "8px",
                color: "white",
                transition: ".3s ease-in",
                opacity: loadingForAWhile ? 1 : 0,
                zIndex: loadingForAWhile ? 1 : -9999
              }}
            >
              quit
            </div>

            {this.state.msg}
          </div>
          <div
            style={{
              overflow: "hidden",
              backgroundColor: "white",
              overflowWrap: "break-word",
              zIndex: "10",
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "flex-end",
              height: showPWAprompt ? "56px" : "0px",
              width: "100%",
              transition: `${showPWAprompt ? 1 : 0.3}s ease-in`,
              color: "black"
            }}
          >
            <div
              onClick={this.props.closeWebAppPrompt}
              style={{
                fontSize: "24px",
                margin: "0px 10px",
                padding: "6px 10px",
                backgroundColor: "rgb(150,180,255)",
                color: "white"
              }}
            >
              &times;
            </div>
            add to homescreen
            <div
              style={{
                fontSize: "24px",
                margin: "0px 10px",
                padding: "6px 10px",
                backgroundColor: "blue",
                color: "white"
              }}
              onClick={this.props.addToHomescreen}
            >
              add
            </div>
          </div>
          {/*!width ? (
            "sizing you up"
            ) : */}{" "}
          <Auth
            rediret={this.props.rediret}
            navigate={this.props.navigate}
            pathname={this.props.pathname}
            statePathname={this.props.statePathname}
            location={this.props.location}
            loadingHeight={loadingHeight}
            unmountFirebase={this.props.unmountFirebase}
            containerStyle={containerStyle}
            appHeight={this.props.appHeight}
            width={this.props.width}
            apple={this.props.apple}
            displayPreferences={this.state.displayPreferences}
            setDisplayPreferences={async (displayPreferences) =>
              await this.state.dodb["setPreferences"]({
                _id: "preferences",
                ...displayPreferences
              })
            }
            isPost={this.props.isPost}
            isCommunity={this.props.isCommunity}
            profile={this.state.profile}
            lastProfilePosts={this.state.lastProfilePosts}
            entityPosts={this.state.entityPosts}
            setIndex={(pathname) => this.setState(pathname)}
            setPath={() =>
              this.setState({ pathname: window.location.pathname })
            }
            setCommtype={async (x) => {
              this.setState(x);
              return await new Promise((resolve) => resolve(true));
            }}
            setCommunity={(x) => {
              //{community:x}
              if (x.community) console.log(x.community.message + " stored");
              this.setState(x);
            }}
            chosenPlace={this.state.chosenPlace}
            setPlace={(x) => this.setState(x)}
            onMapEntities={this.state.together}
            storageRef={this.storageRef}
            getVideos={this.getVideos}
            stripeKey={this.state.stripeKey}
            videos={this.state.videos}
            setGoogleLoginRef={this.loginButton}
            spotifyAccessToken={this.state.spotifyAccessToken}
            deleteScopeCode={() => this.state.sdb.deleteKeys()}
            setScopeCode={(scopecode) => this.setScopeCode(scopecode, "setKey")}
            accessToken={this.state.accessToken}
            twitchUserAccessToken={this.state.twitchUserAccessToken}
            loaded={this.state.loaded}
            //
            filePreparedToSend={this.state.filesPreparedToSend}
            picker={this.picker}
            picker1={this.picker1}
            picker2={this.picker2}
            loadGapiApi={
              () => {}
              //this.loadGapiApi
            }
            signedIn={this.state.signedIn}
            switchAccount={this.switchAccount}
            signOut={signOut}
            //
            clearFilePreparedToSend={() =>
              this.setState({ filesPreparedToSend: [] })
            }
            loadYoutubeApi={this.loadYoutubeApi}
            s={this.s}
            authResult={this.state.authResult}
            googlepicker={this.googlepicker}
            dodb={this.state.dodb}
            loadGreenBlue={this.loadGreenBlue}
            unloadGreenBlue={this.unloadGreenBlue}
            //
            setForumDocs={(x) => {
              /*if (
                0 === x.completeProfileSet &&
                this.state.profilePosts !== []
              ) {
                this.setState({ profilePosts: [] });
              }*/
              x && this.setState(x);
            }}
            //
            item={this.state.item}
            loadingMessage={this.state.msg} //loadingMessage
            //
            clearProfile={(comments) => {
              if (comments) {
                this.setState({
                  profilePosts: profilePosts.filter((x) => !x.isOfComment)
                });
              } else {
                this.setState({
                  profilePosts: profilePosts.filter((x) => x.isOfComment)
                });
              }
            }}
          />
        </div>
      );
    } else return <div />;
  }
}
export default InitApp;
