import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../../lib/Player';
import { getLastEmittedEvent } from '../../TestUtils';
import {
  Canvas,
  Comment,
  GalleryCanvasModel,
  NewPixelData,
  TownEmitter,
} from '../../types/CoveyTownSocket';
import WhiteboardArea from './WhiteboardArea';
import PixelColor from './PixelColor';
import WhiteboardCanvas from './WhiteboardCanvas';

describe('WhiteboardArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: WhiteboardArea;
  const townEmitter = mock<TownEmitter>();
  let newPlayer: Player;
  const id = nanoid();
  const comments: Comment[] = [];
  let testComment: Comment;
  let testCommentReply: Comment;
  let testCommentReplyReply: Comment;
  let testFakeCommentReply: Comment;
  let canvas: WhiteboardCanvas;
  const testCanvas: Canvas = {
    name: nanoid(),
    pixels: [],
    timeCreated: 0,
  };
  const gallery: GalleryCanvasModel[] = [];

  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new WhiteboardArea({ id, comments, gallery }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
    testComment = {
      id: nanoid(),
      author: nanoid(),
      text: nanoid(),
      dateCreated: nanoid(),
      replies: [],
    };
    testCommentReply = {
      id: nanoid(),
      author: nanoid(),
      text: nanoid(),
      dateCreated: nanoid(),
      replies: [],
      parentCommentId: testComment.id,
    };
    testCommentReplyReply = {
      id: nanoid(),
      author: nanoid(),
      text: nanoid(),
      dateCreated: nanoid(),
      replies: [],
      parentCommentId: testCommentReply.id,
    };
    testFakeCommentReply = {
      id: nanoid(),
      author: nanoid(),
      text: nanoid(),
      dateCreated: nanoid(),
      replies: [],
      parentCommentId: nanoid(),
    };
  });

  describe('Test Drawing', () => {
    it('Removes the player from the list of occupants and emits an interactableUpdate event', () => {
      // Add another player so that we are not also testing what happens when the last player leaves
      const extraPlayer = new Player(nanoid(), mock<TownEmitter>());
      testArea.add(extraPlayer);
      testArea.remove(newPlayer);

      expect(testArea.occupantsByID).toEqual([extraPlayer.id]);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({ id, comments, gallery });
    });
    it("Clears the player's interactableID and emits an update for their location", () => {
      testArea.remove(newPlayer);
      expect(newPlayer.location.interactableID).toBeUndefined();
      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toBeUndefined();
    });
    it('Does not clear area data when last player leaves', () => {
      const newPixelData: NewPixelData = { pixInd: 0, color: new PixelColor(237, 23, 23, 23) };
      testArea.updateCanvas(newPixelData);
      const newCanvas = testArea.currentCanvas;
      const newGallery = testArea.gallery;
      testArea.remove(newPlayer);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        id,
        comments,
        canvas: newCanvas,
        gallery: newGallery,
      });
    });
  });
  describe('add', () => {
    it('Adds the player to the occupants list', () => {
      expect(testArea.occupantsByID).toEqual([newPlayer.id]);
    });
    it("Sets the player's interactableID and emits an update for their location", () => {
      expect(newPlayer.location.interactableID).toEqual(id);

      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toEqual(id);
    });
  });
  test('[Test Drawing] toModel sets the ID, ', () => {
    const model = testArea.toModel();
    expect(model).toEqual({
      id,
      comments,
      canvas,
      gallery,
    });
  });
  test('[Test Drawing] updateModel sets canvas and comments', () => {
    const newId = 'spam';
    const newCanvas = new WhiteboardCanvas(newId);
    const newComments: Comment[] = [];
    const newGallery: GalleryCanvasModel[] = [];
    testArea.updateModel({
      id,
      canvas: newCanvas,
      comments: newComments,
      gallery: newGallery,
    });
    expect(testArea.id).toBe(id);
    expect(testArea.currentCanvas).toBe(newCanvas);
    expect(testArea.comments).toEqual(newComments);
    expect(testArea.gallery).toEqual(newGallery);
  });
  describe('[Test Drawing fromMapObject]', () => {
    it('Throws an error if the width or height are missing', () => {
      expect(() =>
        WhiteboardArea.fromMapObject(
          { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
          townEmitter,
        ),
      ).toThrowError();
    });
    it('Creates a new whiteboard area using the provided boundingBox and id, with default white canvas, and emitter', () => {
      const x = 30;
      const y = 20;
      const width = 10;
      const height = 20;
      const name = 'name';
      const val = WhiteboardArea.fromMapObject(
        { x, y, width, height, name, id: 10, visible: true },
        townEmitter,
      );
      expect(val.boundingBox).toEqual({ x, y, width, height });
      expect(val.id).toEqual(name);
      // expect(val.currentCanvas).toBeUndefined();
      expect(val.comments).toEqual([]);
      expect(val.gallery).toEqual([]);
      expect(val.occupantsByID).toEqual([]);
    });
  });
  describe('Comments', () => {
    it('Adds a new comment to the comment section', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testComment);
      expect(testArea.comments).toEqual([testComment]);
    });
    it('Does not add a new comment to the comment section when there is no canvas', () => {
      testArea.addComment(testComment);
      expect(testArea.comments).toEqual([]);
    });
    it('Does not add a new comment to the comment section when there is a parentCommentId that does not correspond to an existing comment', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testCommentReply);
      expect(testArea.comments).toEqual([]);
    });
    it('Adds a reply to an existing comment', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testComment);
      testArea.addComment(testCommentReply);
      expect(testArea.comments[0].replies).toEqual([testCommentReply]);
    });
    it('Adds a reply to an existing reply', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testComment);
      testArea.addComment(testCommentReply);
      testArea.addComment(testCommentReplyReply);
      expect(testArea.comments[0].replies[0].replies).toEqual([testCommentReplyReply]);
    });
    it('Does not add a reply when there is a parentCommentId that does not correspond to an existing comment', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testComment);
      testArea.addComment(testFakeCommentReply);
      expect(testArea.comments[0].replies).toEqual([]);
      expect(testArea.comments).not.toContain(testFakeCommentReply);
    });
    it('Clears all comments and replies', () => {
      testArea.createNewCanvas(testCanvas);
      testArea.addComment(testComment);
      testArea.addComment(testCommentReply);
      testArea.addComment(testCommentReplyReply);
      testArea.clearComments();
      expect(testArea.comments).toEqual([]);
    });
  });
});
