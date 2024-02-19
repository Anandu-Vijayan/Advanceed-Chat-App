import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-1f1bd39a-ananduvijayan8-1197.a.aivencloud.com",
  port: 15506,
  username: "default",
  password: "AVNS_M7kTFre9NFnHMYozKae",
});

const sub = new Redis({
  host: "redis-1f1bd39a-ananduvijayan8-1197.a.aivencloud.com",
  port: 15506,
  username: "default",
  password: "AVNS_M7kTFre9NFnHMYozKae",
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("init Socket service ......");

    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe('MESSAGE')
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New socket connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        //publish this message to redis
        await pub.publish("MESSAGE",JSON.stringify(message));
      });
    });
    sub.on('message',(channel,message)=>{
      if(channel === 'MESSAGE'){
        io.emit('message',message)
      }
    })
  }

  get io() {
    return this._io;
  }
}
export default SocketService;
