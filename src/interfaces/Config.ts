import { SprintTypes } from '../enums/SprintTypes';

export interface Config {
  width: number;
  height: number;
  topMargin: number;

  body: ProfileBody;
  mainLine?: Line;
  body3D?: Body3D;
  line3D?: Line;
  sprint?: Sprint;
  location?: Sprint;
  start?: StartFinish;
  finish?: StartFinish;
  elevationGrid?: Grid;
  distanceGrid?: Grid;
}

export interface Font {
  fontFamilly: string;
  fontSize: number;
  fontColor: string;
  fontWeight?: string;
}

export interface Line { 
  color: string;
  width: number;
  dasharray?: string;
}

export interface Grid {
  overProfileOnly: boolean;
  color: string;
  width: number;
  interval: number;
}

export interface ProfileBody {
  color?: string;
  image?: string;
}

export interface Sprint extends Line {
  policeForName: Font;
  policeForAltitude?: Font;
  policeForDistance?: Font;
  fixToTop: boolean;
  rotation: number;
  icons?: Partial<Record<SprintTypes, Icon>>;
}

export interface StartFinish extends Sprint {
  name: string;
  icon?: Icon;
}

export interface Body3D extends ProfileBody {
  retreat: number;
}

export interface Icon {
  src: string;
  width: number;
  height: number;
}
