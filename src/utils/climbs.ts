import GPXHelper from '../classes/GPXHelper';
import { Slope } from '../interfaces/Gpx';

export function autoDetectClimbs (slopes: Slope[]) {
  const simplifiedSlopes = simplifySlopes(slopes);
  const classifiedSlopes = classifySlopes(simplifiedSlopes);
  console.log(classifiedSlopes);
  console.log(getUpClassifiedSlopes(classifiedSlopes));
  
  //return classifiedSlopes;
}

/**
 * Simplify slopes by merging slopes into bigger ones of a fixed length
 *
 * @param {Slope[]} slopes
 * @return {Slope[]} 
 */
function simplifySlopes (slopes: Slope[]) {
  const slopeLength = 100;
  const mergedSlopes = [];
  let currentSlope = null;

  for (let i = 1; i < slopes.length; i++) {
    const slope = slopes[i];
    if(currentSlope === null) {
      currentSlope = slope;
    }
    else {
      currentSlope.slopeDistance += slope.slopeDistance;
      currentSlope.slope = (currentSlope.slope * currentSlope.slopeDistance + slope.slope * slope.slopeDistance) / (currentSlope.slopeDistance + slope.slopeDistance);
    }

    if(currentSlope.slopeDistance >= slopeLength) {
      mergedSlopes.push(currentSlope);
      currentSlope = null;
    }
  }

  return mergedSlopes;
}

function classifySlopes (slopes: Slope[]): ClassifiedSlope[] {
  const classifiedSlopes: ClassifiedSlope[] = [];
  let currentSlope: ClassifiedSlope | null  = null;

  for (let i = 0; i < slopes.length; i++) {
    const slope = slopes[i];
    const actualSlopeType = getSlopeType(slopes[i].slope);
    if(currentSlope?.type === actualSlopeType) {
      currentSlope.to = slope.slopeStartTrackDistance + slope.slopeDistance;
    }
    else {
      if(currentSlope !== null) {
        classifiedSlopes.push(currentSlope);
      }
      currentSlope = { from: slope.slopeStartTrackDistance, to: slope.slopeStartTrackDistance + slope.slopeDistance, type: actualSlopeType };
    }
  }

  return classifiedSlopes;
}

function getSlopeType (slope: number) {
  const upSlopeLimit= 3.5;
  const downSlopeLimit = -3.5;

  if(slope < downSlopeLimit) {
    return SlopeType.DOWN;
  }
  else if(slope > upSlopeLimit) {
    return SlopeType.UP;
  }
  else {
    return SlopeType.FLAT;
  }
}

function getUpClassifiedSlopes (classifiedSlopes: ClassifiedSlope[], climbMergeThresold = 0.3) {
  const ups =  classifiedSlopes.filter(slope => slope.type === SlopeType.UP);

  const mergedClassifiedSlopes: ClassifiedSlope[] = [];
  for (let i = 1; i < ups.length; i++) {
    const lastClassifiedSlope = mergedClassifiedSlopes[mergedClassifiedSlopes.length - 1];
    const actualClassifiedSlope = ups[i];
    if(lastClassifiedSlope) {

      const lastClassifiedSlopeLength = lastClassifiedSlope.to - lastClassifiedSlope.from;
      const distanceBetweenSlopes = actualClassifiedSlope.from - lastClassifiedSlope.to;

      if(distanceBetweenSlopes < lastClassifiedSlopeLength * climbMergeThresold) {
        lastClassifiedSlope.to = actualClassifiedSlope.to;
      }
      else {
        mergedClassifiedSlopes.push(actualClassifiedSlope);
      }
    }
    else {
      mergedClassifiedSlopes.push(actualClassifiedSlope);
    }
  }

  return mergedClassifiedSlopes;
}

function calculateClimbDifficulty (lenght: number, slope: number, heightElevation: number) {
  let cotation = lenght / 1000 * slope * slope;
  const elevationCotation = heightElevation - 1000;
  if(elevationCotation > 0) {
    cotation = cotation + cotation * elevationCotation * 0.0001;
  }
}

enum SlopeType {
  FLAT = 0,
  UP = 1,
  DOWN = 2
};

interface ClassifiedSlope {
  from: number;
  to: number;
  type: SlopeType;
}