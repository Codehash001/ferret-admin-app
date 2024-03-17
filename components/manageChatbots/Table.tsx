// components/Table.tsx
import React from 'react';
import Actions from './actions';
import { Button, Tooltip } from 'flowbite-react';
import { FcOk, FcHighPriority } from 'react-icons/fc';
import { BsDatabaseFillCheck } from 'react-icons/bs';
import { CgSpinnerTwo } from 'react-icons/cg';

interface TableProps {
  data: Array<{
    id: string;
    name: string;
    password: string;
    description: string;
    created_at: string;
    header:string;
    primary_color:string;
    logo_name:string
    // Add more fields as needed
  }>;
}

const Table: React.FC<TableProps> = ({ data  }) => {
  return (
    <div className="w-full border rounded-md flex flex-col">
      <table className="w-full">
        <caption className="text-start text-xl font-semibold border-b p-2">
          Chatbots
        </caption>
        <thead className="text-start">
          <tr>
            <th className="p-2 text-start">ID</th>
            <th className="p-2 text-start">Name</th>
            <th className="p-2 text-start">Password</th>
            <th className="p-2 text-start">Description</th>
            <th className="p-2 text-start">Created at</th>
            <th className="p-2 text-start">Header</th>
            <th className="p-2 text-start">Primary color</th>
            <th className="p-2 text-start">Logo name</th>
            <th className="p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? 'bg-slate-200 w-full' : 'bg-white w-full'
              }
            >
              <td className="p-2 w-[20%]">{item.id}</td>
              <td className="p-2 w-[10%]">{item.name}</td>
              <td className="p-2 w-[10%]">{item.password}</td>
              <td className="p-2 w-[20%]">{item.description}</td>
              <td className="p-2 w-[20%]">{item.created_at}</td>
              <td className="p-2 w-[10%]">{item.header}</td>
              <td className="p-2 w-[20%]">{item.primary_color}</td>
              <td className="p-2 w-[10%]">{item.logo_name}</td>
              <td className="p-2 w-[10%]">
                {/* Add your action buttons or links here */}
                <Actions botdata={item}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
