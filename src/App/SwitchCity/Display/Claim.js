import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from "firebase/auth";
import React from "react";
import { standardCatch } from "../../../widgets/Sudo";

class Claim extends React.Component {
  state = { subject: "", body: "" };
  mountRecaptcha = () => {
    console.log("mount recaptcha multi");
    !this.isMountCanceled &&
      window.recaptchaVerifier
        .render()
        .then((id) => (window.recaptchaId = id)) //onload=onloadCallback&render=explicit
        .catch(standardCatch);
  };
  componentWillUnmount = () => {
    this.isMountCanceled = true;
  };
  render() {
    return (
      <div
        style={{
          zIndex: "1",
          overflow: "hidden",
          display: "flex",
          position: "fixed",
          transform: `translateY(${
            this.props.showReqMayorForm ? "0" : "-100"
          }%)`,
          transition: ".3s ease-in",
          left: "0",
          top: "0",
          height: this.props.showReqMayorForm ? "min-content" : "0px",
          maxHeight: "calc(100% - 86px)",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,.8)",
          wordWrap: "break-word",
          flexDirection: "column"
        }}
      >
        <div
          onClick={this.props.clear}
          style={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "10px"
          }}
        >
          &times;
        </div>
        <div
          onClick={async () => {
            const isEmail = (email) =>
              email !== "" &&
              email.split("@")[1] &&
              email.split("@")[1].split(".")[1];
            const emailnew = () => {
              if (
                this.props.auth.email &&
                this.props.auth.emailVerified === false
              )
                return this.props.getUserInfo();
              if (
                !this.props.auth.email ||
                (!this.props.auth.emailVerified &&
                  window.confirm("resend email?"))
              ) {
                if (this.props.auth.email && !this.props.auth.emailVerified)
                  return window.alert(
                    "check your email: " + this.props.auth.email
                  );
                const email = window.prompt(
                  "your decanter email" +
                    (this.props.auth.emailVerified
                      ? this.props.auth.email
                      : ` (you will enter this again while visiting the confirmation path)`)
                );
                if (!email) return null;
                if (isEmail(email)) {
                  this.setState({ openEmail: email });
                  console.log("email", email);
                  if (
                    !this.props.auth.email ||
                    this.props.auth.email !== email
                  ) {
                    console.log("mount recaptcha");
                    return this.mountRecaptcha();
                  }
                  return null;
                } else return window.alert(`${email} is not an email format`);
              }
            };
            /*if (!this.state.account)
          return this.setState({ openLinkToStripe: true },()=>{
            
          });*/
            const { email } = this.props.auth;
            console.log(this.props.auth);
            if (
              !email ||
              !this.props.auth.emailVerified ||
              email !== this.state.openEmail
            )
              return emailnew();

            if (this.props.auth.emailAuth) return null; //emailCallback();

            fetchSignInMethodsForEmail(getAuth(), email)
              .then((signInMethods) => {
                if (
                  signInMethods.indexOf(
                    EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                  ) > -1
                )
                  return null; //emailCallback();

                const canSignLinkEmail = isSignInWithEmailLink(
                  getAuth(),
                  window.location.href
                ); //console.log("getAuth() a.k.a. auth ", getAuth());
                console.log(
                  `can${canSignLinkEmail ? "" : "'t"} sign in with ` + email
                );
                if (canSignLinkEmail)
                  return signInWithEmailLink(
                    getAuth(),
                    email,
                    window.location.href
                  )
                    .then(() => {
                      window.alert(email + " added!");
                      this.props.navigate("/");
                    })
                    .catch((e) => {
                      console.log(e.message);
                      if (e.message === "INVALID_OOB_CODE") {
                        window.alert(
                          `The ${email}-confirmation link was already either used or is just expired.`
                        );
                        this.props.navigate("/login");
                      }
                    });
                const cb = (success) =>
                  this.setState({
                    humanCodeCredential: !success
                  }); //reauth then //if (this.state.humanCodeCredential === 2)
                sendSignInLinkToEmail(getAuth(), this.props.auth.email, {
                  handleCodeInApp: true,
                  url: window.location.href
                })
                  .then(() => {
                    window.alert("visit your email");
                    cb(true);
                  })
                  .catch(() => cb()); //this would invalidate phone auth?
                //https://firebase.google.com/docs/auth/flutter/email-link-auth
              })
              .catch(standardCatch);
          }}
          //src={""}
          style={{
            display: "none",
            position: "absolute",
            right: "0px",
            margin: "10px",
            width: "36px",
            top: "0px",
            border: "1px solid" + (!this.props.stripe ? " pink" : " black"),
            height: "36px",
            backgroundColor:
              !this.state.submitStripe && this.state.openFormSecure
                ? "rgb(255,217,102)" //"rgb(146,184,218)"
                : "rgb(25,35,25)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "1",
            color:
              !this.state.submitStripe && this.state.openFormSecure
                ? "navy" //"rgb(207,226,243)" // "rgb(207,226,243)" //"rgb(146,184,218)"
                : "white"
          }}
          //alt="err"
        >
          +
        </div>
        <div style={{ color: "rgb(220,220,250)" }}>
          enter your town email, I will ask for your reply from that email to
          give your user admin role
          <br />
          Or, add this{" "}
          {`<meta name="clerk" content="${
            this.props.user !== undefined && this.props.user.username
          }">`}{" "}
          to your html header & send me an email with website name + your
          username
        </div>
        <div
          className="formbkgd"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <form
            className="emailform"
            style={{ position: "absolute", width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `mailto:nick@thumbprint.us?subject=${this.state.subject}&body=${this.state.body}`
              );
            }}
          >
            <input
              onChange={(e) => this.setState({ subject: e.target.value })}
              placeholder={`${
                this.props.user !== undefined && this.props.user.username
              } is ${this.props.showReqMayorForm} clerk`}
            />
            <textarea
              placeholder={`I will confirm using my town-email, or add the meta tag to my town website`}
              onChange={(e) => this.setState({ body: e.target.value })}
            />
          </form>
          <div
            style={{
              position: "relative",
              color: "rgb(200,200,250)"
            }}
          >
            nick@thumbprint.us
          </div>
        </div>
      </div>
    );
  }
}
export default Claim;
