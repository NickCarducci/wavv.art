import React, { lazy, Suspense } from "react";
import { UAParser } from "ua-parser-js";
import { createRoot } from "react-dom/client";
import {
  Route,
  BrowserRouter,
  Routes,
  Redirect,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import PlansByName from "./components/Calendar/PlansByName";
import Calendar from "./components/Calendar";
import Make from "./components/Entities/Make";
import Made from "./components/Entities/Made";
import Eventedmopen from "./widgets/tool/eventedmopen";
import PlanOpen from "./components/Calendar/PouchDBpages/planopen";
import PlanEdit from "./components/Calendar/PouchDBpages/planedit";
import EmailConfirm from "./widgets/EmailConfirm";
import Sudo from "./widgets/Sudo";
import FileManager from "./components/Media/FileManager";
import Document from "./components/Media/Document";
import Authentication from ".";
const Nothing = lazy(() => import("./components/Media/Nothing"));

const Map = {
  EmailConfirm,
  Make,
  Calendar,
  PlansByName,
  PlanOpen,
  PlanEdit,
  Eventedmopen,
  Made,
  Sudo,
  FileManager,
  Document,
  Nothing
};

//FUGGETABOUT IT use pathname and componentDidUpdate
const ClassHook = (props) => {
  /*var parser = new UAParser();
  const name = parser.getBrowser().name;
  const width = name.includes("Safari")
    ? window.screen.availWidth
    : window.innerWidth;
  const height = name.includes("Safari")
    ? window.screen.availHeight
    : window.innerHeight;*/
  console.log("s");
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //https://dev.to/andyrewlee/how-to-dynamically-render-components-in-react-4n7g
  return (
    <div>
      {[props.compnt].map((x) => {
        const Component = Map[x];
        console.log(Component);
        return (
          <Component
            key={x}
            pathname={"/" + params["*"]}
            location={location}
            navigate={navigate}
            /*...{
          height,
          lastWidth: width,
          width,
          availableHeight: name
            ? window.screen.availHeight - 20
            : window.innerHeight
        }*/
            //Authy={}
          />
        );
      })}
      <Authentication
        rediret={props.rediret}
        pathname={"/" + useParams()["*"]}
        location={useLocation()}
        navigate={useNavigate()}
        /*...{
          height,
          lastWidth: width,
          width,
          availableHeight: name
            ? window.screen.availHeight - 20
            : window.innerHeight
        }*/
      />
    </div>
  );
}; // "cannot be called inside a callback" <Hook/>
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Suspense fallback={() => <div>Loading...</div>}>
      <Routes>
        <Route
          path="/__/auth/action"
          element={<ClassHook rediret={"/login"} compnt={"EmailConfirm"} />}
        />
        <Route
          path="/newevent"
          element={
            <ClassHook rediret={"/login"} compnt={"Make"} eventInitial={true} />
          }
        />
        <Route
          path="/newclub"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Make"}
              clubInitial={true}
              //{...props}
              /*hydrateUser={this.props.hydrateUser}
              city={this.props.city}
              community={this.props.community}
              communities={this.props.communities}
              materialDate={
                this.props.materialDate ? this.props.materialDate : new Date()
              }
              openplanner={this.props.openplanner}
              materialDateOpen={this.props.materialDateOpen}
              materialDateOpener={this.props.materialDateOpener}
              menuOpener={this.props.menuOpener}
              createSliderOpen={this.props.createSliderOpen}
              //ref={this.CreateEventThePage}
              myVariable={this.props.myVariable}
              user={this.props.user}
              auth={this.props.auth}
              clearMaterialDate={this.props.clearMaterialDate}*/
            />
          }
        />
        <Route
          path="/newshop"
          element={
            <ClassHook rediret={"/login"} compnt={"Make"} shopInitial={true} />
          }
        />
        <Route
          path="/newrestaurant"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Make"}
              restaurantInitial={true}
            />
          }
        />
        <Route
          path="/newservice"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Make"}
              serviceInitial={true}
            />
          }
        />
        <Route
          path="/newjob"
          element={
            <ClassHook rediret={"/login"} compnt={"Make"} jobInitial={true} />
          }
        />
        <Route
          path="/newhousing"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Make"}
              housingInitial={true}
            />
          }
        />
        <Route
          path="/newpage"
          element={
            <ClassHook rediret={"/login"} compnt={"Make"} pageInitial={true} />
          }
        />
        <Route
          path="/newvenue"
          element={
            <ClassHook rediret={"/login"} compnt={"Make"} venueInitial={true} />
          }
        />
        <Route
          path="/budget"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Calendar"}
              //{...props}
              /*priorDates={this.state.priorDates}
              forwardDates={this.state.forwardDates}
              today={this.state.today}
              noteList={this.state.noteList}
              noteTitles={this.state.noteTitles}
              notes={this.state.notes}
              notesWithDates={this.state.notesWithDates}
              invites={this.props.invites}
              selfvites={this.props.selfvites}
              user={this.props.user}
              auth={this.props.auth}
              queriedDate={this.props.queriedDate}
              datecelestial={this.props.datecelestial}
              chosen={this.props.chosen}
              handleNextDay={this.props.handleNextDay}
              handlePreviousDay={this.props.handlePreviousDay}
              gotoDate={this.props.gotoDate}
              changedate={this.props.changedate}
              isSameDay={this.props.isSameDay}
              month={this.props.month}
              year={this.props.year}
              events={this.props.events}
              foundEntity={this.props.foundEntity}
              recipients={this.props.recipients}
              //calendarInitial={true}

              monthCalOpen={this.props.monthCalOpen}
              dayCalOpener={this.props.dayCalOpener}
              monthCalOpener={this.props.monthCalOpener}
              monthCalCloser={this.props.monthCalCloser}
              chats={this.props.chats}
              hiddenMsgs={this.props.hiddenMsgs}
              deletedMsgs={this.props.deletedMsgs}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave}
              chooseInvite={this.props.chooseInvite}
              achatwasopen={this.props.achatwasopen}
              recentchatswasopen={this.props.recentchatswasopen}
              chatsopen={this.props.chatsopen}
              nochatopen={this.props.nochatopen}*/
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <ClassHook
              rediret={"/login"}
              compnt={"Calendar"}
              calendarInitial={true}
            />
          }
        />
        <Route
          path="/plan"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Calendar"}
              planInitial={true}
            />
          }
        />
        <Route
          path="/events"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Calendar"}
              inviteInitial={true}
              eventsInitial={true}
            />
          }
        />
        <Route
          path="/jobs"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Calendar"}
              inviteInitial={true}
              jobsInitial={true}
            />
          }
        />
        <Route
          path="/sd/:id/:id1"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Calendar"}
              inviteInitial={true}
              eventsInitial={true}
            />
          }
        />
        <Route
          path="/bk/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Calendar"}
            />
          }
        />
        <Route
          path="/plans/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"PlansByName"}
            /> //{...props} notes={this.props.notes} />
          }
        />
        <Route
          path="/plan/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"PlanOpen"}
              //{...props}
              /*noteList={noteList}
            onDelete={this.props.onDelete}
            handleSave={this.props.handleSave2}
            inviteChosen={this.props.inviteChosen}
            notes={this.props.notes}
            auth={this.props.auth}*/
            />
          }
        />
        <Route
          path="/plan/:id/edit"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"PlanEdit"}
              //{...props}
              /*following={this.props.following}
            getUserInfo={this.props.getUserInfo}
            rangeChosen={this.props.rangeChosen}
            auth={this.props.auth}
            user={this.props.user}
            chats={this.props.chats}
            choosePlan={this.props.choosePlan}
            materialDateOpen={this.props.materialDateOpen}
            materialDate={this.props.materialDate}
            materialDateOpener={this.props.materialDateOpener}
            notes={this.props.notes}
            onSave={this.props.onSave}
            onDelete={this.props.onDelete}
            clearMaterialDate={this.props.clearMaterialDate}*/
            />
          }
        />
        {/*<Route
          
          path="/event/:id"
          element={////(props) => (
            <Made
              //{...props}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementhis.props.paelement           droppedPost={this.props.droppedPost}
              linkDrop={this.props.linkDrop}
              dropId={this.props.dropId}
              getUserInfo={this.props.getUserInfo}
              noteList={noteList}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave2}
              communities={this.props.communities}
              community={this.props.community}
              url={window.location.path}
              tickets={this.props.telement             eventsInitial={true}
              eventOpener={this.props.eventOpener}
              event={this.props.eventChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              admin={this.state.admin}
              myEvents={this.props.myEvents}
              listDeletedEvts={this.props.listDeletedEvts}
              handleChangeDate={this.props.handleChangeDate}
              materialDate={this.props.materialDate}
            />
          }
          />*/}
        <Route
          path="/events/edmtrain/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Eventedmopen"}
              //{...props}
              /*noteList={noteList}
            noteTitles={noteTitles}
            handleSave={this.props.handleSave}
            onDelete={this.props.onDelete}
            notes={this.props.notes}
            event={this.props.chosenEdmevent}
            auth={this.props.auth}
            events={this.props.events}*/
            />
          }
        />
        {/*<Route
          
          path="/clubs/:id/:id1"
          element={////(props) => (
            <Made
              //{...props}
              hydrateUserFromUserName={this.props.hydrateUserFromUserName}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementfo={this.proelementrInfo}
              openChatWithGroup={this.props.openChatWithGroup}
              communities={this.props.communities}
              community={this.props.community}
              clubInitial={true}
              clubOpener={this.props.clubOpener}
              event={this.props.clubChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              listDeletedClbs={this.props.listDeletedClbs}
            />
          }
        />
        <Route
          
          path="/shops/:id/:id1"
          element={////(props) => (
            <Made
              //{...props}
              hydrateUserFromUserName={this.props.hydrateUserFromUserName}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementfo={this.proelementrInfo}
              openChatWithGroup={this.props.openChatWithGroup}
              communities={this.props.communities}
              community={this.props.community}
              shopInitial={true}
              clubOpener={this.props.clubOpener}
              event={this.props.clubChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              listDeletedClbs={this.props.listDeletedClbs}
            />
          }
        />
        <Route
          
          path="/restaurants/:id/:id1"
          element={////(props) => (
            <Made
              //{...props}
              hydrateUserFromUserName={this.props.hydrateUserFromUserName}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementfo={this.proelementrInfo}
              openChatWithGroup={this.props.openChatWithGroup}
              communities={this.props.communities}
              community={this.props.community}
              restaurantInitial={true}
              clubOpener={this.props.clubOpener}
              event={this.props.clubChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              listDeletedClbs={this.props.listDeletedClbs}
            />
          }
        />
        <Route
          
          path="/services/:id/:id1"
          element={////(props) => (
            <Made
              //{...props}
              hydrateUserFromUserName={this.props.hydrateUserFromUserName}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementfo={this.proelementrInfo}
              openChatWithGroup={this.props.openChatWithGroup}
              communities={this.props.communities}
              community={this.props.community}
              serviceInitial={true}
              clubOpener={this.props.clubOpener}
              event={this.props.clubChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              listDeletedClbs={this.props.listDeletedClbs}
            />
          }
        />
        <Route
          
          path="/departments/:id/:id1"
          element={////(props) => (
            <Made
              //{...props}
              postHeight={this.props.postHeight}
              groupLast={this.state.groupLast}
              groupUndo={this.state.groupUndo}
              helper={this.props.helper}
              hydrateEntityFromName={this.props.hydrateEntityFromName}
              findPost={this.props.findPost}
              getCommunity={this.props.getCommunity}
              hydrateUser={this.props.hydrateUser}
              chosenEntity={this.props.chosenEntity}
              forumPosts={this.props.forumPosts}
              pathname={this.props.pathname}
              elementfo={this.proelementrInfo}
              openChatWithGroup={this.props.openChatWithGroup}
              communities={this.props.communities}
              community={this.props.community}
              departmentInitial={true}
              clubOpener={this.props.clubOpener}
              event={this.props.clubChosen}
              auth={this.props.auth}
              resetEvent={this.props.resetEvent}
              user={this.props.user}
              listDeletedClbs={this.props.listDeletedClbs}
            />
          }
        />
        {/*<Route
                      
                      path="/classes/:id/:id1/:id2"
                      element={////(props) => (
                        <Made
                          //{...props}
                          hydrateEntityFromName={
                            this.props.hydrateEntityFromName
                          }
                          findPost={this.props.findPost}
                          getCommunity={this.props.getCommunity}
                          hydrateUser={this.props.hydrateUser}
                          chosenEntity={this.props.chosenEntity}
                          
                          forumPosts={this.props.forumPosts}
                          pathname={this.props.pathname}
                  element                      getUserInfo={this.props.getUserInfo}
                          openChatWithGroup={this.props.openChatWithGroup}
                          openachat={this.props.openachat}
                          communities={this.props.communities}
                          community={this.props.community}
                          classInitial={true}
                          //classOpener={this.props.classOpener}
                          //event={this.props.classChosen}
                          auth={this.props.auth}
                          resetEvent={this.props.resetEvent}
                          user={this.props.user}

                          //listDeletedClss={this.props.listDeletedClss}
                        />
                      }
                        />*/}
        <Route
          path="/oldClasses/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Made"}
              classInitial={true}
            />
          }
        />
        <Route
          path="/classes/:id/:id1"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Made"}
              classInitial={true}
            />
          }
        />
        <Route
          path="/job/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Made"}
              jobInitial={true}
            />
          }
        />
        <Route
          path="/housing/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Made"}
              housingInitial={true}
            />
          }
        />
        <Route
          path="/pages/:id/:id1"
          element={
            <ClassHook //rediret={"/login"}
              compnt={"Made"}
              pageInitial={true}
            />
          }
        />
        <Route
          path="/venues/:id/:id1"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Made"}
              venueInitial={true}
            />
          }
        />
        <Route
          path="/newplan"
          element={
            <ClassHook //rediret={"/login"}
              compnt={"Make"}
              planInitial={true}
            />
          }
        />
        <Route
          path="/newplan/:id"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Make"}
              planInitial={true}
            />
          }
        />
        <Route
          path="/newplan/:id/:id1"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Make"}
              planInitial={true}
            />
          }
        />
        <Route
          //BumpRoute

          path="/login"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Sudo"}
              //userLoaded={this.props.userLoaded}
              //anonymous={this.props.anonymous}
            />
          }
        />
        <Route
          path="/files"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"FileManager"}
            />
          }
        />
        <Route
          path="/doc"
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Document"}
            />
            //(props) =>  //{...props} />} />
          }
        />
        <Route
          path="/" //Nothing
          element={
            <ClassHook
              //rediret={"/login"}
              compnt={"Nothing"}
            /> //(props) => } //{...props} openit={this.props.openit} />
          }
        />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
