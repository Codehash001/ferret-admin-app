import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase-client';
import { Button, Modal , Dropdown } from 'flowbite-react';

interface FileUploadProps {
  chatbotname: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ chatbotname }) => {
  const [fileInfoArray, setFileInfoArray] = useState<
    { name: string; batches: number; textSize: number; status: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState(false);

  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [selectedAuthor , setSelectedAuthor] = useState('');


  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const { data, error } = await supabase.from('authors').select('*').eq('chatbot' , chatbotname);

        if (error) {
          throw error;
        }

        setAllAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    // Set up Supabase real-time subscription
    const insertChannel = supabase.channel('authors');

    insertChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'authors' },
        fetchAuthors,
      )
      .subscribe();

      fetchAuthors();
  }, [chatbotname]);

  useEffect(() => {
    const handleFileChange = async () => {
      if (fileInputRef.current && fileInputRef.current.files) {
        const files = fileInputRef.current.files;

        const uploadFiles = async () => {
          const fileArray = Array.from(files);

          for (const file of fileArray) {
            try {
              // Replace spaces with underscores in the file name
              const newName = file.name.replace(/ /g, '_');

              const fileInfoDataBefore = {
                name: newName,
                chatbot: chatbotname,
                author_name : selectedAuthor,
                batches: Math.ceil(file.size / 1024),
                text_size: file.size,
                status: 'uploading',
              };

              const { data: insertDataBefore, error: insertErrorBefore } = await supabase
                .from('files_info')
                .insert([fileInfoDataBefore]);

              if (insertErrorBefore) {
                console.error(
                  'Error inserting data in files_info before upload:',
                  insertErrorBefore.message,
                );
              } else {
                console.log('Data inserted in files_info before upload:', insertDataBefore);
              }

              const { data, error } = await supabase.storage
                .from('files')
                .upload(`${newName}`, file); // Use the modified file name here

              let fileInfoData = {
                name: newName,
                chatbot: chatbotname,
                author_name : selectedAuthor,
                batches: Math.ceil(file.size / 1024),
                text_size: file.size,
                status: 'uploaded',
              };

              if (error) {
                console.error('Error uploading file:', error.message);
                fileInfoData = {
                  name: newName,
                  chatbot: chatbotname,
                  author_name: selectedAuthor,
                  batches: Math.ceil(file.size / 1024),
                  text_size: file.size,
                  status: 'error',
                };
              }

              const { data: insertData, error: insertError } = await supabase
                .from('files_info')
                .update([fileInfoData])
                .eq('name', newName);

              if (insertError) {
                console.error(
                  'Error inserting data in files_info after upload:',
                  insertError.message,
                );
              } else {
                console.log('Data inserted in files_info after upload:', insertData);
              }
            } catch (uploadError: any) {
              console.error('Error during file upload:', uploadError.message);
            }
          }
        };

        uploadFiles();
        setOpenModal(false);
      }
    };

    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('change', handleFileChange);
    }

    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener('change', handleFileChange);
      }
    };
  }, [chatbotname , selectedAuthor]);

  const handleSelectAuthor = (name : string) => {
    setSelectedAuthor(name);
    console.log(selectedAuthor);
  }

  return (
    <div className="p-4 border-spacing-1 border">
      <h1 className='font-medium mb-2'>Select Author and Upload a new document to {chatbotname}'s Dataset.</h1>
          <div className='flex space-x-3'>
          <Dropdown label={selectedAuthor ? selectedAuthor :"Select an author"} className='bg-none'>
          {allAuthors.map((item , index) =>
            <Dropdown.Item key={index} onClick={()=>{setSelectedAuthor(item.author_name)}}>{item.author_name}</Dropdown.Item>
      
      )}
    </Dropdown>

    <label
        htmlFor="fileInput"
        className={`bg-blue-500 text-white py-2 px-4 rounded ${selectedAuthor ? "cursor-pointer" : "cursor-disabled opacity-60"}`}
      >
        {selectedAuthor? 'Select Files and upload' : 'please select a author'}
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        ref={fileInputRef}
        disabled={selectedAuthor ? false : true}
      />
          </div>
    </div>
  );
};

export default FileUpload;
