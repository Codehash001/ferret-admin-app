import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { pinecone } from '@/utils/pinecone-client';

const deleteFilesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const FileName = req.body;
    
    if (!FileName) {
      return res.status(400).json({ message: 'FileName is required' });
    }

    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
      return res.status(500).json({ message: 'Pinecone index name is not set in environment variables' });
    }

    console.log(`Deleting file ${FileName} from Pinecone index: ${indexName}`);
    const index = pinecone.Index(indexName);

    const response = await index.deleteAll();
    console.log('Delete response:', response);

    res.status(200).json({ message: 'All files deleted successfully' });
  } catch (error:any) {
    console.error('Error deleting vector:', error);

    let errorMessage = 'Failed to delete vector';
    if (error.response) {
      errorMessage += `: ${error.response.data.message || error.response.statusText}`;
    }

    res.status(500).json({ message: errorMessage });
  }
};

export default deleteFilesHandler;
