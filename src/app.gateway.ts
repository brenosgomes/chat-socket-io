import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket, Server } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/chat' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');
  public message = [];

  afterInit(server: any) {
    this.logger.log('Inicialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('messageServer')
  handleMessage(
    client: Socket,
    payload: { sender: string; message: string; likes: number },
  ) {
    this.message.push(payload);
    this.server.emit('messageClient', this.message);
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('likeMessageServer')
  handleLike(client: Socket, payload: { id: number }) {
    this.message[payload.id].likes++;
    this.server.emit('messageClient', this.message);
  }
}
