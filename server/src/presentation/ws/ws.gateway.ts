import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/application/messages/messages.service';
import { LoggerService } from 'src/infra/logger/logger.service';

enum EventsMap {
  message = 'message',
  typing = 'typing',
  stop_typing = 'stop_typing',
  connected = 'connected',
  disconnected = 'disconnected',
  join = 'join',
  leave = 'leave',
}

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

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WSGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly messagesService: MessagesService,
  ) {
    this.logger.setContext(WSGateway.name);
  }

  @SubscribeMessage(EventsMap.join)
  async handleEvent(
    @MessageBody() data: Join,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<Ack>> {
    await socket.join(data.chatRoomId);

    this.logger.log(`User ${data.userId} joined room ${data.chatRoomId}`);

    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage(EventsMap.leave)
  async leave(
    @MessageBody() data: Leave,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<Ack>> {
    await socket.leave(data.chatRoomId);

    this.logger.log(`User ${data.userId} left room ${data.chatRoomId}`);

    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage(EventsMap.message)
  async findAll(
    @MessageBody() data: Message,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<Ack>> {
    try {
      await this.messagesService.createChatRoomMessage(
        data.chatRoomId,
        data.senderId,
        {
          content: data.content,
        },
      );

      socket.timeout(5000).to(data.chatRoomId).emit(EventsMap.message, data);
      this.logger.log(`Message sent to room ${data.chatRoomId}`);
      return {
        event: 'events',
        data: {
          timestamp: new Date(),
        },
      };
    } catch (error) {
      this.logger.error(`Error sending message to room ${data.chatRoomId}`, {
        error,
      });
      return {
        event: 'events',
        data: {
          timestamp: new Date(),
        },
      };
    }
  }

  @SubscribeMessage(EventsMap.typing)
  async typing(
    @MessageBody() data: TypingEvent,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<Ack>> {
    socket.timeout(5000).to(data.chatRoomId).emit(EventsMap.typing, data);
    this.logger.log(
      `User ${data.senderId} is typing in room ${data.chatRoomId}`,
    );

    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage(EventsMap.stop_typing)
  async stopTyping(
    @MessageBody() data: TypingEvent,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<Ack>> {
    socket.timeout(5000).to(data.chatRoomId).emit(EventsMap.stop_typing, data);
    this.logger.log(
      `User ${data.senderId} stopped typing in room ${data.chatRoomId}`,
    );

    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage(EventsMap.connected)
  async connected(@MessageBody() data: any): Promise<WsResponse<Ack>> {
    console.log('connected', data);
    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage(EventsMap.disconnected)
  async disconnected(@MessageBody() data: any): Promise<WsResponse<Ack>> {
    console.log('disconnected', data);
    return {
      event: 'events',
      data: {
        timestamp: new Date(),
      },
    };
  }
}
