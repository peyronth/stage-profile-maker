/*
Éléments à afficher ou pas
- Corps
Couleur / Image de fond

- Ligne principale
Couleur
Épaisseur

- Effet 3D
Couleur
Width

- Ligne effet 3D
Couleur
Épaisseur

- Sprints
PoliceForName
PoliceForAltitude
PoliceForDistance
FixToTop
LineWidth
Icon
Rotation

- Start - Finish
PoliceForName
PoliceForAltitude
PoliceForDistance
Police
FixToTop
LineWidth
Icon
Rotation

- Ligne d'altitude
OverProfileOnly
Dashed
Épaisseur

- Ligne de distance
OverProfileOnly
Dashed
Épaisseur

- Indication kilométrique
BackgroundColor
Police


  -Police
  Font
  Taille
  Couleur

*/

export interface Config {
  body: Body;
  mainLine: Line;
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

export interface Body {
  color: string;
  image: string;
}

export interface Sprint extends Line {
  policeForName: Font;
  policeForAltitude?: Font;
  policeForDistance?: Font;
  fixToTop: boolean;
  rotation: number;
  icon?: string;
}

export interface Body3D extends Body {
  retreat: number;
}
