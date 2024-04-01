import React from "react";
import {
  Above5millionImg,
  EightHundredImg,
  FiftyToOneHunImg,
  FiveToEightHunImg,
  FoodImg,
  InTheatreImg,
  MoviesImg,
  MuseumImg,
  MusicImg,
  OneToFiveHunImg,
  OneToThreeMilImg,
  PlaywrightImg,
  PodImg,
  RadioImg,
  RentImg,
  RewindAndDriveInImg,
  SeriesImg,
  SportImg,
  StayImg,
  TelevisionImg,
  ThreeToFiveMilImg,
  TechImg,
  HospitalityImg,
  OfficeImg,
  HomeImg,
  AutoImg,
  ShippingImg,
  EducationImg,
  ArtsImg,
  MedicalImg,
  MusicJobImg,
  NonProfitImg,
  BusinessImg,
  AccountingImg,
  ActorImg,
  ArchitectureImg,
  CarpentryImg,
  CateringImg,
  CodeImg,
  DentistImg,
  ElectricianImg,
  FramingImg,
  GraphicsAnimationImg,
  HairNailsTanImg,
  HVACImg,
  InteriorDesignImg,
  InternistImg,
  LandscapingImg,
  LawyerImg,
  MasonryImg,
  MechanicImg,
  MusicianImg,
  OrthodontistImg,
  OrthopedistImg,
  PaintingImg,
  PlumbingImg,
  SingerImg,
  VideoProductionImg,
  WeldingImg,
  WriterImg,
  ChineseImg,
  ItalianImg,
  MexicanImg,
  IndianImg,
  HomeStyleImg,
  BurgerAndSandwichImg,
  NoodlesImg,
  VeganOrHealthImg,
  SeafoodImg,
  BreakfastOrLunchImg,
  ClothingImg,
  TechnologyImg,
  MoviesShopImg,
  TrinketsImg,
  HomeFurnishingImg,
  ToolsImg,
  AutoShopImg,
  GroceryImg,
  MusicShopImg,
  AppliancesImg,
  SportClubImg,
  NetworkingImg,
  TechnologyClubImg,
  EngineeringImg,
  ScienceImg,
  LiteratureImg,
  RecreationImg,
  ArtsClubImg,
  MedicineImg,
  MusicClubImg,
  NonProfitClubImg,
  PoliticsImg,
  BusinessEventImg,
  TechEventImg,
  RecreationEventImg,
  EducationEventImg,
  ArtsEventImg,
  SportsImg,
  ConcertImg,
  CauseImg,
  PartyAndClubbingImg,
  DayPartyFestivalImg,
  PhotographyImg
} from "./aphoto";

class EventType extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    return (
      <div /*style={{ display: !subForum ? "block" : "none" }}*/>
        <div
          className="eventtypessetmap"
          //cannot push id behind this "synthetic"-target, must
          //interpolate here...
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "event" ? "flex" : "none"
          }}
        >
          <FoodImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BusinessEventImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechEventImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />

          <RecreationEventImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EducationEventImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsEventImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SportsImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ConcertImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <CauseImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PartyAndClubbingImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <DayPartyFestivalImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "club" ? "flex" : "none"
          }}
        >
          <SportClubImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NetworkingImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechnologyClubImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EngineeringImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ScienceImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <LiteratureImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RecreationImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsClubImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MedicineImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicClubImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NonProfitClubImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PoliticsImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "shop" ? "flex" : "none"
          }}
        >
          <ClothingImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechnologyImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MoviesShopImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TrinketsImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeFurnishingImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ToolsImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AutoShopImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <GroceryImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicShopImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AppliancesImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "restaurant" ? "flex" : "none"
          }}
        >
          <ChineseImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ItalianImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MexicanImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <IndianImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeStyleImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BurgerAndSandwichImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NoodlesImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <VeganOrHealthImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SeafoodImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BreakfastOrLunchImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          style={{
            display: tileChosen === "service" ? "flex" : "none"
          }}
        >
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(160,190,250)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Service
            <HairNailsTanImg subtype={subtype} tileChosen={tileChosen} />
            <CateringImg subtype={subtype} tileChosen={tileChosen} />
            <LawyerImg subtype={subtype} tileChosen={tileChosen} />
            <MechanicImg subtype={subtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,190,190)",
              borderRadius: "30px",
              margin: "-2px",
              padding: "2px"
            }}
          >
            Medicine <div style={{ color: "grey" }}>911 for emergency</div>
            <InternistImg subtype={subtype} tileChosen={tileChosen} />
            <OrthopedistImg subtype={subtype} tileChosen={tileChosen} />
            <OrthodontistImg subtype={subtype} tileChosen={tileChosen} />
            <DentistImg subtype={subtype} tileChosen={tileChosen} />
          </div>

          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,240,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Digital
            <GraphicsAnimationImg subtype={subtype} tileChosen={tileChosen} />
            <PhotographyImg subtype={subtype} tileChosen={tileChosen} />
            <VideoProductionImg subtype={subtype} tileChosen={tileChosen} />
            <CodeImg subtype={subtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(190,240,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Planning
            <ArchitectureImg subtype={subtype} tileChosen={tileChosen} />
            <InteriorDesignImg subtype={subtype} tileChosen={tileChosen} />
            <LandscapingImg subtype={subtype} tileChosen={tileChosen} />
            <FramingImg subtype={subtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,190,240)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Solutions
            <HVACImg subtype={subtype} tileChosen={tileChosen} />
            <PaintingImg subtype={subtype} tileChosen={tileChosen} />
            <PlumbingImg subtype={subtype} tileChosen={tileChosen} />
            <ElectricianImg subtype={subtype} tileChosen={tileChosen} />
          </div>
          <div
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(100,100,100)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Project
            <AccountingImg subtype={subtype} tileChosen={tileChosen} />
            <CarpentryImg subtype={subtype} tileChosen={tileChosen} />
            <WeldingImg subtype={subtype} tileChosen={tileChosen} />
            <MasonryImg subtype={subtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(190,100,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Talents
            <MusicianImg subtype={subtype} tileChosen={tileChosen} />
            <ActorImg subtype={subtype} tileChosen={tileChosen} />
            <WriterImg subtype={subtype} tileChosen={tileChosen} />
            <SingerImg subtype={subtype} tileChosen={tileChosen} />
          </div>
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "job" ? "flex" : "none"
          }}
        >
          <TechImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HospitalityImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OfficeImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AutoImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ShippingImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EducationImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MedicalImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicJobImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NonProfitImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BusinessImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "housing" ? "flex" : "none"
          }}
        >
          <StayImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RentImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <Above5millionImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ThreeToFiveMilImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OneToThreeMilImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EightHundredImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <FiveToEightHunImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OneToFiveHunImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <FiftyToOneHunImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "page" ? "flex" : "none"
          }}
        >
          <PodImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RadioImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TelevisionImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SeriesImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MoviesImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "venue" ? "flex" : "none"
          }}
        >
          <InTheatreImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RewindAndDriveInImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PlaywrightImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SportImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MuseumImg
            subtype={subtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
      </div>
    );
  }
}
export default EventType;
