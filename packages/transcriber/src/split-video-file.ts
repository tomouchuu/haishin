import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Worker } from 'worker_threads'
import probe from 'node-ffprobe'

import pathToData from './utils/path-to-data'

import { SplitVideoFileResponse } from '../types/responses'

const splitVideoFile = async function (filename: string, startTime: number): Promise<SplitVideoFileResponse> {
  const pathToFile = path.join('.', filename)

  let durationOfPart = 0
  let nextStartTime = startTime

  probe.sync = true
  const probeData = await probe(pathToFile)

  if (!probeData.error) {
    const currentStreamLength = parseInt(probeData.format.duration)
    nextStartTime = currentStreamLength
    durationOfPart = (currentStreamLength - startTime)
  } else {
    // TODO: Handle error, ie do nothing and wait for the next attempt
  }

  if (durationOfPart === 0) {
    // TODO: Handle error, ie do nothing and wait for the next attempt
  }

  const part = uuidv4()  
  const partFileName = pathToData(`stream-part-${part}.wav`)

  const workerPath = path.join(__dirname, 'utils/ffmpeg-splitter-worker.js');
  const ffmpegSplitWorker = new Worker(workerPath);

  ffmpegSplitWorker.postMessage({ 
    command: 'run', 
    pathToFile, startTime, durationOfPart
  });

  const splitFileData = await new Promise<Buffer>((resolve, reject) => {
    ffmpegSplitWorker.on('message', (message) => {
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message.output);
      }
    });
    ffmpegSplitWorker.on('error', reject);
    ffmpegSplitWorker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });

  await fs.promises.writeFile(partFileName, splitFileData)

  ffmpegSplitWorker.postMessage({ 
    command: 'shutdown',
  });

  return {
    partFileName,
    nextStartTime
  }
}

export default splitVideoFile;