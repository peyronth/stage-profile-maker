import { Point, Waypoint } from '../interfaces/Gpx';
import { autoDetectClimbs } from '../utils/climbs';
import GPXMaker from './GPXMaker';
import { getLocation } from '../utils/locations';

export default class GPXHelper extends GPXMaker {
  constructor(gpxString: string) {
    super(gpxString);
  }

  //#region Get
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
    }, []).sort((a, b) => a.dist - b.dist)
  }

  getElevation (distance: number): number {
    const points = this.tracks[0].points;
    const point = points.find(p => p.dist >= distance);
    if(point) {
      return point.ele;
    }
    return 0;
  }

  getDistanceAtPoint(lat: number, lon: number): number {
    const sortedPoints = this.getPoints().toSorted((a, b) => {
      return this.calculateDistanceBtw(lat, lon, a.lat, a.lon) - this.calculateDistanceBtw(lat, lon, b.lat, b.lon);
    });
    const nearestPoints = sortedPoints.slice(0, 2);
    const distanceToFirst = this.calculateDistanceBtw(lat, lon, nearestPoints[0].lat, nearestPoints[0].lon);
    const distanceToSecond = this.calculateDistanceBtw(lat, lon, nearestPoints[1].lat, nearestPoints[1].lon);
    const pointDist = nearestPoints[0].dist * distanceToFirst / (distanceToFirst + distanceToSecond) + nearestPoints[1].dist * distanceToSecond / (distanceToFirst + distanceToSecond);
    return pointDist;
  }

  getWaypoints(): Record<number, Waypoint> {
    const distWaypoints = this.waypoints.reduce((waypoints, waypoint) => {
      waypoints[this.getDistanceAtPoint(waypoint.lat, waypoint.lon)] = waypoint;
      return waypoints;
    }, {});

    return distWaypoints;
  }

  getPointAtDistance(distance: number): Point {
    const points = this.getPoints();
    const point = points.find(p => p.dist >= distance);
    if(point) {
      return point;
    }
    return points[points.length - 1];
  }

  async getStartLocation(): Promise<string> {
    const startPoint = this.getPointAtDistance(0);
    const lat = startPoint.lat;
    const lon = startPoint.lon;
    const location = await getLocation(lat, lon);
    return location;
  }

  async getEndLocation(): Promise<string> {
    const allPoints = this.getPoints();
    const endPoint = allPoints[allPoints.length - 1];
    const lat = endPoint.lat;
    const lon = endPoint.lon;
    const location = await getLocation(lat, lon);
    return location;
  }
  //#endregion

  //#region Add
  addWaypoint(waypoint: Waypoint) {
    this.waypoints.push(waypoint);
  }
  //#endregion

  //#region Set - Update - Edit
  setName(name: string) {
    this.metadata.name = name;
  }
  //#endregion
  
  //#region Remove
  deleteWaypoint(lat: number, lon: number) {
    this.waypoints = this.waypoints.filter(waypoint => waypoint.lat !== lat && waypoint.lon !== lon);
  }
  //#endregion
  
  //#region Miscellaneous
  autoDetectClimbs() {
    const detectedClimbs = autoDetectClimbs(this.tracks[0].slopes);
    
    return detectedClimbs;
  }

  calculateDistanceBtw(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  exportGPX(): string {
    const gpx = this.generateGpx();
    return gpx;
  }
  //#endregion
}