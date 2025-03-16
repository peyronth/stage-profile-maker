import GPXHelper from './classes/GPXHelper';
import ProfileDrawer from './classes/ProfileDrawer';

export class ProfileMaker {
  gpx: GPXHelper;
  drawer: ProfileDrawer;

  constructor(gpxContext: string) {
    this.gpx = new GPXHelper(gpxContext);
    this.drawer = new ProfileDrawer(gpxContext);
  }

  getHtml(): string {
    return this.drawer.getHtml();
  }
}
