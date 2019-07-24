import {
  SignalValues,
  BageFillColors,
  StrokeColors,
  BagePaths,
  LabelTexts,
  LabelWidths
} from '../../enums';
import { TSignalsConfig } from '../../interfaces'

export const signalConfig: TSignalsConfig  = {
  [SignalValues.Ok]: {
    path: BagePaths.Ok,
    strokeColor: StrokeColors.Ok,
    fillColor: BageFillColors.Ok,
    text: LabelTexts.Ok,
    labelWidth: LabelWidths.Ok
  },
  [SignalValues.Warning]: {
    path: BagePaths.Warning,
    strokeColor: StrokeColors.Warning,
    fillColor: BageFillColors.Warning,
    text: LabelTexts.Warning,
    labelWidth: LabelWidths.Warning
  },
  [SignalValues.Fail]: {
    path: BagePaths.Fail,
    strokeColor: StrokeColors.Fail,
    fillColor: BageFillColors.Fail,
    text: LabelTexts.Fail,
    labelWidth: LabelWidths.Fail
  },
  [SignalValues.NoSignal]: {
    strokeColor: StrokeColors.NoSignal,
    fillColor: BageFillColors.NoSignal,
    text: LabelTexts.NoSignal,
    labelWidth: LabelWidths.NoSignal,
    dash: '8, 3'
  }
};