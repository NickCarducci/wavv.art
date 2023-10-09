import React from "react";

class Calendar extends React.Component {
  render() {
    return (
      <div
        ref={this.props.fwd}
        style={{
          backgroundColor: "transparent"
        }}
      />
    );
  }
}
export default React.forwardRef((props, ref) => (
  <Calendar {...props} {...ref.current} fwd={ref} />
));
