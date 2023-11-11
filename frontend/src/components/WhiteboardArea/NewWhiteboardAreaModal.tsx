import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable, useWhiteboardAreaController } from '../../classes/TownController';
import { Canvas, NewPixelData } from '../../generated/client';
import useTownController from '../../hooks/useTownController';
import CanvasComponent from './CanvasComponent';
import { useCanvas } from '../../classes/WhiteboardAreaController';
import WhiteboardAreaCommentSection from './WhiteboardAreaCommentSection';
import { CompactPicker, ColorResult, RGBColor } from 'react-color';
import { EyeDropper, OnChangeEyedrop } from 'react-eyedrop';
import { ReactComponent as ColorizeIcon } from './images/colorize_white_24dp.svg';
import { GalleryCanvasModel } from '../../types/CoveyTownSocket';
import { ReactComponent as HeartUnfilled } from './images/favorite_border_white_24dp.svg';
import { ReactComponent as HeartFilled } from './images/favorite_white_24dp.svg';
import heartPixel from './images/sample_pixel_art.png';
import WhiteboardInstructions from './WhiteboardInstructions';

export default function NewWhiteboardModal(): JSX.Element {
  const coveyTownController = useTownController();
  const whiteboardAreaController = useWhiteboardAreaController();
  const newWhiteboard = useInteractable('whiteboardArea');

  const [canvasTitle, setCanvasTitle] = useState<string>('');
  const [canvasActive, setCanvasActive] = useState<boolean>(true);
  const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 0, a: 1 });
  const [gridArray, setGridArray] = useState<JSX.Element[] | undefined>([]);

  const [galleryViewAll, setGalleryViewAll] = useState<boolean>(true);
  const [galleryCanvasId, setGalleryCanvasId] = useState<number>(0);

  const [timeOfLastUpdate, setTimeOfLastUpdate] = useState<number>(0);

  const toast = useToast();

  const canvas = useCanvas(whiteboardAreaController);

  const [canvasArray, setCanvasArray] = useState<JSX.Element[] | undefined>([]);
  const [favoritesArray, setFavoritesArray] = useState<JSX.Element[] | undefined>([]);

  const [galleryLikeArray, setGalleryLikeArray] = useState<boolean[]>([false]);

  const makeInactive = () => setCanvasActive(false);
  const makeActive = () => setCanvasActive(true);

  const handleChange = (colorResult: ColorResult) => {
    setColor(colorResult.rgb);
  };

  function rgbToObj(rgb: string) {
    // Remove the leading "rgb" or "rgba" and the parentheses
    rgb = rgb.replace(/rgba?/i, '').replace(/\(|\)/g, '');

    // Splits the string by commas
    const parts = rgb.split(',');

    // Parses the parts into numbers
    const r = parseInt(parts[0], 10);
    const g = parseInt(parts[1], 10);
    const b = parseInt(parts[2], 10);
    const a = parts[3] ? parseFloat(parts[3]) : 1;

    // Returns the object with the rgb values
    return { r, g, b, a };
  }

  const pickNewColor = ({ rgb }: OnChangeEyedrop) => {
    const rgba = rgbToObj(rgb);
    setColor(rgba);
  };

  const isOpen = newWhiteboard !== undefined;

  const createWhiteboard = useCallback(async () => {
    if (newWhiteboard) {
      const canvasToCreate: Canvas = {
        name: canvasTitle,
        pixels: [],
        timeCreated: new Date().getMilliseconds(),
      };
      try {
        await coveyTownController.createNewCanvas(canvasToCreate);
        toast({
          title: 'Whiteboard Created!',
          status: 'success',
        });
        setCanvasTitle('');
        coveyTownController.unPause();
        coveyTownController.getCanvas().then(newCanvas => {
          whiteboardAreaController.canvas = newCanvas;
        });
        coveyTownController.emitWhiteboardAreaUpdate(whiteboardAreaController);
        coveyTownController.emitStartTimer();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create new whiteboard',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [newWhiteboard, canvasTitle, coveyTownController, toast, whiteboardAreaController]);

  const updateLikes = useCallback(
    async id => {
      const newArray = { ...galleryLikeArray };
      if (newArray[id]) {
        newArray[id] = false;
      } else {
        newArray[id] = true;
      }
      setGalleryLikeArray(newArray);
    },
    [galleryLikeArray],
  );

  const showTimelapse = useCallback(
    async id => {
      const initialGallery: GalleryCanvasModel[] = await coveyTownController.getGallery();
      if (initialGallery) {
        const numArrayCopies = initialGallery[id].history.length;
        for (let j = 0; j < numArrayCopies; j++) {
          setTimeout(() => {
            const ret: JSX.Element[] = [];
            const galleryGridArray = initialGallery[id].history[j].map(pix => (
              <Box
                key={pix.id}
                bg={`rgb(${pix.color.r}, ${pix.color.g}, ${pix.color.b})`}
                border='1px'
                borderColor='gray.200'
                height='20px'
                width='20px'
              />
            ));
            ret.push(
              <Box>
                <CanvasComponent
                  canvasName={initialGallery[id].name}
                  gridArray={galleryGridArray}
                />
                <HStack mt={4}>
                  <Button
                    colorScheme='purple'
                    onClick={() => {
                      showTimelapse(id);
                    }}>
                    Play again
                  </Button>
                  <Button
                    mr={4}
                    ml={4}
                    onClick={() => {
                      setGalleryViewAll(true);
                    }}>
                    Back
                  </Button>
                  <Button
                    colorScheme='purple'
                    aria-label='Favorite'
                    leftIcon={
                      galleryLikeArray[galleryCanvasId] ? <HeartFilled /> : <HeartUnfilled />
                    }
                    onClick={() => {
                      updateLikes(galleryCanvasId);
                    }}>
                    Favorite
                  </Button>
                </HStack>
              </Box>,
            );
            setCanvasArray(ret);
          }, 1000);
        }
      }
    },
    [coveyTownController, galleryCanvasId, galleryLikeArray, updateLikes],
  );

  const viewAllCanvases = useCallback(async () => {
    const initialGallery = await coveyTownController.getGallery();
    const ret: JSX.Element[] = [];
    const favoritesGallery: JSX.Element[] = [];
    let upperLimit = 0;
    if (canvas) {
      upperLimit = initialGallery.length - 1;
    } else {
      upperLimit = initialGallery.length;
    }
    if (initialGallery) {
      for (let i = 0; i < upperLimit; i++) {
        const numArrayCopies = initialGallery[i].history.length;
        const galleryGridArray = initialGallery[i].history[numArrayCopies - 1].map(pix => (
          <Box
            key={pix.id}
            bg={`rgb(${pix.color.r}, ${pix.color.g}, ${pix.color.b})`}
            border='1px'
            borderColor='gray.200'
            height='20px'
            width='20px'
          />
        ));
        ret.push(
          <Box>
            <CanvasComponent canvasName={initialGallery[i].name} gridArray={galleryGridArray} />
            <Box mt={4}>
              <Button
                colorScheme='purple'
                _hover={{
                  bgGradient: 'linear(to-r, red.500, yellow.500)',
                }}
                onClick={() => {
                  setGalleryViewAll(false);
                  setGalleryCanvasId(i);
                }}>
                View as Timelapse
              </Button>
            </Box>
          </Box>,
        );
        favoritesGallery.push(
          <Box>
            <CanvasComponent canvasName={initialGallery[i].name} gridArray={galleryGridArray} />
          </Box>,
        );
      }
    }
    setCanvasArray(ret);
    const updatedFavoritesArray = [];
    for (let i = 0; i < favoritesGallery.length; i++) {
      if (galleryLikeArray[i]) {
        updatedFavoritesArray.push(favoritesGallery[i]);
      }
    }
    setFavoritesArray(updatedFavoritesArray);
  }, [canvas, coveyTownController, galleryLikeArray]);

  const viewSingleCanvas = useCallback(async () => {
    const initialGallery = await coveyTownController.getGallery();
    if (initialGallery) {
      const ret: JSX.Element[] = [];
      const numArrayCopies = initialGallery[galleryCanvasId].history.length;
      const galleryGridArray = initialGallery[galleryCanvasId].history[numArrayCopies - 1].map(
        pix => (
          <Box
            key={pix.id}
            bg={`rgb(${pix.color.r}, ${pix.color.g}, ${pix.color.b})`}
            border='1px'
            borderColor='gray.200'
            height='20px'
            width='20px'
          />
        ),
      );
      ret.push(
        <Box>
          <CanvasComponent
            canvasName={initialGallery[galleryCanvasId].name}
            gridArray={galleryGridArray}
          />
          <Box mt={4}>
            <Button
              colorScheme='purple'
              _hover={{
                bgGradient: 'linear(to-r, red.500, yellow.500)',
              }}
              onClick={() => {
                showTimelapse(galleryCanvasId);
              }}>
              View as Timelapse
            </Button>
            <Button
              mr={4}
              ml={4}
              onClick={() => {
                setGalleryViewAll(true);
                viewAllCanvases();
              }}>
              Back
            </Button>
            <Button
              colorScheme='purple'
              aria-label='Favorite'
              leftIcon={galleryLikeArray[galleryCanvasId] ? <HeartFilled /> : <HeartUnfilled />}
              onClick={() => {
                updateLikes(galleryCanvasId);
              }}>
              Favorite
            </Button>
          </Box>
        </Box>,
      );
      setCanvasArray(ret);
    }
  }, [
    coveyTownController,
    galleryCanvasId,
    galleryLikeArray,
    showTimelapse,
    updateLikes,
    viewAllCanvases,
  ]);

  const closeModal = useCallback(() => {
    if (newWhiteboard) {
      coveyTownController.interactEnd(newWhiteboard);
    }
  }, [coveyTownController, newWhiteboard]);

  useEffect(() => {
    if (isOpen) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, isOpen, newWhiteboard]);

  const updateCanvas = useCallback(
    (newPixelData: NewPixelData) => {
      const currentTime = new Date().getTime();
      if (currentTime - timeOfLastUpdate > 1000) {
        coveyTownController
          .updateCanvas(newPixelData)
          .then(newCanvas => (whiteboardAreaController.canvas = newCanvas));
        coveyTownController.emitWhiteboardAreaUpdate(whiteboardAreaController);
        setTimeOfLastUpdate(currentTime);
      }
    },
    [coveyTownController, timeOfLastUpdate, whiteboardAreaController],
  );

  const getCanvas = useCallback(() => {
    coveyTownController
      .getCanvas()
      .then(newCanvas => (whiteboardAreaController.canvas = newCanvas));
  }, [coveyTownController, whiteboardAreaController]);

  useEffect(() => {
    async function getData() {
      const pixArray = canvas?.pixels;
      setGridArray(
        pixArray?.map(pix => {
          return (
            <Box
              key={pix.id}
              bg={`rgb(${pix.color.r}, ${pix.color.g}, ${pix.color.b})`}
              _hover={{ bg: '#C0DDF5', border: 'gray.300' }}
              border='1px'
              borderColor='gray.200'
              height='20px'
              width='20px'
              onClick={() => {
                if (canvasActive) {
                  const targetPixInd = canvas?.pixels.findIndex(otherPix => otherPix.id === pix.id);
                  if (targetPixInd) {
                    const newPixelData = {
                      pixInd: targetPixInd,
                      color: { r: color.r, g: color.g, b: color.b, a: color.a ? color.a : 1 },
                    };
                    updateCanvas(newPixelData);
                  }
                }
              }}
            />
          );
        }),
      );
    }
    getData();
  }, [canvas, canvasActive, color, coveyTownController, getCanvas, updateCanvas]);

  useEffect(() => {
    if (galleryViewAll) {
      viewAllCanvases();
    } else {
      viewSingleCanvas();
    }
  }, [galleryViewAll, viewAllCanvases, viewSingleCanvas]);

  return (
    <Modal
      size={'full'}
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to the Art Station!</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant='unstyled'>
            <TabList>
              <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Active Canvas</Tab>
              <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Canvas Gallery</Tab>
              <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Favorites</Tab>
              <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Instructions</Tab>
            </TabList>
            <TabPanels>
              {canvas ? (
                <TabPanel
                  bgGradient={[
                    'linear(to-tr, teal.300, yellow.400)',
                    'linear(to-t, blue.200, teal.500)',
                    'linear(to-b, orange.100, purple.300)',
                  ]}>
                  <HStack mt={2} mb={5} alignItems='top'>
                    <Box>
                      <VStack align='left' mr={2}>
                        <CompactPicker color={color} onChange={handleChange} />
                        <EyeDropper
                          onChange={pickNewColor}
                          onPickStart={makeInactive}
                          onPickEnd={makeActive}>
                          <ColorizeIcon />
                        </EyeDropper>
                      </VStack>
                    </Box>
                    <CanvasComponent canvasName={canvas?.name} gridArray={gridArray} />
                  </HStack>
                  <WhiteboardAreaCommentSection />
                </TabPanel>
              ) : (
                <TabPanel
                  bgGradient={[
                    'linear(to-tr, teal.300, yellow.400)',
                    'linear(to-t, blue.200, teal.500)',
                    'linear(to-b, orange.100, purple.300)',
                  ]}>
                  <form
                    onSubmit={ev => {
                      ev.preventDefault();
                      createWhiteboard();
                    }}>
                    <Box bg='white' borderRadius='lg' maxW='xl' mt={8} mb={8} padding={8}>
                      <FormControl>
                        <Heading fontSize='lg' mb='10'>
                          It looks there is currently no active canvas. Give the blank canvas a name
                          to get started!
                        </Heading>
                        <FormLabel htmlFor='topic'>Name of New Canvas</FormLabel>
                        <Input
                          id='topic'
                          placeholder='Give your masterpiece a zesty name!'
                          name='topic'
                          value={canvasTitle}
                          onChange={e => setCanvasTitle(e.target.value)}
                        />
                      </FormControl>
                      <ModalFooter mt={4}>
                        <Button
                          colorScheme='purple'
                          _hover={{
                            bgGradient: 'linear(to-r, red.500, yellow.500)',
                          }}
                          mr={3}
                          onClick={() => {
                            createWhiteboard();
                          }}>
                          Create
                        </Button>
                        <Button onClick={closeModal}>Cancel</Button>
                      </ModalFooter>
                    </Box>
                  </form>
                </TabPanel>
              )}
              {canvas ? (
                <TabPanel bgGradient='linear(red.100 0%, orange.100 45%, purple.100 70%)'>
                  <HStack mt={2} alignItems='top'>
                    <Box>
                      <Heading size='l' mb={4}>
                        No canvases exist yet for this town! Here is a sample piece for inspiration:
                      </Heading>
                      <Image mb={48} src={heartPixel} alt='pixel heart art' />
                    </Box>
                  </HStack>
                </TabPanel>
              ) : (
                <TabPanel bgGradient='linear(red.100 0%, orange.100 45%, purple.100 70%)'>
                  <HStack mt={2} alignItems='top'>
                    <Box>{canvasArray}</Box>
                  </HStack>
                </TabPanel>
              )}
              <TabPanel bgGradient='linear(red.100 0%, orange.100 45%, purple.100 70%)'>
                <HStack mt={2} alignItems='top'>
                  <Box>{favoritesArray}</Box>
                </HStack>
              </TabPanel>
              <TabPanel
                bgGradient={[
                  'linear(to-tr, teal.300, yellow.400)',
                  'linear(to-t, blue.200, teal.500)',
                  'linear(to-b, orange.100, purple.300)',
                ]}>
                <WhiteboardInstructions />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
