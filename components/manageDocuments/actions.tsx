'use client'

import { pinecone } from '@/utils/pinecone-client';
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
  };
}

const Actions: React.FC<actionprops> = ({ filedata , chatbotnamespace }) => {

  const ingest = async () => {
    const { data, error } = await supabase
      .from('files_info')
      .update({ status: 'ingesting' })
      .eq('name', filedata.name);
    if (!error) {
      const FileName = filedata.name
      const res = await fetch('/api/downloadFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ FileName }),
      });
      if (res.ok) {
        const { message } = await res.json();
        console.log(message);
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
        }
      } else {
        console.error('Failed to download file:', res.statusText);
      }
    }
  };

  const handleDeleteLocalDir = async () => {
    try {
      await fetch('/api/deleteTempFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('temp files deleted!')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFromSupabase = async () => {
    const { data, error } = await supabase
      .from('files_info')
      .update({ status: 'unlinked' })
      .eq('name', filedata.name);
    if (error) {
      console.log('error deletion status', error.message);
    }
    if (!error) {

    }

  };


  const deletefromPinecone = async () => {
    try {
      const FileName = filedata.name
      const response = await fetch('/api/deleteVector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FileName),
      });
      console.log(response);
      if (response.ok) {
        const { data, error } = await supabase
      .from('files_info')
      .delete()
      .eq('name', filedata.name);
      console.log('permanantly deleted')
    if (error) {
      console.log('error deletion status', error.message);
    }
      }
      
    } catch (error) {
      console.log('error deletion vector', error);
    }
  }

  const handleDeletePermemnat = async () => {
    try {
      // await deletefromPinecone();
      await deleteFromSupabase();
    } catch (error) {
      
    }
  }

  const handleClickIngest = async () => {
    try {
      await ingest();
      await handleDeleteLocalDir();
    } catch (error) {
      
    }
  }
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
        <Dropdown.Item>
          <Button outline fullSized onClick={handleClickIngest}>
            Ingest to dataset
          </Button>
        </Dropdown.Item>
        <Dropdown.Item > 
          <Button gradientMonochrome="failure" disabled>Delete permenently</Button>
        </Dropdown.Item>
        <Dropdown.Item onClick={deleteFromSupabase}>
          <Button color='dark' fullSized>Unlink document</Button>
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}

export default Actions;
