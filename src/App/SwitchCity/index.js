import React from "react";
//import Slider from "react-input-slider";
import Claim from "./Display/Claim";
import SearchPowers from "./SearchPowers";
import Search from "./Search";
import Suggest from "./Suggest";
import BuyCommunity from ".././Community/BuyCommunity";
import { specialFormatting } from "../Post/Media/RollFiles";
import "./Display/Headerstyles.css";
import "./CitiesMap.css";

class SwitchCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryCity: "",
      marginTop: 200,
      hasResults: false,
      y: this.props.distance,
      scrollingRadius: false
    };
    this.header = React.createRef();
    this.switch = React.createRef();
  }
  onSearchChange = async () => {
    const { typesA = ["(address)"] } = this.props;
    //const { typesE = ["(establishment)"] } = this.props;
    //console.log(input)
    const numberEntered = /^[\d]/;
    const letterEntered = /^[\W\D]/;
    const enteredValue = this.state.queryCity; //e.target.value;
    if (this.state.new !== this.state.queryCity) {
      this.setState({ new: this.state.queryCity });
      this.setState({ enteredValue, typesA });
      if (enteredValue) {
        clearTimeout(this.timepout);
        this.timepout = setTimeout(async () => {
          await fetch(
            //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
            //`https://api.mapbox.com/geocoding/v5/mapbox.places/${enteredValue}.json?limit=2&types=address&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${enteredValue}.json?limit=5&types=${
              numberEntered.test(enteredValue) ? "address" : "places"
            }&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
          )
            .then(async (response) => await response.json())
            .then(
              (body) => {
                this.setState({ predictions: body.features });
              },
              (err) => console.log(err)
            )
            .catch((err) => {
              console.log(err);
              this.setState({ city: "", address: "" });
              alert("please use a neighbor's address, none found");
            });
        });
      }
    }
  };
  componentWillUnmount = () => {
    clearTimeout(this.stopTooltip);
    clearTimeout(this.timepout);
  };
  search = (e) =>
    this.setState({
      queryCity: specialFormatting(e.target.value)
    });

  handleTooltipMove = (ev) => {
    const e = ev.touches ? ev.touches[0] : ev;
    const tooltipTop = e.pageY - this.header.current.offsetTop;
    this.setState(
      {
        tooltipMove: true,
        tooltipTop
      },
      () => {
        clearTimeout(this.stopTooltip);
        this.stopTooltip = setTimeout(
          () =>
            this.setState({
              tooltipMove: false,
              tooltipTop: 0
            }),
          200
        );
      }
    );
  };
  render() {
    var close =
      this.state.queryCity !== ""
        ? () => this.setState({ queryCity: "" })
        : this.props.switchCMapCloser;

    const { predictions } = this.state;
    const { displayPreferences, switchCityOpen } = this.props;
    const { backgroundColor } = displayPreferences;
    var buyerClosed = !this.state.openBuyer;
    return (
      <div
        ref={this.switch}
        onDrag={(e) => {
          this.handleTooltipMove(e);
        }}
        onDragExit={() => this.setState({ tooltipTop: null })}
        style={{
          background: "rgb(20,100,170)",
          zIndex: "1",
          //opacity: switchCityOpen ? 1 : 0.5,
          overflow: "hidden",
          height: switchCityOpen ? "min-content" : "0px",
          position: "relative",
          width: "100%",
          transition: ".7s ease-in",
          top: this.state.tooltipTop ? this.state.tooltipTop : 0
        }}
      >
        <div
          style={{
            opacity: switchCityOpen ? 1 : 0,
            bottom: "0px",
            position: "absolute",
            width: "100%",
            overflow: "hidden",
            height: switchCityOpen ? "100%" : "0%",
            background: !switchCityOpen
              ? "rgb(20,50,30)"
              : "linear-gradient(rgb(20,100,170), rgb(20,50,30))",

            transition: ".4s ease-in"
          }}
          onClick={close}
        />

        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />

        <form
          style={{
            overflow: "hidden",
            transition: ".3s ease-in",
            marginLeft: "100px",
            //marginTop: `${this.state.tooltipTop ? this.state.tooltipTop : 0}px`,
            width: "calc(100% - 100px)",
            display: "none",
            position: "relative",
            height: switchCityOpen ? "56px" : "0px"
          }}
          onSubmit={(e) => {
            e.preventDefault();
            this.onSearchChange();
          }}
        >
          <input
            //className="Switch_CMap_Header"
            autoComplete="off"
            autoCorrect="off"
            placeholder="Try somewhere else"
            ref={this.header}
            style={{
              textIndent: "10px",
              border: "none",
              fontSize: "20px",
              width: "100%",
              height: "min-content",
              minHeight: "100%",
              //backgroundColor: "rgb(180,200,255)"
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              transition: ".3s ease-in-out"
            }}
            value={this.state.queryCity}
            onChange={this.search}
          />
        </form>

        <SearchPowers neww={this.state.new} queryCity={this.state.queryCity} />

        <Search
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          chooseCommunity={this.props.chooseCommunity}
          predictions={predictions}
          queryCity={this.state.queryCity}
          getUserInfo={this.props.getUserInfo}
          showReqMayorForm={this.state.showReqMayorForm}
          auth={this.props.auth}
          user={this.props.user}
          clickCityGifmap={this.props.clickCityGifmap}
          new={this.state.new}
        />

        <Suggest
          switchCityOpen={this.props.switchCityOpen}
          backgroundColor={backgroundColor}
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          auth={this.props.auth}
          user={this.props.user}
          chooseCommunity={this.props.chooseCommunity}
          height={this.state.height}
          queryCity={this.state.queryCity}
          switchCMapCloser={this.props.switchCMapCloser}
          comm={this.state.comm}
          show={
            !this.state.openRadiusThing &&
            (!this.state.new || this.state.queryCity !== this.state.new)
          }
          clickCityGifmap={this.props.clickCityGifmap}
          setHovered={(x) => this.setState(x)}
        />

        <div
          onClick={() => this.setState({ openBuyer: !this.state.openBuyer })}
          style={{
            fontSize: "30px",
            color: "white",
            bottom: "0px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center",
            right: buyerClosed ? "56px" : "0px",
            position: "fixed",
            display: switchCityOpen ? "flex" : "none",
            backgroundColor: buyerClosed
              ? "rgba(30,20,30,.4)"
              : "rgba(0,0,0,.5)",
            width: buyerClosed ? "56px" : "100%",
            height: buyerClosed ? "56px" : "100%"
          }}
        >
          {buyerClosed && "+"}
        </div>
        <BuyCommunity
          individualTypes={this.props.individualTypes}
          getCommunity={this.props.getCommunity}
          getUserInfo={this.props.getUserInfo}
          user={this.props.user}
          closeBuyer={() => this.setState({ openBuyer: false })}
          openBuyer={this.state.openBuyer}
          auth={this.props.auth}
        />
        {/*<div
            style={{ display: this.state.openRadiusThing ? "flex" : "none" }}
          >
            <div className="radiusExpectedToolbar">
              <div className="radiusnumber">
                {this.props.y}
                <br />
                km
              </div>
              <Slider
                axis="y"
                y={this.props.y}
                onChange={this.props.sliderchange}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "fixed",
              borderRadius: "45px",
              border: "1px white solid",
              right: "4.5px",
              top: "4.5px",
              width: "46px",
              height: "46px",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
            onClick={
              this.state.openRadiusThing
                ? () => this.setState({ openRadiusThing: false })
                : () => this.setState({ openRadiusThing: true })
            }
          >
            {this.state.y}
          </div>*/}
      </div>
    );
  }
}

export default SwitchCity;

/*<img
src={back}
className="backSWback"
alt="error"
onClick={this.props.switchCMapCloser}
/>*/
/*<img src={search} className="searchSWsearch" alt="error" />*/

/*this.state.search ? (
    <div className="yrnotagline">
      Weather forecast from Yr delivered by the Norwegian
      Meteorological Institute and NRK www.yr.no
    </div>
  ) : null}
</div>
{this.state.search ? (
  <div className="yrnotagline">
    Weather forecast from Yr delivered by the Norwegian Meteorological
    Institute and NRK www.yr.no
  </div>
) : null*/
/*this.state.queryingWait ? (
  <div className="queryWaitLoading">loading</div>
) : null*/
