import { nanoid } from 'nanoid';
import { Color, Pixel } from '../../types/CoveyTownSocket';

export default class WhiteboardPixel implements Pixel {
  private _id: string;

  private _x: number;

  private _y: number;

  private _color: Color;

  public get id() {
    return this._id;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get color() {
    return { r: this._color.r, g: this._color.g, b: this._color.b, a: this._color.a };
  }

  public set color(newColor: Color) {
    this._color = newColor;
  }

  public constructor(x: number, y: number, color: Color) {
    this._id = nanoid();
    this._x = x;
    this._y = y;
    this._color = color;
  }
}
