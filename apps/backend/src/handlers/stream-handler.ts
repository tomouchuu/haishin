import { setupStream } from "@haishin/transcriber"
import transcriberHandler from "./transcriber-handler"

function isUrl(str) {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return urlRegex.test(str);
}

export default function (io) {
  io.of('/').adapter.on('create-room', async (room) => {    
    console.log({ createRoom: room });

    if (isUrl(room)) {
      // Get the initial stream data
      const streamData = await setupStream(room);

      if (streamData.newStream) {
        // If it's a new stream start the transcriber after 10 seconds
        setTimeout(() => {
          console.log('Start transcribing')
          transcriberHandler(io, {
            url: streamData.originalUrl,
            filename: streamData.file,
            startTime: 0,
            prompt: '',
          })
        }, 10000);
      }

      return streamData;
    }
  });
  
  io.of('/').adapter.on('delete-room', (room) => {
    console.log({ deleteRoom: room });
  });
  
  io.of('/').adapter.on('join-room', (room) => {
    console.log({ joinRoom: room });
    if (isUrl(room)) {
      // We just want to join in progress so let's get the streamSetup only
      setTimeout(async () => {
        const streamData = await setupStream(room);
        return streamData;
      }, 5000);
    }
  });
  
  io.of('/').adapter.on('leave-room', (room) => {
    console.log({ leaveRoom: room });
  });
}
