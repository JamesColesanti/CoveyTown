import { Box, Button, ButtonGroup, Input, Text, useToast } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWhiteboardAreaController } from '../../classes/TownController';
import { useComments } from '../../classes/WhiteboardAreaController';
import useTownController from '../../hooks/useTownController';
import { Comment } from '../../types/CoveyTownSocket';

export default function WhiteboardAreaCommentSection() {
  const coveyTownController = useTownController();
  const whiteboardAreaController = useWhiteboardAreaController();
  const comments = useComments(whiteboardAreaController);
  const [commentsList, setCommentsList] = useState<JSX.Element[] | undefined>([]);
  const [messageBody, setMessageBody] = useState('');
  const [isTextareaShown, setIsTextAreaShown] = useState('');
  const boxShadow = '0 0 100px rgba(0,0,0,0.1)';

  const toast = useToast();

  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTextareaShown) {
      // When the chat window is opened, we will focus on the text input.
      // This is so the user doesn't have to click on it to begin typing a message.
      textInputRef.current?.focus();
    }
  }, [isTextareaShown]);

  const addComment = useCallback(
    (comment: Comment) => {
      try {
        coveyTownController
          .addWhiteboardAreaComment(comment)
          .then(newComments => (whiteboardAreaController.comments = newComments));
        coveyTownController.emitWhiteboardAreaUpdate(whiteboardAreaController);
        toast({
          title: 'Comment added!',
          status: 'success',
        });
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to add comment',
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
    },
    [coveyTownController, toast, whiteboardAreaController],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageBody(event.target.value);
  };

  const addCommentUI = useCallback(
    (parentCommentId?: string) => {
      return isTextareaShown === (parentCommentId ? parentCommentId : 'main') ? (
        <div>
          <Input
            placeholder='Write a comment...'
            onChange={handleChange}
            onKeyDown={e => e.key === ' ' && setMessageBody(messageBody + ' ')}
            value={messageBody}
            ref={textInputRef}
            bgColor='whiteAlpha.500'
            boxShadow={boxShadow}
            border='hidden'
            _focus={{ bgColor: 'whiteAlpha.700', boxShadow: '0 0 100px rgba(0,0,0,0.3)' }}
            mb={3}
          />
          <ButtonGroup size='sm' spacing={3}>
            <Button
              colorScheme={messageBody ? 'purple' : 'gray'}
              onClick={() => {
                if (messageBody) {
                  setIsTextAreaShown('');
                  setMessageBody('');
                  const date = new Date();
                  const comment = {
                    id: nanoid(),
                    author: coveyTownController.userName,
                    text: messageBody,
                    dateCreated: date.toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    }),
                    replies: [],
                    parentCommentId: parentCommentId,
                  };
                  addComment(comment);
                }
              }}>
              {'Submit'}
            </Button>
            <Button
              onClick={() => {
                setIsTextAreaShown('');
                setMessageBody('');
              }}>
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      ) : parentCommentId ? (
        <Button
          colorScheme='purple'
          size='sm'
          variant='link'
          onClick={() => setIsTextAreaShown(parentCommentId)}>
          {'Reply'}
        </Button>
      ) : (
        <Input
          placeholder='Write a comment...'
          onClick={() => setIsTextAreaShown('main')}
          bgColor='whiteAlpha.500'
          boxShadow={boxShadow}
          border='hidden'
        />
      );
    },
    [addComment, coveyTownController.userName, isTextareaShown, messageBody],
  );

  useEffect(() => {
    function CommentUI({ comment }: { comment: Comment }): JSX.Element {
      return (
        <Box rounded='20px' overflow='hidden' boxShadow={boxShadow} p={8} mt={5} mb={5}>
          <Text
            as='span'
            color='purple.700'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='sm'
            textTransform='uppercase'
            isTruncated>
            {comment.author}
          </Text>
          <Text
            as='span'
            color='purple.700'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='sm'
            textTransform='uppercase'
            style={{ float: 'right' }}
            isTruncated>
            {comment.dateCreated}
          </Text>
          <Text fontSize='sm' mt={5} mb={5}>
            {comment.text}
          </Text>
          {addCommentUI(comment.id)}
          {comment.replies.length > 0 &&
            comment.replies.map(reply => CommentUI({ comment: reply }))}
        </Box>
      );
    }

    setCommentsList(comments.map(comment => CommentUI({ comment })));
  }, [comments, coveyTownController, addComment, isTextareaShown, messageBody, addCommentUI]);

  return (
    <div>
      {addCommentUI()}
      {commentsList}
    </div>
  );
}
