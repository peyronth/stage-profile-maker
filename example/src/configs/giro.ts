import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';
import { SprintTypes } from 'stage-profile-maker/src/enums/SprintTypes.ts';

export const giroPreset: Config = {
  width: 1300,
  height: 400,
  topMargin: 400,

  pointCount: 200,

  body: {
    color: '#FAF8EC',
  },

  mainLine: {
    color: '#C34074',
    width: 2.5,
  },

  body3D: {
    retreat: [-8, -4],
    color: '#A3A7AA'
  },

  line3D: {
    color: '#000000',
    width: 2.5,
  },


  elevationGrid: {
    overProfileOnly: true,
    dasharray: '1 5',
    width: 1,
    interval: 200,
    color: '#000000'
  },
  start: {
    color: "#000000",
    width: 6,
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "Marseille",
    icon: {
      src: "/stage-profile-maker/icons/tour/tour_start.png",
      width: 28,
      height: 28
    }
  },
  finish: {
    color: "#000000",
    width: 6,
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "Marseille",
    icon: {
      src: "/stage-profile-maker/icons/tour/tour_start.png",
      width: 28,
      height: 28
    }
  },
  sprint: {
    color: "#000000",
    width: 2,
    offset: 16,
    policeForName: {
      fontFamilly: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamilly: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontWeight: "bold"
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
    fixToTop: false,
    rotation: 90
  },
  bottomDistance: {
    font: {
      fontFamilly: "Arial",
      fontSize: 18,
      fontColor: "#FEEC02",
      fontWeight: "bold"
    }
  },
}