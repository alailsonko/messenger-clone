import { Socket, io } from 'socket.io-client';

export type Message = {
  senderId: string;
  chatRoomId: string;
  content: string;
  timestamp: Date;
};

export type TypingEvent = {
  senderId: string;
  chatRoomId: string;
};

export type Ack = {
  timestamp: Date;
};

export type Join = { chatRoomId: string; userId: string };

export type Leave = { chatRoomId: string; userId: string };

export type EventsMap = {
  message: (msg: Message) => void;
  typing: (typingEvent: TypingEvent) => void;
  stop_typing: (typingEvent: TypingEvent) => void;
  connected: (userId: string) => void;
  disconnected: (userId: string) => void;
  join: (join: Join) => void;
  leave: (leave: Leave) => void;
};

export type ListenEventsMap = {
  message: (msg: Message, callback: (ack: Ack) => void) => void;
  typing: (typingEvent: TypingEvent, callback: (ack: Ack) => void) => void;
  stop_typing: (typingEvent: TypingEvent, callback: (ack: Ack) => void) => void;
  connected: (userId: string, callback: (ack: Ack) => void) => void;
  disconnected: (userId: string, callback: (ack: Ack) => void) => void;
  join: (join: Join, callback: (ack: Ack) => void) => void;
  leave: (leave: Leave, callback: (ack: Ack) => void) => void;
};

export const socket: Socket<EventsMap, ListenEventsMap> = io(
  process.env.REACT_APP_BACKEND_URL!,
  {
    ackTimeout: 5000,
  }
);
