import { Users } from '../api/Api';
import { SearchUsersListType } from '../types';

export const toSearchUsersList = (users: Users[]): SearchUsersListType => {
  return users.map((user) => ({
    avatarSrc: process.env.REACT_APP_BACKEND_URL + '/' + user.avatar.url,
    fullname: user.firstName + ' ' + user.lastName,
    message: user.email,
    messageFrom: '',
    id: user.id,
  }));
};
