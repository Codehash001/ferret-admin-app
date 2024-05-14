// components/Table.tsx
import React, { useState } from 'react';
import Actions from './actions';
import { Button, Tooltip, Label, Modal, TextInput} from 'flowbite-react';
import { FcOk, FcHighPriority } from 'react-icons/fc';
import { BsDatabaseFillCheck } from 'react-icons/bs';
import { CgSpinnerTwo } from 'react-icons/cg';
import { supabase } from '@/utils/supabase-client';


interface TableProps {
  data: Array<{
    name: string;
    author_name: string;
    batches: number;
    text_size: number;
    status: string;
    custom_link:string
    // Add more fields as needed
  }>;
  chatbotname: string;
}

const Table: React.FC<TableProps> = ({ data , chatbotname }) => {
  const [openModal, setOpenModal] = useState(false);
  const [customLink, setCustomLink] = useState('');

  function onCloseModal() {
    setOpenModal(false);
    setCustomLink('');
  }

  const handleAddLink = async (name:string) => {
      console.log(customLink)
      const { data, error } = await supabase
      .from('files_info')
      .update({ custom_link: customLink })
      .eq('name', name);
      setOpenModal(false);
    if (error) {
      console.log('error deletion status', error.message);
    }
  }
  return (
    <div className="w-full border rounded-md flex flex-col">
      <table className="w-full">
        <caption className="text-start text-xl font-semibold border-b p-2">
          Documents
        </caption>
        <thead className="text-start">
          <tr>
            <th className="p-2 text-start">Name</th>
            <th className="p-2 text-start">Author</th>
            <th className="p-2 text-start">No. of 1KB Batches</th>
            <th className="p-2 text-start">Text Size</th>
            <th className="p-2 text-start">Status</th>
            <th className="p-2 text-start">Custom Link</th>
            <th className="p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? 'bg-slate-200 w-full' : 'bg-white w-full'
              }
            >
              <td className="p-2 w-[30%]">{item.name}</td>
              <td className="p-2 w-[10%]">{item.author_name}</td>
              <td className="p-2 w-[15%]">{item.batches}</td>
              <td className="p-2 w-[10%]">{item.text_size}</td>
              <td className="py-2 pr-10 w-[10%] ">

                {item.status == 'deleting' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="red"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-red-600" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'uploading' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="yellow"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-yellow-400" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'uploaded' ? (
                  <Tooltip content='File has uploaded to file storage'>
                                      <Button size="sm" color="green">
                    {item.status}
                    <BsDatabaseFillCheck className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : item.status == 'ingesting' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="yellow"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-yellow-400" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'ingested' ? (
                  <Tooltip content='File has uploaded and ingested to the dataset'>
                  <Button size="sm" color="green">
                    <h1 className="text-sm text-green-900 font-semibold">
                      {item.status}
                    </h1>
                    <FcOk className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : item.status == 'error' ? (
                  <Tooltip content='Error! Please check your database'>
                  <Button size="sm" color="red">
                    {item.status}
                    <FcHighPriority className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </td>
              <td className="py-2 pr-10 w-[20%] ">
              {
                item.custom_link ? item.custom_link :
                <>
          <Button onClick={() => setOpenModal(true)} className='bg-black hover:bg-black hover:opacity-50 text-sm' size='sm' >Add a custom link</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="customLink" value="customLink" />
              </div>
              <TextInput
                id="customLink"
                placeholder="eg: https://google.com"
                value={customLink}
                onChange={(event) => setCustomLink(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={()=>handleAddLink(item.name)}>Add</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal></>
              }

              </td>

              <td className="p-2 w-[10%]">
                {/* Add your action buttons or links here */}
                <Actions filedata={item} chatbotnamespace={chatbotname} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
