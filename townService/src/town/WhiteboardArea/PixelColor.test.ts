import { Color } from '../../types/CoveyTownSocket';
import PixelColor from './PixelColor';

describe('PixelColor', () => {
  const whiteColor: Color = new PixelColor(255, 255, 255, 1);

  it('Creates a Color object for the color white', () => {
    expect(whiteColor.r).toBe(255);
    expect(whiteColor.g).toBe(255);
    expect(whiteColor.b).toBe(255);
    expect(whiteColor.a).toBe(1);
  });
});
