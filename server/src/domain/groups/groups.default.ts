import { ContentTypes } from 'lib/content-types.static';

export enum EGroups {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type GroupDefaultPermissionType = {
  contentTypeId: string;
  permissions: string[];
};

export const userGroupDefaultPermissions: GroupDefaultPermissionType[] = [
  {
    contentTypeId: ContentTypes.Attachment.id,
    permissions: [
      ContentTypes.Attachment.permissions.add_Attachment.id,
      ContentTypes.Attachment.permissions.change_Attachment.id,
      ContentTypes.Attachment.permissions.delete_Attachment.id,
      ContentTypes.Attachment.permissions.read_Attachment.id,
    ],
  },
  {
    contentTypeId: ContentTypes.User.id,
    permissions: [
      ContentTypes.User.permissions.add_User.id,
      ContentTypes.User.permissions.change_User.id,
      ContentTypes.User.permissions.delete_User.id,
      ContentTypes.User.permissions.read_User.id,
    ],
  },
  {
    contentTypeId: ContentTypes.UserGroup.id,
    permissions: [ContentTypes.UserGroup.permissions.read_UserGroup.id],
  },
  {
    contentTypeId: ContentTypes.UserPermission.id,
    permissions: [
      ContentTypes.UserPermission.permissions.read_UserPermission.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Permission.id,
    permissions: [ContentTypes.Permission.permissions.read_Permission.id],
  },
  {
    contentTypeId: ContentTypes.ContentType.id,
    permissions: [ContentTypes.ContentType.permissions.read_ContentType.id],
  },
  {
    contentTypeId: ContentTypes.AdminLog.id,
    permissions: [ContentTypes.AdminLog.permissions.read_AdminLog.id],
  },
  {
    contentTypeId: ContentTypes.ChatRoom.id,
    permissions: [
      ContentTypes.ChatRoom.permissions.add_ChatRoom.id,
      ContentTypes.ChatRoom.permissions.change_ChatRoom.id,
      ContentTypes.ChatRoom.permissions.delete_ChatRoom.id,
      ContentTypes.ChatRoom.permissions.read_ChatRoom.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Message.id,
    permissions: [
      ContentTypes.Message.permissions.add_Message.id,
      ContentTypes.Message.permissions.change_Message.id,
      ContentTypes.Message.permissions.delete_Message.id,
      ContentTypes.Message.permissions.read_Message.id,
    ],
  },
  {
    contentTypeId: ContentTypes.UserChatRoom.id,
    permissions: [
      ContentTypes.UserChatRoom.permissions.add_UserChatRoom.id,
      ContentTypes.UserChatRoom.permissions.change_UserChatRoom.id,
      ContentTypes.UserChatRoom.permissions.delete_UserChatRoom.id,
      ContentTypes.UserChatRoom.permissions.read_UserChatRoom.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Comment.id,
    permissions: [
      ContentTypes.Comment.permissions.add_Comment.id,
      ContentTypes.Comment.permissions.change_Comment.id,
      ContentTypes.Comment.permissions.delete_Comment.id,
      ContentTypes.Comment.permissions.read_Comment.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Post.id,
    permissions: [
      ContentTypes.Post.permissions.add_Post.id,
      ContentTypes.Post.permissions.change_Post.id,
      ContentTypes.Post.permissions.delete_Post.id,
      ContentTypes.Post.permissions.read_Post.id,
    ],
  },
  {
    contentTypeId: ContentTypes.Reaction.id,
    permissions: [
      ContentTypes.Reaction.permissions.add_Reaction.id,
      ContentTypes.Reaction.permissions.change_Reaction.id,
      ContentTypes.Reaction.permissions.delete_Reaction.id,
      ContentTypes.Reaction.permissions.read_Reaction.id,
    ],
  },
];
