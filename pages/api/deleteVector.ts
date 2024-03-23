// import { PineconeClient } from "@pinecone-database/pinecone";

// const pc = new PineconeClient()
// const index = pc.index("pinecone-index")

// const ns = index.namespace('example-namespace')
// // Delete one record by ID.
// await ns.deleteOne('id-1');
// // Delete more than one record by ID.
// await ns.deleteMany(['id-2', 'id-3']);

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const deleteFilesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
//   try {
//     const folderPath = path.join(process.cwd(), 'public', 'docs');

//     // Delete all files in the folder
//     fs.readdirSync(folderPath).forEach((file) => {
//       fs.unlinkSync(path.join(folderPath, file));
//     });

//     res.status(200).json({ message: 'All files deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting files:', error);
//     res.status(500).json({ message: 'Failed to delete files' });
//   }
};

export default deleteFilesHandler;