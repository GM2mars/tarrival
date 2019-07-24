import { SignalTypes, SignalValues } from '../enums';

export interface ISignalValue {
  type: SignalTypes,
  from_ts: number,
  to_ts: number,
  value?: SignalValues
}
