import { Point, Waypoint } from '../interfaces/Gpx';
import { autoDetectClimbs } from '../utils/climbs';
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

  getElevation (distance: number): number {
    const points = this.tracks[0].points;
    const point = points.find(p => p.dist >= distance);
    if(point) {
      return point.ele;
    }
    return 0;
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

  getWaypoints(): Record<number, Waypoint> {
    // COmpute distance of each waypoint
    const points = this.getPoints();

    const distWaypoints = this.waypoints.reduce((waypoints, waypoint) => {

      const sortedPoints = points.toSorted((a, b) => {
        return this.calculateDistanceBtw(waypoint.lat, waypoint.lon, a.lat, a.lon) -
          this.calculateDistanceBtw(waypoint.lat, waypoint.lon, b.lat, b.lon);
      });
      const nearestPoints = sortedPoints.slice(0, 2);

      const distanceToFirst = this.calculateDistanceBtw(waypoint.lat, waypoint.lon, nearestPoints[0].lat, nearestPoints[0].lon);
      const distanceToSecond = this.calculateDistanceBtw(waypoint.lat, waypoint.lon, nearestPoints[1].lat, nearestPoints[1].lon);
      const waypointDist = nearestPoints[0].dist * distanceToFirst / (distanceToFirst + distanceToSecond) + nearestPoints[1].dist * distanceToSecond / (distanceToFirst + distanceToSecond);
      waypoints[waypointDist] = waypoint;
      return waypoints;
    }, {});

    return distWaypoints;
  }

  addWaypoint(waypoint: Waypoint) {
    this.waypoints.push(waypoint);
  }

  getPointAtDistance(distance: number): Point {
    const points = this.getPoints();
    const point = points.find(p => p.dist >= distance);
    if(point) {
      return point;
    }
    return points[points.length - 1];
  }

  autoDetectClimbs() {
    const detectedClimbs = autoDetectClimbs(this.tracks[0].slopes);

    return detectedClimbs;
  }
}