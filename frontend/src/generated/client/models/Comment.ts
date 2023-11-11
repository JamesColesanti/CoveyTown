export type Comment = {
  id: string;
  author: string;
  text: string;
  dateCreated: string;
  replies: Array<Comment>;
  parentCommentId?: string;
};
