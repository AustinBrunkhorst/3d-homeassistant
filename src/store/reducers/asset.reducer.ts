import * as THREE from "three";
import { AssetMetadata } from "../asset.model";

const modelAssets = [
  "campfire_large.gltf",
  "campfire_small.gltf",
  "campfireStones_blocks.gltf",
  "campfireStones_rocks.gltf",
  "canoe.gltf",
  "canoe_paddle.gltf",
  "cliffBrown.gltf",
  "cliffBrown_block.gltf",
  "cliffBrown_blockHalf.gltf",
  "cliffBrown_blockQuarter.gltf",
  "cliffBrown_cornerInnerMid.gltf",
  "cliffBrown_cornerInnerTop.gltf",
  "cliffBrown_cornerMid.gltf",
  "cliffBrown_cornerTop.gltf",
  "cliffBrown_entrance.gltf",
  "cliffBrown_half.gltf",
  "cliffBrown_halfCorner.gltf",
  "cliffBrown_halfCornerInner.gltf",
  "cliffBrown_steps.gltf",
  "cliffBrown_stepsCornerInner.gltf",
  "cliffBrown_stepsEnd.gltf",
  "cliffBrown_top.gltf",
  "cliffBrown_waterfallMid.gltf",
  "cliffBrown_waterfallTop.gltf",
  "cliffGrey.gltf",
  "cliffGrey_block.gltf",
  "cliffGrey_blockHalf.gltf",
  "cliffGrey_blockQuarter.gltf",
  "cliffGrey_cornerInnerMid.gltf",
  "cliffGrey_cornerInnerTop.gltf",
  "cliffGrey_cornerMid.gltf",
  "cliffGrey_cornerTop.gltf",
  "cliffGrey_entrance.gltf",
  "cliffGrey_half.gltf",
  "cliffGrey_halfCorner.gltf",
  "cliffGrey_halfCornerInner.gltf",
  "cliffGrey_steps.gltf",
  "cliffGrey_stepsCornerInner.gltf",
  "cliffGrey_stepsEnd.gltf",
  "cliffGrey_top.gltf",
  "cliffGrey_waterfallMid.gltf",
  "cliffGrey_waterfallTop.gltf",
  "fence.gltf",
  "fence_corner.gltf",
  "fence_cornerRound.gltf",
  "fence_cornerRoundStrong.gltf",
  "fence_diagonal.gltf",
  "fence_diagonalStrong.gltf",
  "fence_double.gltf",
  "fence_gate.gltf",
  "fence_simple.gltf",
  "fence_simpleHigh.gltf",
  "fence_simpleLow.gltf",
  "fence_strong.gltf",
  "flower_beige1.gltf",
  "flower_beige2.gltf",
  "flower_beige3.gltf",
  "flower_blue1.gltf",
  "flower_blue2.gltf",
  "flower_blue3.gltf",
  "flower_red1.gltf",
  "flower_red2.gltf",
  "flower_red3.gltf",
  "grass.gltf",
  "grass_dense.gltf",
  "ground_dirt.gltf",
  "ground_dirtRiver.gltf",
  "ground_dirtRiverBanks.gltf",
  "ground_dirtRiverCorner.gltf",
  "ground_dirtRiverCornerBank.gltf",
  "ground_dirtRiverCornerInner.gltf",
  "ground_dirtRiverCrossing.gltf",
  "ground_dirtRiverEnd.gltf",
  "ground_dirtRiverEntrance.gltf",
  "ground_dirtRiverRocks.gltf",
  "ground_dirtRiverSide.gltf",
  "ground_dirtRiverSideCorner.gltf",
  "ground_dirtRiverT.gltf",
  "ground_dirtRiverTile.gltf",
  "ground_dirtRiverWater.gltf",
  "hanging_moss.gltf",
  "lily_large.gltf",
  "lily_small.gltf",
  "log_large.gltf",
  "log_small.gltf",
  "logs_stack.gltf",
  "logs_stackLarge.gltf",
  "mushroom_brown.gltf",
  "mushroom_brownGroup.gltf",
  "mushroom_brownTall.gltf",
  "mushroom_red.gltf",
  "mushroom_redGroup.gltf",
  "mushroom_redTall.gltf",
  "palm_large.gltf",
  "palm_small.gltf",
  "palmDetailed_large.gltf",
  "palmDetailed_small.gltf",
  "plant_bush.gltf",
  "plant_bushDetailed.gltf",
  "plant_bushLarge.gltf",
  "plant_bushSmall.gltf",
  "plant_flatLarge.gltf",
  "plant_flatSmall.gltf",
  "pumpkin.gltf",
  "rock_large1.gltf",
  "rock_large2.gltf",
  "rock_large3.gltf",
  "rock_large4.gltf",
  "rock_large5.gltf",
  "rock_large6.gltf",
  "rock_small1.gltf",
  "rock_small2.gltf",
  "rock_small3.gltf",
  "rock_small4.gltf",
  "rock_small5.gltf",
  "rock_small6.gltf",
  "rock_small7.gltf",
  "rock_small8.gltf",
  "rock_small9.gltf",
  "rock_smallFlat1.gltf",
  "rock_smallFlat2.gltf",
  "rock_smallFlat3.gltf",
  "rock_smallTop1.gltf",
  "rock_smallTop2.gltf",
  "rock_tall1.gltf",
  "rock_tall2.gltf",
  "rock_tall3.gltf",
  "rock_tall4.gltf",
  "rock_tall5.gltf",
  "rock_tall6.gltf",
  "rock_tall7.gltf",
  "rock_tall8.gltf",
  "rock_tall9.gltf",
  "rock_tall10.gltf",
  "stone_block.gltf",
  "stone_column.gltf",
  "stone_large1.gltf",
  "stone_large2.gltf",
  "stone_large3.gltf",
  "stone_large4.gltf",
  "stone_large5.gltf",
  "stone_large6.gltf",
  "stone_obelisk.gltf",
  "stone_small1.gltf",
  "stone_small2.gltf",
  "stone_small3.gltf",
  "stone_small4.gltf",
  "stone_small5.gltf",
  "stone_small6.gltf",
  "stone_small7.gltf",
  "stone_small8.gltf",
  "stone_small9.gltf",
  "stone_smallFlat1.gltf",
  "stone_smallFlat2.gltf",
  "stone_smallFlat3.gltf",
  "stone_smallTop1.gltf",
  "stone_smallTop2.gltf",
  "stone_statue.gltf",
  "stone_tall1.gltf",
  "stone_tall2.gltf",
  "stone_tall3.gltf",
  "stone_tall4.gltf",
  "stone_tall5.gltf",
  "stone_tall6.gltf",
  "stone_tall7.gltf",
  "stone_tall8.gltf",
  "stone_tall9.gltf",
  "stone_tall10.gltf",
  "tent_detailedClosed.gltf",
  "tent_detailedOpen.gltf",
  "tent_smallClosed.gltf",
  "tent_smallOpen.gltf",
  "tree_blocks.gltf",
  "tree_blocks_dark.gltf",
  "tree_blocks_fall.gltf",
  "tree_default.gltf",
  "tree_default_dark.gltf",
  "tree_default_fall.gltf",
  "tree_detailed.gltf",
  "tree_detailed_dark.gltf",
  "tree_detailed_fall.gltf",
  "tree_oak.gltf",
  "tree_oak_dark.gltf",
  "tree_oak_fall.gltf",
  "tree_pine_short.gltf",
  "tree_pine_short_detailed.gltf",
  "tree_pine_shortSquare.gltf",
  "tree_pine_shortSquare_detailed.gltf",
  "tree_pine_tall.gltf",
  "tree_pine_tall_detailed.gltf",
  "tree_pine_tallSquare.gltf",
  "tree_pine_tallSquare_detailed.gltf",
  "tree_pineSmall_round1.gltf",
  "tree_pineSmall_round2.gltf",
  "tree_pineSmall_round3.gltf",
  "tree_pineSmall_round4.gltf",
  "tree_pineSmall_round5.gltf",
  "tree_pineSmall_square1.gltf",
  "tree_pineSmall_square2.gltf",
  "tree_pineSmall_square3.gltf",
  "tree_plateau.gltf",
  "tree_plateau_dark.gltf",
  "tree_plateau_fall.gltf",
  "tree_short.gltf",
  "tree_short_dark.gltf",
  "tree_short_fall.gltf",
  "tree_simple.gltf",
  "tree_simple_dark.gltf",
  "tree_simple_fall.gltf",
  "tree_small.gltf",
  "tree_small_dark.gltf",
  "tree_small_fall.gltf",
  "tree_tall.gltf",
  "tree_tall_dark.gltf",
  "tree_tall_fall.gltf",
  "tree_thin.gltf",
  "tree_thin_dark.gltf",
  "tree_thin_fall.gltf",
  "treeStump.gltf",
  "treeStump_deep.gltf",
  "treeStump_deep_side.gltf",
  "treeStump_old.gltf",
  "treeStump_round.gltf",
  "treeStump_round_side.gltf",
  "treeStump_side.gltf",
  "wheat.gltf",
  "bathroomCabinet.glb",
  "bathroomCabinetDrawer.glb",
  "bathroomMirror.glb",
  "bathroomSink.glb",
  "bathroomSinkSquare.glb",
  "bathtub.glb",
  "bear.glb",
  "bedBunk.glb",
  "bedDouble.glb",
  "bedSingle.glb",
  "bench.glb",
  "benchCushion.glb",
  "benchCushionLow.glb",
  "bookcaseClosed.glb",
  "bookcaseClosedDoors.glb",
  "bookcaseClosedWide.glb",
  "bookcaseOpen.glb",
  "bookcaseOpenLow.glb",
  "books.glb",
  "cabinetBed.glb",
  "cabinetBedDrawer.glb",
  "cabinetBedDrawerTable.glb",
  "cabinetTelevision.glb",
  "cabinetTelevisionDoors.glb",
  "cardboardBoxClosed.glb",
  "cardboardBoxOpen.glb",
  "ceilingFan.glb",
  "chair.glb",
  "chairCushion.glb",
  "chairDesk.glb",
  "chairModernCushion.glb",
  "chairModernFrameCushion.glb",
  "chairRounded.glb",
  "coatRack.glb",
  "coatRackStanding.glb",
  "computerKeyboard.glb",
  "computerMouse.glb",
  "computerScreen.glb",
  "desk.glb",
  "deskCorner.glb",
  "doorway.glb",
  "doorwayFront.glb",
  "doorwayOpen.glb",
  "dryer.glb",
  "floorCorner.glb",
  "floorCornerRound.glb",
  "floorFull.glb",
  "floorHalf.glb",
  "hoodLarge.glb",
  "hoodModern.glb",
  "kitchenBar.glb",
  "kitchenBarEnd.glb",
  "kitchenBlender.glb",
  "kitchenCabinet.glb",
  "kitchenCabinetCornerInner.glb",
  "kitchenCabinetCornerRound.glb",
  "kitchenCabinetDrawer.glb",
  "kitchenCabinetUpper.glb",
  "kitchenCabinetUpperCorner.glb",
  "kitchenCabinetUpperDouble.glb",
  "kitchenCabinetUpperLow.glb",
  "kitchenCoffeeMachine.glb",
  "kitchenFridge.glb",
  "kitchenFridgeBuiltIn.glb",
  "kitchenFridgeLarge.glb",
  "kitchenFridgeSmall.glb",
  "kitchenMicrowave.glb",
  "kitchenSink.glb",
  "kitchenStove.glb",
  "kitchenStoveElectric.glb",
  "lampRoundFloor.glb",
  "lampRoundTable.glb",
  "lampSquareCeiling.glb",
  "lampSquareFloor.glb",
  "lampSquareTable.glb",
  "lampWall.glb",
  "laptop.glb",
  "loungeChair.glb",
  "loungeChairRelax.glb",
  "loungeDesignChair.glb",
  "loungeDesignSofa.glb",
  "loungeDesignSofaCorner.glb",
  "loungeSofa.glb",
  "loungeSofaCorner.glb",
  "loungeSofaLong.glb",
  "loungeSofaOttoman.glb",
  "paneling.glb",
  "pillow.glb",
  "pillowBlue.glb",
  "pillowBlueLong.glb",
  "pillowLong.glb",
  "plantSmall1.glb",
  "plantSmall2.glb",
  "plantSmall3.glb",
  "pottedPlant.glb",
  "radio.glb",
  "rugDoormat.glb",
  "rugRectangle.glb",
  "rugRound.glb",
  "rugRounded.glb",
  "rugSquare.glb",
  "shower.glb",
  "showerRound.glb",
  "sideTable.glb",
  "sideTableDrawers.glb",
  "speaker.glb",
  "speakerSmall.glb",
  "stairs.glb",
  "stairsCorner.glb",
  "stairsOpen.glb",
  "stairsOpenSingle.glb",
  "stoolBar.glb",
  "stoolBarSquare.glb",
  "table.glb",
  "tableCloth.glb",
  "tableCoffee.glb",
  "tableCoffeeGlass.glb",
  "tableCoffeeGlassSquare.glb",
  "tableCoffeeSquare.glb",
  "tableCross.glb",
  "tableCrossCloth.glb",
  "tableGlass.glb",
  "tableRound.glb",
  "televisionAntenna.glb",
  "televisionModern.glb",
  "televisionVintage.glb",
  "toaster.glb",
  "toilet.glb",
  "toiletSquare.glb",
  "trashcan.glb",
  "wall.glb",
  "wallCorner.glb",
  "wallCornerRond.glb",
  "wallDoorway.glb",
  "wallDoorwayWide.glb",
  "wallHalf.glb",
  "wallWindow.glb",
  "wallWindowSlide.glb",
  "washer.glb",
  "washerDryerStacked.glb",
  "bamboo.gltf",
  "bridge_arch.gltf",
  "bridge_straight.gltf",
  "cactus_large.gltf",
  "cactus_short.gltf",
  "cactus_tall.gltf"
];

const initialState: AssetMetadata[] = modelAssets.sort().map(path => {
  const [basename] = path.split(".");

  return {
    guid: THREE.Math.generateUUID(),
    title: basename
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/([A-Z])/g, match => ` ${match}`)
      .replace(/^./, match => match.toUpperCase())
      .trim(),
    thumbnail: `/models/${basename}.png`,
    model: `/models/${path}`
  };
});

export function reducer(state = initialState, action) {
  return state;
}
