import {property} from '../decorators';
import {Signal} from '@motion-canvas/core/lib/utils';
import {textLerp} from '@motion-canvas/core/lib/tweening';
import {Shape, ShapeProps} from './Shape';
import {rect, Rect} from '@motion-canvas/core/lib/types';

export interface TextProps extends ShapeProps {
  children?: string;
  text?: string;
}

export class Text extends Shape<TextProps> {
  protected static segmenter;

  static {
    try {
      this.segmenter = new (Intl as any).Segmenter(undefined, {
        granularity: 'grapheme',
      });
    } catch (e) {
      // do nothing
    }
  }

  @property('', textLerp)
  public declare readonly text: Signal<string, this>;

  public constructor({children, ...rest}: TextProps) {
    super(rest);
    if (children) {
      this.text(children);
    }
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.requestFontUpdate();
    this.applyStyle(context);
    context.font = this.layout.styles.font;
    context.textBaseline = 'middle';

    const parentRect = this.layout.element.getBoundingClientRect();
    const {width, height} = this.computedSize();
    const wrap = this.layout.styles.whiteSpace !== 'nowrap';
    const range = document.createRange();

    if (wrap) {
      let line = '';
      const lineRect = rect();
      for (const childNode of this.layout.element.childNodes) {
        if (!childNode.textContent) {
          continue;
        }

        range.selectNodeContents(childNode);
        const rangeRect = range.getBoundingClientRect();

        const x = width / -2 + rangeRect.left - parentRect.left;
        const y = height / -2 + rangeRect.top - parentRect.top;

        if (lineRect.y === y) {
          lineRect.width += rangeRect.width;
          line += childNode.textContent;
        } else {
          this.drawText(context, line, lineRect);
          lineRect.x = x;
          lineRect.y = y;
          lineRect.width = rangeRect.width;
          lineRect.height = rangeRect.height;
          line = childNode.textContent;
        }
      }

      this.drawText(context, line, lineRect);
    } else if (this.layout.element.firstChild) {
      range.selectNodeContents(this.layout.element.firstChild);
      const rangeRect = range.getBoundingClientRect();
      rangeRect.x = width / -2 + rangeRect.left - parentRect.left;
      rangeRect.y = height / -2 + rangeRect.top - parentRect.top;
      this.drawText(context, this.text(), rangeRect);
    }
  }

  protected drawText(
    context: CanvasRenderingContext2D,
    text: string,
    rect: Rect,
  ) {
    if (this.lineWidth() <= 0) {
      context.fillText(text, rect.x, rect.y + rect.height / 2, rect.width);
    } else if (this.strokeFirst()) {
      context.strokeText(text, rect.x, rect.y + rect.height / 2, rect.width);
      context.fillText(text, rect.x, rect.y + rect.height / 2, rect.width);
    } else {
      context.fillText(text, rect.x, rect.y + rect.height / 2, rect.width);
      context.strokeText(text, rect.x, rect.y + rect.height / 2, rect.width);
    }
  }

  protected override applyFontChanges() {
    super.applyFontChanges();
    const wrap = this.layout.styles.whiteSpace !== 'nowrap';
    const text = this.text();

    if (wrap && Text.segmenter) {
      this.layout.element.innerText = '';
      for (const word of Text.segmenter.segment(text)) {
        this.layout.element.appendChild(document.createTextNode(word.segment));
      }
    } else {
      this.layout.element.innerText = this.text();
    }

    if (wrap && !Text.segmenter) {
      console.error('Wrapping is not supported');
    }
  }
}
