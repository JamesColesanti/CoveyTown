import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import TownsStore from '../../lib/TownsStore';
import { getLastEmittedEvent, mockPlayer, MockedPlayer, isWhiteboardArea } from '../../TestUtils';
import { TownsController } from '../TownsController';
import WhiteboardArea from './WhiteboardArea';
import { TownEmitter, Pixel, Interactable, NewPixelData } from '../../types/CoveyTownSocket';
import WhiteboardPixel from './WhiteboardPixel';
import PixelColor from './PixelColor';
import GalleryCanvas from './GalleryCanvas';

type TestTownData = {
  friendlyName: string;
  townID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

const broadcastEmitter = jest.fn();
describe('TownsController integration tests', () => {
  let controller: TownsController;

  const createdTownEmitters: Map<string, DeepMockProxy<TownEmitter>> = new Map();
  async function createTownForTesting(
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await controller.createTown({
      friendlyName,
      isPubliclyListed: isPublic,
      mapFile: 'testData/indoors.json',
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      townID: ret.townID,
      townUpdatePassword: ret.townUpdatePassword,
    };
  }

  beforeAll(() => {
    // Set the twilio tokens to dummy values so that the unit tests can run
    process.env.TWILIO_API_AUTH_TOKEN = 'testing';
    process.env.TWILIO_ACCOUNT_SID = 'ACtesting';
    process.env.TWILIO_API_KEY_SID = 'testing';
    process.env.TWILIO_API_KEY_SECRET = 'testing';
  });

  beforeEach(async () => {
    createdTownEmitters.clear();
    broadcastEmitter.mockImplementation((townID: string) => {
      const mockRoomEmitter = mockDeep<TownEmitter>();
      createdTownEmitters.set(townID, mockRoomEmitter);
      return mockRoomEmitter;
    });
    TownsStore.initializeTownsStore(broadcastEmitter);
    controller = new TownsController();
  });

  describe('Interactables', () => {
    let testingTown: TestTownData;
    let player: MockedPlayer;
    let sessionToken: string;
    let interactables: Interactable[];
    beforeEach(async () => {
      testingTown = await createTownForTesting(undefined, true);
      player = mockPlayer(testingTown.townID);
      await controller.joinTown(player.socket);
      const initialData = getLastEmittedEvent(player.socket, 'initialize');
      sessionToken = initialData.sessionToken;
      interactables = initialData.interactables;
    });

    describe('Create canvas in whiteboard area', () => {
      it('[Test Drawing] Returns an error message if the town ID is invalid', async () => {
        const whiteboardArea = interactables.find(isWhiteboardArea) as WhiteboardArea;
        const pixels: Pixel[] = [];
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            pixels.push(new WhiteboardPixel(x, y, new PixelColor(255, 255, 255, 1)));
          }
        }
        const newCanvas = {
          name: 'Test Drawing',
          pixels,
          timeCreated: 10,
        };
        await expect(
          controller.createNewCanvas(nanoid(), sessionToken, newCanvas),
        ).rejects.toThrow();
      });
      it('[Test Drawing] Checks for a valid session token before creating a canvas', async () => {
        const invalidSessionToken = nanoid();
        const pixels: Pixel[] = [];
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            pixels.push(new WhiteboardPixel(x, y, new PixelColor(255, 255, 255, 1)));
          }
        }
        const newCanvas = {
          name: 'Test Drawing',
          pixels,
          timeCreated: 10,
        };
        await expect(
          controller.createNewCanvas(testingTown.townID, invalidSessionToken, newCanvas),
        ).rejects.toThrow();
      });
    });
    describe('Interact with existing canvas', () => {
      // testing in progress
      it('[Test Drawing] Updates current canvas', async () => {
        const pixels: Pixel[] = [];
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            pixels.push(new WhiteboardPixel(x, y, new PixelColor(255, 255, 255, 1)));
          }
        }
        const newCanvas = {
          name: 'Test Drawing',
          pixels,
          timeCreated: 10,
        };
        const newPixelData: NewPixelData = { pixInd: 0, color: new PixelColor(0, 0, 0, 1) };
        await controller.createNewCanvas(testingTown.townID, sessionToken, newCanvas);
        const updatedCanvas = await controller.updateCanvas(
          testingTown.townID,
          sessionToken,
          newPixelData,
        );
        for (let i = 0; i < 25; i++) {
          if (i === 0) {
            expect(updatedCanvas?.pixels[i].color).toEqual(new PixelColor(0, 0, 0, 1));
          } else {
            expect(updatedCanvas?.pixels[i].color).toEqual(new PixelColor(255, 255, 255, 1));
          }
        }
      });
      it('[Test Drawing] Gets the canvas of whiteboard area', async () => {
        const pixels: Pixel[] = [];
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            pixels.push(new WhiteboardPixel(x, y, new PixelColor(255, 255, 255, 1)));
          }
        }
        const newCanvas = {
          name: 'Test Drawing',
          pixels,
          timeCreated: 10,
        };
        await controller.createNewCanvas(testingTown.townID, sessionToken, newCanvas);
        const actualCanvas = await controller.getCanvas(testingTown.townID, sessionToken);
        for (let i = 0; i < 25; i++) {
          expect(actualCanvas?.pixels[i].color).toEqual(new PixelColor(255, 255, 255, 1));
        }
      });
      it('[Test Drawing] Destroys the canvas of whiteboard area and moves it to gallery', async () => {
        const pixels: Pixel[] = [];
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            pixels.push(new WhiteboardPixel(x, y, new PixelColor(255, 255, 255, 1)));
          }
        }
        const newCanvas = {
          name: 'Test Drawing',
          pixels,
          timeCreated: 10,
        };
        await controller.createNewCanvas(testingTown.townID, sessionToken, newCanvas);
        const actualCanvas = await controller.getCanvas(testingTown.townID, sessionToken);
        for (let i = 0; i < 25; i++) {
          expect(actualCanvas?.pixels[i].color).toEqual(new PixelColor(255, 255, 255, 1));
        }
        await controller.destroyCanvas(testingTown.townID, sessionToken);
        const finalCanvas = await controller.getCanvas(testingTown.townID, sessionToken);
        expect(finalCanvas).toBeUndefined();
        const gallery = await controller.getGallery(testingTown.townID, sessionToken);
        const expectedGallery = [];
        expectedGallery.push(new GalleryCanvas('Test Drawing'));
        expect(gallery[0].name).toEqual(expectedGallery[0].name);
        for (let i = 0; i < 25; i++) {
          expect(expectedGallery[0].history[0][i].color).toEqual(new PixelColor(255, 255, 255, 1));
        }
      });
    });
  });
});
