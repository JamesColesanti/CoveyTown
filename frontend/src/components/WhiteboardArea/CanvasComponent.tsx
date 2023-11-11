import { Box, Button, Flex, HStack, SimpleGrid, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import format from 'date-fns/format';
import { ReactComponent as PixelStar } from './images/pixel_star.svg';
import { ReactComponent as DownloadIcon } from './images/file_download_white_24dp.svg';

export default function CanvasComponent({
  gridArray,
  canvasName,
}: {
  gridArray: JSX.Element[] | undefined;
  canvasName: string | undefined;
}): JSX.Element {
  // Attribution to https://medium.com/react-courses/save-react-component-as-png-jpeg-or-pdf-bdd626184693 for code to download as a png
  const ref = useRef<HTMLDivElement>(null);
  const getFileName = (fileType: string) =>
    `${format(new Date(), "'Masterpiece-'HH-mm-ss")}.${fileType}`;

  const downloadPng = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = `${getFileName('png')}`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.log(err);
      });
  }, [ref]);

  return (
    <Box>
      <Flex>
        <Box width='100%' padding='4' bg='white'>
          <HStack align='flex-start'>
            <VStack align='left' ml={2}>
              <HStack spacing={3}>
                <PixelStar width='24px' height='24px' />
                <Text className='font-face-arcade' fontSize='36px'>
                  {canvasName}
                </Text>
                <PixelStar width='24px' height='24px' />
              </HStack>
            </VStack>
            <Spacer />
            <Button
              colorScheme='purple'
              fontWeight='bold'
              borderRadius='md'
              _hover={{
                bgGradient: 'linear(to-r, red.500, yellow.500)',
              }}
              aria-label='Download as png'
              leftIcon={<DownloadIcon />}
              onClick={downloadPng}>
              Download .png
            </Button>
          </HStack>
          <div ref={ref}>
            <SimpleGrid width='100%' mt={6} mb={8} columns={53} spacing={0}>
              {gridArray}
            </SimpleGrid>
          </div>
        </Box>
      </Flex>
    </Box>
  );
}
