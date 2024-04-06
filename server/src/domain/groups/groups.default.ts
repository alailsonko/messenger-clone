import { ContentTypes } from 'static/content-types.static';

export const Groups = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const UserGroupDefaultPermissions: {
  contentTypeId: string;
  permissions: string[];
}[] = [
  {
    contentTypeId: ContentTypes.Attachment.id,
    permissions: [
      ContentTypes.Attachment.Permission.add_Attachment.id,
      ContentTypes.Attachment.Permission.change_Attachment.id,
      ContentTypes.Attachment.Permission.delete_Attachment.id,
      ContentTypes.Attachment.Permission.read_Attachment.id,
    ],
  },
  {
    contentTypeId: ContentTypes.User.id,
    permissions: [
      ContentTypes.User.Permission.add_User.id,
      ContentTypes.User.Permission.change_User.id,
      ContentTypes.User.Permission.delete_User.id,
      ContentTypes.User.Permission.read_User.id,
    ],
  },
  {
    contentTypeId: ContentTypes.UserGroup.id,
    permissions: [ContentTypes.UserGroup.Permission.read_UserGroup.id],
  },
  {
    contentTypeId: ContentTypes.UserPermission.id,
    permissions: [
      ContentTypes.UserPermission.Permission.read_UserPermission.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Permission.id,
    permissions: [ContentTypes.Permission.Permission.read_Permission.id],
  },
  {
    contentTypeId: ContentTypes.ContentType.id,
    permissions: [ContentTypes.ContentType.Permission.read_ContentType.id],
  },
  {
    contentTypeId: ContentTypes.AdminLog.id,
    permissions: [ContentTypes.AdminLog.Permission.read_AdminLog.id],
  },
  {
    contentTypeId: ContentTypes.ChatRoom.id,
    permissions: [
      ContentTypes.ChatRoom.Permission.add_ChatRoom.id,
      ContentTypes.ChatRoom.Permission.change_ChatRoom.id,
      ContentTypes.ChatRoom.Permission.delete_ChatRoom.id,
      ContentTypes.ChatRoom.Permission.read_ChatRoom.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Message.id,
    permissions: [
      ContentTypes.Message.Permission.add_Message.id,
      ContentTypes.Message.Permission.change_Message.id,
      ContentTypes.Message.Permission.delete_Message.id,
      ContentTypes.Message.Permission.read_Message.id,
    ],
  },
  {
    contentTypeId: ContentTypes.UserChatRoom.id,
    permissions: [
      ContentTypes.UserChatRoom.Permission.add_UserChatRoom.id,
      ContentTypes.UserChatRoom.Permission.change_UserChatRoom.id,
      ContentTypes.UserChatRoom.Permission.delete_UserChatRoom.id,
      ContentTypes.UserChatRoom.Permission.read_UserChatRoom.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Like.id,
    permissions: [
      ContentTypes.Like.Permission.add_Like.id,
      ContentTypes.Like.Permission.change_Like.id,
      ContentTypes.Like.Permission.delete_Like.id,
      ContentTypes.Like.Permission.read_Like.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Comment.id,
    permissions: [
      ContentTypes.Comment.Permission.add_Comment.id,
      ContentTypes.Comment.Permission.change_Comment.id,
      ContentTypes.Comment.Permission.delete_Comment.id,
      ContentTypes.Comment.Permission.read_Comment.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Post.id,
    permissions: [
      ContentTypes.Post.Permission.add_Post.id,
      ContentTypes.Post.Permission.change_Post.id,
      ContentTypes.Post.Permission.delete_Post.id,
      ContentTypes.Post.Permission.read_Post.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Reaction.id,
    permissions: [
      ContentTypes.Reaction.Permission.add_Reaction.id,
      ContentTypes.Reaction.Permission.change_Reaction.id,
      ContentTypes.Reaction.Permission.delete_Reaction.id,
      ContentTypes.Reaction.Permission.read_Reaction.id,
    ],
  },
];
