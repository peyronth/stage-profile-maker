import type { Config, Line, ProfileBody } from '../interfaces/Config';
import GPXHelper from './GPXHelper';

export default class ProfileDrawer {
  gpx: GPXHelper;
  width: number = 800;
  height: number = 300;
  xScale: number;
  yScale: number;
  cssImported: boolean = false;

  constructor(gpxContext: string) {
    this.gpx = new GPXHelper(gpxContext);

    this.xScale = this.width / this.gpx.getDistance();
    this.yScale = this.height / (this.gpx.getMaxAltitude() - this.gpx.getMinAltitude());
  }

  drawMainLine(config: Line): string {
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

    return `<path d="${path}" stroke="${config.color}" fill="none" />`;
  }

  drawBody(config: ProfileBody): string {
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


    return `<path d="${path}" fill="${config.color}" />`;
  }

  drawEleveationGrid(config: Grid): string {

  }

  drawProfile(config: Config): string {
    const svgElements = [];
    svgElements.push(this.drawBody(config.body));

    if(config.mainLine) {
      svgElements.push(this.drawMainLine(config.mainLine));
    }
    if(config.elevationGrid) {
      svgElements.push(this.drawElevationGrid(config.elevationGrid));
    }

    return `<svg
      viewBox="0 0 ${this.width} ${this.height}"
    >
      ${svgElements.join('')}
    </svg>`;
  }

  getHtml(config: Config): string {
    if(!this.cssImported) {
      this.cssImported = true;
      
      // Write style
      const style = document.createElement('style');
      style.innerHTML = this.getCss();
      document.head.appendChild(style);
    }

    return `
      <div
        class="stage-profile-maker-container"
      >
        ${this.drawProfile(config)}
      </div>
    `;
  }

  getCss(): string {
    return `
      .stage-profile-maker-container {
        width: 100%;
        height: 400px;
      }

      .stage-profile-maker-container > svg {
        width: 100%;
        height: 100%;
      }
    `;
  }
}