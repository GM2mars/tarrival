import {
  SignalValues,
  BageFillColors,
  StrokeColors,
  BagePaths,
  LabelTexts,
  LabelWidths
} from '../enums';

export type TSignalsConfig = {
  [key in SignalValues]: ISignalConfig;
}

export interface ISignalConfig {
  path?: BagePaths;
  strokeColor: StrokeColors;
  fillColor?: BageFillColors;
  text: LabelTexts;
  labelWidth: LabelWidths;
  dash?: string;
}