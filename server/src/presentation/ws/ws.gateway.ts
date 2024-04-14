import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

enum EventsMap {
  message = 'message',
  typing = 'typing',
  stop_typing = 'stop_typing',
  connected = 'connected',
  disconnected = 'disconnected',
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
