import type { Config } from '../../../src/interfaces/Config';

export const defaultPreset: Config = {
  width: 1300,
  height: 400,
  topMargin: 400,

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
      src: "/icons/tour/tour_start.png",
      width: 28,
      height: 28
    }
  },
  finish: {
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
      src: "/icons/tour/tour_finish.png",
      width: 28,
      height: 28
    }
  },
  sprint: {
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
    fixToTop: true,
    rotation: 90
  }
}