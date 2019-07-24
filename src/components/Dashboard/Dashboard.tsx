import React, { PureComponent } from 'react';

import { Signal } from '../Signal/Signal';
import { DashboardService } from './Dashboard.service';
import { ISignalData } from '../../interfaces';
import { SignalTypes, SignalValues, EventsType } from '../../enums';
import './Dashboard.style.less';

interface IState {
  staticTime: number;
  currentTime: number;
}


export class Dashboard extends PureComponent<{}, IState> {

  readonly state: IState = {
    staticTime: null,
    currentTime: null
  }
  private readonly svgRef: React.RefObject<SVGSVGElement> = React.createRef();
  private svg: SVGElement;
  private dashboardService: DashboardService;

  componentDidMount() {
    this.svg = this.svgRef.current;
    this.dashboardService = new DashboardService(this.svg);
    this.dashboardService.setScale(data[0].values);

    document.addEventListener(EventsType.Move, this.eventMoveHandler);
    document.addEventListener(EventsType.Click, this.eventClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener(EventsType.Move, this.eventMoveHandler);
    document.removeEventListener(EventsType.Click, this.eventClickHandler);
  }

  eventMoveHandler = (event: MouseEvent): void => {
    this.dashboardService.moveAxis(event);
  }

  eventClickHandler = (event: MouseEvent): void => {
    this.dashboardService.setAxis(event);
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header"/>

        <div className="dashboard-back">
          <svg
            ref={this.svgRef}
            preserveAspectRatio="xMinYMin meet"
            height="100%"
            width="100%"
          />
        </div>

        <div className="dashboard-signals">
          {data.map((s: ISignalData, i: number): JSX.Element =>
            <Signal {...s} key={s.name.replace(/[ ]/g, `${i}`)}/>
          )}
        </div>
      </div>
    );
  }
}

const data: ISignalData[] = [
  {
    name: 'Right Rear Turn Signal',
    values: [
      {
        type: SignalTypes.Data,
        from_ts: 1561631363959,
        to_ts: 1561631366354,
        value: SignalValues.Ok
      },
      {
        type: SignalTypes.Data,
        from_ts: 1561631366354,
        to_ts: 1561631370186,
        value: SignalValues.Warning
      },
      {
        type: SignalTypes.NoSignal,
        from_ts: 1561631370186,
        to_ts: 1561631373539
      },
      {
        type: SignalTypes.Data,
        from_ts: 1561631373539,
        to_ts: 1561631374018,
        value: SignalValues.Fail
      }
    ]
  },
  {
    name: 'Steering & Brakes',
    values: [
      {
        type: SignalTypes.Data,
        from_ts: 1561631363959,
        to_ts: 1561631370186,
        value: SignalValues.Ok
      },
      {
        type: SignalTypes.Data,
        from_ts: 1561631370186,
        to_ts: 1561631373539,
        value: SignalValues.Warning
      },
      {
        type: SignalTypes.NoSignal,
        from_ts: 1561631373539,
        to_ts: 1561631374018
      }
    ]
  }
];