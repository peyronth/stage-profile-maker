import type { Config, Font, Grid, Icon, Line, ProfileBody, Sprint, StartFinish } from '../interfaces/Config';
import GPXHelper from './GPXHelper';

const bodyMaskId = "body-mask";

export default class ProfileDrawer {
  gpx: GPXHelper;
  width: number = 1300;
  height: number = 540;
  xScale: number;
  yScale: number;
  topMargin: number;
  cssImported: boolean = false;

  constructor(gpxHelper: GPXHelper) {
    this.gpx = gpxHelper;
  }

  getBottomAltitude(): number {
    const minAltitude = this.gpx.getMinAltitude();
    if (minAltitude < 200) {
      return 0;
    }
    else {
      return minAltitude - 200;
    }
  }

  drawMainLine(config: Line): string {
    const points = this.gpx.getPoints();
    const minAltitude = this.getBottomAltitude();

    // Calculer le nombre de points à utiliser
    const maxPoints = 2500;
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
    const minAltitude = this.getBottomAltitude();

    // Calculer le nombre de points à utiliser
    const maxPoints = 2500;
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

  drawElevationGrid(config: Grid): string {
    const gridLines: string[] = [];
    const step = config.interval * this.yScale;

    // Générer les lignes horizontales tous les `step` pixels
    for (let y = this.height; y > 0; y -= step) {
      gridLines.push(`<line x1="0" y1="${y}" x2="${this.width}" y2="${y}" stroke="${config.color}" stroke-width="${config.width}" />`);
    }

    return `
      <g ${config.overProfileOnly ? `mask="url(#${bodyMaskId})` : ''}">
        ${gridLines.join("\n")}
      </g>
    `;
  }

  getPointHeight(distance: number): string {
    return this.gpx.getElevation(distance) / (this.gpx.getMaxAltitude() - this.getBottomAltitude()) * 100 + '%';
  }

  drawLine(config: Line, lineHeight: string): string {
    return `
    <svg
      style="
        flex-shrink: 0;
        flex-grow: 0;
      "
      width="${config.width}"
      height="calc(${lineHeight} - ${this.topMargin}px)"
    >
      <line
        x1="0"
        y1="100%"
        x2="0"
        y2="0"
        stroke="${config.color}"
        stroke-width="${config.width}"
        ${config.dasharray ? `stroke-dasharray="${config.dasharray}"` : ''}
      />
    </svg>`;
  }

  drawIcon(icon: Icon): string {
    return `
    <img
      src="${icon.src}"
      style="
        width: ${icon.width}px;
        height: ${icon.height}px;
      "
    />`;
  }

  drawWrite(config: Font, text: string): string {
    return `
    <span
      style="
        font-family: ${config.fontFamilly};
        font-size: ${config.fontSize}px;
        color: ${config.fontColor};
        font-weight: ${config.fontWeight};
      "
    >
      ${text}
    </span>
    `;
  }

  drawMarker(config: Sprint, name: string, distance: number, icon?: Icon): string {
    const { color, width, fixToTop, policeForName, policeForAltitude } = config;

    const lineHeight = fixToTop ? '100%' : this.getPointHeight(distance);

    return `
      <div style="
        position: absolute;
        left: ${distance / this.gpx.getDistance() * 100}%;
        bottom: 0;
        text-align: center;
        height: 100%;
      ">
        <div
          style="
            margin-left: -100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            justify-content: flex-end;
            gap: 8px;
          "
        >
          ${icon ? this.drawIcon(icon) : ''}
          <div style="
            writing-mode: vertical-lr;
            transform: rotate(180deg);
            display: inline-flex;
            white-space: nowrap;
            gap: 8px;
            flex-shrink: 1;
            min-height: 0;
          ">
            ${policeForAltitude ? this.drawWrite(policeForAltitude, `${this.gpx.getElevation(distance)}m`) : ''} ${this.drawWrite(policeForName, name)}
          </div>
          ${this.drawLine(config, lineHeight)}
        </div>
      </div>
    `;
  }

  drawStart(config: StartFinish): string {
    return this.drawMarker(config, config.name, 0, config.icon);
  }

  drawFinish(config: StartFinish): string {
    return this.drawMarker(config, config.name, this.gpx.getDistance(), config.icon);
  }

  drawSprints(config: Sprint): string {
    const sprints = this.gpx.getWaypoints();
    const sprintHtmls = [];
    
    for (const sprintDistance in sprints) {
      const sprint = sprints[sprintDistance];
      let icon = null;
      
      if(config.icons[sprint.sym]) {
        icon = config.icons[sprint.sym];
      }

      sprintHtmls.push(this.drawMarker(config, sprint.name, +sprintDistance, icon));
    }

    return sprintHtmls.join('');
  }

  drawProfile(config: Config): string {
    const svgElements = [];
    const bodyMaskPath = this.drawBody({ color: "white" });

    svgElements.push(this.drawBody(config.body));
    if (config.mainLine) {
      svgElements.push(this.drawMainLine(config.mainLine));
    }
    if (config.elevationGrid) {
      svgElements.push(this.drawElevationGrid(config.elevationGrid));
    }

    return `
    <svg
      viewBox="0 0 ${this.width} ${this.height}"
    >
      <defs>
        <mask id="${bodyMaskId}">
          <rect width="${this.width}" height="${this.height}" fill="black"/>
          ${bodyMaskPath}
        </mask>
      </defs>
      ${svgElements.join('')}
    </svg>`;
  }

  drawBottomDistance(config: Config): string {
    const { backgroundColor, font } = config.bottomDistance;

    const waypointsDistances = [];

    for (const [distance, waypoint] of Object.entries(this.gpx.getWaypoints())) {
      waypointsDistances.push(
        `
        <div
          class="stage-profile-maker-distance"
          style="
            position: absolute;
            left: ${(+distance / this.gpx.getDistance()) * 100}%;
            text-align: center;
            padding-left: -50%;
          "
        >
          ${this.drawWrite(font, (+distance / 1000).toFixed(1))}
        </div>
        `
        
      );
    }

    return `
      <div
        style="
          width: calc(100% + ${config.start.width / 2}px + ${config.finish.width / 2}px);
          margin-left: -${config.start.width / 2}px;
          background-color: ${backgroundColor};
          position: relative;
          height: ${config.bottomDistance.font.fontSize + 4}px;
        "
      >
        ${waypointsDistances.join('')}
      </div>
    `;
  }

  getHtml(config: Config): string {
    this.width = config.width;
    this.height = config.height;
    this.topMargin = config.topMargin;
    this.xScale = this.width / this.gpx.getDistance();
    this.yScale = this.height / (this.gpx.getMaxAltitude() - this.getBottomAltitude());

    if (!this.cssImported) {
      this.cssImported = true;

      // Write style
      const style = document.createElement('style');
      style.innerHTML = this.getCss();
      document.head.appendChild(style);
    }

    return `
      <div
        class="stage-profile-maker-wrapper"
      >
        <div
          class="stage-profile-maker-container"
        >
          <div class="stage-profile-maker-sprints">
            ${config.start ? this.drawStart(config.start) : ''}
            ${config.sprint ? this.drawSprints(config.sprint) : ''}
            ${config.finish ? this.drawFinish(config.finish) : ''}
          </div>
          ${this.drawProfile(config)}
        </div>
        ${config.bottomDistance ? this.drawBottomDistance(config) : ''}
      </div>
    `;
  }

  getCss(): string {
    return `
      .stage-profile-maker-wrapper {
        padding: 16px;
        padding-top: calc(16px + ${this.topMargin}px);
      }

      .stage-profile-maker-container {
        aspect-ratio: ${this.width} / ${this.height};
        width: auto;
        height: 100%;
        position: relative;
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stage-profile-maker-sprints {
        z-index: 2;
        height: calc(100% + ${this.topMargin}px);
        width: 100%;
        left: 0;
        position: absolute;
        bottom: 0;
      }

      .stage-profile-maker-container > svg {
        width: 100%;
        height: 100%;
      }

      .stage-profile-maker-distance > span {
        margin-left: -100%;
      }
    `;
  }
}