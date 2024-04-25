export interface IAttachment {
  id: string;
  file: string;
  messageId: string;
  postId: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
}
