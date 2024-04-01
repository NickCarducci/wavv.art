import React from "react";
import firebase from "../../../.././init-firebase";
import rsa from "js-crypto-rsa";
import getBlobDuration from "get-blob-duration";
import LiveChat from "./Live";
import Playback from "./Playback";
import RollFiles from "../RollFiles";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  list,
  ref,
  updateMetadata,
  uploadBytes
} from "firebase/storage";
import { standardCatch } from "../../../../widgets/Sudo";
import {
  FieldValue,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc
} from "firebase/firestore";

const firestore = getFirestore(firebase);
const storage = getStorage(firebase);
export class Videos extends React.Component {
  state = {};
  getFolders = async (folderReference) =>
    await this.props.storageRef
      .child(folderReference)
      .listAll()
      .then((res) => {
        console.log("folders in: ");
        console.log(folderReference);
        //console.log(res); //{prefixes: Array(0), items: Array(1)}
        let folders = [];
        let p = 0;
        res._delegate.prefixes.forEach((reference) => {
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
  getFiles = async (pathReference, pageToken) => {
    await list(ref(storage, pathReference), { maxResults: 20, pageToken })
      .then((res) => {
        let p = 0;
        console.log(res);
        this.setState({
          pageToken: res.nextPageToken
        });
        //res._delegate.prefixes.forEach((folderRef) => folderRef.listAll());
        Promise.all(
          res /*._delegate*/.items
            .map(async (reff) => {
              const reference = ref(storage, reff.fullPath);
              const metadata = await getMetadata(reference).catch((e) =>
                  console.log(e, "file metadata")
                ),
                gsUrl = await getDownloadURL(reference);
              //metadata, ref
              return new Promise(async (r) => {
                const done =
                  metadata &&
                  gsUrl &&
                  JSON.stringify({
                    ref: reference,
                    gsUrl,
                    metadata
                  });
                return done && r(done);
              });
            })
        )
          .then((files) => files.map((x) => JSON.parse(x)))
          .then((files) => {
            console.log(files.length + " files downloaded ", files);
            //this.unloadGreenBlue();
            this.setState({ files });
          });
      })
      .catch(standardCatch);
  };
  render() {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {/*<RollFiles
      user={this.props.user}
      showStuff={true}
      collection={this.props.collection}
      unloadGreenBlue={this.props.unloadGreenBlue}
      loadGreenBlue={this.props.loadGreenBlue}
      topic={this.props.topic}
      getUserInfo={this.props.getUserInfo}
      auth={this.props.auth}
      entityId={this.props.entityId}
      entityType={this.props.entityType}
      videos={this.props.videos}
      getVideos={this.props.getVideos}
      threadId={this.props.threadId}
      inCloud={true}
    />*/}

        <input
          key={this.state.clear ? 0 : 1}
          style={{
            margin: "3px",
            maxWidth: "calc(100% - 6px)",
            width: "min-content",
            borderRadius: "2px"
            //border: "3px solid blue"
          }}
          type="file"
          onChange={(event) => {
            // Update the state
            // const fileReader = new window.FileReader();
            var answer = window.confirm("begin upload?");
            if (answer) {
              const { pathReference } = this.state;
              var file = event.target.files[0];
              if (file) {
                const { type } = file;
                console.log("file " + type, file);
                if (
                  type === "image"
                  //["application/pdf", "video"].includes(type)
                ) {
                  const blob = new Blob([file], {
                      type //"video/mp4"
                    }),
                    url = this.URL.createObjectURL(blob);
                  console.log("blob url", url);
                  this.setState({ file, url, blob }, () => {
                    //const { newPhoto } = this.state;
                    if (!file.title) return null;
                    if (file.title.includes("/"))
                      return window.alert("/ forbidden in title");
                    console.log("newPhoto type", file.type);
                    var filename = file.title; //+ x.type.split("/")[1].toLowerCase();
                    var itemRef = this.storageRef.child(
                      pathReference + "/" + filename
                    );
                    itemRef
                      .put(file.blob)
                      .then((snapshot) => {
                        console.log(snapshot);
                        console.log(
                          `${filename}.${file.type.split("/")[1]}` +
                            " added to " +
                            pathReference
                        );
                        if (this.props.videos && this.props.videos.length > 0) {
                          //var folderReference = `personalCaptures/${this.props.auth.uid}/*`;

                          this.getFolders(pathReference);
                        }
                        this.getFiles(pathReference);
                      })
                      .catch((err) => console.log(err.title));
                  });
                } else return window.alert(`unsupported file type ${type}`);
              }
            }
          }}
        />

        <div style={{ columnCount: "3" }}>
          {this.props.files &&
            this.props.files.map((file) => {
              const revert = (x) => {
                  updateMetadata(x.ref, {
                    customMetadata: {
                      public: false
                    },
                    metadata: {
                      description: "no description",
                      modified: new Date()
                    }
                  })
                    .then(() => this.props.unloadGreenBlue())
                    .catch((err) => console.log(err.message));
                },
                confirmRating = (x) => {
                  updateMetadata(x.ref, {
                    customMetadata: {
                      ageAppropriate: true
                    },
                    metadata: {
                      description: "no description",
                      modified: new Date()
                    }
                  })
                    .then(() => {
                      this.props.unloadGreenBlue();
                      var folderReference = `personalCaptures/${this.props.auth.uid}`;
                      //this.props.getFolders(folderReference);
                      var pathReference = `${folderReference}/${"*"}`;
                      this.getFiles(pathReference);
                    })
                    .catch((err) => console.log(err.message));
                },
                applyApropos = (x) => {
                  this.props.loadGreenBlue("sending to deepai for rating...");
                  //return console.log(x);

                  updateMetadata(x.ref, {
                    customMetadata: {
                      public: true
                    },
                    metadata: {
                      description: "no description",
                      modified: new Date()
                    }
                  })
                    .then(async () => {
                      if (
                        !x.metadata ||
                        !x.metadata.customMetadata ||
                        !x.metadata.customMetadata.ageAppropriate
                      ) {
                        this.deepai = window.deepai;
                        this.deepai.setApiKey(
                          "fbc3602b-4af4-4b5e-81fb-8a4407b75eab"
                        );
                        var output = await this.deepai.callStandardApi(
                          "content-moderation",
                          {
                            image: x.gsUrl
                          }
                        );
                        var result = output.output;
                        if (result) {
                          console.log(result);
                          console.log(
                            "deepai nudity score " + result.nsfw_score
                          );
                          if (result.nsfw_score > 0.7) {
                            window.alert(
                              "we cannot store this video, it does not pass our nudity test"
                            );
                            //move to pouchdb
                            //delete from cloud storage
                          } else if (result.nsfw_score) {
                            confirmRating(x);
                          } else {
                            revert(x);
                            return window.alert(result);
                          }
                        } else {
                          revert(x);
                          return window.alert(
                            "file moderation analysis error, will not add ageAppropriate tag"
                          );
                        }
                      } else {
                        confirmRating(x);
                      }
                    })
                    .catch((err) => console.log(err.message));
                };
              return file.type === "video" ? (
                <video></video>
              ) : (
                <div style={{ position: "relative" }}>
                  <div
                    //airplane air plane
                    //className="fa fa-send-o"
                    style={{
                      fontWeight: "border",
                      zIndex: "9999",
                      color:
                        file.metadata &&
                        file.metadata.customMetadata &&
                        file.metadata.customMetadata.ageAppropriate
                          ? "lightskyblue"
                          : "white",
                      borderRadius: "6px",
                      padding: "2px",
                      left: "8px",
                      top: "8px",
                      fontSize: "12px",
                      position: "absolute",
                      backgroundColor: "rgb(20,20,30)",
                      border: "2px solid"
                    }}
                    onClick={() => {
                      updateDoc(doc(firestore, "forum", this.props.post.id), {
                        videos: arrayUnion(file.gsUrl)
                      });
                    }}
                  >
                    {"^"}
                  </div>
                  <div
                    //airplane air plane
                    //className="fa fa-send-o"
                    style={{
                      fontWeight: "border",
                      zIndex: "9999",
                      color:
                        file.metadata &&
                        file.metadata.customMetadata &&
                        file.metadata.customMetadata.ageAppropriate
                          ? "lightskyblue"
                          : "white",
                      borderRadius: "6px",
                      padding: "2px",
                      right: "8px",
                      top: "8px",
                      fontSize: "12px",
                      position: "absolute",
                      backgroundColor: "rgb(20,20,30)",
                      border: "2px solid"
                    }}
                    onClick={() => {
                      console.log(file);
                      const desertRef = ref(storage, file.fullPath);
                      var answer = window.confirm("Delete?");
                      answer &&
                        deleteObject(desertRef)
                          .then(() => {
                            // File deleted successfully
                          })
                          .catch((error) => {
                            // Uh-oh, an error occurred!
                          });
                    }}
                  >
                    &times;
                  </div>
                  <img
                    src={file.gsUrl}
                    alt={file.name}
                    style={{ width: "100%" }}
                  />
                </div>
              );
            })}
        </div>

        <div
          style={{
            display: this.props.files && this.state.noPexels ? "flex" : "none",
            justifyContent: "space-around"
          }}
        >
          <div
            style={{
              padding: "10px"
            }}
            onClick={() => {
              this.getFiles(this.state.pathReference);
            }}
          >
            {"<"}
          </div>
          <div
            style={{
              padding: "10px"
            }}
            onClick={() => {
              this.getFiles(this.state.pathReference, this.state.pageToken);
            }}
          >
            {">"}
          </div>
        </div>
      </div>
    );
  }
}
class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blobs: [],
      recordedChunks: [],
      videos: [],
      startTime: 0,
      endTime: 0,
      duration: 0,
      videoTitle: "",
      videoFolder: "*",
      openFrom: "Folder"
    };
    this.URL = window.URL;
    this.stream = window.stream;
    this.canvas = React.createRef();
    this.photo = React.createRef();
    this.video = React.createRef();
    this.video2 = React.createRef();
  }
  componentDidMount = () => {
    //this.startTrack();
  };
  startTrack = () => {
    if (this.stream !== "loading media devices") {
      this.stream = "loading media devices";
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 4096,
            height: 2160,
            facingMode: "user"
          }
        })
        .then((stream) => {
          this.stream = stream; // make stream available to console
          this.video.current.srcObject = stream;

          const track = stream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(track);
          this.video.current.play();
        })
        .catch((err) => console.log(err.message));
    }
  };
  fetchf = () => {
    var folderReference = `personalCaptures/${this.props.auth.uid}`;
    this.props.getFolders(folderReference);
    var pathReference = `${folderReference}/${"*"}`;
    this.props.getVideos(pathReference);
    this.setState({ gotVideos: true });
  };
  videoUpload = async (x) => {
    var answer = window.confirm("begin upload?");
    if (answer) {
      if (x.title.includes("/")) return window.alert("/ forbidden in title");
      console.log(x.type);
      var filename = x.title; //+ x.type.split("/")[1].toLowerCase();
      var pathReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
      var itemRef = ref(storage, pathReference); // this.props.storageRef.child(pathReference + "/" + filename);
      const create = () => {
        console.log("no doc exists by name of: " + x.title);
        // Create a root reference
        console.log(`adding to ${x.folder}...`);
        uploadBytes(itemRef, x.blob)
          .then((snapshot) => {
            console.log(snapshot);
            console.log(
              `${x.title}.${x.type.split("/")[1]}` +
                " added to " +
                `personalCaptures/${this.props.auth.uid}/${x.folder}`
            );
            if (this.props.videos && this.props.videos.length > 0) {
              var folderReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
              this.setState({ openFrom: "Store" });
              this.props.getVideos(pathReference);
              this.props.getFolders(folderReference);
            } else this.props.getVideos(pathReference);
          })
          .catch((err) => console.log(err.message));
      };
      getDownloadURL(itemRef)
        .then((url) => {
          window.alert(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
          console.log(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
        })
        .catch((error) => {
          // https://firebase.google.com/docs/storage/web/handle-errors
          if (error.code === "storage/object-not-found") {
            create();
          } else return console.log(error.code);
        });
    }
  };
  startTrack = async () => {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 4096,
          height: 2160,
          facingMode: "user"
        }
      });
      /* use the this.stream */
      const videoTracks = this.stream.getTracks();
      const track =
        videoTracks[0]; /*.applyConstraints({
        echoCancellation: true,
        googEchoCancellation: true,
        googAutoGainControl: true,
        googNoiseSuppression: true,
        mozEchoCancellation: true,
        mozAutoGainControl: true,
        mozNoiseSuppression: true
      });*/
      this.setState({ track });

      this.video.current.srcObject = this.stream;
      //this.localPeerConnection.addStream(this.video.current.srcObject);
      this.video.current.play();
    } catch (err) {
      /* handle the error */
      console.log(err.message);
      if (err.message === "Permission denied") {
        window.alert("camera off, edit this in browser settings");
      } else return window.alert("camera off");
    }
  };
  play = () => {
    if (!this.recorder) {
      try {
        this.recorder = new MediaRecorder(this.stream, {
          mimeType: "video/webm"
        });
      } catch (e) {
        return console.error("Exception while creating MediaRecorder: " + e);
      }
      let recordedChunks = [];
      this.recorder.ondataavailable = (event) => {
        if (!this.recorder || event.data.size === 0) return;

        recordedChunks.push(event.data);
        this.setState({
          recordedChunks
        });
      };
      this.recorder.start(100);
    } else {
      this.recorder.resume();
    }
    console.log("start recording video " + this.state.videos.length);
    this.startTrack();
    this.setState({
      recording: true,
      play: false,
      ["videos" + this.state.videos.length]: new Date()
    });
  };
  record = () => {
    if (!this.recorder) {
      try {
        this.recorder = new MediaRecorder(this.stream, {
          mimeType: "video/webm"
        });
      } catch (e) {
        return console.error("Exception while creating MediaRecorder: " + e);
      }
      let recordedChunks = [];
      this.recorder.ondataavailable = (event) => {
        if (!this.recorder || event.data.size === 0) return;

        recordedChunks.push(event.data);
        this.setState({
          recordedChunks
        });
      };
      this.recorder.start(100);
    } else {
      this.recorder.resume();
    }
    console.log("start recording video " + this.state.videos.length);
    this.startTrack();
    this.setState({
      recording: true,
      play: false,
      ["videos" + this.state.videos.length]: new Date()
    });
  };
  pauseRecording = async () => {
    try {
      this.recorder.pause();
      this.setState({
        ["videos" + this.state.videos.length]:
          new Date().getTime() - this.state["videos" + this.state.videos.length]
      });
      console.log("stop recording video " + this.state.videos.length);
      var newBlob = new Blob(this.state.recordedChunks, {
        type: "video/webm"
      });

      var blobs = [...this.state.blobs, newBlob];
      this.setState({ blobs });

      let videos = [];
      blobs.map(async (x) => {
        var url = this.URL.createObjectURL(x);
        return videos.push({
          url,
          time: new Date()
        });
      });
      videos.sort((a, b) => b.time.getTime() - a.time.getTime());
      this.setState(
        {
          videos
        },
        async () => {
          var compositeBlob = new Blob(blobs, {
            type: "video/webm"
          });
          var url = this.URL.createObjectURL(compositeBlob);
          var duration = await getBlobDuration(url);
          console.log("load preview");
          this.setState({ url, blob: compositeBlob, duration });
          this.video2.current.src =
            url + `#t=${this.state.startTime},${duration}`;
          this.video2.current.load();
          this.video2.current.onloadeddata = () => {
            this.video2.current && this.video2.current.play();
            this.setState({ play: true });
          };

          this.setState({
            recording: false
          });
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
  delete = async () => {
    try {
      this.recorder.stop();
      //this.recorder.stream.stop();

      this.removeTracks(this.stream);
    } catch (err) {
      console.log(err.message);
    }
    console.log(`deleting (${this.state.videos.length}) videos`);
    this.setState(
      {
        recording: false,
        track: [],
        videos: [],
        recordedChunks: [],
        blob: null,
        blobs: [],
        url: "",
        recorderPaused: false
      },
      () => {
        this.video.current.srcObject = null;
        if (this.video2 && this.video2.current) {
          this.video2.current.srcObject = null;
          this.video2.current.src = null;
        }
        this.video.current.src = null;

        this.recorder = null;
        this.stream = null;
        this.localPeerConnection = null;
        //this.props.cancel();
        window.alert(
          "camera & audio input have been successfully dismounted.  reload page to reset stream-indication light"
        );
      }
    );
  };
  removeTracks = (stream) => {
    stream.getVideoTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
  };
  cancel = async () => {
    if (
      this.stream &&
      this.video &&
      this.video.current &&
      this.video.current.readyState === 4
    )
      try {
        this.removeTracks(this.stream);

        /*const devices = await navigator.mediaDevices.enumerateDevices();
        const capabilities = devices.map((d) =>
          d.getCapabilities ? d.getCapabilities() : d.toJSON()
        );*/
        this.stream = null;
        this.recorder = null;
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(() =>
            this.setState(
              {
                recording: false
              },
              () => {
                window.alert(
                  "the app has nullified the stream object, lo the light" +
                    " remains because your browser has its own settings to persist"
                );
              }
            )
          );
        /*capabilities.map(x=>{
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: { deviceId: { exact: x.deviceId } } })
          .then(() =>
            this.setState({
              recording: false
            })
          );
        })*/
      } catch (err) {
        console.log(err);
      }
  };
  save = async () => {
    if (this.state.navigate) return null;
    const { url, blob, type, videoTitle, videoFolder } = this.state;
    //e.stopPropagation();
    if (url && blob) {
      if (videoTitle) {
        if (this.props.auth !== undefined) {
          console.log("initiating upload...");
          console.log(url);
          console.log(blob.size);
          if (blob.size < 1288490188) {
            //1,288,490,188.8 (1.2 gb / 2 hours)
            //this.state.blob) {

            const saltedBlob = rsa.encrypt(
              blob,
              this.props.user.box,
              "SHA-256",
              {
                name: "RSA-PSS"
              }
            );
            saltedBlob &&
              this.videoUpload({
                type,
                folder: videoFolder,
                title: videoTitle,
                blob: saltedBlob,
                authorId: this.props.auth.uid,
                date: new Date()
              });
          } else
            return window.alert(
              `${type} file is too big.  ` +
                `Folder a file below 1,288,490,188 byte (1.2 gb / ~2 hours)`
            );
        } else {
          var answer1 = window.confirm("you will have to login");
          if (answer1) this.setState({ navigate: true });
        }
      } else {
        window.alert("choose title/location");
        this.setState({ selectedFile: blob });
      }
      /* else if (this.stream) {
        this.imageCapture
          .takePhoto()
          .then((blob) => {
            var mediaRecorder = new MediaRecorder(
              this.stream
            );
            this.photo.current.src = window.URL.createObjectURL(
              blob
            );
            this.setState({
              blob,
              type: mediaRecorder.mimeType
            });
          })
          .catch((err) => console.log(err.message));
      }*/
    } else this.startTrack();
  };
  render() {
    var { videos, recording, live } = this.state;
    var isSafari = navigator.userAgent.includes("safari"); //navigator.vendor === "Apple Computer, Inc."//window.safari !== undefined;

    var videoDurations = { ...this.state };
    //videoDurations.filter((x) => x.split("video")[1]);

    const filterObject = (obj) => {
      Object.keys(obj).forEach((x) => {
        if (!x.split("video")[1]) {
          delete obj[x];
        }
      });
    };
    filterObject(videoDurations);
    const savable =
      (this.state.openFrom === "Folder" && this.state.selectedFile) ||
      (this.stream && this.state.blob);
    return (
      <div
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
          width: "min-content",
          position: "relative",
          bottom: "0px",
          color: "white"
        }}
      >
        {!this.stream && (
          <div style={{ position: "absolute", right: "4px" }}>
            {!this.state.openFolder ? "recorder" : "uploader"}
          </div>
        )}
        <div
          style={{
            backgroundColor: "rgba(20,20,30)",
            margin: this.stream ? "10px" : "0px",
            minHeight: this.stream && recording ? "56px" : "0px"
          }}
        >
          {!this.stream && !this.state.openFolder && (
            <div
              onClick={
                this.state.openFolder
                  ? () => this.setState({ openFolder: false })
                  : () => this.props.setPost({ videoRecorderOpen: false })
              }
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red",
                bottom: "0px",
                zIndex: "9999",
                height: "26px",
                width: "46px",
                left: "20px",
                display: "flex",
                fontSize: "25px",
                color: "white",
                textShadow: `"-1px -1px 0 #000",  
              "1px -1px 0 #000",
              "-1px 1px 0 #000",
              "1px 1px 0 #000"`
              }}
            >
              &times;
            </div>
          )}
          <div
            style={{
              display: !this.stream && this.state.openFolder ? "flex" : "none",
              flexDirection: "column",
              height: "min-content"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: "40px",
                width: "100%",
                position: "relative",
                backgroundColor: "rgb(220,220,220)"
              }}
            >
              <div
                onClick={() => this.setState({ openFrom: "Folder" })}
                style={{
                  color: this.state.openFrom === "Folder" ? "black" : "grey",
                  fontSize: "17px",
                  textDecoration:
                    this.state.openFrom === "Folder" ? "underline" : "none"
                }}
              >
                Folder
              </div>
              <div
                onClick={() => this.setState({ openFrom: "Store" })}
                style={{
                  color: this.state.openFrom === "Store" ? "black" : "grey",
                  fontSize: "17px",
                  textDecoration:
                    this.state.openFrom === "Store" ? "underline" : "none"
                }}
              >
                Private Cloud
              </div>
              <div
                onMouseEnter={() =>
                  this.setState({ hoverCloseFolder: true }, () => {
                    clearTimeout(this.resetHoverCloser);
                    this.resetHoverCloser = setTimeout(() => {
                      this.setState({ hoverCloseFolder: false });
                    }, 200);
                  })
                }
                style={{
                  color: this.state.hoverCloseFolder ? "black" : "grey",
                  padding: "10px",
                  border: "1px dotted"
                }}
                onClick={() => {
                  if (this.state.selectedFile || this.state.url) {
                    this.setState({
                      blob: null,
                      video: null,
                      selectedFile: null,
                      url: null,
                      clear: true
                    });
                    setTimeout(() => {
                      this.setState({
                        clear: false
                      });
                    }, 200);
                  } else {
                    this.setState({ openFolder: false });
                  }
                }}
              >
                &times;
              </div>
              {/*this.props.user !== undefined && (
                <Link
                  to="/files" //{`/files/${this.props.user.id}`}
                  style={{
                    color: "black",
                    height: "13px",
                    width: "13px",
                    borderBottom: "1px solid",
                    borderLeft: "1px solid"
                  }}
                >
                  <div style={{ transform: "rotate(45deg)" }}>&#x2191;</div>
                </Link>
                )*/}
            </div>
            {this.state.openFrom === "Folder" && (
              <div>
                {this.state.video ? (
                  <video
                    style={{
                      width: "60%",
                      height: "300px",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px"
                    }}
                    width="320"
                    height="240"
                    controls
                    ref={this.video}
                  >
                    <p>Video stream not available. </p>
                  </video>
                ) : this.state.video === false ? (
                  <img
                    //id="photo"
                    ref={this.photo}
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "90px",
                      width: "63px"
                    }}
                    src={this.state.url}
                    alt={this.state.selectedFile.name}
                  />
                ) : this.state.frame ? (
                  <div style={{ height: "min-content", zIndex: "6" }}>
                    {/*canvasEl*/}
                    <div
                      style={{
                        height: "min-content",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ color: "white" }} onClick={this.save}>
                        send{/*this.state.blob ? "send" : "capture"*/}
                      </div>
                      <div
                        onClick={() => {
                          this.photo.current.src = null;
                          if (this.state.blob) {
                            this.setState({ blob: null, type: null });
                          } else {
                            this.stream.getTracks().forEach(function (track) {
                              track.stop();
                            });
                            this.setState({ blob: null, type: null });
                            this.stream = null;
                            this.setState({ frame: false });
                          }
                        }}
                      >
                        {this.state.blob ? "delete" : "close"}
                      </div>
                    </div>
                    <img
                      style={{
                        height: "150px",
                        display: !this.state.blob ? "none" : "flex"
                      }}
                      ref={this.photo}
                      alt="camera"
                    />
                    <video
                      style={{
                        height: "150px",
                        zIndex: "9",
                        display: this.state.blob ? "none" : "flex"
                      }}
                      ref={this.video}
                      autoplay
                    ></video>
                  </div>
                ) : this.state.selectedFile ? (
                  <iframe
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      overflow: "auto",
                      marginTop: "5px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "180px",
                      width: "126px"
                    }}
                    src={this.state.url}
                    title={this.state.selectedFile.name}
                  />
                ) : (
                  <div
                    onClick={() => this.setState({ frame: true })}
                    style={{
                      margin: "10px",
                      marginBottom: "0px",
                      border: "3px solid",
                      borderRadius: "10px",
                      height: "60px",
                      width: "42px"
                    }}
                  />
                )}
                {!this.state.frame && (
                  <input
                    key={this.state.clear ? 0 : 1}
                    style={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "column",
                      margin: "10px 15px",
                      borderRadius: "6px",
                      border: "3px solid blue"
                    }}
                    type="file"
                    onChange={(event) => {
                      // Update the state
                      // const fileReader = new window.FileReader();
                      var selectedFile = event.target.files[0];
                      if (selectedFile) {
                        console.log(selectedFile);
                        var blob;
                        var url;
                        if (
                          selectedFile.type.includes("video") ||
                          selectedFile.type.includes("image") ||
                          selectedFile.type.includes("application/pdf")
                        ) {
                          blob = new Blob([selectedFile], {
                            type: selectedFile.type //"video/mp4"
                          });
                          url = this.URL.createObjectURL(blob);
                          console.log(url);
                          this.setState({ selectedFile, url, blob });
                          if (selectedFile.type.includes("video")) {
                            this.videoObj = this.video.current;
                            if (this.videoObj) {
                              //this.videoObj.srcObject = selectedFile.stream;
                              this.videoObj.src = this.state.url;
                              this.setState({ video: true });
                            }
                          } else if (selectedFile.type.includes("image")) {
                            this.setState({ video: false });
                          }
                        } else
                          return window.alert(
                            `unsupported file type ${selectedFile.type}`
                          );
                      }
                    }}
                  />
                )}
                {!this.state.frame && (
                  <div
                    style={{ textDecoration: "none" }}
                    onClick={
                      this.props.auth === undefined && this.state.navigate
                        ? () => this.props.getUserInfo() //"/login"
                        : null //window.location.pathname
                    }
                  >
                    <button
                      onClick={this.save}
                      style={{
                        color: "white",
                        width: "max-content",
                        margin: "10px",
                        marginTop: "5px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "blue"
                      }}
                    >
                      {this.state.navigate ? "Login" : "Save"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {this.state.openFrom === "Store" && this.props.auth !== undefined && (
              <div
                style={{
                  top: `${this.props.top ? this.props.top : 0}px`,
                  width: "100%",
                  height: this.props.openFullScreen ? "100%" : "min-content"
                }}
              >
                {this.props.videos && (
                  <Videos
                    files={this.props.videos}
                    auth={this.props.auth}
                    post={this.props.parent}
                  />
                )}
                {!this.props.videos && !this.state.gotVideos ? (
                  <div
                    style={{
                      fontSize: "12px",
                      margin: "10px",
                      textDecoration: "underline"
                    }}
                    onClick={this.fetchf}
                  >
                    fetch (takes ~10 seconds)
                  </div>
                ) : !this.props.videos ? (
                  <div className="loader">loading</div>
                ) : null}
                {this.props.videos && this.props.videos.length < 0 && (
                  <div style={{ margin: "5px", fontSize: "12px" }}>
                    no files stored
                  </div>
                )}
              </div>
            )}
          </div>
          {savable && (
            <select
              value={this.state.videoFolder}
              onChange={(e) => this.setState({ videoFolder: e.target.value })}
              className="input"
              style={{ width: "80%" }}
            >
              {this.props.user !== undefined && this.props.user.folders ? (
                this.props.user.folders.map((x) => {
                  return <option key={x}>{x}</option>;
                })
              ) : (
                <option>*</option>
              )}
            </select>
          )}
          {savable && (
            <input
              value={this.state.videoTitle}
              onChange={(e) => this.setState({ videoTitle: e.target.value })}
              placeholder="name"
              className="input"
              style={{ width: "80%" }}
            />
          )}
          {!this.stream && (
            <span
              onClick={() => this.setState({ openFolder: true })}
              //folder
              style={{
                display: this.state.openFolder ? "none" : "flex",
                left: "10px",
                position: "absolute",
                margin: "10px 0px"
              }}
              role="img"
              aria-label="upload folder or file"
            >
              &#128193;
            </span>
          )}
          <div
            //pause record
            style={{
              height: "min-content",
              display: "flex",
              top: "10px"
            }}
          >
            {this.stream && !live ? (
              recording ? (
                <div onClick={this.pauseRecording}>
                  <b>|</b>
                  <b>|</b>
                </div>
              ) : (
                <div
                  onMouseEnter={() => this.setState({ hoverRec: true })}
                  onMouseLeave={() => this.setState({ hoverRec: false })}
                  //record
                  onClick={this.record}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(20,20,30)",
                      opacity: recording || this.state.hoverRec ? "1" : ".7",
                      color: recording ? "red" : "rgb(250,200,200)"
                    }}
                  >
                    &#9673;
                  </div>
                </div>
              )
            ) : null}
          </div>
          {!this.stream || live || recording ? null : videos.length === 0 ? (
            <div
              onMouseEnter={() => this.setState({ hoverCancel: true })}
              onMouseLeave={() => this.setState({ hoverCancel: false })}
              style={{
                width: "max-content",
                color: this.state.hoverCancel ? "white" : "grey",
                display: "flex",
                left: "0px",
                position: "relative",
                margin: "5px",
                fontSize: "12px"
              }}
              onClick={this.cancel}
            >
              cancel
            </div>
          ) : (
            <button onClick={this.save}>send</button>
          )}
          {this.stream && !recording && !live && videos.length > 0 && (
            <div
              style={{
                display: "flex",
                right: "0px",
                position: "absolute"
              }}
              onClick={this.delete}
            >
              delete
            </div>
          )}
        </div>
        {!this.state.openFolder &&
          this.state.videos.length === 0 &&
          !this.state.recording && (
            <div
              style={{
                backgroundColor: "rgba(40,30,90)",
                textAlign: "right",
                textIndent: "10px",
                padding: this.stream ? "0px" : "15px 5px",
                color: "grey"
              }}
              onClick={() => {
                if (isSafari) {
                  return window.alert("not available in Apple's safari");
                } else {
                  if (!this.stream) {
                    //if (navigator.mediaDevices) {
                    this.startTrack();
                    //} else return window.alert("video loading failure");
                  } else {
                    return window.alert(
                      "camera enabled, edit this in browser settings"
                    );
                  }
                }
              }}
            >
              {!this.stream ? (
                "enable camera"
              ) : !this.state.hovered ? (
                <div
                  onMouseEnter={() => this.setState({ hoverSettings: true })}
                  onMouseLeave={() => this.setState({ hoverSettings: false })}
                  style={{
                    color: this.state.hoverSettings ? "white" : "grey",
                    height: "min-content",
                    width: "min-content"
                  }}
                >
                  &#9881;
                </div>
              ) : (
                "camera enabled, edit this in browser settings"
              )}
            </div>
          )}
        {this.stream &&
          this.state.videos.length > 0 &&
          this.props.auth !== undefined &&
          !this.state.live && (
            <div
              style={{
                top: "10px",
                display: "flex",
                right: "10px",
                position: "absolute"
              }}
              onClick={() => {
                this.setState({ sendSaveVideo: true });
              }}
              //send paper airplane
            >
              &#xf1d9;
            </div>
          )}
        {this.stream &&
          !this.state.recording &&
          !this.state.live &&
          this.state.videos.length > 0 && (
            <div
              onClick={() => {
                this.video2.current.srcObject = null;
                this.video2.current.src = this.state.url;
                this.video2.current.load();
                this.video2.current.onloadeddata = () => {
                  this.video2.current.play();
                  this.setState({ play: true });
                };
              }}
            >
              play
            </div>
          )}
        <Playback
          {...videoDurations}
          videos={this.state.videos}
          live={this.state.live}
          stream={this.stream}
          play={this.state.play}
          url={this.state.url}
          ref={this.video2}
        />
        {this.localPeerConnection && (
          <div>
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                color: "rgb(20,20,30)",
                borderRadius: "23px",
                width: "20px",
                height: "20px",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={async () => {
                await this.localPeerConnection.createOffer({
                  iceRestart: true
                });
              }}
            >
              &#8634;
            </div>
            connection
          </div>
        )}
        {this.props.isPost ? (
          <div>
            <div
              style={{
                display: "flex",
                right: "10px",
                position: "absolute",
                top: "10px"
              }}
            >
              {this.stream &&
                !this.state.recording &&
                this.state.videos.length === 0 && (
                  <div
                    style={{
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid",
                      flexDirection: "column",
                      display: "flex"
                    }}
                  >
                    &#9880;
                    <div
                      style={{
                        fontSize: "12px"
                      }}
                    >
                      live
                    </div>{" "}
                  </div>
                )}
            </div>
            {this.stream && (
              <video
                //live video
                style={{
                  left: "50%",
                  opacity: "1",
                  zIndex: "5",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  maxWidth: "600px",
                  backgroundColor: "white",
                  color: "white"
                }}
                ref={this.video}
              >
                <p>Audio stream not available. </p>
              </video>
            )}
          </div>
        ) : (
          <LiveChat
            auth={this.props.auth}
            videos={this.state.videos}
            room={this.props.room}
            stream={this.stream}
            recording={this.state.recording}
            ref={this.video}
          />
        )}
      </div>
    );
  }
}
export default Recorder;
