// components/Table.tsx
import React, { useState } from 'react';
import Actions from './actions';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { supabase } from '@/utils/supabase-client';
import { FiPlus } from "react-icons/fi";

interface TableProps {
  data: Array<{
    auth_id: string;
    created_at: string;
    author_name: string;
    avatar_file_name:string
  }>;
  chatbotname: string;
}

const Table: React.FC<TableProps> = ({ data, chatbotname }) => {
  const [openModal, setOpenModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  function onCloseModal() {
    setOpenModal(false);
    setAuthorName('');
    setAvatarFile(null);
  }

  const handleCreateButton = async () => {
    try {
      const avatarFileName = avatarFile ? `${avatarFile.name}` : '';

      if (avatarFile) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('avatars') // Replace with your Supabase bucket name
          .upload(avatarFileName, avatarFile);

        if (fileError) {
          console.error('Error uploading avatar:', fileError);
          return;
        }
      }

      const { data, error } = await supabase.from('authors').insert({
        author_name: authorName,
        avatar_file_name: avatarFileName,
        chatbot: chatbotname
      });

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', data);
      }

      onCloseModal();
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className='space-y-4'>
      <div className="w-full border rounded-md flex flex-col">
        <table className="w-full">
          <caption className="text-start text-xl font-semibold border-b p-2">
            Authors
          </caption>
          <thead className="text-start">
            <tr>
              <th className="p-2 text-start">ID</th>
              <th className="p-2 text-start">Name</th>
              <th className="p-2 text-start">Avatar Name</th>
              <th className="p-2 text-start">Created at</th>
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
                <td className="p-2 w-[20%]">{item.auth_id}</td>
                <td className="p-2 w-[20%]">{item.author_name}</td>
                <td className="p-2 w-[20%]">{item.avatar_file_name}</td>
                <td className="p-2 w-[30%]">{item.created_at}</td>
                <td className="p-2 w-[10%]">
                  <Actions authorData={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={() => setOpenModal(true)} >New Author <FiPlus className='ml-2 fill-white'/></Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create a new author</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="authorName" value="Author Name" />
              </div>
              <TextInput
                id="authorName"
                placeholder="Enter Author Name"
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="avatarFile" value="Avatar" />
              </div>
              <input
                type="file"
                id="avatarFile"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={handleCreateButton}>Create</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Table;
