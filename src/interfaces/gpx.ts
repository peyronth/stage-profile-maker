export interface Author {
  name: string;
  email: {
    id: string;
    domain: string;
  };
  link: {
    href: string;
    text: string;
    type: string;
  };
}

export interface MetaData {
  name: string;
  desc: string;
  time: string;
  author: Author;
  link: Link;
}

export interface Link {
  href: string;
  text: string;
  type: string;
}

export interface Waypoint {
  name: string;
  sym: string;
  cmt: string;
  desc: string;
  lat: number;
  lon: number;
  ele: number;
  time: Date;
}

export interface Track {
  name: string;
  cmt: string;
  desc: string;
  src: string;
  number: string;
  link: Link;
  type: string;
  points: Point[];
  distance: Distance;
  elevation: Elevation;
  slopes: number[];
}

export interface Point {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
}

export interface Distance {
  total: number;
  cumul: number;
}

export interface Elevation {
  max: number;
  min: number;
  pos: number;
  neg: number;
  avg: number;
}

export interface Route {
  name: string;
  cmt: string;
  desc: string;
  src: string;
  number: string;
  type: string | null;
  link: {
    href: string;
    text: string;
    type: string;
  };
  distance: Distance;
  elevation: Elevation;
  slopes: number[];
  points: Point[];
}
