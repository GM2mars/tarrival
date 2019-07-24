import * as d3 from 'd3';

import { ISignalValue, ISignals, ISliceTime } from '../../interfaces';
import { SignalValues, SliceTimeSelectors } from '../../enums';
import { signalConfig } from './Signal.config';


export class SignalService {

  private svgElement: SVGElement;
  private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private scale: d3.ScaleLinear<number, number>;
  private scaleSignalValue: d3.ScaleQuantile<any>;

  constructor(svg: SVGElement) {
    this.svgElement = svg;
    this.svg = d3.select(svg);
  }

  private setScale = (values: ISignalValue[]): void => {
    const clientWidth: number = this.svg.property('clientWidth');

    //собираем все точки и вычисляем максимум и минимум
    const extent: [number, number] = d3.extent(values.reduce((res, v) => {
      res.push(v.from_ts, v.to_ts);
      return res;
    }, []));

    this.scale = d3.scaleLinear()
      .domain(extent)
      .range([0, clientWidth]);

    //зажимаем рейндж
    this.scale.clamp(true);
  }

  private setScaleColor = (values: ISignalValue[]): void => {
    //собираем все точки и типы сигналов
    const signalZones = values.reduce((res, s, i, arr) => {
      const value = s.value ? SignalValues[s.value] : SignalValues.NoSignal;

      res.points.push(this.scale(s.from_ts));
      res.value.push(value);

      //для последней точки берем последнее дначение времени
      if (i === arr.length - 1) {
        res.points.push(this.scale(s.to_ts));
      }

      return res;
    },
      { points: [], value: [] }
    );

    //скейлим типы сигналов на временные отрезки
    this.scaleSignalValue = d3.scaleQuantile()
      .domain(signalZones.points)
      .range(signalZones.value);
  }

  prepareSignalData = (values: ISignalValue[]): ISignals[] => {
    const clientHeight: number = this.svg.property('clientHeight');

    this.setScale(values);
    this.setScaleColor(values);

    //подготавливаем данные для отрисовки на графике
    return values.map((s: ISignalValue): ISignals =>
      ({
        from: this.scale(s.from_ts),
        to: this.scale(s.to_ts),
        middle: clientHeight / 2,
        type: s.type,
        value: s.value ? SignalValues[s.value] : SignalValues.NoSignal
      })
    );
  }

  //отрисовка основной линии сигнала
  drawLine = (signals: ISignals[]): void => {
    const toPath = d3.line();
    const signalLines: d3.Selection<any, ISignals, SVGElement, {}> = this.svg
      .selectAll('path.svg-signal-line')
      .data(signals);

    signalLines.exit().remove();

    signalLines
      .enter()
      .append('path')
      .classed('svg-signal-line', true)
      .merge(signalLines)
      .style('stroke', d => signalConfig[d.value].strokeColor)
      .style('stroke-dasharray', d => signalConfig[d.value].dash)
      .style('fill', 'transparent')
      .attr('d', d => toPath([
        [d.from, d.middle],
        [d.to, d.middle],
        [d.to, d.middle - 5],
        [d.to, d.middle + 5]
      ]));
  }

  //отрисовка лейбла вначале сигнала
  drawLabel = (signal: ISignals[]): void => {
    const signalLabel: d3.Selection<any, ISignals, SVGElement, {}> = this.svg
      .selectAll('g.svg-group-label')
      .data(signal);

    signalLabel.exit().remove();

    const labelGroup = signalLabel
      .enter()
      .append('g')
      .classed('svg-group-label', true);

    labelGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', d => d.middle - 1)
      .attr('width', d => signalConfig[d.value].labelWidth)
      .attr('height', 2)
      .style('fill', '#282828')
      .style('fill-opacity', '0.87');

    labelGroup
      .append('text')
      .attr('fill', d => signalConfig[d.value].strokeColor)
      .attr('x', d => d.from + 10)
      .attr('y', d => d.middle + 4)
      .text(d => signalConfig[d.value].text);
  }

  //отрисовка бейджев (а ля колбаски =)
  drawBage = (signals: ISignals[]): void => {
    const signalBage: d3.Selection<any, ISignals, SVGElement, {}> = this.svg
      .selectAll('g.svg-group-bage')
      .data(signals);

    signalBage.exit().remove();

    const bageGroup = signalBage
      .enter()
      .append('g')
      .classed('svg-group-bage', true);

    bageGroup
      .merge(signalBage)
      .attr('transform', d => `translate(${d.from}, ${d.middle / 2 - 2})`);

    bageGroup
      .append('path')
      .attr('d', d => signalConfig[d.value].path)
      .style('stroke', d => signalConfig[d.value].strokeColor)
      .style('stroke-width', 1)
      .style('fill', d => signalConfig[d.value].fillColor);

    bageGroup
      .append('text')
      .style('fill', '#fff')
      .attr('x', 5)
      .attr('y', d => d.middle - 5)
      .text(d => signalConfig[d.value].text);
  }

  setSliceTime = (event: MouseEvent) => {
    this.drawSliceTime(event.clientX, SliceTimeSelectors.Static);
  }

  moveSliceTime = (event: MouseEvent) => {
    this.drawSliceTime(event.clientX, SliceTimeSelectors.Current);
  }

  //отрисовка временного среза
  private drawSliceTime = (x: number, classSelector: SliceTimeSelectors): void => {
    const { left }: ClientRect = this.svgElement.getBoundingClientRect();
    const currentTime: number = this.scale.invert(x - left);
    const currentPoint: number = this.scale(currentTime);
    const currentValue: SignalValues = this.scaleSignalValue(currentPoint);
    const clientHeight: number = this.svg.property('clientHeight');
    const data: ISliceTime[] = [{
      point: currentPoint,
      value: currentValue,
      clientHeight
    }];

    const sliceTime: d3.Selection<any, ISliceTime, SVGElement, {}> = this.svg
      .selectAll(`g.${classSelector}`)
      .data(data);

    sliceTime.exit().remove();

    const sliceGroup = sliceTime
      .enter()
      .append('g')
      .classed(classSelector, true);
    sliceGroup
      .append('rect')
      .attr('x', 0)
      .attr('height', 2)
      .style('fill', '#282828')
      .style('fill-opacity', '0.87');
    sliceGroup
      .append('text')
      .attr('x', 15);
    sliceGroup
      .append('circle')
      .attr('cx', 0)
      .attr('r', 4);

    const mergesGroup = sliceTime.merge(sliceGroup);

    mergesGroup.attr('transform', d => `translate(${d.point}, 0)`);
    mergesGroup
      .select('rect')
      .attr('y', d => d.clientHeight / 2 - 1)
      .attr('width', d => signalConfig[d.value].labelWidth);

    mergesGroup
      .select('circle')
      .attr('cy', d => d.clientHeight / 2)
      .style('fill', d => signalConfig[d.value].fillColor)
      .style('stroke', d => signalConfig[d.value].strokeColor);
    mergesGroup
      .select('text')
      .style('fill', d => signalConfig[d.value].strokeColor)
      .attr('y', d => d.clientHeight / 2 + 4)
      .text(d => signalConfig[d.value].text);
  }
}
