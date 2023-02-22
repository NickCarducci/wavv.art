import { updateDoc } from "firebase/firestore";
import React from "react";
import firebase from "../../../.././init-firebase.js";

class NewFilter extends React.Component {
  state = {};
  render() {
    const { field } = this.props;
    return (
      <div
        style={{
          breakInside: "avoid",
          display: "flex",
          width: "calc(100%)",
          backgroundColor: "rgb(20,20,20)",
          color: "white",
          height: "min-content"
        }}
      >
        <input
          maxLength="15"
          className="input"
          style={{ margin: "10px", border: "none" }}
          placeholder="new election filter"
          value={this.state.entry}
          onChange={(e) =>
            this.setState({ entry: specialFormatting(e.target.value) })
          }
        />
        {this.state.entry && (
          <div
            onClick={() => {
              updateDoc(
                doc(firestore, "communities", this.props.community.id),
                {
                  [field]: firebase.firestore.FieldValue.arrayUnion(
                    this.state.entry
                  )
                }
              )
                .then(() => this.setState({ entry: "" }))
                .catch((err) => console.log(err.message));
              this.setState({ entry: "" });
            }}
          >
            +
          </div>
        )}
      </div>
    );
  }
}
export default NewFilter;
