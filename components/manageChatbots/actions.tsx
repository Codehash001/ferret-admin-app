import { supabase } from '@/utils/supabase-client';
import { Button, Dropdown , Spinner } from 'flowbite-react';
import { useState } from 'react';
import { HiDotsHorizontal } from "react-icons/hi";


interface actionprops {

  botdata:{
    id: string;
    name: string;
    password: string;
    description: string;
    created_at: string;
    // Add more fields as needed
  };
}

const Actions: React.FC<actionprops> = ({ botdata }) => {

  const [isdeleting , setIsDeleting] = useState(false);


  const handledeleteFromTable = async () => {
    setIsDeleting(true);
    const { data, error } = await supabase
      .from('chatbots')
      .delete()
      .match({ name: botdata.name });

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
        <Dropdown.Item onClick={handledeleteFromTable}>
          <Button gradientMonochrome="failure">Delete permenently</Button>
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}

export default Actions;
