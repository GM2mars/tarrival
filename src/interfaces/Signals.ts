import { SignalTypes, SignalValues } from '../enums';

export interface ISignals {
  from: number;
  to: number;
  middle: number;
  type: SignalTypes;
  value: SignalValues
}