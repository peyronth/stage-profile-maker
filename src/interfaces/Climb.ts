import { SprintTypes } from '../enums/SprintTypes';

export interface Climb {

}

export interface DetectedClimb {
  from: number;
  to: number;
  length: number;
  slope: number;
  elevation: number;
  difficulty: SprintTypes;
}