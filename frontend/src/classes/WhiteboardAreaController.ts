import { EventEmitter } from 'events';
import { useEffect, useState } from 'react';
import TypedEventEmitter from 'typed-emitter';
import { GalleryCanvasModel } from '../generated/client';
import { Comment, WhiteboardArea as WhiteboardAreaModel, Canvas } from '../types/CoveyTownSocket';

/**
 * The events that a WhiteboardAreaController can emit
 */
export type WhiteboardAreaEvents = {
  /**
   * A whiteboardAreaPixelChange event indicates that a single pixel on the whiteboard area has changed.
   * Listeners are passed the new state in new pixel.
   */
  canvasChange: (canvas: Canvas | undefined) => void;
  /**
   * A whiteboardAreaCommentChange event indicates that the comments on the whiteboard area have changed.
   * Listeners are passed the new comments.
   */
  commentsChange: (comments: Comment[]) => void;
};

/**
 * A WhiteboardAreaController manages the state for a WhiteboardArea in the frontend app, serving as a bridge between the whiteboard
 * that is being displayed in the user's browser and the backend TownService, and ensuring that like updates are
 * synchronized across all the players looking at the whiteboard.
 *
 * The WhiteboardAreaController implements callbacks that handle events from the whiteboard in this browser window, and
 * emits updates when the state is updated, @see WhiteboardAreaEvents
 */
export default class WhiteboardAreaController extends (EventEmitter as new () => TypedEventEmitter<WhiteboardAreaEvents>) {
  private _model: WhiteboardAreaModel;

  private _galleryCanvasLikes: number[];

  /**
   * Constructs a new WhiteboardAreaController, initialized with the state of the
   * provided whiteboardAreaModel.
   *
   * @param whiteboardAreaModel The whiteboard area model that this controller should represent
   */
  constructor(whiteboardAreaModel: WhiteboardAreaModel) {
    super();
    this._model = whiteboardAreaModel;
    this._galleryCanvasLikes = [];
  }

  /**
   * The ID of the whiteboard area represented by this whiteboard area controller
   * This property is read-only: once a WhiteboardAreaController is created, it will always be
   * tied to the same whiteboard area ID.
   */
  public get id(): string {
    return this._model.id;
  }

  /**
   * The canvas of the whiteboard assigned to this area, or undefined if there is not one.
   */
  public get canvas(): Canvas | undefined {
    return this._model.canvas;
  }

  public set canvas(updatedCanvas: Canvas | undefined) {
    if (updatedCanvas && this._model.canvas !== updatedCanvas) {
      this._model.canvas = {
        name: updatedCanvas?.name,
        pixels: updatedCanvas?.pixels,
        timeCreated: updatedCanvas?.timeCreated,
      };
      this.emit('canvasChange', this._model.canvas);
    } else {
      this._model.canvas = undefined;
      this.emit('canvasChange', this._model.canvas);
    }
  }

  /**
   * The comments assigned to this area
   */
  public get comments(): Comment[] {
    return this._model.comments;
  }

  public set comments(comments: Comment[]) {
    if (this._model.comments !== comments) {
      this._model.comments = comments;
      this.emit('commentsChange', comments);
    }
  }

  /**
   * The gallery assigned to this area
   */
  public set gallery(gallery: GalleryCanvasModel[]) {
    this._model.gallery = gallery;
  }

  /**
   * @returns whiteboardAreaModel that represents the current state of this whiteboardAreaController
   */
  public whiteboardAreaModel(): WhiteboardAreaModel {
    const modelCanvas = this._model.canvas;
    if (modelCanvas) {
      const pixelsOriginal = modelCanvas.pixels;
      const pixelsParsed = [];
      for (let i = 0; i < pixelsOriginal.length; i++) {
        pixelsParsed.push({
          id: pixelsOriginal[i].id,
          x: pixelsOriginal[i].x,
          y: pixelsOriginal[i].y,
          color: pixelsOriginal[i].color,
        });
      }
      const outputCanvas = {
        name: modelCanvas?.name,
        pixels: pixelsParsed,
        timeCreated: modelCanvas?.timeCreated,
      };
      return {
        id: this._model.id,
        canvas: outputCanvas,
        comments: this._model.comments,
        gallery: this._model.gallery,
      };
    }
    return this._model;
  }

  /**
   * Applies updates to this whiteboardArea controller's model, setting the fields
   * from the updatedModel
   *
   * @param updatedModel
   */
  public updateFrom(updatedModel: WhiteboardAreaModel): void {
    const modelCanvas = updatedModel.canvas;
    if (modelCanvas?.name || modelCanvas?.pixels) {
      const pixelsOriginal = modelCanvas.pixels;
      const pixelsParsed = [];
      for (let i = 0; i < pixelsOriginal.length; i++) {
        pixelsParsed.push({
          id: pixelsOriginal[i].id,
          x: pixelsOriginal[i].x,
          y: pixelsOriginal[i].y,
          color: pixelsOriginal[i].color,
        });
      }
      this.canvas = {
        name: modelCanvas?.name,
        pixels: pixelsParsed,
        timeCreated: modelCanvas?.timeCreated,
      };
    }
    this.comments = updatedModel.comments;
  }

  /**
   * Destroys a canvas, setting it to undefined and setting comments back to an empty list
   *
   */
  public destroyCanvas(): void {
    this.canvas = undefined;
    this.comments = [];
  }
}

/**
 * A hook that returns the pixels for the whiteboard area with the given controller
 */
export function useCanvas(controller: WhiteboardAreaController): Canvas | undefined {
  const [canvas, setCanvas] = useState(controller.canvas);
  useEffect(() => {
    controller.addListener('canvasChange', setCanvas);
    return () => {
      controller.removeListener('canvasChange', setCanvas);
    };
  }, [controller]);
  return canvas;
}

/**
 * A hook that returns the comments for the whiteboard area with the given controller
 */
export function useComments(controller: WhiteboardAreaController): Comment[] {
  const [comments, setComments] = useState(controller.comments);
  useEffect(() => {
    controller.addListener('commentsChange', setComments);
    return () => {
      controller.removeListener('commentsChange', setComments);
    };
  }, [controller]);
  return comments;
}
