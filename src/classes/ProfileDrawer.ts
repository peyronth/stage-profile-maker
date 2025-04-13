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
  pointCount: number;

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

  drawProfileLine(config: Line, offset: [number, number] = [0, 0]): string {
    const [offsetX, offsetY] = offset;
    const points = this.gpx.getPoints();
    const minAltitude = this.getBottomAltitude();
  
    const step = Math.ceil(points.length / this.pointCount);
  
    let path = `M ${offsetX} ${offsetY + this.height - (points[0].ele - minAltitude) * this.yScale}`;
  
    for (let i = 1; i < points.length; i += step) {
      const point = points[i];
      const x = offsetX + point.dist * this.xScale;
      const y = offsetY + this.height - (point.ele - minAltitude) * this.yScale;
      path += ` L ${x} ${y}`;
    }
  
    return `<path d="${path}" stroke="${config.color}" stroke-width="${config.width}" fill="none" />`;
  }
  

  drawBody(config: ProfileBody, offset: [number, number] = [0, 0]): string {
    const [offsetX, offsetY] = offset;
    const points = this.gpx.getPoints();
    const minAltitude = this.getBottomAltitude();
  
    const step = Math.ceil(points.length / this.pointCount);
  
    let path = `M ${offsetX} ${offsetY + this.height - (points[0].ele - minAltitude) * this.yScale}`;
  
    let point;
    for (let i = 1;i < points.length; i += step) {
      point = points[i];
      const x = offsetX + point.dist * this.xScale;
      const y = offsetY + this.height - (point.ele - minAltitude) * this.yScale;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${point.dist * this.xScale} ${this.height - (point.ele - minAltitude) * this.yScale}`;
  
    path += ` L ${offsetX + this.width} ${offsetY + this.height}`;
    path += ` L ${0} ${this.height}`;
    path += ` L ${offsetX} ${offsetY + this.height}`;
  
    return `<path d="${path}" fill="${config.color}" />`;
  }
  

  drawElevationGrid(config: Grid): string {
    const gridLines: string[] = [];
    const step = config.interval * this.yScale;

    // Générer les lignes horizontales tous les `step` pixels
    for (let y = this.height; y > 0; y -= step) {
      gridLines.push(`
        <line
          x1="0"
          y1="${y}"
          x2="${this.width}"
          y2="${y}"
          stroke="${config.color}"
          stroke-width="${config.width}"
          ${config.dasharray ? `stroke-dasharray="${config.dasharray}"` : ''}
        />`);
    }

    return `
      <g ${config.overProfileOnly ? `mask="url(#${bodyMaskId})` : ''}">
        ${gridLines.join("\n")}
      </g>
    `;
  }

  getPointHeight(distance: number): string {
    return this.gpx.getElevation(distance) / (this.gpx.getMaxAltitude() - this.getBottomAltitude()) * 50 + '%';
  }

  drawLine(config: Line, lineHeight: string): string {
    return `
    <svg
      style="
        flex-shrink: 0;
        flex-grow: 0;
      "
      width="${config.width}"
      height="calc(${lineHeight})"
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
    const { fixToTop, policeForName, policeForAltitude, offset } = config;

    const lineHeight = fixToTop ? '100%' : `calc(${this.getPointHeight(distance)} + ${offset ?? 0}px)`;

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
    let offset = [0, 0];
    

    if(config.body3D) {
      offset = config.body3D.retreat;
      svgElements.push(this.drawBody(config.body3D, config.body3D.retreat));
    }
    if (config.line3D && config.body3D) {
      svgElements.push(this.drawProfileLine(config.line3D, config.body3D.retreat));
    }
    svgElements.push(this.drawBody(config.body));
    if (config.mainLine) {
      svgElements.push(this.drawProfileLine(config.mainLine));
    }
    
    if (config.elevationGrid) {
      svgElements.push(this.drawElevationGrid(config.elevationGrid));
    }

    return `
    <svg
      style="
        margin-left: ${offset[0]}px;
      "
      viewBox="${offset[0]} ${0} ${this.width} ${this.height - offset[1]}"
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

    for (const [distance] of Object.entries(this.gpx.getWaypoints())) {
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
    this.pointCount = config.pointCount;
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
        height: calc(200%);
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