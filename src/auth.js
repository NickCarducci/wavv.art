import React from "react";
import { withRouter } from "react-router-dom";
import Data from "./data";
import ReactDOM from "react-dom";
import ExecutionEnvironment from "exenv";
import firebase from "./init-firebase.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  limitToLast
} from "firebase/firestore";
import {
  signInWithPhoneNumber,
  getAuth,
  RecaptchaVerifier,
  onAuthStateChanged,
  signOut,
  setPersistence
} from "firebase/auth";
import "./styles.css";
import PhoneInput from "react-phone-number-input";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import "react-phone-number-input/style.css";
export const standardCatch = (err, title) =>
  console.log(title || "err-msg:", err.message);
export const arrayMessage = (message) =>
  message
    .toLowerCase()
    //capture or, excluding set, match 2 or more of the preceding token
    .replace(/((\r\n|\r|\n)+[^a-zA-Z#]+_+[ ]{2,})+/g, " ")
    .split(" ");
export const specialFormatting = (x, numbersOk) =>
  x
    .toLowerCase()
    //replace or regex a-z or A-Z includes space whitespace
    .replace(!numbersOk ? /[^a-zA-Z,']+/g : /[^a-zA-Z0-9,']+/g, " ")
    .split(" '")
    .map((word) => {
      var end = word.substring(1);
      var resword = word.charAt(0).toUpperCase() + end;
      return resword;
    })
    .join(" '")
    .split(" ")
    .map((word) => {
      var end = word.substring(1);
      /*if (word.includes("'")) {
            var withapos = word.lastIndexOf("'");
            var beginning = word.substring(1, withapos);
            //if (beginning.length === 1) {
            end =
              beginning +
              "'" +
              word.charAt(withapos + 1).toUpperCase() +
              word.substring(withapos + 2);
            // }
          }*/
      var resword = word.charAt(0).toUpperCase() + end;
      resword.replaceAll("Of", "of");
      resword.replaceAll("And", "and");
      resword.replaceAll("The", "the");
      //console.log(resword);["Of", "And", "The"].includes(resword); resword.toLowerCase()
      return resword; //arrayMessage(resword).join(" ");
    })
    .join(" ");
const optsForPouchDB = {
  revs_limit: 1, //revision-history
  auto_compaction: true //zipped...
};
class CDB {
  //Country caching for phone-input module-dependency
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "meCountry";
    this.db = new PouchDB(title, optsForPouchDB);
  }
  //deletion = (d) => this.db.remove(d).catch(standardCatch);
  deleteKeys = () => this.db.destroy();
  setCountry = async (c) => {
    //const cc = JSON.parse(JSON.stringify(c)); //https://github.com/pouchdb/pouchdb/issues/6411
    if (!c._id)
      return (
        window.alert("pouchdb needs ._id key:value: JSON.parse= " + c) &&
        (await this.db
          .destroy()
          .then(() => true)
          .catch(standardCatch))
      );
    return await new Promise((resolve) => {
      this.db //has upsert plugin from class constructor
        .upsert(c._id, (copy) => {
          copy = { ...c }; //pouch-db \(construct, protocol)\
          return copy;
        }); //upsert polyfill has no promise returned (...then)
      //console.log(c);
      const done = JSON.stringify(c);
      resolve(done);
      //return a copy, don't displace immutable object fields
    }).catch(standardCatch);
  };
  readCountry = async (notes = {}) =>
    //let notes = {};
    await this.db
      .allDocs({ include_docs: true })
      .then(
        async (
          allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
        ) =>
          await Promise.all(
            allNotes.rows.map(
              async (n) =>
                await new Promise((r) => {
                  const which = n.doc.key,
                    done = JSON.stringify((notes[which] = n.doc));
                  r(done);
                })
            )
          )
        // && and .then() are functionally the same;
      )
      .catch(standardCatch);
}

const loginInitial = {
  sentCode: null,
  authError: "",
  uid: "",
  phone: "",
  attemptedPhone: "",
  ctry: { _id: "country", country: "US" },
  newAccount: null,
  bumpedFrom: "this page",
  uid: "",
  phone: "",
  attemptedPhone: "",
  username: "",
  //name: "",
  id: "",
  under13: false,
  textedCode: "",
  alertExistingUser: false,
  newAccount: null,
  recaptchaResponse: ""
};
const firestore = getFirestore(firebase);
class Auth extends React.Component {
  constructor(props) {
    super(props);
    let cdb = new CDB();
    var storedAuth = undefined;
    window.meAuth = undefined;
    this.state = {
      ...loginInitial,
      leaders: [],
      events: [],
      cdb,
      users: [],
      auth: undefined,
      user: undefined,
      meAuth: {},
      storedAuth
    };
    this.FIREBASE_PHONE_recaptcha = React.createRef();
    window.recaptchaId = "";
    this.ra = React.createRef();
    this.pa = React.createRef();
    this.gui = React.createRef();
  }
  handleChange = (e) => {
    var name = e.target.id;
    var value = e.target.value.toLowerCase();
    if (name === "phone") {
      this.setState({
        [name]: "+1" + value
      });
    } else if (name === "username") {
      this.setState({
        [name]:
          !value.includes(" ") &&
          !value.includes("_") &&
          value.match(/[a-z0-9]/g)
            ? value
            : ""
      });
      if (e.which !== 32) {
        this.setState({ findingSimilarNames: true });
        clearTimeout(this.typingUsername);
        this.typingUsername = setTimeout(() => {
          this.setState({ findingSimilarNames: false }, () => {
            const individualTypes = [],
              newIndTypes = individualTypes.map((x) => x.replace(/[ ,-]/g, "")),
              pagesNamesTaken = [
                "event",
                "events",
                "club",
                "clubs",
                "shop",
                "shops",
                "restaurant",
                "restaurants",
                "service",
                "services",
                "dept",
                "department",
                "departments",
                "classes",
                "class",
                "oldclass",
                "oldclasses",
                "job",
                "jobs",
                "housing",
                "oldhome",
                "page",
                "pages",
                "venue",
                "venues",
                "forum",
                "posts",
                "post",
                "oldelection",
                "elections",
                "election",
                "case",
                "cases",
                "oldcase",
                "oldcases",
                "budget",
                "budgets",
                "oldbudget",
                "oldbudgets",
                "ordinance",
                "ordinances",
                "new",
                "news",
                "login",
                "logins",
                "doc",
                "docs",
                "private",
                "privacy",
                "legal",
                "terms",
                "law",
                "laws",
                "bill",
                "bills"
              ],
              pagesNamesTaken1 = [...[], ...[]],
              curses = ["bitch", "cunt", "pussy", "pussies", "fuck", "shit"],
              hasCurse = curses.find((x) => value.toLowerCase().includes(x));

            if (
              hasCurse ||
              pagesNamesTaken.includes(value.toLowerCase()) ||
              pagesNamesTaken1.includes(value.toLowerCase())
            )
              return this.setState({ newUserPlease: true }, () =>
                window.alert(
                  "reserve word '" + value + "', please choose another"
                )
              );
            this.setState({ newUserPlease: false }, () =>
              getDocs(
                query(
                  collection(firestore, "users"),
                  where("username", "==", this.state.username)
                )
              ).then((snapshot) =>
                snapshot.docs.forEach((doc) =>
                  this.setState({ newUserPlease: doc.exists() })
                )
              )
            );
          });
        }, 1000);
      }
    } /* else if (e.target.id === "parentEmail") {
      this.setState({
        parentEmail: e.target.value.toLowerCase()
      });
  }*/ /*else {
      this.setState({
        [e.target.id]: specialFormatting(e.target.value)
      });
    }*/
  };
  componentWillUnmount = () => {
    clearTimeout(this.typingUsername);
    this.isMountCanceled = true;
  };
  setCountry = async (ctry, method) => {
    this.setState({
      country: ctry.country
    });
    return await this.state.cdb[method](ctry).catch(standardCatch);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      let bumpedFrom =
        this.props.location.state && this.props.location.state.bumpedFrom
          ? this.props.location.state.bumpedFrom
          : this.state.bumpedFrom;
      this.setState({ bumpedFrom });
    }
  };
  // prettier-ignore
  /*const stringAuthObj = (meAuth) => {
      var {
        uid, displayName,photoURL, email, emailVerified,phoneNumber, isAnonymous,  tenantId,
        providerData, apiKey, appName, authDomain, stsTokenManager,  refreshToken,  accessToken,
        expirationTime, redirectEventId, lastLoginAt,  createdAt, multiFactor
      } = meAuth;
      return { _id: uid,  uid, displayName,photoURL, email, emailVerified,  phoneNumber,
        isAnonymous,  tenantId, providerData, apiKey, appName, authDomain, stsTokenManager,
        refreshToken, accessToken, expirationTime,  redirectEventId,  lastLoginAt, createdAt,
        multiFactor: JSON.stringify(multiFactor)
      };
    };*/
  //under 13 not for such a social hazard; -ism
  confirmCode = async (textcode, phone) => {
    window.alert("checking numbers");
    window.confirmationResult
      //"test [bookings, the capacity to will for charging contractual compulsory quality subscription]" (trashboi.club)
      //Not from a monthly escrow but upon ompletion of the deed, or really *just before* overtime indemnity yall
      //work don't make rent bro
      .confirm(textcode)
      .then(async (r) => {
        window.recaptchaId = "";
        //window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        //this.likeUserforThis(r, phone);

        //reefer latches!
        //likeUserforThis = (r, pn) => {
        //var { user } = result; //AuthImpl:UserImpl//DON'T DECONSTRUCT NOR UNSCOPED VAR?
        //auth = new a;//https://github.com/firebase/firebase-js-sdk/issues/5753#issuecomment-978339103
        //await updateProfile(result.user, {displayName: name});
        //https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile
        console.log("auth?impl:setAuth ", r.user); //.auth
        const _auth = JSON.stringify(r.user.proactiveRefresh.user); //https://github.com/codesandbox/codesandbox-client/issues/1933#issuecomment-589710212
        //_auth && console.log(_auth);
        /* eslint-disable-next-line*/
        this.setState(JSON.parse(_auth));
        //^^do this in SUDO (hibit.cc) or currentUser
        // setTimeout(() => this.props.pa.current.click(), 200)
        //this.props.getUserInfo(); //"one other quick thing" (future demand berose)
        getDoc(doc(firestore, "users", r.user.uid))
          .then(async (res) => {
            var exists = res.exists();
            var user = exists && { ...res.data(), id: res.id };
            window.alert(
              exists
                ? "user profile exists... welcome back!"
                : `Welcome to Passport! Adding to firestore...`
            );
            var c = this.state.username.toLowerCase(),
              usernameAsArray = [];
            exists
              ? console.log("users[" + user.username + "]", r.user.uid)
              : console.log("users[" + c + "]", r.user.uid);
            if (exists) return this.props.navigate("/");//null//this.props.getUserInfo();
            for (let i = 1; i < c.length + 1; i++) {
              usernameAsArray.push(c.substring(0, i));
            }
            await setDoc(doc(firestore, "users", r.user.uid), {
              under13: this.state.under13,
              usernameAsArray,
              //nameAsArray,
              createdAt: new Date(),
              username: this.state.username
              //name: this.state.name
            })
              .then(async () =>
                await setDoc(doc(firestore, "numbers", phone), {
                  uid: r.user.uid
                }).then(async () => {
                  //this.props.getUserInfo();
                  const country = phone ? phone.country : "US";
                  await this.setCountry(
                    {
                      _id: "country",
                      country
                    },
                    "setCountry"
                  )
                    .then(async (r) => await JSON.parse(r))
                    .then((ctry) => {
                      console.log(
                        ctry,
                        country + " set. Normal Finish " + r.user.uid
                      );
                      window.recaptchaId = "";
                      this.setState({authError:""})
                      this.props.navigate("/");
                    })
                    .catch((e) => console.log(e));
                  //this.promptCode
                }).catch(standardCatch)
              )
              .catch(standardCatch);
            //this.props.history.push("/");
            //this.props.unloadGreenBlue();
          })
          .catch((err) => {
            this.setState({
              authError: err.message,
              sentCode: false
            });
            console.log(err.message);
            if (window.confirm("send another code?"))
              return this.promptCode(phone, true);
          });
      })
  };
  promptCode = (phone, ask) =>
    this.setState({ attemptedPhone: phone, sentCode: true }, () => {
      console.log(this.state.textedCode, "ok");
      signInWithPhoneNumber(getAuth(), phone, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          if (ask) {
            var textcode = window.prompt(
              "what is the sms code sent to " + phone
            );
            if (textcode) this.confirmCode(textcode, phone);
            console.log("sms sent code to " + phone);
          }
        })
        .catch((err) =>
          this.setState(
            {
              sentCode: false,
              newAccount: null,
              authError: err.message
            },
            () => {
              window.recaptchaId = "";
              console.log(err.message);
            }
          )
        );
    });
  componentDidMount = () => {
    this.state.cdb
      .readCountry()
      //.then(async (r) => await r)
      .then(
        (r) =>
          r.length === 0 &&
          console.log(
            "no country stored [Right-Click>inspect>Application>IndexedDB]...",
            r
          )
      )
      .catch((err) => console.log(err));
    //this.responseCallback();
    ExecutionEnvironment.canUseDOM && this.mountRecaptcha();
    onAuthStateChanged(
      getAuth(),
      async (auth) => {
        auth &&
          this.setState({ auth }, () => {
            onSnapshot(
              doc(firestore, "users", auth.uid),
              (dc) =>
                dc.exists() &&
                this.setState(
                  {
                    user: { ...dc.data(), id: dc.id },
                    loaded: true
                  },
                  () => {
                    onSnapshot(doc(firestore, "userDatas", auth.uid), (dc) => {
                      var userDatas = undefined;
                      if (dc.exists()) {
                        var u = this.state.user;
                        userDatas = dc.data(); //{...,doc.id}

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
                      }
                    });
                  }
                )
            );
          });
      },
      standardCatch
    );
    if (this.props.pathname === "/login") {
      return this.setState({ sudo: true });
    } else {
      this.setState({ sudo: false });
    }
  };
  responseCallback = () => {
    this.promptCode(this.state.phone, true);
    window.recaptchaId = "";
  };

  //return window.alert("no element FIREBASE_PHONE_recaptcha Sudo.js");
  /*if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }*/
  //https://firebase.google.com/docs/auth/web/phone-auth?hl=en&authuser=0#send-a-verification-code-to-the-users-phone
  //https://firebase.google.com/docs/auth/web/phone-auth?hl=en&authuser=0#send-a-verification-code-to-the-users-phone
  mountRecaptcha = () => {
    const loggedIn = this.props.auth !== undefined;
    window.recaptchaVerifier = new RecaptchaVerifier(
      this.FIREBASE_PHONE_recaptcha.current,
      {
        size: "normal", //callback:()=>true,getResponse : await render()
        callback: (res) => {
          const title = loggedIn ? "multi-" : "main ";
          console.log(`${title}authentication recaptcha response: `, res);
          const recaptchaResponse = window.grecaptcha.getResponse(
            window.recaptchaId
          );
          console.log("verified RecaptchaVerifier: ", recaptchaResponse);
          loggedIn ? this.props.multiCallback() : this.responseCallback();
          return res;
        },
        "expired-callback": (err) => {
          //window.recaptchaVerifier.clear();
          window.recaptchaId = "";
          loggedIn &&
            this.setState({
              sentCode: false
            });
          console.log(err.message);
          return err;
        }
      },
      getAuth()
    );
    let script = require("scriptjs");

    !this.isMountCanceled &&
      script("https://www.google.com/recaptcha/api.js", "explicit", () =>
        this.setState({ loadedRecaptcha: true }, async () => {
          if (!this.isMountCanceled)
            await window.recaptchaVerifier
              .render()
              .then((id) => {
                this.setState({ recaptchaId: id });
              }) //onload=onloadCallback&render=explicit
              .catch(standardCatch);
        })
      );
  };
  showRecaptcha = async () => {
    window.recaptchaId = this.state.recaptchaId;
    this.setState({ boo: true });
  };
  login = () => {
    const warnCaptcha = window.confirm(
      //Cross origin the ability, not security policy. (I lead the latter)
      "Was W3C's Javascript or Apple's WebKit the invention of cross-origin internet cookies?"
    );
    if (this.state.newAccount) return this.showRecaptcha();
    this.setState(
      {
        warnCaptcha
      },
      () => {
        if (!warnCaptcha || this.state.authError !== "") return null;
        console.log("test");
        if (this.state.newUserPlease)
          return window.alert(
            `${this.state.username} is taken. ` +
              `email nick@thumbprint.us to claim copyright`
          );
        onSnapshot(doc(firestore, "numbers", this.state.phone), (doc) => {
          var existingAccount = doc.exists();
          console.log(doc.id, doc.data());
          if (!existingAccount) {
            console.log("no user exists, please sign in");
            this.setState({
              newAccount: !existingAccount
            });
          } else {
            this.showRecaptcha(); //this.renderRecaptcha();
            console.log("user exists, here's the FIREBASE_PHONE_recaptcha");
          }
        });
      }
    ); // && this.setState({ warnCaptcha: true })
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
    const { newUserPlease, attemptedPhone, ctry, authError } = this.state;
    const meAuth =
        window.meAuth &&
        window.meAuth.constructor === Object &&
        Object.keys(window.meAuth).length > 0
          ? window.meAuth
          : undefined,
      space = " ",
      logoutofapp = (yes) => {
        signOut(getAuth())
          .then(async () => {
            console.log("logged out");
            //await setPersistence(getAuth(), browserSessionPersistence);
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
    const columnCount = Math.round(this.props.width / 120);
    //console.log(this.state.users);
    return (
      <div>
        <div>
          <div
            style={{
              opacity:
                window.recaptchaId !== "" //.constructor === Number
                  ? 1
                  : 0,
              position:
                window.recaptchaId !== "" //.constructor === Number
                  ? "relative"
                  : "fixed",
              zIndex:
                window.recaptchaId !== "" //.constructor === Number
                  ? 1
                  : -9999
            }}
            ref={this.FIREBASE_PHONE_recaptcha}
            //(this.state.username !== "" || !this.state.newAccount)
          />

          <div>
            {authError && authError.toString()}
            {this.state.newAccount === null
              ? null
              : this.state.newAccount
              ? "no user exists, use FIREBASE_PHONE_recaptcha to get firebase.auth() text"
              : "user exists, use FIREBASE_PHONE_recaptcha to get firebase.auth() text"}
          </div>
          <div
            style={{
              display:
                this.state.sudo && this.state.auth === undefined
                  ? "block"
                  : "none",
              color: "white",
              cursor: "pointer",
              padding: "10px",
              //width: "calc(100% - 20px)",
              backgroundColor: "rgba(0,0,0,.8)"
            }}
          >
            <h4>Thumbprint "Social Calendar"</h4>
            <br />
            {ctry && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {ctry.country !== "US" && (
                  <div
                    style={{ padding: "10px", color: "white" }}
                    onClick={() => {
                      var ctry = { country: "US", _id: "country" };
                      this.setCountry(ctry, "setCountry");
                    }}
                  >
                    &times;
                  </div>
                )}
                <div style={{ display: "flex" }}>
                  <PhoneInput
                    //PhoneInputCountryFlag-height={50}
                    defaultCountry={ctry.country}
                    required
                    options={{ extract: true }}
                    placeholder="Enter phone number"
                    value={this.state.phone}
                    onChange={(phone) => {
                      if (phone) {
                        this.setState({
                          phone
                        });
                      } /*else {
                              window.alert("only numbers");
                            }*/
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      //we will have to stop the FDA and KYC virtual ID platform
                      //nothing is free. porn cookies

                      ///business of government false advertising general defense
                      /*if (phone !== "+17322331085")
                                return window.alert("pub use in dev");*/
                      this.login();
                    }}
                  />
                  {this.state.sentCode && (
                    <div
                      style={{
                        width: "max-content",
                        padding: "4px",
                        marginLeft: "4px",
                        fontSize: "14px"
                      }}
                      onClick={() => this.promptCode(this.state.phone, true)}
                    >
                      GOT IT
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              onClick={() =>
                this.setState(loginInitial, () => (window.recaptchaId = ""))
              }
            >
              &#8634;
            </div>
            {this.state.newAccount && !authError && (
              <div>
                {/*this.state.under13 === true ? (
                  <input
                    required
                    className="input-field"
                    type="email"
                    id="parentEmail"
                    placeholder="parentEmail"
                    value={this.state.parentEmail}
                    onChange={this.handleChange}
                    minLength="3"
                    maxLength="60"
                  />
                 ) : null*/}
                {newUserPlease ? (
                  <div>
                    {newUserPlease !== true ? newUserPlease : "Username"} taken
                  </div>
                ) : (
                  this.state.username !== "" && (
                    <div style={{ fontSize: "14px", color: "grey" }}>
                      SUBJECT TO COPYRIGHT
                    </div>
                  )
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.showRecaptcha();
                  }}
                >
                  <input
                    required
                    id="username"
                    type="text" //servers "email" "name" "fname" etc.
                    placeholder="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    minLength="3"
                    maxLength="30"
                  />
                </form>
                {/*<input required className="input-field" id="name" placeholder="name"
                  value={this.state.type} onChange={this.handleChange} minLength="3" maxLength="30"/>*/}
              </div>
            )}
            {this.state.loading ? (
              <img
                src="https://www.dropbox.com/s/le41i6li4svaz0q/802%20%282%29.gif?raw=1"
                alt="error"
              />
            ) : window.recaptchaId === "" &&
              !authError &&
              this.state.phone !== attemptedPhone ? (
              <div onClick={() => this.login()}>
                {this.state.newAccount ? "Sign Up" : "Log in"}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: this.state.auth !== undefined ? "block" : "none"
            }}
          >
            <div
              onClick={() => {
                var answer = window.confirm("logout?");
                answer && logoutofapp();
              }}
              style={{
                margin: "6px",
                right: "0px",
                position: "absolute",
                padding: "6px",
                backgroundColor: "white"
              }}
            >
              &#128682;
            </div>
          </div>

          <Data
            onMapEntities={this.props.onMapEntities}
            ref={{
              current: {
                pa: this.pa,
                gui: this.gui
              }
            }}
            navigate={this.props.navigate}
            setAuth={(auth) =>
              this.setState(auth, () => this.pa.current.click())
            }
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
      </div>
    );
  }
}

export default Auth;
