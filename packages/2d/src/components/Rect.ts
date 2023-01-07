import {SignalValue} from '@motion-canvas/core/lib/utils';
import {PossibleSpacing, Rect as RectType} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {drawRoundRect} from '../utils';
import {spacingProperty, SpacingProperty} from '../decorators/spacingProperty';

export interface RectProps extends ShapeProps {
  radius?: SignalValue<PossibleSpacing>;
}

export class Rect extends Shape {
  @spacingProperty('radius')
  public declare readonly radius: SpacingProperty<this>;

  public constructor(props: RectProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const radius = this.radius();
    const rect = RectType.fromSizeCentered(this.size());
    drawRoundRect(path, rect, radius);

    return path;
  }

  protected override getCacheRect(): RectType {
    return super.getCacheRect().expand(this.rippleSize());
  }

  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const rippleSize = this.rippleSize();
    const radius = this.radius().addScalar(rippleSize);
    const rect = RectType.fromSizeCentered(this.size()).expand(rippleSize);
    drawRoundRect(path, rect, radius);

    return path;
  }
}
