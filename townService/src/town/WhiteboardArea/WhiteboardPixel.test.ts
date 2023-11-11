import { Color } from '../../types/CoveyTownSocket';
import PixelColor from './PixelColor';
import WhiteboardPixel from './WhiteboardPixel';

describe('WhiteboardPixel', () => {
  const whiteColor: Color = new PixelColor(255, 255, 255, 1);
  const testPixel = new WhiteboardPixel(1, 1, whiteColor);

  it('Creates a new pixel', () => {
    expect(testPixel.x).toBe(1);
    expect(testPixel.y).toBe(1);
    expect(testPixel.color).toEqual(whiteColor);
  });
});
