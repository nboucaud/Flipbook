import {initial, parser, signal} from './signal';
import {canvasStyleParser} from '../utils';
import type {CanvasStyle, PossibleCanvasStyle} from '../partials';
import {Signal} from '@motion-canvas/core/lib/signals';

export type CanvasStyleSignal<T> = Signal<PossibleCanvasStyle, CanvasStyle, T>;

export function canvasStyleSignal(): PropertyDecorator {
  return (target, key) => {
    signal()(target, key);
    parser(canvasStyleParser)(target, key);
    initial(null)(target, key);
  };
}
