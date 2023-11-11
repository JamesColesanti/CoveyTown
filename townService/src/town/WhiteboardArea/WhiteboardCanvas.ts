import { Pixel } from '../../types/CoveyTownSocket';
import WhiteboardPixel from './WhiteboardPixel';

export default class WhiteboardCanvas {
  private _name: string;

  private _pixels: Pixel[];

  private _timeCreated: number;

  public constructor(name: string) {
    this._name = name;
    this._pixels = this._initializePixels();
    this._timeCreated = new Date().getTime();
  }

  public get name() {
    return this._name;
  }

  public get pixels() {
    return this._pixels;
  }

  public get timeCreated() {
    return this._timeCreated;
  }

  private _initializePixels(): Pixel[] {
    const pixArray = [];
    const whiteColor = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = 0; i < 53; i++) {
      for (let j = 0; j < 30; j++) {
        const pix: Pixel = new WhiteboardPixel(i, j, whiteColor);
        pixArray.push({ id: pix.id, x: pix.x, y: pix.y, color: pix.color });
      }
    }
    return pixArray;
  }
}
