import { doc, getDoc, getFirestore } from "firebase/firestore";
import React from "react";
import firebase from "../.././init-firebase";
import Display from "./Display";
import WeatherCitySky from "./WeatherCitySky";

const suggs = [
  {
    center: [34.0522, -118.2437],
    place_name: "Los Angeles, California, United States"
  },
  {
    center: [40.71427, -74.00597],
    place_name: "New York, New York, United States"
  },
  {
    center: [35.5951, -82.5515],
    place_name: "Asheville, North Carolina, United States"
  },
  {
    center: [33.749, -84.388],
    place_name: "Atlanta, Georgia, United States"
  },
  {
    center: [39.3643, -74.4229],
    place_name: "Atlantic City, New Jersey, United States"
  },
  {
    center: [30.2672, -97.7431],
    place_name: "Austin, Texas, United States"
  },
  {
    center: [39.2904, -76.6122],
    place_name: "Baltimore, Maryland, United States"
  },
  {
    center: [42.3601, -71.0589],
    place_name: "Boston, Massachusetts, United States"
  },
  {
    center: [42.8864, -78.8784],
    place_name: "Buffalo, New York, United States"
  },
  {
    center: [51.0447, -114.0719],
    place_name: "Calgary, Alberta, Canada"
  },
  {
    center: [35.2271, -80.8431],
    place_name: "Charlotte, North Carolina, United States"
  },
  {
    center: [41.8781, -87.6298],
    place_name: "Chicago, Illinois, United States"
  },
  {
    center: [41.4993, -81.6944],
    place_name: "Cleveland, Ohio, United States"
  },
  {
    center: [39.9612, -82.9988],
    place_name: "Columbus, Ohio, United States"
  },
  {
    center: [33.6638, -117.9047],
    place_name: "Costa Mesa, California, United States"
  },
  {
    center: [32.7767, -96.797],
    place_name: "Dallas, Texas, United States"
  },
  {
    center: [39.7392, -104.9903],
    place_name: "Denver, Colorado, United States"
  },
  {
    center: [42.3314, -83.0458],
    place_name: "Detroit, Michigan, United States"
  },
  {
    center: [53.5461, -113.4938],
    place_name: "Edmonton, Alberta, Canada"
  },
  {
    center: [31.7619, -106.485],
    place_name: "El Paso, Texas, United States"
  },
  {
    center: [44.0521, -123.0868],
    place_name: "Eugene, Oregon, United States"
  },
  {
    center: [42.9634, -85.6681],
    place_name: "Grand Rapids, Michigan, United States"
  },
  {
    center: [29.7604, -95.3698],
    place_name: "Houston, Texas, United States"
  },
  {
    center: [39.0997, -94.5786],
    place_name: "Kansas City, Missouri, United States"
  },
  {
    center: [36.1699, -115.1398],
    place_name: "Las Vegas, Nevada, United States"
  },
  {
    center: [43.0731, -89.4012],
    place_name: "Madison, Wisconsin, United States"
  },
  {
    center: [25.7617, -80.1918],
    place_name: "Miami, Florida, United States"
  },
  {
    center: [43.0389, -87.9065],
    place_name: "Milwaukee, Wisconsin, United States"
  },
  {
    center: [44.9778, -93.265],
    place_name: "Minneapolis, Minnesota, United States"
  },
  {
    center: [45.5017, -73.5673],
    place_name: "Montreal, Quebec, Canada"
  },
  {
    center: [36.1627, -86.7816],
    place_name: "Nashville, Tennessee, United States"
  },
  {
    center: [29.9511, -90.0715],
    place_name: "New Orleans, Louisiana, United States"
  },
  {
    center: [28.5383, -81.3792],
    place_name: "Orlando, Florida, United States"
  },
  {
    center: [45.4215, -75.6972],
    place_name: "Ottawa, Ontario, United States"
  },
  {
    center: [39.9526, -75.1652],
    place_name: "Philadelphia, Pennsylvania, United States"
  },
  {
    center: [33.4484, -112.074],
    place_name: "Phoenix, Arizona, United States"
  },
  {
    center: [40.4406, -79.9959],
    place_name: "Pittsburgh, Pennsylvania, United States"
  },
  {
    center: [45.5051, -122.675],
    place_name: "Portland, Oregon, United States"
  },
  {
    center: [39.5296, -119.8138],
    place_name: "Reno, Nevada, United States"
  },
  {
    center: [37.5407, -77.436],
    place_name: "Richmond, Virgina, United States"
  },
  {
    center: [38.5816, -121.4944],
    place_name: "Sacremento, Califoria, United States"
  },
  {
    center: [38.627, -90.1994],
    place_name: "Saint Louis, Missouri, United States"
  },
  {
    center: [40.7608, -111.891],
    place_name: "Salt Lake City, Utah, United States"
  },
  {
    center: [32.7157, -117.1611],
    place_name: "San Diego, California, United States"
  },
  {
    center: [37.7749, -122.4194],
    place_name: "San Francisco, California, United States"
  },
  {
    center: [34.4208, -119.6982],
    place_name: "Santa Barbara, California, United States"
  },
  {
    center: [47.6062, -122.3321],
    place_name: "Seattle, Washington, United States"
  },
  {
    center: [27.9506, -82.4572],
    place_name: "Tampa, Florida, United States"
  },
  {
    center: [43.6532, -79.3832],
    place_name: "Toronto, Ontario, Canada"
  },
  {
    center: [49.2827, -123.1207],
    place_name: "Vancouver, British Columbia, Canada"
  },
  {
    center: [38.9072, -77.0369],
    place_name: "Washington, District of Columbia, United States"
  }
];
export const suggestions = [];
suggs.map((x) =>
  suggestions.push({
    center: [x.center[1], x.center[0]],
    place_name: x.place_name
  })
);
const firestore = getFirestore(firebase);
class Suggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defComms: []
    };
    this.measure = React.createRef();
  }
  queryFlow = () => {
    clearTimeout(this.pause);
    this.pause = setTimeout(() => {
      this.setState({
        overflowWidth:
          this.measure &&
          this.measure.current &&
          this.measure.current.offsetWidth > this.props.width
      });
    }, 200);
  };
  componentDidUpdate = (prevProps) => {
    /*if (this.props.width !== prevProps.width) {
      if (!this.state.overflowWidth)
        this.setState({ overflowWidth: null }, this.queryFlow);
    }*/
  };
  componentDidMount = () => {
    Promise.all(
      [
        "HsgnpZX3z50cca3IAt0E",
        "ko3CQqeyefMuRjWTewYf",
        "YqCbpISpnkLsRlXdSiak",
        "KNKt7TYwyQWPplJzYuw3",
        "HPQErn3ztJdvBJlueMXi",
        "CNGi23HMa3XviwvsnueG",
        "xtEZTYN1lAixEQjUPO9j",
        "NWeJf7jl1TTXr9CQFXXq",
        "R2BHPbl3FQAkVtwDZUKr",
        "BhwXbwv7WMvsFyFvXGci",
        "zRLEWQIwxV8wJ6sXZky6",
        "7dhovgf2MYY8WWeSEZVv",
        "MiiPoZoTVkHdFEcCcNER"
      ].map(
        async (id) =>
          await new Promise((resolve) =>
            getDoc(doc(firestore, "communities", id)) //United States of America
              .then((doc) => {
                if (doc.exists) {
                  var comm = doc.data();
                  comm.id = doc.id;
                  comm.isCommunity = true;
                  resolve(JSON.stringify(comm));
                }
              })
              .catch((err) => {
                console.log(err.message);
                resolve(JSON.stringify({}));
              })
          )
      )
    ).then((de) => {
      var defComms = de.map((x) => JSON.parse(x));
      this.setState(
        { defComms } //,this.queryFlow
      );
    });
  };
  render() {
    var cityStyle = {
      breakInside: "avoid",
      textDecoration: "none",
      width: 100, //"100%",
      height: `min-content`
    };
    return (
      <div
        ref={this.measure}
        /*style={{
          overflow: !overflowWidth ? "auto" : "hidden",
          marginBottom: "30px",
          //backgroundColor: `rgba(${backgroundColor},1.8)`,
          columnCount: columnCount ? columnCount : "",
          position: "relative",
          width: show ? (overflowWidth ? "100%" : "min-content") : "0px",
          height: `calc(100% - 130px)`
        }}*/
        style={{
          overflow: "hidden",
          height: this.props.switchCityOpen ? "min-content" : "0px",
          flexWrap: "wrap",
          display: "flex",
          //transition: ".3s ease-in",
          position: "relative",
          width: "100%",
          marginBottom: "300px"
        }}
      >
        {[...this.state.defComms, ...suggestions].map((suggestion, i) => {
          if (Object.keys(suggestion).length > 0) {
            var color =
              this.state.hovering !== suggestion.place_name
                ? "rgb(90,90,90)"
                : "rgb(160,160,160)";
            return (
              <div
                onMouseEnter={() =>
                  this.setState({ hovering: suggestion.place_name })
                }
                onMouseLeave={() =>
                  this.setState({ hovering: suggestion.place_name })
                }
                style={{ ...cityStyle, color }}
                key={
                  (suggestion.isCommunity
                    ? suggestion.message
                    : suggestion.place_name) + i
                }
              >
                <div
                  style={{
                    borderBottomRightRadius: "3px",
                    borderBottomLeftRadius: "3px",
                    padding: "3px",
                    backgroundColor: "rgb(20,20,25)",
                    boxShadow: "0px 5px 5px -3px black"
                  }}
                >
                  {suggestion.isCommunity
                    ? suggestion.message
                    : suggestion.place_name &&
                      suggestion.place_name.split(",")[0]}
                </div>
                {suggestion.place_name ===
                "Las Vegas, Nevada, United States" ? (
                  <div style={{ position: "relative" }}>
                    <img
                      onClick={() => {
                        this.props.setHovered({
                          comm: suggestion
                        });
                        this.props.clickCityGifmap(suggestion);
                        this.props.switchCMapCloser();
                      }}
                      style={{
                        width: "100%",
                        height: "auto",
                        backgroundColor: "rgb(100,100,200)"
                      }}
                      src="https://www.dropbox.com/s/it3dr963cddy2y9/nicola-tolin-bKx2zZUvv9k-unsplash.jpg?raw=1"
                      alt="New York City"
                    />
                  </div>
                ) : suggestion.isCommunity ? (
                  <Display
                    openOptionsForThis={() => {
                      // this.props.openOptionsForThis(suggestion)
                      this.props.chooseCommunity(suggestion, "forum");
                    }}
                    chooseCommunity={this.props.chooseCommunity}
                    auth={this.props.auth}
                    user={this.props.user}
                    x={suggestion}
                    height={50}
                  />
                ) : Object.keys(suggestion).length !== 0 ? (
                  <WeatherCitySky
                    onClickThis={() => {
                      this.props.setHovered({
                        comm: suggestion
                      });
                      this.props.clickCityGifmap(suggestion);
                      this.props.switchCMapCloser();
                    }}
                    hovering={this.state.hovering === suggestion.place_name}
                    city={suggestion.place_name}
                    forProfile={true}
                    height={48}
                  />
                ) : null}
              </div>
            );
          } else return null;
        })}
      </div>
    );
  }
}
export default Suggest;
