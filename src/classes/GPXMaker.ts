import GPXParser from './GPXParser';
import { create } from 'xmlbuilder2';

export default class GPXMaker extends GPXParser {
  generateGpx(): string {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('gpx', {
        xmlns: 'http://www.topografix.com/GPX/1/1',
        version: '1.1',
        creator: 'GPXParser',
      });

    // Metadata
    const { metadata } = this;
    if (metadata) {
      const meta = root.ele('metadata');
      if (metadata.name) meta.ele('name').txt(metadata.name).up();
      if (metadata.desc) meta.ele('desc').txt(metadata.desc).up();
      if (metadata.author) {
        const author = meta.ele('author');
        author.ele('name').txt(metadata.author.name).up();
        if (metadata.author.email) {
          const email = metadata.author.email;
          author.ele('email').att('id', email.id).att('domain', email.domain).up();
        }
        if (metadata.author.link) {
          const link = metadata.author.link;
          author
            .ele('link')
            .att('href', link.href)
            .ele('text').txt(link.text).up()
            .ele('type').txt(link.type).up()
            .up();
        }
        author.up();
      }
      if (metadata.link) {
        meta
          .ele('link')
          .att('href', metadata.link.href)
          .ele('text').txt(metadata.link.text).up()
          .ele('type').txt(metadata.link.type).up()
          .up();
      }
      if (metadata.time) meta.ele('time').txt(new Date(metadata.time).toISOString()).up();
      meta.up();
    }

    // Waypoints
    this.waypoints.forEach((pt) => {
      const wpt = root.ele('wpt', {
        lat: pt.lat.toFixed(7),
        lon: pt.lon.toFixed(7),
      });
      if (pt.ele !== null) wpt.ele('ele').txt(pt.ele.toString()).up();
      if (pt.time) wpt.ele('time').txt(pt.time.toISOString()).up();
      if (pt.name) wpt.ele('name').txt(pt.name).up();
      if (pt.desc) wpt.ele('desc').txt(pt.desc).up();
      if (pt.cmt) wpt.ele('cmt').txt(pt.cmt).up();
      if (pt.sym) wpt.ele('sym').txt(pt.sym).up();
      wpt.up();
    });

    // Routes
    this.routes.forEach((route) => {
      const rte = root.ele('rte');
      if (route.name) rte.ele('name').txt(route.name).up();
      if (route.cmt) rte.ele('cmt').txt(route.cmt).up();
      if (route.desc) rte.ele('desc').txt(route.desc).up();
      if (route.src) rte.ele('src').txt(route.src).up();
      if (route.number) rte.ele('number').txt(route.number).up();
      if (route.type) rte.ele('type').txt(route.type).up();

      if (route.link) {
        rte
          .ele('link')
          .att('href', route.link.href)
          .ele('text').txt(route.link.text).up()
          .ele('type').txt(route.link.type).up()
          .up();
      }

      route.points.forEach((pt) => {
        const rtept = rte.ele('rtept', {
          lat: pt.lat.toFixed(7),
          lon: pt.lon.toFixed(7),
        });
        if (pt.ele !== null) rtept.ele('ele').txt(pt.ele.toString()).up();
        if (pt.time) rtept.ele('time').txt(pt.time.toISOString()).up();
        rtept.up();
      });
      rte.up();
    });

    // Tracks
    this.tracks.forEach((track) => {
      const trk = root.ele('trk');
      if (track.name) trk.ele('name').txt(track.name).up();
      if (track.cmt) trk.ele('cmt').txt(track.cmt).up();
      if (track.desc) trk.ele('desc').txt(track.desc).up();
      if (track.src) trk.ele('src').txt(track.src).up();
      if (track.number) trk.ele('number').txt(track.number).up();
      if (track.type) trk.ele('type').txt(track.type).up();

      if (track.link) {
        trk
          .ele('link')
          .att('href', track.link.href)
          .ele('text').txt(track.link.text).up()
          .ele('type').txt(track.link.type).up()
          .up();
      }

      const trkseg = trk.ele('trkseg');
      track.points.forEach((pt) => {
        const trkpt = trkseg.ele('trkpt', {
          lat: pt.lat.toFixed(7),
          lon: pt.lon.toFixed(7),
        });
        if (pt.ele !== null) trkpt.ele('ele').txt(pt.ele.toString()).up();
        if (pt.time) trkpt.ele('time').txt(pt.time.toISOString()).up();
        trkpt.up();
      });
      trkseg.up();
      trk.up();
    });

    return root.end({ prettyPrint: true });
  }
}
