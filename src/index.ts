import GPXParser from './classes/GPXParser';

//console.log(GPXParser);

export class ProfileMaker {
  gpxParser: GPXParser;

  constructor(gpxContext: string) {
    this.gpxParser = new GPXParser(gpxContext);
    console.log(this.gpxParser);
  }
}
