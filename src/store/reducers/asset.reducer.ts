import { PropAsset } from "../prop.model";

const propNames = [
  "washerDryerStacked",
  "bathroomCabinet",
  "bathroomCabinetDrawer",
  "bathroomMirror",
  "bathroomSink",
  "bathroomSinkSquare",
  "bathtub",
  "bear",
  "bedBunk",
  "bedDouble",
  "bedSingle",
  "bench",
  "benchCushion",
  "benchCushionLow",
  "bookcaseClosed",
  "bookcaseClosedDoors",
  "bookcaseClosedWide",
  "bookcaseOpen",
  "bookcaseOpenLow",
  "books",
  "cabinetBed",
  "cabinetBedDrawer",
  "cabinetBedDrawerTable",
  "cabinetTelevision",
  "cabinetTelevisionDoors",
  "cardboardBoxClosed",
  "cardboardBoxOpen",
  "ceilingFan",
  "chair",
  "chairCushion",
  "chairDesk",
  "chairModernCushion",
  "chairModernFrameCushion",
  "chairRounded",
  "coatRack",
  "coatRackStanding",
  "computerKeyboard",
  "computerMouse",
  "computerScreen",
  "desk",
  "deskCorner",
  "doorway",
  "doorwayFront",
  "doorwayOpen",
  "dryer",
  "floorCorner",
  "floorCornerRound",
  "floorFull",
  "floorHalf",
  "hoodLarge",
  "hoodModern",
  "kitchenBar",
  "kitchenBarEnd",
  "kitchenBlender",
  "kitchenCabinet",
  "kitchenCabinetCornerInner",
  "kitchenCabinetCornerRound",
  "kitchenCabinetDrawer",
  "kitchenCabinetUpper",
  "kitchenCabinetUpperCorner",
  "kitchenCabinetUpperDouble",
  "kitchenCabinetUpperLow",
  "kitchenCoffeeMachine",
  "kitchenFridge",
  "kitchenFridgeBuiltIn",
  "kitchenFridgeLarge",
  "kitchenFridgeSmall",
  "kitchenMicrowave",
  "kitchenSink",
  "kitchenStove",
  "kitchenStoveElectric",
  "lampRoundFloor",
  "lampRoundTable",
  "lampSquareCeiling",
  "lampSquareFloor",
  "lampSquareTable",
  "lampWall",
  "laptop",
  "loungeChair",
  "loungeChairRelax",
  "loungeDesignChair",
  "loungeDesignSofa",
  "loungeDesignSofaCorner",
  "loungeSofa",
  "loungeSofaCorner",
  "loungeSofaLong",
  "loungeSofaOttoman",
  "paneling",
  "pillow",
  "pillowBlue",
  "pillowBlueLong",
  "pillowLong",
  "plantSmall1",
  "plantSmall2",
  "plantSmall3",
  "pottedPlant",
  "radio",
  "rugDoormat",
  "rugRectangle",
  "rugRound",
  "rugRounded",
  "rugSquare",
  "shower",
  "showerRound",
  "sideTable",
  "sideTableDrawers",
  "speaker",
  "speakerSmall",
  "stairs",
  "stairsCorner",
  "stairsOpen",
  "stairsOpenSingle",
  "stoolBar",
  "stoolBarSquare",
  "table",
  "tableCloth",
  "tableCoffee",
  "tableCoffeeGlass",
  "tableCoffeeGlassSquare",
  "tableCoffeeSquare",
  "tableCross",
  "tableCrossCloth",
  "tableGlass",
  "tableRound",
  "televisionAntenna",
  "televisionModern",
  "televisionVintage",
  "toaster",
  "toilet",
  "toiletSquare",
  "trashcan",
  "wall",
  "wallCorner",
  "wallCornerRond",
  "wallDoorway",
  "wallDoorwayWide",
  "wallHalf",
  "wallWindow",
  "wallWindowSlide",
  "washer"
];

const initialState: PropAsset[] = propNames.sort().map(name => ({
  title: name
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase())
    .trim(),
  thumbnail: `/models/${name}.png`,
  model: ""
}));

export function reducer(state = initialState, action) {
  return state;
}
