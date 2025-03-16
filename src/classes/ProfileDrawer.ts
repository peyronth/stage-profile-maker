import GPXHelper from './GPXHelper';

export default class ProfileDrawer {
  gpx: GPXHelper;
  width: number = 800;
  height: number = 300;
  xScale: number;
  yScale: number;

  constructor(gpxContext: string) {
    this.gpx = new GPXHelper(gpxContext);

    this.xScale = this.width / this.gpx.getDistance();
    this.yScale = this.height / (this.gpx.getMaxAltitude() - this.gpx.getMinAltitude());
  }

  drawSvgProfileLine(): string {
    const points = this.gpx.getPoints();
    const minAltitude = this.gpx.getMinAltitude();

    // Calculer le nombre de points à utiliser
    const maxPoints = 100;
    const step = Math.ceil(points.length / maxPoints);

    let path = `M  0 ${this.height - (points[0].ele - minAltitude) * this.yScale}`;

    // Échantillonner les points
    for (let i = 1; i < points.length; i += step) {
      const point = points[i];
      const x = point.dist * this.xScale;
      const y = this.height - (point.ele - minAltitude) * this.yScale;
      path += ` L ${x} ${y}`;
    }

    return path;
  }

  drawSvgProfileBody(): string {
    const points = this.gpx.getPoints();
    const minAltitude = this.gpx.getMinAltitude();

    // Calculer le nombre de points à utiliser
    const maxPoints = 100;
    const step = Math.ceil(points.length / maxPoints);

    let path = `M  0 ${this.height - (points[0].ele - minAltitude) * this.yScale}`;

    // Échantillonner les points
    for (let i = 1; i < points.length; i += step) {
      const point = points[i];
      const x = point.dist * this.xScale;
      const y = this.height - (point.ele - minAltitude) * this.yScale;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${this.width} ${this.height}`;
    path += ` L 0 ${this.height}`;


    return path;
  }



  getHtml(): string {
    return `
      <svg viewBox="0 0 ${this.width} ${this.height}">
        <path d="${this.drawSvgProfileBody()}" fill="lightgray" />
        <path d="${this.drawSvgProfileLine()}" stroke="black" fill="none" />
      </svg>
    `;
  }
}