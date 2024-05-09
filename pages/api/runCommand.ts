import { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders';
import { CustomPDFLoader } from "@/utils/customPDFLoader";

import { DirectoryLoader } from 'langchain/document_loaders';

const filePath = 'public/docs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

      const chatbotnamespace = req.body;
      console.log(chatbotnamespace)
      /*load raw docs from the all files in the directory */
      const directoryLoader = new DirectoryLoader(filePath, {
        '.pdf': (path) => new CustomPDFLoader(path),
      });
  
      // const loader = new PDFLoader(filePath);
      const rawDocs = await directoryLoader.load();
  
      /* Split text into chunks */
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
  
      const docs = await textSplitter.splitDocuments(rawDocs);
      console.log('split docs', docs);
  
      console.log('creating vector store...');
      /*create and store the embeddings in the vectorStore*/
      const embeddings = new OpenAIEmbeddings(
      );
      const index = pinecone.Index(process.env.PINECONE_INDEX ? process.env.PINECONE_INDEX :''); //change to your own index name
  
      //embed the PDF documents
      const response = await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: chatbotnamespace,
        textKey: 'text',
      });
      console.log(response)
      return res.status(200).json({ message: 'Inserted data successfully' });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: 'Failed to ingest your data' });
    }
}
