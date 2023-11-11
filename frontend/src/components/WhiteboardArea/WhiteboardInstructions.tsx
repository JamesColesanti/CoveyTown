import { AspectRatio, Box, Text, Heading, Link } from '@chakra-ui/react';
import React from 'react';

export default function WhiteboardInstructions(): JSX.Element {
  return (
    <Box bg='white' borderRadius='lg' maxW='1200px' mt={8} mb={8} padding={8}>
      <Heading fontSize='xl' mb={4}>
        Welcome to our Pixel Art Station!
      </Heading>
      <Text mb={8}>
        Inspired by r/place, our collaborative art canvas is a place for CoveyTown players to work
        together to create pixel artwork. Pixel Art is a form of digital art created using software.
        To get started, create a canvas or join the existing one. Canvases are active for 72 hours
        before the next one is created, but you can download your work at anytime as a PNG, and
        watch back the process in the gallery via our timelapse feature! You can learn more about
        pixel art{' '}
        <Link
          color='purple.500'
          href='https://pegboard.store/en/blogs/createur-d-interactions/pixel-art#:~:text=Pixel%20Art%20is%20a%20form,colors%20used%20is%20extremely%20limited.'
          isExternal>
          here,{' '}
        </Link>
        as well as in the tutorial below!
      </Text>
      <AspectRatio maxW='1120px' ratio={16 / 9}>
        <iframe
          title='Pixel Art tutorial'
          src='https://www.youtube.com/embed/lfR7Qj04-UA'
          allowFullScreen
        />
      </AspectRatio>
    </Box>
  );
}
