import * as d3 from 'd3';

import { ISignalValue } from '../../interfaces';
import { AxisSelectors } from '../../enums';

const offsetRight = 200;


export class DashboardService {

  private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private scale: d3.ScaleLinear<number, number>;
  private clientHeight: number;
  private staticTimePoint: number;

  constructor(svg: SVGElement) {
    this.svg = d3.select(svg);
    this.clientHeight = this.svg.property('clientHeight');
  }

  setScale = (values: ISignalValue[]): void => {
    const clientWidth: number = this.svg.property('clientWidth');

    const extent: [number, number] = d3.extent(values.reduce((res, v) => {
      res.push(v.from_ts, v.to_ts);
      return res;
    }, []));

    //point X to time
    this.scale = d3.scaleLinear()
      .domain([offsetRight, clientWidth])
      .range(extent);

    this.scale.clamp(true);
  }

  moveAxis = (event: MouseEvent): void => {
    const { clientX }: MouseEvent = event;

    if (clientX > offsetRight) {
      this.drawAxis(clientX, AxisSelectors.Current);

      if (this.staticTimePoint) {
        this.drawCurrentOffsetTime(clientX);
      }
    }
  }

  setAxis = (event: MouseEvent): void => {
    const { clientX }: MouseEvent = event;

    if (clientX > offsetRight) {
      this.staticTimePoint = this.scale(clientX);
      this.drawAxis(event.clientX, AxisSelectors.Static);
      this.drawStaticTime(event.clientX);
    }
  }

  private drawAxis = (x: number, classSelector: AxisSelectors): void => {
    const axis: d3.Selection<any, number, SVGElement, {}> = this.svg
      .selectAll(`line.${classSelector}`)
      .data([x]);

    axis
      .enter()
      .append('line')
      .classed(classSelector, true)
      .style('stroke', '#7A7A7A')
      .style('stroke-width', '1')
      .merge(axis)
      .attr('x1', d => d)
      .attr('y1', 0)
      .attr('x2', d => d)
      .attr('y2', this.clientHeight);
  }

  private drawStaticTime = (x: number): void => {
    const width = 200;
    const height = 24;
    const date = new Date(this.scale(x));
    const data = {
      posX: x - (width / 2),
      text: date.toLocaleString()
    };
    const staticTime: d3.Selection<any, {posX: number, text: string}, SVGElement, {}> = this.svg
      .selectAll('g.svg-static-time')
      .data([data]);

    staticTime.exit().remove();

    const staticTimeGroup = staticTime
      .enter()
      .append('g')
      .classed('svg-static-time', true);

    staticTimeGroup
      .append('rect')
      .attr('y', 0)
      .attr('x', 0)
      .attr('width', width)
      .attr('height', height);

    staticTimeGroup
      .append('text')
      .attr('y', 16);

    const mergeStaticTime = staticTime.merge(staticTimeGroup);

    mergeStaticTime
      .attr('transform', d => `translate(${d.posX}, 0)`);

    mergeStaticTime
      .select('text')
      .text(d => d.text)
      .attr('x', 50);
  }

  private drawCurrentOffsetTime = (x: number): void => {
    const width = 53;
    const height = 24;
    const data = {
      posX: x - (width / 2),
      text: this.getDifferenceTimeFormat(x)
    };
    const offsetTime: d3.Selection<any, {posX: number, text: string}, SVGElement, {}> = this.svg
      .selectAll('g.svg-current-time')
      .data([data]);

    offsetTime.exit().remove();

    const offsetTimeGroup = offsetTime
      .enter()
      .append('g')
      .classed('svg-current-time', true);

    offsetTimeGroup
      .append('rect')
      .attr('y', 0)
      .attr('x', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', '#000000')
      .style('stroke', '#FFFFFF');

    offsetTimeGroup
      .append('text')
      .attr('y', 16);

    const mergeOffsetTime = offsetTime.merge(offsetTimeGroup);

    mergeOffsetTime
      .attr('transform', d => `translate(${d.posX}, 0)`);

    mergeOffsetTime
      .select('text')
      .text(d => d.text)
      .attr('x', 7);
  }

  private getDifferenceTimeFormat = (x: number): string => {
    const time = this.scale(x) - this.staticTimePoint;
    const sec = (time / 1000).toFixed(2);

    return `${time > 0 ? '+' : ''}${sec}s`;
  }

}
