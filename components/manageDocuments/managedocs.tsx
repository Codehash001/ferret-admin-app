import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, SetStateAction , useRef } from 'react';
import { supabase } from '../../utils/supabase-client';

import Switch from 'react-switch';
import React from 'react';
import Table from '@/components/manageDocuments/Table';
import FileUpload from '@/components/manageDocuments/uploadToBucketButton';
import { Dropdown , Tabs, TabsRef  } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';


const ManageDocs: NextPage = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [allfiles, setallFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [ingested, setIngested] = useState(false);
  const [apiRespone, setApiResponse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTempFiles, SetSelectedTempFiles] = useState<File[]>([]);

  const validUsername = process.env.NEXT_PUBLIC_USERNAME;
  const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

  const [bucketData, setBucketData] = useState<any[]>([]);
  const [allchatbots, setAllChatbots] = useState<any[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState('');

  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchchatbots = async () => {
      try {
        const { data, error } = await supabase.from('chatbots').select('*');

        if (error) {
          throw error;
        }

        setAllChatbots(data);
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
        fetchchatbots,
      )
      .subscribe();

    fetchchatbots();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('files_info')
          .select('*')
          .eq('chatbot', selectedChatbot); // set rows equal to chatbot name

        if (error) {
          throw error;
        }

        setBucketData(data);
      } catch (error) {
        console.error('Error fetching files_info:', error);
      }
    };

    // Set up Supabase real-time subscription
    const insertChannel = supabase.channel('files_info');

    insertChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'files_info' },
        fetchSubjects,
      )
      .subscribe();

    fetchSubjects();
  }, [selectedChatbot]);



  return (
    <>

        <div className="rounded-sm p-4 space-y-3">
        <div className="text-start text-2xl font-semibold">
              <Dropdown
                label={selectedChatbot ? selectedChatbot : 'Choose a chatbot'}
              >
                {allchatbots.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      setSelectedChatbot(item.name);
                    }}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            <div className="rounded-sm h-[380px] overflow-y-auto">
            <Table data={bucketData} chatbotname={selectedChatbot} />
            </div>
          </div>
          <div className="p-6 flex flex-row items-center justify-between">
            <FileUpload chatbotname={selectedChatbot} />
          </div>
    </>
  );
};


export default ManageDocs;
