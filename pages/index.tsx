
'use client';

import { Button, Tabs, TabsRef } from 'flowbite-react';
import { useRef, useState } from 'react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';

export default function Home() {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full flex flex-col gap-3">
      <Tabs aria-label="Default tabs" style='fullWidth' ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
        <Tabs.Item active title="Manage chatbots" icon={HiUserCircle}>

        </Tabs.Item>
        <Tabs.Item title="Manage Authors" icon={MdDashboard}>
          This is <span className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Manage Documents" icon={HiAdjustments}>
          This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
      </Tabs>
      <div className="text-sm text-gray-500 dark:text-gray-400">Active tab: {activeTab}</div>
    </div>
  );
}
