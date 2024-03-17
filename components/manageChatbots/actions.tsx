import { supabase } from '@/utils/supabase-client';
import { Button, Dropdown , Spinner , Label, Modal, TextInput  } from 'flowbite-react';
import { useEffect, useState } from 'react';
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

  const [chatbotData , setChatbotData] = useState<any[]>([])

  const [openModal, setOpenModal] = useState(false);
  const [chatbotname, setChatbtname] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [header , setHeader] = useState('');
  const [primaryColor , setPrimaryColor] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchbots = async () => {
      try {
        const { data: chatbotData, error: chatbotError } = await supabase
          .from("chatbots")
          .select("*")
          .eq("id", botdata.id);

        if (chatbotError) {
          throw chatbotError;
        }
        
        setDescription(chatbotData[0].description);
        setPassword(chatbotData[0].password);
        setHeader(chatbotData[0].header);
        setPrimaryColor(chatbotData[0].primary_color);
        setLogoFile(chatbotData[0].logo_name);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const insertChannel = supabase.channel("chatbots");

    insertChannel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chatbots" },
        fetchbots
      )
      .subscribe();

    fetchbots();
  }, []);

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

  function onCloseModal() {
    setOpenModal(false);
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
      const { data, error } = await supabase.from('chatbots').update({
        description:description,
        password:password,
        primary_color : primaryColor,
        header:header,
        logo_name:logoFileName,
      })
      .eq('id', botdata.id);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', data);
      }
    } catch (error : any) {
      console.error('Error:', error.message);
    }
  }

  const handleUpdateButton = async () =>{
    await handleCreateChatbot();
    onCloseModal();
  }


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
        <Dropdown.Item>
          <Button gradientMonochrome="success" fullSized onClick={() => setOpenModal(true)}>Update</Button>
        </Dropdown.Item>
      </Dropdown>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update the selected chatbot</h3>
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
              <Button onClick={handleUpdateButton}>Update</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>

    
  );
}

export default Actions;
