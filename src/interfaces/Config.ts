export interface Config {
  body: ProfileBody;
  mainLine?: Line;
  body3D?: Body3D;
  line3D?: Line;
  sprint?: Sprint;
  location?: Sprint;
  start?: Sprint;
  finish?: Sprint;
  elevationGrid?: Grid;
  distanceGrid?: Grid;
}

export interface Font {
  fontFamilly: string;
  fontSize: number;
  fontColor: string;
}

export interface Line { 
  color: string;
  width: number;
}

export interface Grid {
  overProfileOnly: boolean;
  dashed: boolean;
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
  icon?: string;
}

export interface Body3D extends ProfileBody {
  retreat: number;
}
