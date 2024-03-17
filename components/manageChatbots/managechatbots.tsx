import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, SetStateAction , useRef } from 'react';
import { supabase } from '../../utils/supabase-client';

import React from 'react';
import Table from './Table';
import { Dropdown , Tabs, TabsRef , Button, Checkbox, Label, Modal, TextInput  } from 'flowbite-react';
import { FiPlus } from 'react-icons/fi';
import { setPriority } from 'os';



const ManageChatbots: NextPage = () => {


  const [AllChatbotDataData, setAllChatbotData] = useState<any[]>([]);

  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('chatbots')
          .select('*')

        if (error) {
          throw error;
        }

        setAllChatbotData(data);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      }
    };

    // Set up Supabase real-time subscription
    const insertChannel = supabase.channel('chatbots');

    insertChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chatbots' },
        fetchSubjects,
      )
      .subscribe();

    fetchSubjects();
  }, [onCloseModal]);


  const [openModal, setOpenModal] = useState(false);
  const [chatbotname, setChatbtname] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [header , setHeader] = useState('');
  const [primaryColor , setPrimaryColor] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  function onCloseModal() {
    setOpenModal(false);
    setChatbtname('');
    setDescription('');
    setPassword('');
  }

  const handleCreateChatbot = async () => {
    
    try {
      const logoFileName = logoFile ? `${logoFile.name}` : '';

      if (logoFile) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('logos') // Replace with your Supabase bucket name
          .upload(logoFileName, logoFile);

        if (fileError) {
          console.error('Error uploading avatar:', fileError);
          return;
        }
      }
      const { data, error } = await supabase.from('chatbots').insert({
        name:chatbotname,
        description:description,
        password:password,
        primary_color : primaryColor,
        header:header,
        logo_name:logoFileName,
      });

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', data);
      }
    } catch (error : any) {
      console.error('Error:', error.message);
    }
  }

  const handleCreateButton = async () =>{
    await handleCreateChatbot();
    onCloseModal();
  }


  return (
    <>

        <div className="rounded-sm p-4 space-y-3">

        <Button onClick={() => setOpenModal(true)}>New Chatbot <FiPlus className='ml-2'/></Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create a new chatbot</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="chatbotname" value="Chatbot name" />
              </div>
              <TextInput
                id="chatbotname"
                placeholder="bot1"
                value={chatbotname}
                onChange={(event) => setChatbtname(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Chatbot description" />
              </div>
              <TextInput
                id="description"
                placeholder=""
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="header" value="Chatbot header" />
              </div>
              <TextInput
                id="header"
                placeholder=""
                value={header}
                onChange={(event) => setHeader(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="primaryColor" value="Chatbot Primary Color" />
              </div>
              <TextInput
                id="primaryColor"
                placeholder="#FFFFFF"
                value={primaryColor}
                onChange={(event) => setPrimaryColor(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Chatbot password" />
              </div>
              <TextInput
                id="password"
                placeholder=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Logo" value="Chatbot Logo" />
              </div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={handleCreateButton}>Create</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

        <div className="text-start text-2xl font-semibold">
            </div>
            <div className="rounded-sm h-[420px] overflow-y-auto">
            <Table data={AllChatbotDataData}/>
            </div>
          </div>
    </>
  );
};


export default ManageChatbots;
