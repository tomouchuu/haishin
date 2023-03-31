import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable, { Files } from "formidable"

import type { File } from "formidable"

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to save the file
const saveFile = async (file: File) => {
  const destinationPath = `./data/uploads/${file.originalFilename}`
  const data = fs.readFileSync(file.filepath)
  fs.writeFileSync(destinationPath, data)
  await fs.unlinkSync(file.filepath)
  return destinationPath;
};

// Function to handle file upload
const uploadFile = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files: Files) => {
      if (err) {
        reject(err);
      }
      const streamUrl = await saveFile(files.file as File)
      resolve(streamUrl);
    });
  });
};

// API route for downloading a file
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const fileName = req.query.filename as string; // Get filename from query parameter
    const filePath = path.join(process.cwd(), 'data', fileName); // Set file path

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Set headers to force file download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Read the file and send it as the response
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.status(404).end();
    }
  } else if (req.method === 'POST') {
    try {
      const streamUrl = await uploadFile(req); // Upload file
      res.writeHead(302, { Location: `/stream?url=${streamUrl.replace('./data/', '')}` }).end()
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  } else {
    res.status(405).end();
  }
};



// import fs from "fs"
// import formidable, { Files } from "formidable"

// import type { File } from "formidable"
// import type { NextApiRequest, NextApiResponse } from 'next'

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const form = new formidable.IncomingForm()
//   form.parse(req, async function (err, fields, files: Files) {
//     const streamUrl = await saveFile(files.file as File)
//     
//   });
// };

