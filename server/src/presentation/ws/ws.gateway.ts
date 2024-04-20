import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
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

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WSGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(WSGateway.name);
  }

  @SubscribeMessage(EventsMap.join)
  async handleEvent(
    @MessageBody() data: { chatRoomId: string; userId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<number>> {
    console.log(socket.connected);

    await socket.join(data.chatRoomId);

    this.logger.log(`User ${data.userId} joined room ${data.chatRoomId}`);

    return { event: 'events', data: 0 };
  }

  @SubscribeMessage(EventsMap.leave)
  async leave(
    @MessageBody() data: { chatRoomId: string; userId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<number>> {
    await socket.leave(data.chatRoomId);

    this.logger.log(`User ${data.userId} left room ${data.chatRoomId}`);

    return { event: 'events', data: 0 };
  }

  @SubscribeMessage(EventsMap.message)
  findAll(@MessageBody() data: any): string {
    console.log(data);
    return 'Hello';
  }

  @SubscribeMessage(EventsMap.typing)
  typing(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data);

    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage(EventsMap.stop_typing)
  stopTyping(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage(EventsMap.connected)
  connected(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage(EventsMap.disconnected)
  disconnected(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}
