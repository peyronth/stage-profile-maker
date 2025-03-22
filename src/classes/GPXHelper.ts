import { Point } from '../interfaces/Gpx';
import GPXParser from './GPXParser';

export default class GPXHelper extends GPXParser {
  constructor(gpxString: string) {
    super(gpxString);
  }

  getName(): string {
    if(this.metadata.name) {
      return this.metadata.name;
    }
    if(this.tracks.length > 0) {
      return this.tracks[0].name;
    }
    if(this.routes.length > 0) {
      return this.routes[0].name;
    }
    return '';
  }

  getDistance(): number {
    return this.tracks.reduce((acc, track) => {
      return acc + track.distance.total;
    }, 0);
  }

  getElevationGain(): number {
    return this.tracks.reduce((acc, track) => {
      return acc + track.elevation.pos
    }, 0);
  }

  getElevationLoss(): number {
    return this.tracks.reduce((acc, track) => {
      return acc + track.elevation.neg
    }, 0);
  }

  getMinAltitude(): number {
    return this.tracks.reduce((acc, track) => {
      return Math.min(acc, track.elevation.min);
    }, Number.MAX_VALUE);
  }

  getMaxAltitude(): number {
    return this.tracks.reduce((acc, track) => {
      return Math.max(acc, track.elevation.max);
    }, Number.MIN_VALUE);
  }

  getPoints(): Point[] {
    return this.tracks.reduce((acc, track) => {
      return acc.concat(track.points);
    }, []);
  }

}