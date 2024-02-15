import { supabase } from '@/utils/supabase-client';
import { Button, Dropdown , Spinner } from 'flowbite-react';
import { useState } from 'react';
import { HiDotsHorizontal } from "react-icons/hi";

interface actionprops {

  authorData:{
    auth_id: string;
    created_at: string;
    author_name: string;
  };
}

const Actions: React.FC<actionprops> = ({ authorData }) => {

  const [isdeleting , setIsDeleting] = useState(false);


  const deleteFromTable = async () => {
    setIsDeleting(true);
    const { data, error } = await supabase
      .from('authors')
      .delete()
      .match({ author_name: authorData.author_name });

    if (error) {
      console.error('Error deleteing info table data:', error.message);
    } else {
      console.log('Data deleted from info table:', data);
    }
    setIsDeleting(false);
  };


  return (
    <>
      <Dropdown
        label=""
        renderTrigger={() => 
          (
          <div className="w-10 h-10 bg-slate-300 flex justify-center items-center rounded-lg cursor-pointer border border-slate-400">
            { isdeleting?
            <Spinner/> :
            <HiDotsHorizontal/>
            }
          </div>
        )}
      >
        <Dropdown.Item onClick={deleteFromTable}>
          <Button gradientMonochrome="failure">Delete author</Button>
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}

export default Actions;
