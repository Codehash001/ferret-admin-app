import { supabase } from '@/utils/supabase-client';
import { Button, Dropdown } from 'flowbite-react';
import { useState } from 'react';

interface actionprops {

  chatbotnamespace: string;
  filedata:{
    name: string;
    author_name: string;
    batches: number;
    text_size: number;
    status: string;
    // Add more fields as needed
  };
}

const Actions: React.FC<actionprops> = ({ filedata , chatbotnamespace }) => {
  async function runCommand() {
    console.log('Ingesting your data. Please wait...');
    console.log(chatbotnamespace)
    const response = await fetch('/api/runCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatbotnamespace),
    });
    if (response.ok) {
      const output = await response.text();
      console.log(output);
      console.log('Succesfully ingested your data!');
      const { data, error } = await supabase
        .from('files_info')
        .update({ status: 'ingested' })
        .eq('name', filedata.name);
      console.log('Succesfully updated table', data);
      if (error) {
        await supabase
          .from('files_info')
          .update({ status: 'error' })
          .eq('name', filedata.name);
        console.log('error updating table table', error.message);
      }
    } else {
      const error = await response.text();
      console.error(error);
      console.log('Error ingesting your data -_-' , error);
    }
  }

  const handleDownloadFromSupa = async () => {
    try {
      const FileName = filedata.name
      const response = await fetch('/api/downloadFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ FileName }),
      });
      if (response.ok) {
        const { message } = await response.json();
        console.log(message);
      } else {
        console.error('Failed to download file:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const ClearLocalDir = async () => {
    try {
      const response = await fetch('/api/deleteTempFiles', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to delete files');
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const deleteVector = async () => {
    const { data, error } = await supabase
      .from('documents')
      .delete({ count: 'exact' })
      .match({ 'metadata ->> pdf_name': filedata.name });

    if (error) {
      console.error('Error deleteing vector data:', error.message);
    } else {
      console.log('Data deleted from vector:', data);
    }
  };

  const deleteFromInfoTable = async () => {
    const { data, error } = await supabase
      .from('files_info')
      .delete()
      .match({ name: filedata.name });

    if (error) {
      console.error('Error deleteing info table data:', error.message);
    } else {
      console.log('Data deleted from info table:', data);
    }
  };

  const deeleteFromBucketStotage = async () => {
    const { data, error } = await supabase.storage
      .from('files')
      .remove([filedata.name]);
    if (error) {
      console.error('Error deleting bucket data', error.message);
    } else {
      console.log('Permenently deleted data from storage bucket:', data);
    }
  };

  const handleClickIngest = async () => {
    const { data, error } = await supabase
      .from('files_info')
      .update({ status: 'ingesting' })
      .eq('name', filedata.name);
    if (!error) {
      await handleDownloadFromSupa();
      await runCommand();
      await ClearLocalDir();
    }
  };

  const handleClickDelete = async () => {
    await supabase
      .from('files_info')
      .update({ status: 'deleting' })
      .eq('name', filedata.name);

    await deleteVector();

    const { data, error } = await supabase
      .from('files_info')
      .update({ status: 'uploaded' })
      .eq('name', filedata.name);
    console.log('data is only uploaded not ingested yet', data);
    if (error) {
      console.log('error handleling delete function', error.message);
    }
  };

  const handleClickDeletePeremenent = async () => {
    const { data, error } = await supabase
      .from('files_info')
      .update({ status: 'deleting' })
      .eq('name', filedata.name);
    console.log('deleting data', data);
    if (error) {
      console.log('error deletion status', error.message);
    }
    await deleteVector();
    await deeleteFromBucketStotage();
    await deleteFromInfoTable();
  };

  return (
    <>
      <Dropdown
        label=""
        renderTrigger={() => (
          <div className="w-10 h-10 bg-slate-300 flex justify-center items-center rounded-lg cursor-pointer border border-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="hover:fill-slate-700 fill-slate-500 cursor-pointer"
            >
              <path d="M10 10h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4z"></path>
            </svg>
          </div>
        )}
      >
        <Dropdown.Item onClick={handleClickIngest}>
          <Button outline fullSized>
            Ingest to dataset
          </Button>
        </Dropdown.Item>
        <Dropdown.Item onClick={handleClickDeletePeremenent}>
          <Button gradientMonochrome="failure">Delete permenently</Button>
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}

export default Actions;
