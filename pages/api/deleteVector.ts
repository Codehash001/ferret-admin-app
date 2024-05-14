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
import { pinecone } from '@/utils/pinecone-client';

const deleteFilesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {

    const FileName = req.body
    console.log(`deleting file ${FileName} from pinecone`)
    
    const index = pinecone.Index(process.env.PINECONE_INDEX ? process.env.PINECONE_INDEX :'');
    await index._deleteMany({
      pdfName: FileName 
    });
    res.status(200).json({ message: 'All files deleted successfully'});
  } catch (error) {
    console.error('Error deleting vector:', error);
    res.status(500).json({ message: 'Failed to delete vector' });
  }
};

export default deleteFilesHandler;