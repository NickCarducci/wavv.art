import firebase from "./init-firebase";
import { Helmet } from "react-helmet";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import React from "react";
import Foundation from "./App/foundation";
import Sudo, { specialFormatting, standardCatch } from "./widgets/Sudo";

const forbiddenUsernames = [
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
];
const firestore = getFirestore(firebase);
class EventsAt extends React.Component {
  state = { sameaddress: [] };
  componentDidMount = () => {
    this.seekEvents();
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.eventsAt !== prevProps.eventsAt) {
      this.seekEvents();
    }
  };
  seekEvents = () => {
    onSnapshot(
      query(
        collection(firestore, "event"),
        where("place_name", "==", this.props.eventsAt)
      ),
      (querySnapshot) => {
        //if (querySnapshot.docs.length === 0) return window.alert("dev error");
        this.setState({
          sameaddress: querySnapshot.docs
            .map((doc) => {
              if (doc.exists()) {
                return { ...doc.data(), id: doc.id };
              } else return null;
            })
            .filter((x) => x)
        });
      }
    );
  };
  render() {
    const { sameaddress } = this.state;
    const cityFromPlaceName = this.props.eventsAt
      .split(",")
      .map((x, i) => {
        return i === 0
          ? null
          : i === 2
          ? x.replaceAll(/[\d]/g, "").slice(0, -1)
          : x;
      })
      .filter((x) => x)
      .join();
    //console.log(sameaddress, this.props.mapThis, this.props.eventsAt);
    return (
      <div
        style={{
          zIndex: "1",
          display: "block",
          position: "absolute",
          width: "100%",
          minHeight: "100%",
          backgroundColor: "white"
        }}
      >
        <div
          onClick={() => {
            this.props.navigate(`/${cityFromPlaceName}`);
            this.props.setApp({ eventsAt: null });
          }}
          style={{
            padding: "0px 4px",
            borderRadius: "10px",
            color: "white",
            backgroundColor: "navy",
            position: "absolute",
            right: "10px",
            top: "10px",
            fontSize: "20px"
          }}
        >
          &times;
        </div>
        {sameaddress.map((x, i) => {
          console.log(x);
          return (
            <div
              key={i}
              onClick={() => this.props.navigate(`/event/${x.id}`)}
              style={{ padding: "4px 10px", margin: "4px 0px" }}
            >
              {x.title} - {new Date(x.date.seconds * 1000).toLocaleString()}
            </div>
          );
        })}
      </div>
    );
  }
}
class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onroot: false,
      openWhen: "new",
      issues: []
    };
    this.justthisonce = null;
  }
  componentDidMount = () => {
    const { pathname } = this.props;
    this.checkPathname(pathname);
  };
  componentDidUpdate = async (prevProps) => {
    const { pathname } = this.props;
    if (pathname !== prevProps.pathname) {
      this.checkPathname(pathname);
      console.log("••• " + pathname);
    }
    if (this.props.community !== prevProps.community) {
      this.setState(
        {
          community: this.props.community
        },
        () =>
          this.props.community &&
          this.props.setData({ city: this.props.community.place_name })
      );
    }
  };
  checkPathname = async (pathname) => {
    if (pathname === "/login") {
      return this.setState({ sudo: true });
    } else {
      this.setState({ sudo: false });
    }
    //this.props.chosenPost && this.props.helper();
    const user = (isProfile, id) => {
      //this.props.loadGreenBlue("getting profile of " + id);
      //console.log(isProfile);
      //Nick Carducci ​putin will now take foreign currency for consortium is leveraged public land
      this.props.setData({
        isProfile: true,
        profile: isProfile
      });
      const exists =
        this.props.lastProfilePosts && this.props.lastProfilePosts.length === 0;
      if (!this.props.profile || this.props.profile.username !== id || exists) {
        console.log(isProfile.username + " profile");

        this.setState({
          forumOpen: true
        });
        this.props.loadGreenBlue("getting entities by " + isProfile.username);
        this.props.getProfileEntities(isProfile);
      } else {
        console.log(isProfile.username + " again");
        this.setState({
          forumOpen: true
        });
        this.setData({
          profilePosts: this.props.lastProfilePosts
        });
      }
    }; //monthly pilot bonus
    const drop = (forumDoc, id) => {
      console.log(forumDoc + " " + id);
      this.setState({
        isPost: id,
        dropToCheck: id
      });
    };
    const entities = [
      "event",
      "club",
      "shop",
      "restaurant",
      "service",
      "departments",
      "class",
      "oldClass",
      "job",
      "housing",
      "page",
      "venue"
    ];
    const drops = [
      "forum",
      "oldElection",
      "elections",
      "case",
      "oldCase",
      "budget",
      "oldBudget",
      "ordinance"
    ];
    const discoverCreateOrPersonalPages = [
      //DISCOVER CREATE ENTITY
      "/newevent",
      "/newclub",
      "/newshop",
      "/newrestaurant",
      "/newservice",
      "/newjob",
      "/newhousing",
      "/newpage",
      "/newvenue",
      "/newplan",
      "/doc",
      //DISCOVER GLOBAL FORUMS
      "/events/edmtrain/",
      "/calendar", //calendar
      "/forums",
      "/oldElections",
      "/elections",
      "/cases",
      "/oldCases",
      "/budgets",
      "/oldBudgets",
      "/ordinances",
      //DISCOVER GLOBAL ENTITIES
      "/events",
      "/jobs",
      "/clubs",
      "/shops",
      "/restaurants",
      "/services",
      "/departments",
      "/classes",
      "/oldClasses",
      "/housing",
      "/pages",
      "/venues",
      //personal pages
      "/plan",
      "/sd/",
      "/bk/",
      "/invites",
      "/plans/",
      "/login"
    ];
    const showPage = () => {
      return {
        communityOrCity: async (id) => {
          id = specialFormatting(id).replace(/_/g, " ");
          var resComm = await this.props.getCommunityByName(id);
          resComm =
            resComm.constructor === String ? JSON.parse(resComm) : resComm;
          if (
            resComm.constructor === Object &&
            Object.keys(resComm).length !== 0
          ) {
            console.log("community " + id);
            this.props.setData({
              community: resComm,
              isCommunity: id,
              city: resComm.place_name
            });
            this.props.fetchCommEvents(resComm, "event");
            this.props.fetchCommForum(resComm, this.props.commtype);
          } else {
            const letterEntered = /^[\W\D]/;
            if (letterEntered.test(id) && id.includes(",")) {
              console.log("with commas, probably city " + id);
              if (this.state.newCityToQuery === id) {
                this.props.setData({ community: null, city: id });
                this.setState(
                  {
                    newCityToQuery: null
                  },
                  () => {
                    this.setState({
                      newCityToQuery: id
                    });
                  }
                );
                this.props.unloadGreenBlue();
              } else
                this.setState(
                  {
                    newCityToQuery: id
                  },
                  () => {}
                );
            } else {
              window.alert(
                "pathname " +
                  id +
                  " not recognized. (1) City  requires comma, " +
                  "(2) descriptive, community, user has not taken this name"
              );
              this.props.navigate("/");
            }
          }
        },
        entity: async () => {
          var p = pathname.split("/").filter((x) => x !== "");
          var entityEvent = false;
          console.log("pathname", p);
          if (p.length > 2) {
            //[collection,name,community]
            const pos = [p[0], p[1], p[2].replace(/_/g, " ")];
            entityEvent = await this.props.hydrateEntityFromName(...pos);
            if (entityEvent) {
              entityEvent =
                entityEvent.constructor === String
                  ? JSON.parse(entityEvent)
                  : entityEvent;
              this.setState(
                { entityEvent },
                () => {
                  this.props.unloadGreenBlue();
                }
                // this.props.getPostsAs(entityEvent)
              );
            }
          } else {
            //[id,collection]
            entityEvent = await this.props.hydrateEntity(p[1], p[0]);
            if (entityEvent) {
              entityEvent =
                entityEvent.constructor === String
                  ? JSON.parse(entityEvent)
                  : entityEvent;
              console.log(entityEvent, p);
              this.setState(
                { entityEvent },
                () => {
                  this.props.unloadGreenBlue();
                }
                //this.props.getPostsAs(entityEvent)
              );
            }
          }
        }
      };
    };
    const entity = (foundIt, id) => {
      console.log(foundIt + " " + id);
      this.setState({
        isEntity: id
      });
      showPage().entity();
    };
    const go = () =>
      this.setState({
        community: null,
        isPost: null,
        isEntity: null,
        isCommunity: null
      });
    /*if (this.state.pathAliasDiffCity && !this.justthisonce) {
      console.log("pathname", window.location.pathname);
      this.justthisonce = true;
    } else {*/
    this.setState({ pathAliasDiffCity: null }, async () => {
      go();
      const params = pathname.split("/").filter((x) => x !== "");
      var id = params[0];
      this.justthisonce = false;
      var isHome = pathname === "/";
      if (!isHome) {
        var discoverCreateOrPersonalPage = discoverCreateOrPersonalPages.find(
          (x) => pathname.includes(x.toLowerCase())
        );
        if (!discoverCreateOrPersonalPage) {
          this.props.loadGreenBlue("parsing " + pathname);
          /*var path = uriParser(pathname);
            if (path !== pathname) {
              console.log("path", path);
              return this.sustainPath(path, true);
            }*/
          ///[a-zA-Z0-9-]/g.test(profileUsername)
          //var noPunc =
          //!profileUsername.includes(" ") && !profileUsername.match(/[^\w\s]+/);

          var isPostEntityCommunityOrUser = /[a-zA-Z0-9_]/g.test(id);
          if (isPostEntityCommunityOrUser) {
            var isProfile =
              id && (await this.props.hydrateUserFromUserName(id));
            isProfile =
              isProfile.constructor === String
                ? JSON.parse(isProfile)
                : isProfile;
            if (
              isProfile &&
              isProfile.constructor === Object &&
              Object.keys(isProfile).length !== 0
            ) {
              console.log("isProfile", id, isProfile);
              user(isProfile, id);
            } else {
              //if no entity prefix, checks if comm/city
              showPage().communityOrCity(id);
            }
          } else {
            const remainder = id.replace(/[ +-_]+/g, " ");
            window.alert(remainder + " is not recognized");
            this.setState(
              {
                dropToCheck: null
              },
              () => {
                //this.sustainPath("/", true);
                go();
              }
            );
          }
        } else {
          console.log(
            "discoverCreateOrPersonalPage " +
              discoverCreateOrPersonalPage +
              " handled by Router"
          );
          var forumDoc = drops.find((x) => id.toLowerCase().startsWith(x));
          if (forumDoc) {
            drop(forumDoc, id);
          } else {
            if (params[0] === "events") {
              const eventsAt = params[1];
              console.log("eventsAt", eventsAt);
              return this.setState({
                eventsAt
              });
            }
            var foundIt = entities.find((x) => id.toLowerCase().startsWith(x));
            if (foundIt) {
              //entities work as signular or plural startWiths
              entity(params[1], params[3]); //extra path in entity func means
              //within a city/comm, named
              //if (params.length > 1) return null;
            }
          }

          this.setState(
            {
              dropToCheck: null
            },
            () => go()
          );
        }
      } else {
        console.log("no path, suggested city " + this.props.item.place_name);
        this.setState(
          {
            dropToCheck: null
          },
          () => {
            //this.sustainPath("/", true);
            go();
          }
        );
      }
    });
  };
  /*componentWillUnmount = () => {
    clearTimeout(this.susPath);
  };
  sustainPath = (city, once) => {
    if (this.justthisonce) {
      this.setState(
        {
          pathAliasDiffCity: false
        },
        () => (this.justthisonce = null)
      );
    } //i threw down for Jorgensen after checking bank run able trump tho
    clearTimeout(this.susPath);
    this.susPath = setTimeout(() => {
      this.setState(
        {
          pathAliasDiffCity: once ? city : this.state.pathAliasDiffCity
        },
        () => {} //this.props.history.push(city.replace(/[ +-]+/g, "_"))
      );
    }, 200);
  };*/
  render() {
    const {
      user,
      auth,
      width,
      showChatsOnce,
      containerStyle,
      appHeight,
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      profileEntities,
      lastComments,
      undoComments,
      lastPostOfComment,
      undoPostOfComment,
      groupLast,
      groupUndo,
      lastPosts,
      lastPost,
      undoPosts,
      undoPost,
      //
      lastGlobalPost,
      undoGlobalPost,
      lastGlobalForum,
      undoGlobalForum,
      //
      lastCityPost,
      undoCityPost,
      lastCityForum,
      undoCityForum,
      //
      lastCommForum,
      undoCommForum,
      fetchCommEvents,
      fetchEvents,
      timeFilterEvents,
      timeFilterJobs,
      range,
      queriedDate,
      cityapisLoaded,
      edmStore,
      cityapi,
      stateapi,
      getGlobalForum,
      onDelete,
      handleSave,
      loadingMessage,
      //
      current,
      current1,
      commtype,
      item
    } = this.props;
    const { keyBoxes, issues, openWhen } = this.state;
    const meAuth =
      window.meAuth &&
      window.meAuth.constructor === Object &&
      Object.keys(window.meAuth).length > 0
        ? window.meAuth
        : undefined;
    //console.log(this.state.forumOpen);
    let noteList = [];
    let noteTitles = [];
    //pushed
    this.state.notes &&
      this.state.notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    return !item ? null : (
      <div style={{ width: "100%", position: "relative" }}>
        {this.state.sudo && (
          <Sudo
            ref={{ current: {} }}
            forbiddenUsernames={forbiddenUsernames}
            phoneNumberCollection={"numbers"}
            width={width}
            rooturi={"https://wavv.art/"} //comment out to use click
            homeuri={"https://wavv.art"} // emulateRoot onroot instead
            logoutofapp={this.props.logoutofapp}
            auth={meAuth}
            lastWidth={this.props.lastWidth}
            availableHeight={appHeight}
            backgroundColor={null} //transparent
            position={"relative"}
            supportemail={"nick@thumbprint.us"}
            welcomeName={"Thumbprint.us - Social Calendar"}
            onroot={true}
            emulateRoot={(e) => this.setState(e)}
            getUserInfo={() => this.props.gui.current.click()}
            setAuth={(auth) =>
              this.setState(auth, () => this.props.pa.current.click())
            }
            meAuth={meAuth}
            user={this.state.user}
            pathname={this.props.pathname}
            navigate={this.props.navigate}
            useTopComment={null}
            memberMessage=""
            subTop=""
            useTitle={<span></span>}
            useCan={false} //trash
            useCanComment={null}
            root={(a) => this.state.onroot && <div></div>}
            rootArguments={[
              {
                current: {}
              }
            ]}
            subRoot=""
            //emulateRoot={() => this.props.navigate("/")}
            home={!this.state.onroot && <div></div>} //Are drug gangs not pharmacists because they have no shop nor employees?
            //Do employees of regular businesses with diverse customers have to report gifted sweat up to $15,000 per year?
          />
        )}
        <Foundation
          setData={this.props.setData}
          entityEvent={this.state.entityEvent}
          event={this.props.event}
          entity={this.props.entity}
          onMapEntities={this.props.onMapEntities}
          lastGlobalPost={this.props.lastGlobalPost}
          undoGlobalPost={this.props.undoGlobalPost}
          lastGlobalCommForum={this.props.lastGlobalForum}
          undoGlobalCommForum={this.props.undoGlobalForum}
          //
          lastCityPost={this.props.lastCityPost}
          undoCityPost={this.props.undoCityPost}
          lastCityForum={this.props.lastCityForum}
          undoCityForum={this.props.undoCityForum}
          //
          lastCommForum={this.props.lastCommForum}
          undoCommForum={this.props.undoCommForum}
          //
          lastComments={lastComments}
          undoComments={undoComments}
          lastPostOfComment={lastPostOfComment}
          undoPostOfComment={undoPostOfComment}
          groupLast={groupLast}
          groupUndo={groupUndo}
          lastPosts={lastPosts}
          lastPost={lastPost}
          undoPosts={undoPosts}
          undoPost={undoPost}
          paginationhandle={this.props.paginationhandle}
          //
          myStuff={this.props.myStuff}
          navigate={this.props.navigate}
          setAuth={this.props.setAuth}
          profilePosts={this.props.profilePosts}
          getRoomKeys={this.props.getRoomKeys}
          setToUser={this.props.setToUser}
          standbyMode={null}
          width={width}
          setFolder={(folder) => this.setState(folder)}
          containerStyle={containerStyle}
          appHeight={appHeight}
          apple={this.props.apple}
          resetPathAlias={() =>
            this.setState(
              { pathAliasDiffCity: null },
              () => (this.justthisonce = false)
            )
          }
          location={this.props.location}
          statePathname={this.props.statePathname}
          sustainPath={this.sustainPath}
          setIndex={this.props.setIndex}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          allowDeviceToRead={() => {}}
          manuallyDeleteKeyBox={() => {}}
          isPost={this.props.isPost}
          isCommunity={this.props.isCommunity}
          isProfile={this.props.isProfile}
          isEntity={this.state.isEntity}
          keyBoxes={keyBoxes}
          dropToCheck={this.state.dropToCheck}
          newCityToQuery={this.state.newCityToQuery}
          forumPosts={this.props.forumPosts}
          checkPathname={this.checkPathname}
          pathname={this.props.pathname}
          postHeight={this.props.postHeight}
          chosenPostId={this.props.chosenPostId}
          community={this.props.community}
          ordinances={ordinances}
          budget={budget}
          cases={cases}
          elections={elections}
          oldBudget={oldBudget}
          oldCases={oldCases}
          oldElections={oldElections}
          //
          commtype={this.props.commtype}
          tileChosen={this.props.tileChosen}
          //
          tileOnce={this.props.tileOnce}
          setCommunity={this.props.setCommunity}
          forumOpen={this.state.forumOpen}
          following={this.props.following}
          getProfile={this.props.getProfile}
          openOptions={this.props.openOptions}
          openEntity={this.props.openEntity}
          chooseCity={this.props.chooseCity}
          dropCityIssues={this.props.dropCityIssues}
          profile={this.props.profile}
          issues={issues}
          notes={this.state.notes}
          openWhen={openWhen}
          item={item}
          city={this.props.city}
          setCommtype={this.props.setCommtype}
          //
          favoriteCities={this.props.favoriteCities}
          parents={this.props.parents}
          storageRef={this.props.storageRef}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          saveAuth={this.props.saveAuth}
          getUserInfo={this.props.getUserInfo}
          //
          myDocs={this.props.myDocs}
          moreDocs={this.props.moreDocs}
          againBackDocs={this.props.againBackDocs}
          tickets={this.props.tickets}
          myCommunities={this.props.myCommunities}
          profileEntities={profileEntities}
          auth={this.props.auth}
          user={this.props.user}
          //
          iAmCandidate={this.props.iAmCandidate}
          iAmJudge={this.props.iAmJudge}
          iAmRepresentative={this.props.iAmRepresentative}
          followingMe={this.props.followingMe}
          //
          getFolders={this.props.getFolders}
          getVideos={this.props.getVideos}
          folders={this.props.folders}
          videos={this.props.videos}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={showChatsOnce}
          //

          stripeKey={this.props.stripeKey}
          setGoogleLoginRef={this.props.loginButton}
          spotifyAccessToken={this.props.spotifyAccessToken}
          deleteScopeCode={this.props.deleteScopeCode}
          setScopeCode={this.props.setScopeCode}
          accessToken={this.props.accessToken}
          twitchUserAccessToken={this.props.twitchUserAccessToken}
          communities={this.props.communities}
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
          comments={this.props.comments}
          postMessage={this.props.postMessage}
          chosenPost={this.props.chosenPost}
          helper={this.props.helper} //promise
          parent={this.state.parent}
          getDrop={this.props.getf}
          findPost={this.props.findPost}
          dropId={this.props.dropId}
          chats={this.props.chats}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fetchForum={this.props.fetchForum}
          fetchCommForum={this.props.fetchCommForum}
          //observational control (https://stats.stackexchange.com/questions/600587/do-we-expect-sorted-or-unshuffled-single-variable-outcomes-to-be-the-cause-a-me)

          //debenture fiduciary - progressive ([and] truncated) not industry discount
          //security for loss not coverage
          //68.85% - 82.05% non-voter not confident [occupy] (apolitical wait)
          //Apoliical peple are all but "waiting for something new", until not voting is reconciled budgeted
          //spend and save in a purpose industry fee; tax free with a scale and marks
          //grand jury was ever empowered more than uniformity?
          //tort reform! save the rats! Fool me. "hey give me a break buddy" "right to etition and redress"
          //warranty fraud is padrone
          //monthly pilot penalty (Determine your own sick day with a tiny industry specific payday)
          //appeal judge duct
          //Ticketmaster airlines generalmainenanceunit.quora.com
          //revenuedata.doi.gov liquidated
          //Sponsor me nick@vaults.biz vau.money
          //Reciprocal scale of real deflationary productivity or else
          //Shahada gateway
          //Trump made checkable deposits 3x but does he think it is good for treasury stock currency or does he want to smd
          //do not contract a deal just lessen all sentance IF it is alrady either unjust or too long
          //Trump checking bank runs is good character
          //Whenever I feel the heat, I complement djt
          //Default budget recon
          //FedCash atms
          //significant plant expected
          //he is a rat (save them - even with repitoire "public interest lawyer" industry advocacy response do we need to respond)

          fetchCommEvents={fetchCommEvents}
          fetchEvents={fetchEvents}
          timeFilterEvents={timeFilterEvents}
          timeFilterJobs={timeFilterJobs}
          range={range}
          queriedDate={queriedDate}
          getCommunity={this.props.getCommunity}
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          hydrateUser={this.props.hydrateUser}
          hydrateEntity={this.props.hydrateEntity}
          hydrateEntityFromName={this.props.hydrateEntityFromName}
          cityapisLoaded={cityapisLoaded}
          edmStore={edmStore}
          cityapi={cityapi}
          stateapi={stateapi}
          getGlobalForum={getGlobalForum}
          onDelete={onDelete}
          handleSave={handleSave}
          loadingMessage={loadingMessage}
          //we can trust digital ocean build logs
          current={current}
          current1={current1}
        />
        {this.state.eventsAt && false && (
          <EventsAt
            eventsAt={this.state.eventsAt}
            mapThis={this.state.event}
            navigate={this.props.navigate}
            setApp={(e) => this.setState(e)}
          />
        )}
        {this.state.entityEvent && (
          <div
            style={{
              zIndex: "1",
              display: "flex",
              position: "fixed",
              width: "100%",
              minHeight: "100%",
              backgroundColor: "white"
            }}
          >
            <Helmet>
              <title>{`${this.state.entityEvent.title} in ${this.state.entityEvent.city}`}</title>
            </Helmet>
            <div
              onClick={() => {
                this.setState({ entityEvent: null });
                this.props.navigate(this.state.entityEvent.city);
              }}
              style={{
                padding: "0px 4px",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "navy",
                position: "absolute",
                right: "10px",
                top: "10px",
                fontSize: "20px"
              }}
            >
              &times;
            </div>

            <div
              style={{
                padding: "0px 4px",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "navy",
                position: "absolute",
                right: "10px",
                top: "50px",
                fontSize: "20px"
              }}
              onClick={async () => {
                //return console.log(note);
                if (noteList.includes(this.state.entityEvent.planId)) {
                  var deleteAll = window.confirm(
                    "Are you sure you want to delete this plan? " +
                      `${
                        this.props.auth !== undefined &&
                        this.state.entityEvent.authorId === this.props.auth.uid
                          ? "This also deletes you invites in chat with this plan." +
                            " Nothing can be recovered after this"
                          : "It will have its original date when you " +
                            `redownload it from the original author`
                      }`
                  );
                  if (deleteAll) {
                    deleteDoc(
                      doc(firestore, "chats", this.state.entityEvent.planId)
                    )
                      .then(async (ref) => {
                        console.log(
                          "deleted plan from messages " +
                            this.state.entityEvent.planId
                        );
                      })
                      .catch(standardCatch);
                  }
                } else {
                  this.props.auth !== undefined &&
                    addDoc(collection(firestore, "chats"), {
                      entityType: "user",
                      entityId: null,
                      message: this.state.entityEvent.title,
                      body: this.state.entityEvent.body,
                      threadId: "user" + this.props.auth.uid,
                      recipients: [this.props.auth.uid],
                      topic: this.state.topic || "*",
                      authorId: this.props.auth.uid,
                      time: new Date(),
                      date: this.state.entityEvent.date,
                      rangeChosen: this.state.entityEvent.rangeChosen,
                      authoritarianTopic: false
                    })
                      .then(
                        async (docRef) => {
                          this.props.navigate("/");
                        },
                        (e) => console.log(e.title)
                      )
                      .catch((error) => {
                        console.error("Error adding document: ", error);
                      });

                  //this.props.navigate("/");
                }
              }}
            >
              {noteList.includes(this.state.entityEvent.planId) ? (
                <p style={{ opacity: ".5" }}>&#9733;</p>
              ) : (
                <p>&#9734;</p>
              )}
            </div>
            <div>
              <img
                style={{ width: "200px", maxwidth: "100%" }}
                src={this.state.entityEvent.chosenPhoto}
                alt={this.state.entityEvent.chosenPhoto}
              />
              {this.state.entityEvent.collection}
              <br />
              {this.state.entityEvent.title}
              <br />
              {this.state.entityEvent.body}
              <br />
              {this.state.entityEvent.place_name}
              <br />
              {this.state.entityEvent.date &&
                new Date(
                  this.state.entityEvent.date.seconds * 1000
                ).toLocaleString()}
              <div
                onClick={() => {
                  //window.location.href ="https://" + window.location.hostname + "/" +
                  this.setState({ entityEvent: null });
                  this.props.navigate(this.state.entityEvent.city);
                }}
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "4px 10px",
                  backgroundColor: "blue",
                  color: "white"
                }}
              >
                Go to {this.state.entityEvent.city}
              </div>
              {this.state.entityEvent.collection === "event" ? (
                <div
                  onClick={() => {
                    window.location.href =
                      "https://tpt.net.co/event/" + this.state.entityEvent.id;
                  }}
                  style={{
                    borderRadius: "10px",
                    padding: "10px",
                    margin: "4px 10px",
                    backgroundColor: "blue",
                    color: "white"
                  }}
                >
                  See ticket availability
                </div>
              ) : this.state.entityEvent.collection === "club" ? (
                <div
                  onClick={() => {
                    window.location.href =
                      "https://thumbprint.app/sd/club/" +
                      this.state.entityEvent.id;
                  }}
                  style={{
                    borderRadius: "10px",
                    padding: "10px",
                    margin: "4px 10px",
                    backgroundColor: "blue",
                    color: "white"
                  }}
                >
                  View schedule
                </div>
              ) : this.state.entityEvent.collection === "venue" ? (
                this.props.auth !== undefined &&
                (this.state.entityEvent.authorId === this.props.auth.uid ||
                  this.state.entityEvent.admin.includes(
                    this.props.auth.uid
                  )) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      getDocs(
                        query(
                          collection(firestore, "users"),
                          where(
                            "usernameAsArray",
                            "array-contains",
                            this.state.newAdmin
                          )
                        )
                      ).then((querySnapshot) => {
                        this.setState({
                          possibleAdmins: querySnapshot.docs.map((doc) => {
                            return (
                              doc.exists() && { ...doc.data(), id: doc.id }
                            );
                          })
                        });
                      });
                    }}
                  >
                    <input
                      onChange={(e) => {
                        this.setState({
                          newAdmin: e.target.value,
                          possibleAdmins: []
                        });
                      }}
                      style={{
                        borderRadius: "10px",
                        padding: "10px",
                        margin: "4px 10px",
                        backgroundColor: "blue",
                        color: "white"
                      }}
                    />
                    {this.state.possibleAdmins &&
                      this.state.possibleAdmins.map((x) => {
                        return (
                          <div
                            onClick={() => {
                              if (this.state.entityEvent.includes(x.id)) {
                                var answer1 = window.confirm(
                                  "Remove " +
                                    x.username +
                                    " from " +
                                    this.state.entityEvent.title +
                                    "?"
                                );
                                return (
                                  answer1 &&
                                  updateDoc(
                                    doc(
                                      firestore,
                                      "==",
                                      this.state.entityEvent.id
                                    ),
                                    {
                                      admin: arrayRemove(x.id)
                                    }
                                  )
                                );
                              }
                              var answer = window.confirm(
                                "Add " +
                                  x.username +
                                  " to " +
                                  this.state.entityEvent.title +
                                  "?"
                              );
                              answer &&
                                updateDoc(
                                  doc(
                                    firestore,
                                    "==",
                                    this.state.entityEvent.id
                                  ),
                                  {
                                    admin: arrayUnion(x.id)
                                  }
                                );
                            }}
                          >
                            {x.username}{" "}
                            {this.state.entityEvent.includes(x.id) && ".admin"}
                          </div>
                        );
                      })}
                  </form>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default React.forwardRef((props, ref) => (
  <Folder {...props} {...ref.current} />
));
