import GPXHelper from './classes/GPXHelper';
import ProfileDrawer from './classes/ProfileDrawer';
import { Config } from './interfaces/Config';

export class ProfileMaker {
  gpx: GPXHelper;
  drawer: ProfileDrawer;

  constructor(gpxContext: string) {
    this.gpx = new GPXHelper(gpxContext);
    this.drawer = new ProfileDrawer(gpxContext);
  }

  getHtml(config: Config): string {
    return this.drawer.getHtml(config);
  }
}
