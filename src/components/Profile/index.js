import React from "react";
import Hobbies from "./Hobbies";
import Education from "./Education";
import Experiences from "./Experiences";
import firebase from "../.././init-firebase";
import Settings from "./Settings";
import Picker from "emoji-picker-react";
import Countries from "./Countries";
import ByMe from "./ByMe";
import imagesl from "../.././App/standardIMG.jpg";
import ManageParent from "./ManageParent";
import Resume from "./Settings/Resume";
import "./Settings/Settings.css";
import "react-phone-number-input/style.css";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { individualTypes } from "../../App/Community/arraystrings";
const firestore = getFirestore(firebase);

/**
 Geohash open source authority (thetax.party)
 docket gateway would stop it I need same sonsulting from the writer
 same people

 taxing gateway prevention on loss
 IRS barter not worth impeding commercial
 "gop vs dem not necessarily not as evil as palpatine"

 Is good will natural in economic profit (opportunity vs good will from currency)

 money == no questions (bills, bonds, notes FedCash farm manifest)... r/islamicbanks shahada

 not natural unless technically. real income productivity

 non-inflationary recession == vacation

 "microcosms of everything everywhere"

 need a bank to uninvest and remit spoof (fight for me)

 costco coin. revenuedata.doi.gov, save what?

 Need a 12.1.5 CFR 12 sponsor

 Checking is good for currency, "stop sending youth to foreign combat zones"

 Uniform is all the law I will look at, otherwise I'll use comparative law and right to ownership

 Extemist thinking? Like what?

 Inflationary recession is bad

 Actually it's fucking marginal sometimes (and real income misses producer benefits, 
  real purchases misses shrinkflation)

  Real purchases misses shrinkflation. eal income misses producer price benefits.

  Don't take away my scars!

  active on the outside

  I think you should be able to reit your taxes to protest globally

  50% deficit is not an accident

  The currency is worth the treasury so this makes sense for their public lands... I say checking is good 
  for currecy though

  pac buddy

  reciprocal derivative over time scale

  costco depo, luv scalp (depositary. it is written - live on inflation? any recession not inflationary is vacay)

  should be easier to hire during non inflationary recession
  real income benefits and production shrinkflation
  It's all because we are secure

  Like at ShopRite? "nationalize the thing[, freedom]"

  Free content network IS. A bull IC utility

  tbills are worthless. bad bet

  I bet you'd like that

  save the whistleblower (take the lesser parachute)

  You say there is no reason

  economic profit

  I was promised 2008 shitting on class

  it just prevents warehouse tries 35% to 27% hard hats or prohibition? prohibition or hard hat?

  scare of happy people

  refrigerated non perishables

  don't take the fuky money, say third party donee beneficiary

  discovery still green, enter thumbprint.us

  68,85% occupy non-voters

  equal and full measure or death

  need to plan ahead

 I have no questions, but many beggars

 george soroes

 I don't think people of different ideologies can

 "work together". beyond the horseshoe

 can't work together when tunout only new. 35% to 27% 2011 to 2022

 I wouldn't be able to live with myself earning income during inflation

 productivity and real income benefits or purchase shrinkflation

 non voter twitter, we all vote in confidence. reconciliation. 68.85% non voting occupy

 reconcile my expenses venmo. transfers "what does a w2 mean" - decon blues

 press 1 if checing is good for currency treasury stock

 bank run trump

 Does Trump think checking is good for currency treasury stock?


John tobacco banks with his competition
 */
class Me extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      describeKeyBoxes: false,
      jobDescriptions: [],
      extraFeatures: [],
      openDescript: true,
      s: "",
      filePreparedToSend: [],
      openDrivePicker: false,
      gapiReady: false,
      signedIn: false,
      events: [],
      clubs: [],
      tileChosen: undefined,
      usernameTaken: false,
      loading: false,
      working: true,
      me: "",
      chosenSetting: null,
      showNewPInput: false,
      newPhone: "",
      textgood: false
    };
    this.slider = React.createRef();
    this.slider1 = React.createRef();
  }
  cDidMount = () => {
    document.addEventListener("DOMContentLoaded", async function () {
      if (!window.Square) console.log("Square.js failed to load properly");

      let payments = window.Square.payments(appId, locationId);

      /*let cashAppPay;
      const appPayDetails = {
        redirectURL: window.location.href,
        referenceId: "my-website-00000001"
      };
      cashAppPay = await payments
        .cashAppPay(
          payments.paymentRequest({
            countryCode: "US",
            currencyCode: "USD",
            total: {
              amount: "1.00",
              label: "Total"
            }
          }),
          appPayDetails
        )
        .then(async (cashAppPay) => {
          await cashAppPay.attach("#cash-app-pay", {
            shape: "semiround",
            width: "full"
          });
          return cashAppPay;
        });*/
      let ach = await payments.ach({
        redirectURI: "https://localhost:1780/",
        transactionId: "123"
      });

      ach.addEventListener("ontokenization", (event) => {
        const { tokenResult, error } = event.detail;
        if (error) {
          // developer handles error
        } else if (tokenResult.status === "OK") {
          fetch("http://vault-co.in/thumbprint", {
            "Content-Type": "Application/JSON",
            Accept: "Application/JSON",
            method: "POST",
            body: JSON.stringify({
              squareACHtoken: tokenResult.token
            })
          });
        }
      });

      ach.tokenize({
        accountHolderName: "John Doe"
      });
    });
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.auth !== prevProps.auth) {
      onSnapshot(
        query(
          collection(firestore, "jobDescriptions"),
          where("authorId", "==", this.props.auth.uid)
        ),
        (querySnapshot) => {
          let jobDescriptions = [];
          let p = 0;
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              jobDescriptions.push(foo);
            }
          });
          if (
            querySnapshot.docs.length === p &&
            this.state.jobDescriptions !== jobDescriptions
          ) {
            this.setState({ jobDescriptions });
          }
        },
        (e) => console.log(e.message)
      );
    }
  };
  render() {
    var availableStuff =
      this.props.user !== undefined
        ? individualTypes
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
            .filter(
              (parent) =>
                (!this.props.user.experiences ||
                  (this.props.user.experiences &&
                    !this.props.user.experiences.includes(parent))) &&
                (!this.props.user.education ||
                  (this.props.user.education &&
                    !this.props.user.education.includes(parent))) &&
                (!this.props.user.hobbies ||
                  (this.props.user.hobbies &&
                    !this.props.user.hobbies.includes(parent)))
            )
        : [];
    var experiences =
      this.props.user && this.props.user.experiences
        ? this.props.user.experiences
        : [];
    var education =
      this.props.user && this.props.user.education
        ? this.props.user.education
        : [];
    var hobbies =
      this.props.user && this.props.user.hobbies ? this.props.user.hobbies : [];
    var chosen = experiences.concat(education).concat(hobbies);
    var regularOpen = !this.state.settingsOpen && !this.state.bankingOpen;
    return (
      <div
        style={{
          backgroundColor: "white",
          color: "black",
          display: this.props.profileOpen ? "flex" : "none",
          zIndex: "9999",
          position: "fixed",
          width: "100%",
          top: "0vh",
          height: "100vh",
          right: "0",
          overflowY: "auto",
          overflowX: "hidden",
          transition: ".3s ease-in-out"
        }}
        ref={this.slider}
      >
        <div style={{ backgroundColor: "white" }}>
          <div
            style={{
              padding: "3px 7px",
              border: "1px solid",
              borderRadius: "7px",
              width: "min-content"
            }}
            onClick={() =>
              this.setState({
                describeKeyBoxes: !this.state.describeKeyBoxes
              })
            }
          >
            ?
          </div>
          <div
            style={{
              transition: ".3s ease-in",
              backgroundColor: "rgb(10,10,10)",
              overflow: "hidden",
              top: "0px",
              height: this.state.describeKeyBoxes ? "min-content" : "0px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%"
            }}
          >
            <div
              style={{
                transition: ".3s ease-in",
                height: this.state.describeKeyBoxes ? "min-content" : "0px",
                color: "rgb(240,240,180)",
                maxWidth: "400px",
                width: "calc(90% - 30px)",
                flexDirection: "column",
                display: "inline-block",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              {/*
                Show chats?
                Firebase chat uses cache to lessen the (down)load
              <br />*/}
              <span style={{ color: "rgba(150,150,250,.6)" }}>
                <i
                  className="fas fa-key"
                  style={{
                    WebkitTextStroke: "1px rgb(240,240,180)",
                    margin: "auto",
                    zIndex: "7",
                    position: "absolute",
                    color: "rgb(150,150,250)"
                  }}
                ></i>
                &nbsp;.&nbsp;
                <i
                  className="fas fa-box"
                  style={{
                    fontSize: "20px",
                    color: "rgb(150,150,250)",
                    WebkitTextStroke: "1px rgb(240,240,180)"
                  }}
                ></i>
              </span>
              &nbsp;for new&nbsp;
              <i className="fas fa-laptop"></i>&nbsp;
              <i className="fas fa-tablet-alt"></i>
              <br />
              collect user&nbsp;
              <i className="fas fa-key"></i> share user{" "}
              <i className="fas fa-box"></i> open thread&nbsp;
              <i className="fas fa-key"></i>'s + secret files.
              <br />
              <br />
              To ensure you can access your <i className="fas fa-box"></i>'s on
              the cloud&nbsp;
              <br />
              <span
                style={{
                  color: "rgb(100,220,150)"
                }}
              >
                (a) Never destoy this <i className="fas fa-laptop"></i>&nbsp;
                <i className="fas fa-tablet-alt"></i>
              </span>
              <br />
              <span
                style={{
                  color: "rgb(170,190,250)"
                }}
              >
                (b) 1. Create device key. 2. Visit your original&nbsp;
                <i className="fas fa-laptop"></i>&nbsp;
                <i className="fas fa-tablet-alt"></i> . 3. Then, come back. 4.
                Never destroy the auxilliary <i className="fas fa-laptop"></i>
                &nbsp;
                <i className="fas fa-tablet-alt"></i>.
              </span>
              <br />
              <span
                style={{
                  color: "rgb(250,150,250)"
                }}
              >
                or (c) 1. Save the <i className="fas fa-key"></i> in a file,
                then drop it into a new <i className="fas fa-laptop"></i>
                &nbsp;
                <i className="fas fa-tablet-alt"></i>.
              </span>
            </div>
            <div
              style={{
                marginTop: "10px",
                borderTop: "1px solid",
                padding: "12px",
                width: "calc(90% - 30px)",
                display: "inline-block",
                textAlign: "center"
              }}
            >
              Your messages will not be recoverable unless you start guessing
              the prime private key for&nbsp;
              <a
                style={{ color: "rgb(100,150,255)" }}
                href="https://www.quintessencelabs.com/blog/breaking-rsa-encryption-update-state-art"
              >
                5 years with a lot of computers or 10 seconds with a perfectly
                stable quantum computer
              </a>
              . In contrast with other companies toting privacy these chats
              ACTUALLY retain end-to-end encryption when backed up (in the
              cloud, with the keys)
              <br />
            </div>
          </div>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: "30px",
                right: "5%",
                backgroundColor: "rgba(250,250,250,.8)"
              }}
              className="logoutbtn"
              onClick={this.props.logoutofapp}
            >
              Log Out
            </div>
            <div
              style={{
                width: "min-content",
                display: "flex",
                position: "relative",
                backgroundColor: "rgba(150,250,250,.8)",
                textDecoration: !this.state.settingsOpen ? "none" : "underline"
              }}
              className="logoutbtn"
              onClick={
                this.state.settingsOpen
                  ? () => this.setState({ settingsOpen: false })
                  : () =>
                      this.setState({
                        settingsOpen: true,
                        bankingOpen: false
                      })
              }
            >
              Settings
            </div>
            <div
              style={{
                display: "flex",
                position: "relative",
                padding: "5px",
                borderLeft: "3px solid grey",
                backgroundColor:
                  this.props.user.banked || this.state.hoverBank
                    ? "black"
                    : "rgba(250,250,250,.8)",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                transition: ".3s ease-in"
              }}
            >
              <i
                onMouseEnter={() => this.setState({ hoverBank: true })}
                onMouseLeave={() => this.setState({ hoverBank: false })}
                className="fas fa-store-slash"
                style={{
                  color:
                    this.props.user.banked || this.state.hoverBank
                      ? "black"
                      : "grey",
                  display: "flex",
                  position: "relative",
                  backgroundColor: "rgba(250,250,250,.8)"
                }}
                onClick={
                  this.state.bankingOpen
                    ? () => this.setState({ bankingOpen: false })
                    : () =>
                        this.setState({
                          bankingOpen: true,
                          settingsOpen: false
                        })
                }
              />
            </div>
            <div
              style={{ display: "flex" }}
              onClick={
                this.state.manageParent
                  ? () => this.setState({ manageParent: false })
                  : () => this.setState({ manageParent: true })
              }
            >
              <i
                style={{
                  display: "flex",
                  position: "relative",
                  left: "5%",
                  backgroundColor: !this.state.manageParent
                    ? "rgba(250,250,250,.8)"
                    : "rgba(250,250,250,.8)",
                  textDecoration: !this.state.manageParent
                    ? "none"
                    : "underline"
                }}
                className="fas fa-baby-carriage"
              ></i>
              /
              <i
                style={{
                  display: "flex",
                  position: "relative",
                  left: "5%",
                  backgroundColor: this.state.manageParent
                    ? "rgba(250,250,250,.8)"
                    : "rgba(250,250,250,.8)",
                  textDecoration: this.state.manageParent ? "none" : "underline"
                }}
                className="fas fa-user-graduate"
              ></i>
            </div>
            {this.state.bankingOpen && (
              <div
                style={{
                  color: "rgba(220,220,220,.9)",
                  backgroundColor:
                    this.props.user.banked || this.state.hoverBank
                      ? "black"
                      : "grey",
                  height: "6px",
                  width: "6px",
                  borderRadius: "3px",
                  display: "flex",
                  position: "relative"
                }}
              />
            )}
          </div>
          <div className="profileinfo">
            {this.props.user.photoThumbnail && regularOpen && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden"
                }}
              >
                <img
                  style={{
                    display: "flex",
                    position: "absolute",
                    width: "100%",
                    height: "auto"
                  }}
                  src={
                    this.props.user.photoThumbnail
                      ? this.props.user.photoThumbnail
                      : imagesl
                  }
                  alt="error"
                />
              </div>
            )}
            <div
              style={
                regularOpen && this.state.changeSmiley
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <Picker
                onEmojiClick={(event, parent) => {
                  this.setState({ smiley: parent.emoji });
                }}
              />
            </div>
            <div
              style={
                regularOpen && this.state.smiley && this.state.changeSmiley
                  ? {
                      display: "flex",
                      padding: "10px",
                      border: "1px solid grey",
                      margin: "10px"
                    }
                  : { display: "none" }
              }
              onClick={
                this.state.smiley !== this.props.user.smiley
                  ? () => {
                      updateDoc(doc(firestore, "users", this.props.auth.uid), {
                        smiley: this.state.smiley
                      }).catch((err) => console.log(err.message));
                      this.setState({ smiley: null, changeSmiley: false });
                    }
                  : () => this.setState({ changeSmiley: true })
              }
            >
              {this.state.smiley !== this.props.user.smiley
                ? `save as ${this.state.smiley}`
                : this.props.user.smiley}
            </div>
            {regularOpen && (
              <div
                onClick={
                  this.state.changeSmiley
                    ? () => this.setState({ changeSmiley: false })
                    : () => this.setState({ changeSmiley: true })
                }
                style={
                  this.state.smiley !== this.props.user.smiley
                    ? { padding: "10px", margin: "10px" }
                    : { padding: "10px", border: "1px solid grey" }
                }
              >
                {this.state.changeSmiley ? "current:" : ""}{" "}
                {this.props.user.smiley}
              </div>
            )}{" "}
            {regularOpen && (
              <div>
                {this.props.commdocs &&
                  this.props.commdocs.map((parent) => {
                    return <div>{parent}</div>;
                  })}
              </div>
            )}
            {regularOpen && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height: "min-content",
                  width: "max-content",
                  padding: "10px",
                  color: "black",
                  zIndex: "9999",
                  backgroundColor: "white"
                }}
              >
                {this.props.myDocs &&
                  this.props.myDocs.length === 0 &&
                  "no docs"}
              </div>
            )}
            {regularOpen && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height:
                    this.props.myDocs && this.props.myDocs.length === 0
                      ? "0"
                      : "30vh",
                  width: "100%",
                  overflowX: "auto"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    height: "100%",
                    width: "win-content"
                  }}
                >
                  {this.props.myDocs && this.props.myDocs.length > 0 && (
                    <RollFiles
                      user={this.props.user}
                      auth={this.props.auth}
                      showStuff={true}
                      getUserInfo={this.props.getUserInfo}
                      videos={this.props.myDocs}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      getVideos={this.props.getVideos}
                      inCloud={true}
                    />
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    height: "56px",
                    display: "flex"
                  }}
                >
                  <div onClick={this.props.moreDocs}>{"<-"}</div>
                  <div onClick={this.props.againBackDocs}>{"->"}</div>
                </div>
              </div>
            )}
            <br />
            <Resume jobDescriptions={this.state.jobDescriptions} />
            <br />
            {this.state.tileChosen !== "" && regularOpen && (
              <div
                style={
                  this.props.user.hideQualifiers
                    ? {
                        opacity: ".5",
                        display: "flex",
                        flexDirection: "column"
                      }
                    : {
                        opacity: "1",
                        display: "flex",
                        flexDirection: "column"
                      }
                }
              >
                <Experiences
                  auth={this.props.auth}
                  chosen={chosen}
                  availableStuff={availableStuff}
                  users={this.props.users}
                  user={this.props.user}
                />

                <Education
                  auth={this.props.auth}
                  chosen={chosen}
                  availableStuff={availableStuff}
                  users={this.props.users}
                  user={this.props.user}
                />
                <Hobbies
                  auth={this.props.auth}
                  chosen={chosen}
                  availableStuff={availableStuff}
                  users={this.props.users}
                  user={this.props.user}
                />
              </div>
            )}
          </div>
          <ManageParent parents={this.props.parents} />
          <Settings
            hydrateUserFromUserName={this.props.hydrateUserFromUserName}
            manageParent={this.state.manageParent}
            currentUser={this.props.currentUser}
            clearFilePreparedToSend={this.props.clearFilePreparedToSend}
            showpicker2={this.props.showpicker2}
            settingsOpen={this.state.settingsOpen}
            profileOpen={this.props.profileOpen}
            picker2={this.props.picker2}
            loadGapiApi={this.props.loadGapiApi}
            signedIn={this.props.signedIn}
            switchAccount={this.props.switchAccount}
            signOut={this.props.signOut}
            users={this.props.users}
            user={this.props.user}
            auth={this.props.auth}
            filePreparedToSend={this.props.filePreparedToSend}
          />
          <Countries
            users={this.props.users}
            currentUser={this.props.currentUser}
            stripeKey={this.props.stripeKey}
            user={this.props.user}
            auth={this.props.auth}
            bankingOpen={this.state.bankingOpen}
          />
          {!this.state.closeOk && (
            <div
              style={{
                textAlign: "center",
                padding: "10px 0px",
                width: "100%",
                backgroundColor: "rgb(5,5,20)",
                color: "rgb(200,200,240)"
              }}
              onClick={() => {
                this.setState({ closeOk: true });
                this.props.getProfile(this.props.user);
              }}
            >
              Load
            </div>
          )}
          <div
            style={{
              width: "100%",
              flexWrap: "wrap",
              display: "flex",
              position: "relative",
              height: regularOpen ? "min-content" : "0px",
              opacity: regularOpen ? "1" : "0",
              transition: "opacity .3s ease-in"
            }}
          >
            <div
              onClick={() => this.setState({ tileChosen: undefined })}
              style={{
                display: "flex",
                position: "relative",
                width: "97%",
                padding: "5px",
                height: "auto",
                maxHeight: "160px",
                maxWidth: "300px",
                borderRadius: "30px"
              }}
            >
              &times;
            </div>
            {[
              "profileEvents",
              "profileClubs",
              "profileShops",
              "profileRestaurants",
              "profileServices",
              "profileJobs",
              "profileHousing",
              "profiePages",
              "profileVenues",
              "profileDepartments",
              "profileClasses"
            ].map((parent, i) => {
              var type =
                parent === "profileEvents"
                  ? "event"
                  : parent === "profileClubs"
                  ? "club"
                  : parent === "profileShops"
                  ? "shop"
                  : parent === "profileRestaurants"
                  ? "restaurant"
                  : parent === "profileServices"
                  ? "service"
                  : parent === "profileJobs"
                  ? "job"
                  : parent === "profileHousing"
                  ? "housing"
                  : parent === "profiePages"
                  ? "page"
                  : parent === "profileVenues"
                  ? "venue"
                  : parent === "profileClasses"
                  ? "className"
                  : parent === "profileDepartments"
                  ? "department"
                  : "event";
              if (this.props[parent]) {
                return (
                  <ByMe
                    key={i}
                    parent={parent}
                    type={type}
                    setTile={(parent) => this.setState(parent)}
                    deletedEvts={this.props.deletedEvts}
                    tileChosen={this.state.tileChosen}
                    auth={this.props.auth}
                    length={this.props[parent].length}
                    profileEvents={this.props.profileEvents}
                    profileClubs={this.props.profileClubs}
                    profileShops={this.props.profileShops}
                    profileRestaurants={this.props.profileRestaurants}
                    profileServices={this.props.profileServices}
                    profileJobs={this.props.profileJobs}
                    profileHousing={this.props.profileHousing}
                    profiePages={this.props.profiePages}
                    profileVenues={this.props.profileVenues}
                    profileDepartments={this.props.profileDepartments}
                    profileClasses={this.props.profileClasses}
                    communities={this.props.communities}
                  />
                );
              } else return null;
            })}
          </div>
        </div>
        <div
          onClick={this.props.close}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            position: "fixed",
            bottom: "68px",
            width: "56px",
            height: "56px",
            right: "10px",
            backgroundColor: "rgb(20,20,20)",
            zIndex: "9999",
            borderRadius: "45px",
            border: "5px solid #78f8fff2"
          }}
        >
          <div style={{ color: "white" }}>&times;</div>
        </div>
      </div>
    );
  }
}
export default Me;

/*regularOpen && 
                <OpenToggle
                  user={this.props.user}
                  iAmCandidate={this.props.iAmCandidate}
                  iAmJudge={this.props.iAmJudge}
                  iAmRepresentative={this.props.iAmRepresentative}
                />
                
                
                <Plaid
  user={this.props.user}
  askLanguage={this.state.askLanguage}
  askLanguager={() => this.setState({ askLanguage: true })}
  closeAskLang={() => this.setState({ askLanguage: false })}
/>
<div>
  {this.props.followingMe &&
    this.props.followingMe.map((parent) => {
      return (
        <div>
          <img
            style={{ height: "30px", width: "30px" }}
            src={parent.photoThumbnail}
            alt={parent.username}
          />
          {parent.name}@{parent.username}
        </div>
      );
    })}
</div>

<div
  style={{
    display: "flex",
    position: "relative",
    height: "56px",
    width: "100%",
    border: "blue 1px solid"
  }}
>
  <div
    onClick={() => {
      var answer = window.confirm("sign into Spotify?");
      if (answer) {
        console.log("ok hold on");

        var scopecode = Math.random();
        this.props.setScopeCode(scopecode);
        var scopes = "streaming";
        var url =
          "https://accounts.spotify.com/authorize" +
          "?response_type=code" +
          "&client_id=a28add4bf14e40b69dd95c6b696c85b8" +
          `&scope=${scopes}` +
          "&redirect_uri=https://wavepoint.la/spotifyCallback" +
          `&state=${scopecode}`; //&show_dialog=true
        window.open(url);
      }
    }}
    style={{
      display: "flex",
      alignItems: "center",
      position: "absolute",
      height: "56px"
    }}
  >
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "33px",
        margin: "10px",
        border: "blue 1px solid"
      }}
    />
    <div>Connect spotify</div>&nbsp;-&nbsp;
    <div style={{ fontSize: "14px" }}>NOW PLAYING</div>
  </div>
    </div>

<div
  style={{
    display: "flex",
    position: "relative",
    height: "56px",
    width: "100%",
    border: "blue 1px solid"
  }}
>
  <div
    style={{
      display: "flex",
      position: "absolute",
      height: "56px"
    }}
  >
    <div
      style={{
        margin: "10px",
        display: "flex",
        position: "relative",
        border: "blue 1px solid"
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "calc(56px - 20px)",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue"
        }}
      >
        _/
      </div>
      folder
    </div>
  </div>
</div> */
