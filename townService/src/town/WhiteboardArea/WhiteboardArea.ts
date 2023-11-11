import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../../lib/Player';
import {
  BoundingBox,
  Color,
  Comment,
  Pixel,
  Canvas as CanvasModel,
  TownEmitter,
  WhiteboardArea as WhiteboardAreaModel,
  NewPixelData,
  GalleryCanvasModel,
} from '../../types/CoveyTownSocket';
import GalleryCanvas from './GalleryCanvas';
import InteractableArea from '../InteractableArea';
import WhiteboardCanvas from './WhiteboardCanvas';

export default class WhiteboardArea extends InteractableArea {
  private _currentCanvas?: CanvasModel;

  private _comments: Comment[];

  private _gallery: GalleryCanvasModel[];

  public get comments() {
    return this._comments;
  }

  public get currentCanvas() {
    return this._currentCanvas;
  }

  public getCurrentCanvas() {
    return this._currentCanvas;
  }

  public get gallery() {
    return this._gallery;
  }

  /**
   * Creates a new WhiteboardArea
   *
   * @param whiteboardArea model containing this area's starting state
   * @param coordinates the bounding box that defines this viewing area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { id }: WhiteboardAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._comments = [];
    this._gallery = [];
  }

  public initializeCanvas(name: string) {
    this._currentCanvas = new WhiteboardCanvas(name);
    const galleryCanvas = new GalleryCanvas(name);
    this._gallery.push(galleryCanvas);
  }

  /**
   * Removes a player from this whiteboard area.
   *
   * The area should remain even when there are no players in it.
   *
   * @param player
   */
  public remove(player: Player): void {
    super.remove(player);
    this._emitAreaChanged();
  }

  /**
   * Updates the state of this WhiteboardArea, setting the pixels and comments properties
   *
   * @param posterSessionArea updated model
   */
  public updateModel(updatedModel: WhiteboardAreaModel) {
    this._currentCanvas = updatedModel.canvas;
    this._comments = updatedModel.comments;
  }

  /**
   * Updates the canvas using the given NewPixelData object. Also pushes a copy of the canvas
   * to the history array to be used later on in the gallery.
   * @param newPixelData object containing the index of the pixel that was changed and the new color
   */
  public updateCanvas(newPixelData: NewPixelData) {
    if (this._currentCanvas) {
      const pixelsCopy = this._currentCanvas.pixels.map(p => ({
        id: p.id,
        x: p.x,
        y: p.y,
        color: p.color,
      }));
      const galleryCanvas = this._gallery[this._gallery.length - 1];
      galleryCanvas.history.push(pixelsCopy);
      this._currentCanvas.pixels[newPixelData.pixInd].color = newPixelData.color;
    }
  }

  /**
   * Creates a new canvas for users to edit along with a corresponding gallery canvas copy
   * @param updatedModel the model used to create the new canvas
   */
  public createNewCanvas(updatedModel: CanvasModel) {
    this._currentCanvas = new WhiteboardCanvas(updatedModel.name);
    const galleryCanvas = new GalleryCanvas(updatedModel.name);
    this._gallery.push(galleryCanvas);
  }

  /**
   * Destroys the current canvas, which means simply setting the field to undefined.
   */
  public destroyCanvas() {
    if (this._currentCanvas) {
      this._currentCanvas = undefined;
    }
  }

  /**
   * Adds a new comment to the area.
   * @param newComment the object holding the data relating to the comment that is to be added
   */
  public addComment(newComment: Comment) {
    if (this._currentCanvas) {
      if (newComment.parentCommentId) {
        const foundComment = this._searchComment(this._comments, newComment.parentCommentId);
        if (foundComment) {
          foundComment.replies.push(newComment);
        }
      } else {
        this._comments.push(newComment);
      }
    }
  }

  /**
   * Searches for the existing comment that the user wants to reply to.
   * @param comments the current list of comments
   * @param id the id for the comment that the user wants to reply to
   * @returns the comment that the user wants to reply to
   */
  private _searchComment(comments: Comment[], id: string): Comment | undefined {
    for (const comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies) {
        const foundComment = this._searchComment(comment.replies, id);
        if (foundComment) {
          return foundComment;
        }
      }
    }
    return undefined;
  }

  /**
   * Clears the comments, which means simply setting the field to an empty array.
   */
  public clearComments() {
    this._comments = [];
  }

  /**
   * Creates a model representation of this area to be used for transmission to the frontend.
   * @returns a model representation of this area
   */
  public toModel(): WhiteboardAreaModel {
    if (this.currentCanvas) {
      return {
        id: this.id,
        canvas: {
          name: this.currentCanvas?.name,
          pixels: this.currentCanvas?.pixels,
          timeCreated: this.currentCanvas?.timeCreated,
        },
        comments: this.comments,
        gallery: this.gallery,
      };
    }
    return {
      id: this.id,
      canvas: this._currentCanvas,
      comments: this._comments,
      gallery: this._gallery,
    };
  }

  /**
   * Creates a new WhiteboardArea object that will represent a WhiteboardArea object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this whiteboard area exists
   * @param townEmitter An emitter that can be used by this whiteboard area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    townEmitter: TownEmitter,
  ): WhiteboardArea {
    if (!mapObject.width || !mapObject.height) {
      throw new Error('missing width/height for map object');
    }
    const canvas: CanvasModel = new WhiteboardCanvas(mapObject.name);
    const box = {
      x: mapObject.x,
      y: mapObject.y,
      width: mapObject.width,
      height: mapObject.height,
    };
    return new WhiteboardArea(
      { id: mapObject.name, canvas, comments: [], gallery: [] },
      box,
      townEmitter,
    );
  }
}
