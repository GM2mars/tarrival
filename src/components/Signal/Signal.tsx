import React, { PureComponent } from 'react';

import { SignalService } from './Signal.service';
import { ISignalData as IProps, ISignalValue, ISignals } from '../../interfaces';
import { SignalTypes, EventsType } from '../../enums';
import './Signal.style.less';


export class Signal extends PureComponent<IProps> {

  private readonly svgRef: React.RefObject<SVGSVGElement> = React.createRef();
  private signalService: SignalService;

  componentDidMount() {
    this.signalService = new SignalService(this.svgRef.current);

    this.drawSignals();
    this.setEvents();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  componentDidUpdate() {
    this.drawSignals();
  }

  setEvents = (): void => {
    window.addEventListener(
      EventsType.Resize,
      debounceEvent(this.forceUpdate.bind(this, this.drawSignals))
    );
    document.addEventListener(EventsType.Move, this.signalService.moveSliceTime);
    document.addEventListener(EventsType.Click, this.signalService.setSliceTime);
  }

  removeEvents = (): void => {
    window.removeEventListener(
      EventsType.Resize,
      debounceEvent(this.forceUpdate.bind(this, this.drawSignals))
    );
    document.removeEventListener(EventsType.Move, this.signalService.moveSliceTime);
    document.removeEventListener(EventsType.Click, this.signalService.setSliceTime);
  }

  drawSignals = (): void => {
    const values: ISignalValue[] = this.props.values;

    const signals: ISignals[] = this.signalService.prepareSignalData(values);
    const onSignalsFilter = (s: ISignals, i: number) => i && s.type === SignalTypes.Data;

    this.signalService.drawLine(signals);
    this.signalService.drawLabel([signals[0]]);
    this.signalService.drawBage(signals.filter(onSignalsFilter));
  }

  render() {
    return (
      <div className="signal-container">
        <div className="signal-name">{this.props.name}</div>
        <div className="signal-graph">
          <svg
            ref={this.svgRef}
            preserveAspectRatio="xMinYMin meet"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    );
  }
}

const debounceEvent = (callback: () => void, time: number = 10, interval: number = 0) =>
  (...args) => {
    clearTimeout(interval);
    interval = window.setTimeout(callback, time, ...args);
  };