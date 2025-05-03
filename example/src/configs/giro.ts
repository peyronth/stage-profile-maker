import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';
import { SprintTypes } from 'stage-profile-maker/src/enums/SprintTypes.ts';
import { IconPosition, LabelPosition } from '../../../src/enums/SprintPositions';

export const giroPreset3d: Config = {
  width: 1300,
  height: 400,
  topMargin: 400,

  pointCount: 1200,

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
    labelPosition: LabelPosition.Body3D,
    iconPosition: IconPosition.AfterLabel,
    color: "#000000",
    width: 6,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "",
    icon: {
      src: "/stage-profile-maker/icons/giro/giro_start.png",
      width: 28,
      height: 28
    }
  },
  finish: {
    labelPosition: LabelPosition.Body,
    iconPosition: IconPosition.AfterLabel,
    color: "#000000",
    width: 6,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "",
    icon: {
      src: "/stage-profile-maker/icons/giro/giro_finish.png",
      width: 28,
      height: 28
    }
  },
  sprint: {
    color: "#000000",
    width: 2,
    offset: 32,
    iconPosition: IconPosition.BodyBottom,
    labelPosition: LabelPosition.Body3D,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontWeight: "bold"
    },
    icons: {
      [SprintTypes.Sprint]: {
        src: "/stage-profile-maker/icons/giro/giro_sprint.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb]: {
        src: "/stage-profile-maker/icons/giro/giro_climb.png",
        width: 28,
        height: 28
      },
      [SprintTypes.ClimbHC]: {
        src: "/stage-profile-maker/icons/giro/giro_hc.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb1]: {
        src: "/stage-profile-maker/icons/giro/giro_1.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb2]: {
        src: "/stage-profile-maker/icons/giro/giro_2.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb3]: {
        src: "/stage-profile-maker/icons/giro/giro_3.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Climb4]: {
        src: "/stage-profile-maker/icons/giro/giro_4.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Bonification]: {
        src: "/stage-profile-maker/icons/giro/giro_bonif.png",
        width: 28,
        height: 28
      },
      [SprintTypes.Feeding]: {
        src: "/stage-profile-maker/icons/giro/giro_ravito.png",
        width: 28,
        height: 28
      },
      [SprintTypes.TimeTrial]: {
        src: "/stage-profile-maker/icons/giro/giro_time.png",
        width: 28,
        height: 28
      }
    },
    fixToTop: false,
    rotation: 90
  },
  bottomDistance: {
    rotation: 90,
    font: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000"
    }
  },
}

export const giroPreset2d: Config = {
  width: 1300,
  height: 400,
  topMargin: 400,

  pointCount: 200,

  body: {
    color: '#FFFCF3',
  },

  mainLine: {
    color: '#CF2D7E',
    width: 4,
  },


  elevationGrid: {
    overProfileOnly: true,
    dasharray: '1 5',
    width: 1,
    interval: 50,
    color: '#060702'
  },
  distanceGrid: {
    overProfileOnly: true,
    width: 1,
    interval: 10000,
    color: '#060702'
  },
  start: {
    offset: 32,
    labelPosition: LabelPosition.Body,
    iconPosition: IconPosition.BeforeLabel,
    color: "#060702",
    width: 3,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "",
    icon: {
      src: "/stage-profile-maker/icons/giro/giro_start.png",
      width: 38,
      height: 38
    }
  },
  finish: {
    offset: 32,
    labelPosition: LabelPosition.Body,
    iconPosition: IconPosition.BeforeLabel,
    color: "#060702",
    width: 3,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    fixToTop: false,
    rotation: 90,
    name: "",
    icon: {
      src: "/stage-profile-maker/icons/giro/giro_finish.png",
      width: 38,
      height: 38
    }
  },
  sprint: {
    color: "#060702",
    width: 2,
    offset: 32,
    iconPosition: IconPosition.BodyBottom,
    labelPosition: LabelPosition.Body,
    policeForName: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    policeForAltitude: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#060702",
      fontWeight: "bold"
    },
    icons: {
      [SprintTypes.Sprint]: {
        src: "/stage-profile-maker/icons/giro/giro_sprint.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Climb]: {
        src: "/stage-profile-maker/icons/giro/giro_climb.png",
        width: 32,
        height: 32
      },
      [SprintTypes.ClimbHC]: {
        src: "/stage-profile-maker/icons/giro/giro_hc.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Climb1]: {
        src: "/stage-profile-maker/icons/giro/giro_1.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Climb2]: {
        src: "/stage-profile-maker/icons/giro/giro_2.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Climb3]: {
        src: "/stage-profile-maker/icons/giro/giro_3.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Climb4]: {
        src: "/stage-profile-maker/icons/giro/giro_4.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Bonification]: {
        src: "/stage-profile-maker/icons/giro/giro_bonif.png",
        width: 32,
        height: 32
      },
      [SprintTypes.Feeding]: {
        src: "/stage-profile-maker/icons/giro/giro_ravito.png",
        width: 32,
        height: 32
      },
      [SprintTypes.TimeTrial]: {
        src: "/stage-profile-maker/icons/giro/giro_time.png",
        width: 32,
        height: 32
      }
    },
    fixToTop: false,
    rotation: 90
  },
  bottomDistance: {
    rotation: 90,
    font: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#060702"
    }
  },
}

export const giroPresets = [
  giroPreset3d,
  giroPreset2d,
];