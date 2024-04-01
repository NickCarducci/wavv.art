import React from "react";

class Nothing extends React.Component {
  state = {};
  componentDidMount = () => {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.openchat
    )
      this.props.openit();
  };
  render() {
    return <div>f</div>;
  }
}
export default Nothing;
