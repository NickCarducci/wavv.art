import React from "react";
import LazyPhoto from "./local-photo"; //"react-local-photo";

const mount = (tileChosen, collection) => {
  return !tileChosen || collection === tileChosen;
};
const buttonStyle = {
  borderRadius: "4px",
  backgroundColor: "white",
  color: "black",
  border: "1px solid"
}; //I'm against the fed and deficit
//russia literally invading
//davidbitcoin101 Billion to Ukraine, 5B for the wall was "racist"s
//Do Republicans like that Donald Trump tripled checkable deposits?
//JoshuaClementsRepublicans are the conservative wing of the Democrats.
//Aren't nonprofits allowed to save tax-exempt business income? Why don't we make everyone a nonprofit?
//litigious slander
//literal libel
//RoadsterKarenSheeple are on their 4th booster here. WTF
//bad sampling
//human only ever made virus with mRNA
//capital == revenue to account including consumption
//profit is exclusion of technology if not marginal and competitive
//profit is (artifact) exclusion of technology if not marginal and competitive (cause)
//keynes and quarts discuss real income notwithstanding equality nor persisting equality
//cause, artifact, prevalent (synthesis, thesis, antithesis)
//JoshuaClements"The States are supposed to be sovereign, not 'one nation.'"
//yeah but someone is wrong
//do libertarians want FedCash atms or not?
//trump triple checkable deposits idc if he is handsome squidward
//Save $, america
//every voter wants to cut the deficits and end the fed
//but 68.85%-82.05% supporting occupy didn't vote
const make = (fallback, maxWidth, id, i, open) =>
  React.createElement(
    LazyPhoto,
    {
      key: id + i,
      i: i,
      show: (open && i === 0) || (!open && i === 1),
      className: i === 0 ? "eventtypesselected" : "eventtypesnotselected",
      style: {
        width: "200px",
        maxWidth: "calc(100% - 10px)",
        borderRadius: "16px",
        margin: "4px 0px"
      },
      locationPath: `.././Photos/${id}/${i === 0 ? "Open.png" : "Closed.png"}`,
      id,
      position:
        (open && i === 0) || (!open && i === 1) ? "relative" : "absolute",
      fallback,
      buttonStyle,
      maxWidth: maxWidth - 20,
      nolabel: true,
      verbose: false
    },
    id + i
  );

/*const make = (fallback, maxWidth, id, i, open) => (
    <LazyPhoto
      key={id + i}
      i={i}
      show={(open && i === 0) || (!open && i === 1)}
      className={i === 0 ? "eventtypesselected" : "eventtypesnotselected"}
      style={{ width: "100%" }}
      locationPath={`.././Photos/${id}/${i === 0 ? "Open.png" : "Closed.png"}`}
      id={id}
      fallback={fallback}
      buttonStyle={buttonStyle}
      maxWidth={maxWidth}
      nolabel={false}
      verbose={false}
    />
  );*/
export class HairNailsTanImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;

    const title = "hair, nails & tan";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/n7x1nni29yfn3nh/Services_Grooming.png?raw=1", //src
        "https://www.dropbox.com/s/iis3mgzii9ddtc7/Services_Grooming%20%28closed%29%20%281%29.png?raw=1" //src
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class CateringImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;

    const title = "catering";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/btl5bey67ytji3e/Services_Catering.png?raw=1", //openSrc
        "https://www.dropbox.com/s/lctdnw37lqi48ts/Services_Catering%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class LawyerImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "lawyer";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/0twhgd2akmefuhv/Services_lawyer.png?raw=1", //openSrc
        "https://www.dropbox.com/s/1qd26hq2yeps313/Services_Lawyer%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MechanicImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "mechanic";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/ockeu56zkt36wpf/Shop_Mechanic%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/tegeovdwjjxl71p/Shop_Mechanic%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class InternistImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "internist";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/bvw5ov3syh08sek/Services_internist.png?raw=1", //openSrc
        "https://www.dropbox.com/s/d02d8y54vponfao/Services_Internist%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class OrthopedistImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "orthopedist";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/5of9fespfso2uhk/Services_orthopedist.png?raw=1", //openSrc
        "https://www.dropbox.com/s/yo08zymmuvw9dvc/Services_Orthopedist%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class OrthodontistImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "orthodontist";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/17xdee095gf16z9/Services_orthodontist.png?raw=1", //openSrc
        "https://www.dropbox.com/s/wocfxbwfgk0spfe/Services_Orthodontist%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class DentistImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "dentist";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/yycynkjh2esm42j/Services_dentist.png?raw=1", //openSrc
        "https://www.dropbox.com/s/k8x1ljs2z4xnzs6/Services_Dentist%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class GraphicsAnimationImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "graphics & animation";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/plnce0a7d6ory0y/Services_Animation.png?raw=1", //openSrc
        "https://www.dropbox.com/s/xpaxa4etskx7dna/Services_Animation%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PhotographyImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "photography";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/7dki02boxhmfhb8/Services_Photography.png?raw=1", //openSrc
        "https://www.dropbox.com/s/u2l61wae68pnttt/Services_Photography%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class VideoProductionImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "video production";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/1pk4ssdax7wq87s/Services_VideoProd.png?raw=1", //openSrc
        "https://www.dropbox.com/s/5sg0ah7798mc6jd/Services_VideoProd%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class CodeImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "code";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/79r9y3tb3vo0tku/Services_code.png?raw=1", //openSrc
        "https://www.dropbox.com/s/4a7fbgrzgi8g3z3/Services_Code%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class ArchitectureImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "architecture";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/4of25ezap14eqn8/Services_Architecture.png?raw=1", //openSrc
        "https://www.dropbox.com/s/msabwkm6vu4w2b8/Services_Architecture%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class InteriorDesignImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "interior design";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/icdgqnngkhxnv79/Services_InteriorDes.png?raw=1", //openSrc
        "https://www.dropbox.com/s/c824lca8qw7vykn/Services_InteriorDes%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class LandscapingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "landscaping";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/uu0yvz3kvc6bm3u/Services_Landscaping.png?raw=1", //openSrc
        "https://www.dropbox.com/s/vmo4uyr6k827vgh/Services_Landscaping%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class FramingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "framing";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/2jx1dmzrbj0c8z5/Services_Framing.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ex4m2m4ipw8akbh/Services_Framing%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class HVACImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "HVAC";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/hcdkgl6mfdnk0ul/Services_HVAC.png?raw=1", //openSrc
        "https://www.dropbox.com/s/t8cl3glx6rzvibs/Services_HVAC%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PaintingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "painting";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/coco1nxnk60mly5/Services_Painting.png?raw=1", //openSrc
        "https://www.dropbox.com/s/6zzvl8c9o8vlbdj/Services_Painting%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PlumbingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "plumbing";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/x0ubcl2m5hj8bo1/Services_Plumbing.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ggf0lu16oqvz8fa/Services_Plumbing%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ElectricianImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "electrician";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/8gws41giprbichz/Services_Electrician.png?raw=1", //openSrc
        "https://www.dropbox.com/s/lvjiaf7mykj6th7/Services_Electrician%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class AccountingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "accounting";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/nyef5qnm0pbw5rg/Services_Accounting.png?raw=1", //openSrc
        "https://www.dropbox.com/s/g8ucu8e8rpdv4il/Services_Accounting%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class CarpentryImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "carpentry";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/fujaobpjpd3pr85/Services_Carpentry.png?raw=1", //openSrc
        "https://www.dropbox.com/s/h4zh8pa2u30z5gb/Services_Carpentry%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class WeldingImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "welding";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/bxg3wl2zymu901e/Services_Welding.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ml4s66u1jeivzbk/Services_Welding%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MasonryImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "masonry";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/p1skewcs5trjwro/Services_Masonry.png?raw=1", //openSrc
        "https://www.dropbox.com/s/8qo7499u4p992fi/Services_Masonry%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class MusicianImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "musician";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/k6ez54ggh0cv9ym/SERVICES_Musician.png?raw=1", //openSrc
        "https://www.dropbox.com/s/qaekx8kxsqvdcrp/SERVICES_musician%20%28closed%29%20%282%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ActorImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "actor";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/tugjy7ky1hdvk4j/SERVICES_Acting.png?raw=1", //openSrc
        "https://www.dropbox.com/s/kmdc9z6odf6xf26/SERVICES_acting%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class WriterImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "writer";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/eyq48dj3r5rp0tk/SERVICES_Writer.png?raw=1", //openSrc
        "https://www.dropbox.com/s/rnh629xrdu99n2p/SERVICES_writer%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SingerImg extends React.Component {
  render() {
    const { subtype, tileChosen } = this.props;
    const title = "singer";
    return (
      mount(tileChosen, "service") &&
      [
        "https://www.dropbox.com/s/5mpnx9rhkm3fm8s/SERVICES_Singer.png?raw=1", //openSrc
        "https://www.dropbox.com/s/fzewrha9ky0yyih/SERVICES_singer%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, null, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class EventImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "event";
    return [
      "https://www.dropbox.com/s/9ik0gzhls9x68lm/EVENTTYPES_Events%20%20%281%29.png?raw=1", //openSrc
      "https://www.dropbox.com/s/z975s62yciuy356/TILES_Events%20%28closed%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class ClubImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "club";
    return [
      "https://www.dropbox.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?raw=1", //openSrc
      "https://www.dropbox.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class ShopImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "shop";
    return [
      "https://www.dropbox.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?raw=1", //openSrc
      "https://www.dropbox.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class RestaurantImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "restaurant";
    return [
      "https://www.dropbox.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?raw=1", //openSrc
      "https://www.dropbox.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class ServiceImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "service";
    return [
      "https://www.dropbox.com/s/0jjuyb2cn56zvsh/EVENTTYPES_Services.png?raw=1", //openSrc
      "https://www.dropbox.com/s/r7sta0v63jpx4t6/EVENTTYPES_Services%20%28closed%29%20%281%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class JobImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "job";
    return [
      "https://www.dropbox.com/s/0tusz7lqrbnzvlx/EVENTTYPES_Jobs.png?raw=1", //openSrc
      "https://www.dropbox.com/s/uslvfnp7xqmh2y8/TILES_Jobs%20%28closed%29%20%281%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class HousingImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "housing";
    return [
      "https://www.dropbox.com/s/rdx2xb7xczvomd1/EVENTTYPES_Housing.png?raw=1", //openSrc
      "https://www.dropbox.com/s/jamhnuor263bx8z/TILES_Housing%20%28closed%29%20%281%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class PageImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "page";
    return [
      "https://www.dropbox.com/s/vtkuoonyq8hpz4w/TILES_Pages.png?raw=1", //openSrc
      "https://www.dropbox.com/s/ne451miwhmgpvr7/TILES_Pages%20%28closed%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}
export class VenueImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    const title = "venue";
    return [
      "https://www.dropbox.com/s/h9ebdl3j1l94xkt/TILES_Venues.png?raw=1", //openSrc
      "https://www.dropbox.com/s/1uw496aac2deg0c/TILES_Venues%20%28closed%29.png?raw=1" //closeSrc
    ].map((fallback, i) =>
      make(fallback, maxWidth, "tile/" + title, i, title === tileChosen)
    );
  }
}

export const eventTypes = [
  "food",
  "business",
  "tech",
  "recreation",
  "education",
  "arts",
  "sport",
  "concert",
  "cause",
  "party & clubbing",
  "day party festival"
];
export const clubTypes = [
  "sport",
  "networking",
  "technology",
  "engineering",
  "science",
  "literature",
  "recreation",
  "arts",
  "medicine",
  "music",
  "non-profit",
  "politics"
];
export const shopTypes = [
  "clothing",
  "technology",
  "movies",
  "trinkets",
  "home furnishing",
  "tools",
  "auto",
  "grocery",
  "music",
  "appliances"
];
export const restaurantTypes = [
  "chinese",
  "italian",
  "mexican",
  "indian",
  "homestyle & fried",
  "burgers & sandwich",
  "noodles",
  "vegan & health",
  "seafood",
  "breakfast & lunch"
];
export const serviceTypes = [
  "hair, nails & tan",
  "catering",
  "lawyer",
  "mechanic"
];
export const jobTypes = [
  "tech",
  "hospitality",
  "office",
  "auto",
  "home",
  "shipping",
  "education",
  "arts",
  "medical",
  "music",
  "non-profit",
  "business"
];
export const housingTypes = [
  "stay",
  "rent",
  "+5m",
  "3-5m",
  "1-3m",
  "800-1m",
  "500-800",
  "100-500",
  "50-100",
  "<50"
];
export const pageTypes = [
  "pod",
  "radio",
  "television news",
  "series",
  "movies"
];
export const venueTypes = [
  "in theatre",
  "rewind & drive-in",
  "playwright",
  "music",
  "sport",
  "museum"
];

export class InTheatreImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "in theatre";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/fzoaumctv583rts/TILES_Theatre%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/5hjmhxfz6yxb7gd/TILES_Theatres%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class RewindAndDriveInImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "rewind & drive-in";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/9ukvuu36bk7ywnb/THEATRES_DriveIn.png?raw=1", //openSrc
        "https://www.dropbox.com/s/75t8s16wwn1iq9t/THEATRES_DriveIn%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PlaywrightImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "playwright";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/7ipwlksr4ut2jkb/THEATRES_Playwright.png?raw=1", //openSrc
        "https://www.dropbox.com/s/58xa9kg39z86431/THEATRES_Playwright%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MusicImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "music";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?raw=1", //openSrc
        "https://www.dropbox.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SportImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "sport";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/i02rrtpdd65t0fe/EVENTTYPES_Sports.png?raw=1", //openSrc
        "https://www.dropbox.com/s/psg1ctymtc17gm3/EVENTTYPES_Sports%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MuseumImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "museum";
    return (
      mount(tileChosen, "venue") &&
      [
        "https://www.dropbox.com/s/il1urm466sqrxty/THEATRES_Museum.png?raw=1", //openSrc
        "https://www.dropbox.com/s/2rxj6x3399xllfz/THEATRES_museum%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class PodImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "pod";
    return (
      mount(tileChosen, "page") &&
      [
        "https://www.dropbox.com/s/ypq72mrjbtw238z/Page_Pod.png?raw=1", //openSrc
        "https://www.dropbox.com/s/6k48msdllj75l3v/Page_pod%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class RadioImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "radio";
    return (
      mount(tileChosen, "page") &&
      [
        "https://www.dropbox.com/s/x8oujtbwjyx19tk/Page_Radio.png?raw=1", //openSrc
        "https://www.dropbox.com/s/0u7h9ca2i3p0dth/Page_radio%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TelevisionImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "television news";
    return (
      mount(tileChosen, "page") &&
      [
        "https://www.dropbox.com/s/5w75yp9j9ccmt2w/Page_Television%20News.png?raw=1", //openSrc
        "https://www.dropbox.com/s/udcrjmqwxmalvut/Page_television%20news%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SeriesImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "series";
    return (
      mount(tileChosen, "page") &&
      [
        "https://www.dropbox.com/s/0nwnkh00gtzjog4/Page_Series.png?raw=1", //openSrc
        "https://www.dropbox.com/s/bawri60wtgmh3ps/Page_series%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MoviesImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "movies";
    return (
      mount(tileChosen, "page") &&
      [
        "https://www.dropbox.com/s/hgrty3yy3h0g1x3/Page_Movies.png?raw=1", //openSrc
        "https://www.dropbox.com/s/tvfs96ne2g15xbv/Page_movies%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class StayImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "stay";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/nuwxyp8nkrdsijl/Home_Stay.png?raw=1", //openSrc
        "https://www.dropbox.com/s/8n97k78v6aqshzc/Home_stay%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class RentImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "rent";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/7d62tahiopmss5p/Home_Rent.png?raw=1", //openSrc
        "https://www.dropbox.com/s/a4x5gom04wy3n8s/Home_rent%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class Above5millionImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "+5m";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/diftejtelzh3c7w/Home_%2B5m.png?raw=1", //openSrc
        "https://www.dropbox.com/s/wxe6ahrpysihrk1/Home_%2B5m%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ThreeToFiveMilImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "3-5m";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/scvdezymmfegp1n/Home_3-5m.png?raw=1", //openSrc
        "https://www.dropbox.com/s/8ey1b4eh0omgph1/Home_3-5m%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class OneToThreeMilImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "1-3m";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/4mky5u3z1h6cn45/Home_1-3m%20%282%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/yk3fyqg82eycyzc/Home_1-3m%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class EightHundredImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "800-1m";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/omleodmo45zmgq0/Home_800-1m.png?raw=1", //openSrc
        "https://www.dropbox.com/s/1prec2tlwejquca/Home_800-1m%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class FiveToEightHunImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "500-800";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/q8qi978x1o1r28r/Home_500-800%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/tfx99kkyvzj2ntd/Home_500-800%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class OneToFiveHunImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "100-500";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/bsasoc30veriwkr/Home_100-500.png?raw=1", //openSrc
        "https://www.dropbox.com/s/1aoejilhz139yzn/Home_100-500%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class FiftyToOneHunImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "50-100";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/z6wwi960wjrjqog/Home_50-100.png?raw=1", //openSrc
        "https://www.dropbox.com/s/m2a7fa9pnv22lhh/Home_50-100%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class LessThanFiftyImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "<50";
    return (
      mount(tileChosen, "housing") &&
      [
        "https://www.dropbox.com/s/uo7ndzrhnm29v3f/Home__50.png?raw=1", //openSrc
        "https://www.dropbox.com/s/39thywimii0f9he/Home__50%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TechImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "tech";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/edom45hrd0d95pl/EVENTTYPES_Tech.png?raw=1", //openSrc
        "https://www.dropbox.com/s/nhd0inv9277p98x/EVENTTYPES_Tech%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class HospitalityImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "hospitality";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/ktra3dmnyuhojxi/EVENTTYPES_Hospitality.png?raw=1", //openSrc
        "https://www.dropbox.com/s/mmubaqhqqoi5dw5/JOBTYPES_Hospitality%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class OfficeImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "office";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/tjzlca16dxqr2ny/JOBTYPES_Office.png?raw=1", //openSrc
        "https://www.dropbox.com/s/abxdu6w3mqyi1oq/JOBTYPES_Office%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class AutoImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "auto";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/b6c0x11l4emtj9n/JOBTYPES_Auto%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/uj7uc1tqwo0jsld/JOBTYPES_Auto%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class HomeImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "home";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/4498iuzqefwxhk8/JOBTYPES_Home.png?raw=1", //openSrc
        "https://www.dropbox.com/s/9z6jua7duld622y/JOBTYPES_Home%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class ShippingImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "shipping";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/oaa94zj64ag2q9u/JOBTYPES_Shipping%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/9i2q3gtss8cr96c/JOBTYPES_Shipping%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class EducationImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "education";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/rv27bbh015odcwh/EVENTTYPES_Educational.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ux354kb91c151e6/EVENTTYPES_Educational%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class ArtsImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "arts";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?raw=1", //openSrc
        "https://www.dropbox.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class MedicalImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "medical";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/x3y63skfcjznhi9/JOBTYPES_Medical.png?raw=1", //openSrc
        "https://www.dropbox.com/s/a3xpjlfd8a4kjnh/JOBTYPES_Medical%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class MusicJobImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "music";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?raw=1", //openSrc
        "https://www.dropbox.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class NonProfitImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "non-profit";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/bfgivqwg9nmpyni/JOBTYPES_NonProfit.png?raw=1", //openSrc
        "https://www.dropbox.com/s/yhfuorswx08zdkc/JOBTYPES_Nonprofit%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class BusinessImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "business";
    return (
      mount(tileChosen, "job") &&
      [
        "https://www.dropbox.com/s/9gjpuf6b2s2sbuv/Copy%20of%20EVENTTYPES_Business.png?raw=1", //openSrc
        "https://www.dropbox.com/s/5mcj3n7ktcm6am3/EVENTTYPES_Business%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class ChineseImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "chinese";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/qo55pj6fceccbpt/Restaurants_chinese.png?raw=1", //openSrc
        "https://www.dropbox.com/s/2rwcfhtspkdwkqb/Restaurants_Chinese%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ItalianImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "italian";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/djo0vlzkdr6bypg/Restaurants_italian.png?raw=1", //openSrc
        "https://www.dropbox.com/s/isq40y1smr70thd/Restaurants_Italian%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MexicanImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "mexican";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/jdm6kl3l3wo74r9/Restaurants_mexican.png?raw=1", //openSrc
        "https://www.dropbox.com/s/vxzoaq7n2m53qlo/Restaurants_Mexican%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class IndianImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "indian";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/jbe7jcwo5rmi7eb/Restaurants_indian.png?raw=1", //openSrc
        "https://www.dropbox.com/s/whw9m4wz21c2box/Restaurants_Indian%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class HomeStyleImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "homestyle & fried";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/q7djmpv7gio055g/Restaurants_homestyle%20.png?raw=1", //openSrc
        "https://www.dropbox.com/s/mf7nzlj8y4f05qy/Restaurants_Homestyle%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class BurgerAndSandwichImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "burger & sandwich";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/ndbfyeolgrsvgi8/Restaurants_burgersSand.png?raw=1", //openSrc
        "https://www.dropbox.com/s/zm4kcp530cmyoy9/Restaurants_BurgersSand%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class NoodlesImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "noodles";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/9c3sk2ji5uw1egb/Restaurants_noodles.png?raw=1", //openSrc
        "https://www.dropbox.com/s/quvahl7cy0523p9/Restaurants_Noodles%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class VeganOrHealthImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "vegan & health";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/doxavaipyloryal/Restaurants_vegan%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/sygqcgjtdy9b26n/Restaurants_Vegan%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SeafoodImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "seafood";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/iughdp3v38ns39u/Restaurants_seafood.png?raw=1", //openSrc
        "https://www.dropbox.com/s/7l7h2we28f5t0k5/Restaurants_Seafood%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class BreakfastOrLunchImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "breakfast & lunch";
    return (
      mount(tileChosen, "restaurant") &&
      [
        "https://www.dropbox.com/s/exnvc1p9t2zclmr/Restaurants_brunch.png?raw=1", //openSrc
        "https://www.dropbox.com/s/vuzt1ihvpbe3e63/Restaurants_Brunch%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class ClothingImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "clothing";
    return (
      mount(tileChosen, "shop") &&
      [
        //help fix new
        "https://www.dropbox.com/s/499sb386845r6lh/Shop_Clothing.png?raw=1", //openSrc
        "https://www.dropbox.com/s/d3lffcpriyq4be2/Copy%20of%20Shop_Trinkets%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TechnologyImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "technology";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/98l76mpbg2bejg8/Shop_Tech.png?raw=1", //openSrc
        "https://www.dropbox.com/s/l2kjjqanvpl53jc/Shop_Tech%20%28closed%29%20%282%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MoviesShopImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "movies";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/98q9s1oscoxpfzj/Shop_Movies%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/nb1vm7lw05z4d1q/Shop_Movies%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TrinketsImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "trinkets";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/3rodgol634pu1tv/Shop_Trinkets.png?raw=1", //openSrc
        "https://www.dropbox.com/s/qpfsgr13wuxr54r/Shop_Trinkets%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class HomeFurnishingImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "home furnishing";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/dpz63l7gv7s3d6m/Shop_Furnishings.png?raw=1", //openSrc
        "https://www.dropbox.com/s/sr9aiejo3gms3br/Shop_Furnishings%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ToolsImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "tools";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/qysayn6mkh7skh0/Shop_Tools.png?raw=1", //openSrc
        "https://www.dropbox.com/s/g6r6daqvl1ogwlz/Shop_Tools%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class AutoShopImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "auto";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/on4zaozfpjmtwf0/Shop_Auto.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ymn2h79wxeipt0k/Shop_Auto%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class GroceryImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "grocery";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/jgou00oxsstc6uz/Shop_Grocery.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ygj1jgba04i9q7g/Shop_Grocery%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MusicShopImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "music";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?raw=1", //openSrc
        "https://www.dropbox.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class AppliancesImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "appliances";
    return (
      mount(tileChosen, "shop") &&
      [
        "https://www.dropbox.com/s/sokzc613wci8ynx/Shop_Appliance.png?raw=1", //openSrc
        "https://www.dropbox.com/s/yxjzfdner06aago/Shop_Appliance%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SportClubImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "sport";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/yj6vf1qt98pez87/EVENTTYPES_Sports%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/t10tus4h6y0cmls/EVENTTYPES_Sports%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class NetworkingImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "networking";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/mobc6ainpq8p3ug/EVENTTYPES_Business%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/i75t7vx8zq6i12a/EVENTTYPES_Business%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TechnologyClubImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "technology";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/lnmkoax9r5ka7t6/EVENTTYPES_Tech%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/cxz7n8sbsngycub/EVENTTYPES_Tech%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class EngineeringImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "engineering";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/w1smbgsn4o6pfbe/CLUBTYPES_Engineering.png?raw=1", //openSrc
        "https://www.dropbox.com/s/y9nauqg3bh74yr0/CLUBTYPES_Engineering%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ScienceImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "science";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/2wg5ihw7t0gh7fg/CLUBTYPES_Science.png?raw=1", //openSrc
        "https://www.dropbox.com/s/3wjccgen8yhqioz/CLUBTYPES_Science%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class LiteratureImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "literature";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/4linrqervqomnsx/CLUBTYPES_Literature.png?raw=1", //openSrc
        "https://www.dropbox.com/s/8oiubhytzy8mf11/CLUBTYPES_Literature%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class RecreationImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "recreation";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/t1k7iwlc5an27lw/EVENTTYPES_Recreational%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/6e89puq3qf9gkyn/EVENTTYPES_Recreational%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ArtsClubImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "arts";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?raw=1", //openSrc
        "https://www.dropbox.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MedicineImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "medicine";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/bmf4gg21nwmnh0d/CLUBTYPES_Medicine.png?raw=1", //openSrc
        "https://www.dropbox.com/s/6xrfdkosnvjk5ei/CLUBTYPES_Medicine%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class MusicClubImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "music";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?raw=1", //openSrc
        "https://www.dropbox.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class NonProfitClubImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "non-profit";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/bfgivqwg9nmpyni/JOBTYPES_NonProfit.png?raw=1", //openSrc
        "https://www.dropbox.com/s/yhfuorswx08zdkc/JOBTYPES_Nonprofit%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PoliticsImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "politics";
    return (
      mount(tileChosen, "club") &&
      [
        "https://www.dropbox.com/s/fph372menxc3w06/CLUBTYPES_Politics.png?raw=1", //openSrc
        "https://www.dropbox.com/s/0xx0a7aog77624p/CLUBTYPES_Politics%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class NewPostImg extends React.Component {
  render() {
    const { commtype, maxWidth } = this.props;
    const title = "new";
    return (
      //mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/zhyxqqhboxu9mxf/ForumFilter_New.png?raw=1", //openSrc
        "https://www.dropbox.com/s/25830k7pg9p9r9j/ForumFILTER_New%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, "forum/" + title, i, title === commtype)
      )
    );
  }
}

export class LessonImg extends React.Component {
  render() {
    const { commtype, maxWidth } = this.props;
    const title = "lesson";
    return (
      //mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/8l4rp5jo7hogi7n/FORUM_Lessons.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ec48bpko5dvaffg/FORUM_Lessons%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, "forum/" + title, i, title === commtype)
      )
    );
  }
}
export class ShowImg extends React.Component {
  render() {
    const { commtype, maxWidth } = this.props;
    const title = "show";
    return (
      //mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/ywl85onmrjggpcg/FORUM_Shows%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/jfr1sk3av6mcxbd/FORUM_Shows%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, "forum/" + title, i, title === commtype)
      )
    );
  }
}
export class GameImg extends React.Component {
  render() {
    const { commtype, maxWidth } = this.props;
    const title = "game";
    return (
      //mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/740qp9i1aeqoqqv/FORUM_Games.png?raw=1", //openSrc
        "https://www.dropbox.com/s/q96i4pcout6fs9c/FORUM_Games%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, "forum/" + title, i, title === commtype)
      )
    );
  }
}

/*commtype === "active" ? (
  <img
    className="eventtypesselected"
    //onClick={this.tileChoose2}
    src="https://www.dropbox.com/s/aozn4kxsfwp3o45/ForumFilter_Active.png?raw=1"
    alt="error"
    id="active"
  />
) : (
  <img
    className="eventtypesnotselected"
    //onClick={this.tileChoose2}
    src="https://www.dropbox.com/s/ckz8m807xbbyndn/ForumFILTER_Active%20%28closed%29.png?raw=1"
    alt="error"
    id="active"
  />
)}
{commtype === "saved" ? (
  <img
    className="eventtypesselected"
    //onClick={this.tileChoose3}
    src="https://www.dropbox.com/s/obzgj0md6578czm/ForumFilter_Saved.png?raw=1"
    alt="error"
    id="saved"
  />
) : (
  <img
    className="eventtypesnotselected"
    //onClick={this.tileChoose3}
    src="https://www.dropbox.com/s/w0rf0ufxqef4x07/ForumFILTER_Saved%20%28closed%29%20%281%29.png?raw=1"
    alt="error"
    id="saved"
  />
)*/
//forum
export class NewCommPostImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "forum";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/zhyxqqhboxu9mxf/ForumFilter_New.png?raw=1", //openSrc
        "https://www.dropbox.com/s/25830k7pg9p9r9j/ForumFILTER_New%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
/*commtype === "active" ? (
  <img
    className="eventtypesselected"
    src="https://www.dropbox.com/s/aozn4kxsfwp3o45/ForumFilter_Active.png?raw=1"
    alt="error"
    id="active"
  />
) : (
  <img
    className="eventtypesnotselected"
    src="https://www.dropbox.com/s/ckz8m807xbbyndn/ForumFILTER_Active%20%28closed%29.png?raw=1"
    alt="error"
    id="active"
  />
)}
{commtype === "saved" ? (
  <img
    className="eventtypesselected"
    src="https://www.dropbox.com/s/obzgj0md6578czm/ForumFilter_Saved.png?raw=1"
    alt="error"
    id="saved"
  />
) : (
  <img
    className="eventtypesnotselected"
    src="https://www.dropbox.com/s/w0rf0ufxqef4x07/ForumFILTER_Saved%20%28closed%29%20%281%29.png?raw=1"
    alt="error"
    id="saved"
  />
)*/
export class FormsAndPermitsImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "form";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/h2o233ymoo684zh/ForumFilter_Forms%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/s2mej1vatctb6c1/ForumFILTER_Forms%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
export class OrdinanceImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "ordinance";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/gd053a7518whzul/ForumFILTER_Notices%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/sd5y9k6kn2l32sk/ForumFILTER_Notices%20%28closed%29%20%282%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(
          fallback,
          maxWidth,
          tileChosen + "/" + title,
          i,
          title === commtype
        )
      )
    );
  }
}
export class BudgetProposalImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "budget";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/0te7pw11fj9vhl9/ForumFilter_Polls%20%281%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/fdk3zxnfpzq00dl/ForumFilter_Polls%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
export class ElectionImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "election";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/my90auj0bfx38nh/ForumFILTER_Elections.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ndtfg6rpyc55d0f/ForumFILTER_Elections%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
export class CourtCaseImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "case";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/ydevlvzn6hfr7bd/ForumFILTER_CourtCase.png?raw=1", //openSrc
        "https://www.dropbox.com/s/50f24410cu6ng01/ForumFILTER_CourtCase%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
export class ClassImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "class";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/z67pb6ahfptah3z/ForumFILTER_Classes.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ftevpdzn72udcmv/ForumFILTER_Classes%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, commtype + "/" + title, i, title === commtype)
      )
    );
  }
}
export class DepartmentImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    const title = "department";
    return (
      mount(tileChosen, "commtype") &&
      [
        "https://www.dropbox.com/s/e99u2x4fg2fl21q/ForumFILTER_Departments.png?raw=1", //openSrc
        "https://www.dropbox.com/s/sijy9a7ux1g0lac/ForumFILTER_Departments%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(
          fallback,
          maxWidth,
          tileChosen + "/" + title,
          i,
          title === commtype
        )
      )
    );
  }
}

export class FoodImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "food";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/z78oeh1t63yt21y/EVENTTYPES_Food.png?raw=1", //openSrc
        "https://www.dropbox.com/s/hho9wzzxj9ffsip/EVENTTYPES_Food%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class BusinessEventImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "business";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/4ybgp4auh1lhxh2/EVENTTYPES_Business.png?raw=1", //openSrc
        "https://www.dropbox.com/s/5mcj3n7ktcm6am3/EVENTTYPES_Business%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class TechEventImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "tech";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/edom45hrd0d95pl/EVENTTYPES_Tech.png?raw=1", //openSrc
        "https://www.dropbox.com/s/nhd0inv9277p98x/EVENTTYPES_Tech%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}

export class RecreationEventImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "recreation";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/9pqf8zpkdsxllrq/EVENTTYPES_Recreational.png?raw=1", //openSrc
        "https://www.dropbox.com/s/qpz15r5kedt0oga/EVENTTYPES_Recreational%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class EducationEventImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "education";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/rv27bbh015odcwh/EVENTTYPES_Educational.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ux354kb91c151e6/EVENTTYPES_Educational%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ArtsEventImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "arts";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?raw=1", //openSrc
        "https://www.dropbox.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class SportsImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "sport";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/i02rrtpdd65t0fe/EVENTTYPES_Sports.png?raw=1", //openSrc
        "https://www.dropbox.com/s/psg1ctymtc17gm3/EVENTTYPES_Sports%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class ConcertImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "concert";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/9vcq3tiuwiqzt0k/EVENTTYPES_Concerts.png?raw=1", //openSrc
        "https://www.dropbox.com/s/71r5fn5nxmpzu2y/EVENTTYPES_Concerts%20%28closed%29%20%281%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class CauseImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "cause";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/e166m8dq57xcutj/EVENTTYPES_Causes.png?raw=1", //openSrc
        "https://www.dropbox.com/s/ezfawkuhltuux07/EVENTTYPES_Causes%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class PartyAndClubbingImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "party & clubbing";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/7lr57eh3izkujkd/EVENTTYPES_Clubbing.png?raw=1", //openSrc
        "https://www.dropbox.com/s/owmltm2bbmeceeq/EVENTTYPES_Clubbing%20%28closed%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
export class DayPartyFestivalImg extends React.Component {
  render() {
    const { subtype, maxWidth, tileChosen } = this.props;
    const title = "day party festival";
    return (
      mount(tileChosen, "event") &&
      [
        "https://www.dropbox.com/s/7mra7xku4uowd1a/EVENTTYPES_Social_%20%284%29.png?raw=1", //openSrc
        "https://www.dropbox.com/s/wa5lc899vsg6bog/EVENTTYPES_Social%20%28closed%29%20%284%29.png?raw=1" //closeSrc
      ].map((fallback, i) =>
        make(fallback, maxWidth, tileChosen + "/" + title, i, title === subtype)
      )
    );
  }
}
