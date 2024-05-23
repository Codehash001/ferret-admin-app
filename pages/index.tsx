import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, SetStateAction , useRef } from 'react';
import { supabase } from '../utils/supabase-client';
import React from 'react';
import {  Tabs, TabsRef  } from 'flowbite-react';
import { MdOutlineDisplaySettings } from 'react-icons/md';
import ManageDocs from '@/components/manageDocuments/managedocs';
import ManageChatbots from '@/components/manageChatbots/managechatbots';
import ManageAuthors from '@/components/manageAuthors/manageAuthors';
import { GrDocumentConfig } from "react-icons/gr";
import { FaUsersCog } from "react-icons/fa";


const Admin: NextPage = () => {
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

  const handleSelectChatbot = (name: string) => {
    setSelectedChatbot(name);
    console.log(selectedChatbot);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (username == validUsername && password == validPassword) {
      // If the email and password match, redirect to the home page
      setIsLoggedIn(true);
    } else {
      // Otherwise, show an error message
      setErrorMessage('Incorrect email or password');
    }
  };

  // if (!isLoggedIn) {
  //   return (
  //     <div>
  //       <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  //         <div className="relative py-3 sm:max-w-xl sm:mx-auto">
  //           <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
  //           <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
  //             <div className="max-w-md mx-auto">
  //               <div>
  //                 <h1 className="text-2xl font-bold text-center">
  //                   <span className="text-xl font-semibold">Login to</span>
  //                   <br />
  //                   Upload and Ingest
  //                 </h1>
  //               </div>
  //               <div className="divide-y divide-gray-200">
  //                 <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
  //                   <div className="relative">
  //                     <input
  //                       type="text"
  //                       value={username}
  //                       onChange={(e) => setUsername(e.target.value)}
  //                       className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
  //                       placeholder="Username"
  //                     />
  //                     <label className="">Username</label>
  //                   </div>
  //                   <div className="relative">
  //                     <input
  //                       type="password"
  //                       value={password}
  //                       onChange={(e) => setPassword(e.target.value)}
  //                       className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
  //                       placeholder="Password"
  //                     />
  //                     <label className="">Password</label>
  //                   </div>
  //                   <div className="relative">
  //                     <button
  //                       className="bg-gray-900 text-white rounded-md px-6 py-2"
  //                       onClick={handleSubmit}
  //                     >
  //                       Log In
  //                     </button>
  //                   </div>
  //                   <div className="text-sm text-red-700">
  //                     {errorMessage && <p>{errorMessage}</p>}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex flex-col items-center w-screen h-screen overflow-hidden bg-gray-100 p-10">
        <div className="border-gray-600 border w-full h-full">
          <Tabs aria-label="Default tabs" style='fullWidth' ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
        <Tabs.Item active title="Manage chatbots" icon={MdOutlineDisplaySettings}>
          <ManageChatbots/>
        </Tabs.Item>
        <Tabs.Item title="Manage Authors" icon={FaUsersCog}>
          <ManageAuthors/>
        </Tabs.Item>
        <Tabs.Item title="Manage Documents" icon={GrDocumentConfig}>
        <ManageDocs/>
        </Tabs.Item>
      </Tabs>
        </div>
      </div>
    </>
  );
};


export default Admin;
