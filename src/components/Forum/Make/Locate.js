import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from "firebase/firestore";
import React from "react";
import { specialFormatting, standardCatch } from "../../../widgets/Sudo";
import firebase from "../../.././init-firebase";

const firestore = getFirestore(firebase);
class Locate extends React.Component {
  state = {
    commQuery: "",
    addressQuery: "",
    predictions: [],
    communities: []
  };
  queryCommunities = (q) => {
    console.log("commQuery", q);
    getDocs(
      query(
        collection(firestore, "communities"),
        where("messageAsArray", "array-contains", q)
      )
    )
      .then((querySnapshot) => {
        //console.log(q, querySnapshot.docs);
        let communities = [];
        querySnapshot.docs.forEach((doc) => {
          if (doc.exists()) {
            communities.push({ ...doc.data(), id: doc.id });
          }
        });
        if (communities.length === querySnapshot.docs.length)
          this.setState({
            communities
          });
      })
      .catch(standardCatch);
  };
  onSearchChange = async () => {
    if (this.state.locationType === "community")
      return this.queryCommunities(this.state.commQuery);
    //const { typesE = ["(establishment)"] } = this.props;
    //console.log(input)
    const numberEntered = /^[\d]/,
      //const letterEntered = /^[\W\D]/;
      { addressQuery } = this.state; //e.target.value;
    if (
      addressQuery !== "" &&
      numberEntered.test(addressQuery) &&
      this.props.place_name === ""
    ) {
      console.log("addressQuery", addressQuery);
      clearTimeout(this.timepout);
      this.timepout = setTimeout(async () => {
        await fetch(
          //`https://atlas.microsoft.com/search/place_name/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${addressQuery}&typeahead={typeahead}&limit={5}&language=en-US`
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressQuery}.json?limit=2&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
        )
          .then(async (response) => await response.json())
          .then(
            (body) => {
              console.log(body);
              this.setState({ predictions: body.features });
            },
            (err) => console.log(err)
          )
          .catch((err) => {
            console.log(err);
            this.props.clearlocation();
            alert("please use a neighbor's place_name, none found");
          });
      });
    }
  };
  componentWillUnmount = () => {
    clearTimeout(this.timepout);
  };
  componentDidUpdate = async () => {
    if (this.state.predictions !== "" && this.state.addressQuery === "") {
      this.setState({ predictions: "" });
    }
  };
  render() {
    const { place_name, chosenCommunity } = this.props,
      { addressQuery, predictions, communities } = this.state;
    const numberEntered = /^[\d]/;
    const space = " ";
    console.log("communities", communities);
    return (
      <div
        className={
          numberEntered.test(addressQuery)
            ? "eventnewcitysearchfilled"
            : "eventnewcitysearch"
        }
      >
        {place_name || chosenCommunity ? (
          <div />
        ) : (
          <div
            onClick={() => this.onSearchChange()}
            style={{
              color: "rgb(200,120,120)",
              fontSize: "15px",
              border: "2px solid",
              borderRadius: "9px",
              padding: "4px",
              margin: "2px"
            }}
          >
            {!this.props.initial !== "plan" ? "Please provide " : ""}the{space}
            {this.props.initial}
            {space}
            address
          </div>
        )}
        <div className="seachboxthing">
          {place_name}
          <div>
            <div
              style={{
                userSelect: "none",
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly"
              }}
            >
              <div
                style={{
                  color: this.state.locationType === "city" ? "" : "grey",
                  fontSize: "12px",
                  border: "2px solid",
                  borderRadius: "9px",
                  padding: "4px",
                  margin: "2px"
                }}
                onClick={() =>
                  this.setState({
                    locationType: !this.state.locationType && "city"
                  })
                }
              >
                Address
              </div>
              <div
                style={{
                  color: this.state.locationType === "community" ? "" : "grey",
                  fontSize: "12px",
                  border: "2px solid",
                  borderRadius: "9px",
                  padding: "4px",
                  margin: "2px"
                }}
                onClick={() =>
                  this.setState({
                    locationType: !this.state.locationType && "community"
                  })
                }
              >
                Community
              </div>
            </div>
            {this.state.locationType === "city" ? (
              <input
                placeholder="Address"
                value={this.state.addressQuery}
                onChange={(e) =>
                  this.setState({
                    addressQuery: specialFormatting(e.target.value, true)
                  })
                }
              />
            ) : this.state.locationType === "community" ? (
              <input
                placeholder="Community"
                value={this.state.commQuery}
                onChange={(e) =>
                  this.setState({
                    commQuery: specialFormatting(e.target.value)
                  })
                }
              />
            ) : null}
          </div>
        </div>

        {place_name !== "" ? (
          <div
            onClick={() => {
              //this.setState({ locationType: false });
              this.props.clearlocation();
            }}
          >
            Clear location
          </div>
        ) : this.state.locationType === "city" ? (
          predictions && predictions.length > 0 ? (
            predictions.map((prediction) => {
              return (
                <div
                  onClick={() => this.props.selectAddress(prediction)}
                  className="citypredictionsevent"
                >
                  ={prediction.place_name}
                </div>
              );
            })
          ) : (
            "none, try an address place_name"
          )
        ) : this.state.locationType === "community" ? (
          communities && communities.length > 0 ? (
            communities.map((prediction) => {
              return (
                <div
                  onClick={() => this.props.selectAddress(prediction)}
                  className="citypredictionsevent"
                >
                  ={prediction.message}
                </div>
              );
            })
          ) : (
            "none, try a community name"
          )
        ) : (
          "Search"
        )}
      </div>
    );
  }
}

export default Locate;
