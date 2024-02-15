import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, SetStateAction , useRef } from 'react';
import { supabase } from '../../utils/supabase-client';
import React from 'react';
import Table from './Table';
import { Dropdown , Tabs, TabsRef , Button, Checkbox, Label, Modal, TextInput   } from 'flowbite-react';



const ManageAuthors: NextPage = () => {


  const [authorsData, setAuthorsData] = useState<any[]>([]);
  const [allchatbots, setAllChatbots] = useState<any[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState('');

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
    const fetchAuthors = async () => {
      try {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('chatbot', selectedChatbot); // set rows equal to chatbot name

        if (error) {
          throw error;
        }

        setAuthorsData(data);
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
            <Table data={authorsData} chatbotname={selectedChatbot} />
            </div>
          </div>
    </>
  );
};


export default ManageAuthors;
