import { Color } from '../../types/CoveyTownSocket';
import PixelColor from './PixelColor';
import WhiteboardCanvas from './WhiteboardCanvas';

describe('WhiteboardCanvas', () => {
  const testCanvas = new WhiteboardCanvas('test');
  const whiteColor: Color = new PixelColor(255, 255, 255, 1);
  const estimatedTime = new Date().getTime();

  it('Creates a new canvas with all pixels initialized to white', () => {
    expect(testCanvas.name).toBe('test');
    expect(estimatedTime - testCanvas.timeCreated).toBeLessThanOrEqual(10);
    expect(testCanvas.pixels[0].color).toEqual(new PixelColor(255, 255, 255, 1));
  });
});
