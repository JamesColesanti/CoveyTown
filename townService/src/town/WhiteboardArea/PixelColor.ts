import { Color } from '../../types/CoveyTownSocket';

export default class PixelColor implements Color {
  public readonly r: number;

  public readonly g: number;

  public readonly b: number;

  public readonly a: number;

  public constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
