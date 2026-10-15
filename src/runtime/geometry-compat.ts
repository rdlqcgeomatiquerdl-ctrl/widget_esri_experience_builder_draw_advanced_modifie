import * as geometryEngine from 'esri/geometry/geometryEngine';
import * as webMercatorUtils from 'esri/geometry/support/webMercatorUtils';

// proj4 for coordinate transformations (NAD83, MTM 7 EPSG:2949, WGS84 EPSG:4326, EPSG:4269)
const proj4Module: any = require('proj4');
const proj4: any = proj4Module.default || proj4Module;

if (proj4 && typeof proj4.defs === 'function') {
  if (!proj4.defs['EPSG:2949']) {
    proj4.defs('EPSG:2949', '+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
    proj4.defs('urn:ogc:def:crs:EPSG::2949', proj4.defs('EPSG:2949'));
  }
  if (!proj4.defs['EPSG:32187']) {
    proj4.defs('EPSG:32187', '+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
    proj4.defs('urn:ogc:def:crs:EPSG::32187', proj4.defs('EPSG:32187'));
  }
  if (!proj4.defs['EPSG:4269']) {
    proj4.defs('EPSG:4269', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs +type=crs');
    proj4.defs('urn:ogc:def:crs:EPSG::4269', proj4.defs('EPSG:4269'));
  }
  if (!proj4.defs['EPSG:4617']) {
    proj4.defs('EPSG:4617', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs +type=crs');
    proj4.defs('urn:ogc:def:crs:EPSG::4617', proj4.defs('EPSG:4617'));
  }
}

export const densifyOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, maxSeg: number, options?: any) => {
    if (!geom) return geom;
    try {
      const ge: any = (geometryEngine as any).default || geometryEngine;
      if (ge && typeof ge.densify === 'function') {
        const unit = options?.unit || 'meters';
        const res = ge.densify(geom, maxSeg, unit);
        if (res) return res;
      }
    } catch (e) {
      console.warn('[geometry-compat] densify error:', e);
    }
    return geom;
  }
};

export const lengthOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, options?: any) => {
    if (!geom) return 0;
    try {
      const ge: any = (geometryEngine as any).default || geometryEngine;
      const unit = options?.unit || 'meters';
      if (ge && typeof ge.planarLength === 'function') {
        return ge.planarLength(geom, unit);
      }
    } catch { }
    return 0;
  }
};

export const geodeticLengthOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, options?: any) => {
    if (!geom) return 0;
    try {
      const ge: any = (geometryEngine as any).default || geometryEngine;
      const unit = options?.unit || 'meters';
      if (ge && typeof ge.geodesicLength === 'function') {
        return ge.geodesicLength(geom, unit);
      }
      if (ge && typeof ge.planarLength === 'function') {
        return ge.planarLength(geom, unit);
      }
    } catch { }
    return 0;
  }
};

export const areaOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, options?: any) => {
    if (!geom) return 0;
    try {
      const ge: any = (geometryEngine as any).default || geometryEngine;
      const unit = options?.unit || 'square-meters';
      if (ge && typeof ge.planarArea === 'function') {
        return ge.planarArea(geom, unit);
      }
    } catch { }
    return 0;
  }
};

export const geodeticAreaOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, options?: any) => {
    if (!geom) return 0;
    try {
      const ge: any = (geometryEngine as any).default || geometryEngine;
      const unit = options?.unit || 'square-meters';
      if (ge && typeof ge.geodesicArea === 'function') {
        return ge.geodesicArea(geom, unit);
      }
      if (ge && typeof ge.planarArea === 'function') {
        return ge.planarArea(geom, unit);
      }
    } catch { }
    return 0;
  }
};

export const projectOperator = {
  isLoaded: () => true,
  load: async () => {},
  execute: (geom: any, targetSR: any): any => {
    if (!geom) return null;
    try {
      if (webMercatorUtils?.canProject && webMercatorUtils.canProject(geom, targetSR)) {
        return webMercatorUtils.project(geom, targetSR);
      }
    } catch { }
    try {
      if (proj4) {
        const fromWkid = geom.spatialReference?.wkid || 4269;
        const toWkid = targetSR?.wkid || (targetSR?.latestWkid) || 2949;
        if (fromWkid && toWkid && fromWkid !== toWkid) {
          const transform = proj4(`EPSG:${fromWkid}`, `EPSG:${toWkid}`);
          if (typeof geom.x === 'number' && typeof geom.y === 'number') {
            const [px, py] = transform.forward([geom.x, geom.y]);
            const clone = typeof geom.clone === 'function' ? geom.clone() : { ...geom };
            clone.x = px;
            clone.y = py;
            clone.spatialReference = targetSR;
            return clone;
          } else if (Array.isArray(geom.rings)) {
            const newRings = geom.rings.map((ring: any[]) =>
              ring.map((c: any[]) => transform.forward([c[0], c[1]]))
            );
            const clone = typeof geom.clone === 'function' ? geom.clone() : { ...geom };
            clone.rings = newRings;
            clone.spatialReference = targetSR;
            return clone;
          } else if (Array.isArray(geom.paths)) {
            const newPaths = geom.paths.map((path: any[]) =>
              path.map((c: any[]) => transform.forward([c[0], c[1]]))
            );
            const clone = typeof geom.clone === 'function' ? geom.clone() : { ...geom };
            clone.paths = newPaths;
            clone.spatialReference = targetSR;
            return clone;
          }
        }
      }
    } catch { }
    return null;
  },
  executeMany: (geoms: any[], targetSR: any): any[] => {
    return (geoms || []).map((g) => projectOperator.execute(g, targetSR));
  }
};
