import { SprintTypes } from '../enums/SprintTypes';
import { DetectedClimb } from '../interfaces/Climb';
import { Slope } from '../interfaces/Gpx';

export function autoDetectClimbs (slopes: Slope[]) {
  const simplifiedSlopes = simplifySlopes(slopes);
  const classifiedSlopes = classifySlopes(simplifiedSlopes);
  const upClassifiedSlopes = getUpClassifiedSlopes(classifiedSlopes);
  const detectedClimbs = getClimbs(upClassifiedSlopes);

  return detectedClimbs;
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

  for (const slope of slopes) {
    const actualSlopeType = getSlopeType(slope.slope);
    if(currentSlope?.type === actualSlopeType) {
      currentSlope.to = slope.slopeStartTrackDistance + slope.slopeDistance;
    }
    else {
      if(currentSlope !== null) {
        classifiedSlopes.push(currentSlope);
      }
      currentSlope = {
        from: slope.slopeStartTrackDistance,
        to: slope.slopeStartTrackDistance + slope.slopeDistance,
        type: actualSlopeType,
        slope: slope.slope,
        heightElevation: slope.slopeStartEle + (slope.slope * slope.slopeDistance)
      };
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

function getUpClassifiedSlopes (classifiedSlopes: ClassifiedSlope[], climbMergeThresold = 0.3, minLenght = 1000) {
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

  return mergedClassifiedSlopes.filter(slope => (slope.to - slope.from) > minLenght);
}


function getClimbs (classifiedSlopes: ClassifiedSlope[]) {
  const climbs: DetectedClimb[] = [];
  
  for (const classifiedSlope of classifiedSlopes) {
    const climbDifficulty = calculateClimbDifficulty(classifiedSlope.to - classifiedSlope.from, classifiedSlope.slope, classifiedSlope.heightElevation);
    if(climbDifficulty) {
      climbs.push(
        { 
          from: classifiedSlope.from,
          to: classifiedSlope.to,
          difficulty: climbDifficulty,
          length: classifiedSlope.to - classifiedSlope.from,
          slope: classifiedSlope.slope,
          elevation: classifiedSlope.slope * (classifiedSlope.to - classifiedSlope.from)
        });
    }
  }

  return climbs;
}

function calculateClimbDifficulty (lenght: number, slope: number, heightElevation: number) {
  let cotation = lenght / 1000 * slope * slope;
  const elevationCotation = heightElevation - 1000;
  if(elevationCotation > 0) {
    cotation = cotation + cotation * elevationCotation * 0.0001;
  }

  for (const climbClassification of climbClassifications) {
    if(cotation >= climbClassification.minpoints && cotation < climbClassification.maxpoints) {
      return climbClassification.sprintType;
    }
  }
  return null;
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
  slope: number;
  heightElevation: number;
}

const climbClassifications = [
  {
    sprintType: SprintTypes.Climb4,
    minpoints: 15,
    maxpoints: 90,
    thresholdTime: 180
  }, 
  {
    sprintType: SprintTypes.Climb3,
    minpoints: 90,
    maxpoints: 180,
    thresholdTime: 360
  },
  {
    sprintType: SprintTypes.Climb2,
    minpoints: 180,
    maxpoints: 360,
    thresholdTime: 720
  },
  {
    sprintType: SprintTypes.Climb1,
    minpoints: 360,
    maxpoints: 720,
    thresholdTime: 1440
  },
  {
    sprintType: SprintTypes.ClimbHC,
    minpoints: 720,
    maxpoints: 9999999999999,
    thresholdTime: 2400
  }
]