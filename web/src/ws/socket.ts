import { Socket, io } from 'socket.io-client';

export type Message = {
  senderId: string;
  chatRoomId: string;
  text: string;
  timestamp: Date;
};

export type TypingEvent = {
  senderId: string;
  chatRoomId: string;
};

export type ChatRoom = {
  name: string;
  userIds: string[];
};

export type Ack = {
  timestamp: Date;
};

export type EventsMap = {
  message: (msg: Message) => void;
  typing: (typingEvent: TypingEvent) => void;
  stop_typing: (typingEvent: TypingEvent) => void;
  connected: (userId: string) => void;
  disconnected: (userId: string) => void;
};

export type ListenEventsMap = {
  message: (msg: Message, callback: (ack: Ack) => void) => void;
  typing: (typingEvent: TypingEvent, callback: (ack: Ack) => void) => void;
  stop_typing: (typingEvent: TypingEvent, callback: (ack: Ack) => void) => void;
  connected: (userId: Ack) => void;
  disconnected: (userId: Ack) => void;
};

export const socket: Socket<EventsMap, ListenEventsMap> = io(
  process.env.REACT_APP_BACKEND_URL!,
  {
    ackTimeout: 5000,
  }
);
