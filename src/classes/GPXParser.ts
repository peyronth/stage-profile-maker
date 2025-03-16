import { MetaData, Waypoint, Point, Route, Track, Distance, Elevation } from '../interfaces/gpx';

export default class GPXParser {
  xmlSource: Document;
  metadata: MetaData;
  waypoints: Waypoint[] = [];
  tracks: Track[] = [];
  routes: Route[] = [];


  constructor(gpxString: string) {
    const domParser = new DOMParser();
    this.xmlSource = domParser.parseFromString(gpxString, 'text/xml');
    
    this.metadata = this.parseMetadata();
    this.parseWaypoints();
    this.parseRoutes();
    this.parseTracks();
  }

  parseMetadata(): MetaData {
    const metadataElem = this.xmlSource.querySelector('metadata');

    const metadata = {
      name: '',
      desc: '',
      time: '',
      author: {
        name: '',
        email: { id: '', domain: '' },
        link: { href: '', text: '', type: '' }
      },
      link: { href: '', text: '', type: '' }
    };
    if (metadataElem != null) {
      metadata.name = this.getElementValue(metadataElem, "name");
      metadata.desc = this.getElementValue(metadataElem, "desc");
      metadata.time = this.getElementValue(metadataElem, "time");

      const authorElem = metadataElem.querySelector('author');
      if (authorElem != null) {
        metadata.author.name = this.getElementValue(authorElem, "name");

        const emailElem = authorElem.querySelector('email');
        if (emailElem != null) {
          metadata.author.email.id = emailElem.getAttribute("id") ?? '';
          metadata.author.email.domain = emailElem.getAttribute("domain") ?? '';
        }

        const linkElem = authorElem.querySelector('link');
        if (linkElem != null) {
          metadata.author.link.href = linkElem.getAttribute('href') ?? '';
          metadata.author.link.text = this.getElementValue(linkElem, "text");
          metadata.author.link.type = this.getElementValue(linkElem, "type");
        }
      }

      const linkElem = this.queryDirectSelector(metadataElem, 'link');
      if (linkElem != null) {
        metadata.link.href = linkElem.getAttribute('href') ?? '';
        metadata.link.text = this.getElementValue(linkElem, "text");
        metadata.link.type = this.getElementValue(linkElem, "type");
      }
    }

    return metadata;
  }

  parseWaypoints(): void {
    const wptElements = Array.from(this.xmlSource.querySelectorAll('wpt'));

    for (const wpt of wptElements) {
      const pt: Waypoint = {
        name: this.getElementValue(wpt, "name"),
        sym: this.getElementValue(wpt, "sym"),
        lat: parseFloat(wpt.getAttribute("lat") ?? '0'),
        lon: parseFloat(wpt.getAttribute("lon") ?? '0'),
        ele: parseFloat(this.getElementValue(wpt, "ele")),
        cmt: this.getElementValue(wpt, "cmt"),
        desc: this.getElementValue(wpt, "desc"),
        time: new Date(this.getElementValue(wpt, "time"))
      };

      this.waypoints.push(pt);
    }
  }

  parseRoutes(): void {
    const routeElements = Array.from(this.xmlSource.querySelectorAll('rte'));

    for (const rte of routeElements) {

      const route: Route = {
        name: this.getElementValue(rte, "name"),
        cmt: this.getElementValue(rte, "cmt"),
        desc: this.getElementValue(rte, "desc"),
        src: this.getElementValue(rte, "src"),
        number: this.getElementValue(rte, "number"),
        type: this.getInnerHTML(this.queryDirectSelector(rte, "type")),
        link: this.parseLink(rte.querySelector('link')),
        distance: { total: 0, cumul: 0 },
        elevation: { max: 0, min: 0, pos: 0, neg: 0, avg: 0 },
        slopes: [],
        points: this.parseRoutePoints(rte),
      };

      route.distance = this.calculDistance(route.points);
      route.elevation = this.calcElevation(route.points);
      route.slopes = this.calculSlope(route.points, route.distance.cumul);

      this.routes.push(route);
    }
  }

  parseRoutePoints(rte: Element): Point[] {
    const rtepts = Array.from(rte.querySelectorAll('rtept'));
    return rtepts.map(rtept => ({
      lat: parseFloat(rtept.getAttribute("lat") ?? '0'),
      lon: parseFloat(rtept.getAttribute("lon") ?? '0'),
      ele: this.parseFloatOrNull(this.getElementValue(rtept, "ele")),
      time: this.parseDateOrNull(this.getElementValue(rtept, "time")),
    }));
  }

  parseTracks(): void {
    const trkElements = Array.from(this.xmlSource.querySelectorAll('trk'));
  
    for (const trk of trkElements) {
      const track: Track = {
        name: this.getElementValue(trk, "name"),
        cmt: this.getElementValue(trk, "cmt"),
        desc: this.getElementValue(trk, "desc"),
        src: this.getElementValue(trk, "src"),
        number: this.getElementValue(trk, "number"),
        type: this.getInnerHTML(this.queryDirectSelector(trk, "type")) ?? '',
        link: this.parseLink(trk.querySelector('link')),
        distance: { total: 0, cumul: 0 },
        elevation: { max: 0, min: 0, pos: 0, neg: 0, avg: 0 },
        slopes: [],
        points: this.parseTrackPoints(trk),
      };
  
      track.distance = this.calculDistance(track.points);
      track.elevation = this.calcElevation(track.points);
      track.slopes = this.calculSlope(track.points, track.distance.cumul);
  
      this.tracks.push(track);
    }
  }
  
  parseTrackPoints(trk: Element): Point[] {
    const trkpts = Array.from(trk.querySelectorAll('trkpt'));
    return trkpts.map(trkpt => ({
      lat: parseFloat(trkpt.getAttribute("lat") ?? '0'),
      lon: parseFloat(trkpt.getAttribute("lon") ?? '0'),
      ele: this.parseFloatOrNull(this.getElementValue(trkpt, "ele")),
      time: this.parseDateOrNull(this.getElementValue(trkpt, "time")),
    }));
  }

  parseFloatOrNull(value: string): number | null {
    const floatValue = parseFloat(value);
    return isNaN(floatValue) ? null : floatValue;
  }

  parseDateOrNull(value: string): Date | null {
    return value ? new Date(value) : null;
  }

  parseLink(linkElem: Element | null): { href: string; text: string; type: string } {
    if (!linkElem) {
      return { href: '', text: '', type: '' };
    }
    return {
      href: linkElem.getAttribute('href') ?? '',
      text: this.getElementValue(linkElem, "text"),
      type: this.getElementValue(linkElem, "type"),
    };
  }

  calculDistance(points: Point[]): Distance {
    //TODO: Implementation of calculDistance
    return { total: 0, cumul: 0 };
  }

  calcElevation(points: Point[]): Elevation {
    //TODO: Implementation of calcElevation
    return { max: 0, min: 0, pos: 0, neg: 0, avg: 0 };
  }

  calculSlope(points: Point[], cumulDistance: number): number[] {
    //TODO: Implementation of calculSlope
    return [];
  }

  getElementValue(parent: Element, tagName: string): string {
    const elem = parent.querySelector(tagName);
    return elem?.innerHTML ?? elem?.childNodes[0].data ?? null;
  }

  getInnerHTML(element: Element | null): string | null {
    return element ? element.innerHTML : null;
  }

  queryDirectSelector(parent: Element, tagName: string): Element | null {
    const elements = parent.querySelectorAll(tagName);
    let finalElement = elements[0];

    if (elements.length > 1) {
      const directChildren = parent.childNodes;

      for(const directChild of directChildren) {
        if (directChild.nodeName === tagName) {
          finalElement = directChild as Element;
        }
      }
    }

    return finalElement;
  }
}