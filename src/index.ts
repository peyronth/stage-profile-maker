import GPXParser from './classes/GPXParser';

export class ProfileMaker {
  gpxParser: GPXParser;

  constructor(gpxContext: string) {
    console.log('ProfileMaker');
    this.gpxParser = new GPXParser(gpxContext);
    console.log(this.gpxParser);
  }
}
