import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';
import { SprintTypes } from 'stage-profile-maker/src/enums/SprintTypes.ts';
import { IconPosition, LabelPosition } from '../../../src/enums/SprintPositions';

export const tourPreset: Config = {
  width: 1300,
  height: 400,
  topMargin: 400,

  pointCount: 400,

  body: {
    color: '#FEEC02',
  },
  elevationGrid: {
    overProfileOnly: true,
    width: 2,
    interval: 100,
    color: '#F0D600'
  },
  start: {
    iconPosition: IconPosition.BeforeLabel,
    labelPosition: LabelPosition.Body,
    color: "#000000",
    width: 2,
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 20,
      fontColor: "#000000"
    },
    fixToTop: true,
    rotation: 90,
    name: "Marseille",
    icon: {
      src: "/stage-profile-maker/icons/tour/tour_start.png",
      width: 28,
      height: 28
    }
  },
  finish: {
    iconPosition: IconPosition.BeforeLabel,
    labelPosition: LabelPosition.Body,
    color: "#000000",
    width: 2,
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 20,
      fontColor: "#000000"
    },
    fixToTop: true,
    rotation: 90,
    name: "Marseille",
    icon: {
      src: "/stage-profile-maker/icons/tour/tour_finish.png",
      width: 28,
      height: 28
    }
  },
  sprint: {
    iconPosition: IconPosition.BeforeLabel,
    labelPosition: LabelPosition.Body,
    color: "#000000",
    width: 2,
    dasharray: "4 4",
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 16,
      fontColor: "#000000"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 16,
      fontColor: "#000000"
    },
    icons: {
      [SprintTypes.Sprint]: {
        src: "/stage-profile-maker/icons/tour/tour_sprint.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb]: {
        src: "/stage-profile-maker/icons/tour/tour_climb.png",
        width: 28,
        height: 28
      },
      [SprintTypes.ClimbHC]: {
        src: "/stage-profile-maker/icons/tour/tour_hc.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb1]: {
        src: "/stage-profile-maker/icons/tour/tour_1.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb2]: {
        src: "/stage-profile-maker/icons/tour/tour_2.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb3]: {
        src: "/stage-profile-maker/icons/tour/tour_3.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb4]: {
        src: "/stage-profile-maker/icons/tour/tour_4.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Bonification]: {
        src: "/stage-profile-maker/icons/tour/tour_bonif.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Feeding]: {
        src: "/stage-profile-maker/icons/tour/tour_ravito.png",
        width: 28,
        height: 28
      },
      [SprintTypes.TimeTrial]: {
        src: "/stage-profile-maker/icons/tour/tour_time.png",
        width: 28,
        height: 28
      }
    },
    fixToTop: true,
    rotation: 90
  },
  bottomDistance: {
    backgroundColor: "#000000",
    font: {
      fontFamilly: "Arial",
      fontSize: 18,
      fontColor: "#FEEC02",
      fontWeight: "bold"
    }
  },
}