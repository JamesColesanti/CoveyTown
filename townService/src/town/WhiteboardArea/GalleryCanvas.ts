import { GalleryCanvasModel, Pixel } from '../../types/CoveyTownSocket';
import WhiteboardPixel from './WhiteboardPixel';

export default class GalleryCanvas implements GalleryCanvasModel {
  private _name: string;

  private _history: Array<Array<Pixel>>;

  public constructor(name: string) {
    this._name = name;
    this._history = [];
    this._history.push(this._initializePixels());
  }

  public get name() {
    return this._name;
  }

  public get history() {
    return this._history;
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
