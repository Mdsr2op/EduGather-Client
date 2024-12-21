import React, { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';

type CreateChannelDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CreateChannelDialog: React.FC<CreateChannelDialogProps> = ({ isOpen, setIsOpen }) => {
  const [channelName, setChannelName] = useState<string>('');
  const [channelDescription, setChannelDescription] = useState<string>('');

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleCreateChannel = () => {
    // Logic to create a new channel
    console.log("Channel Created:", { name: channelName, description: channelDescription });
    closeDialog();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center">
        {/* Background Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        </Transition.Child>

        {/* Dialog Box */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <div className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-dark2 shadow-xl rounded-2xl">
            <div className="text-2xl font-bold leading-6 text-light1 mb-6">
              Create a Channel
            </div>
            <div className="mt-4">
              <label className="block text-light2 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-dark3 text-light1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-light3"
                placeholder="Enter channel name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-light2 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 bg-dark3 text-light1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-light3"
                placeholder="Enter channel description"
                rows={3}
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
               
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-dark4 text-white rounded-md hover:bg-opacity-80"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80"
                onClick={handleCreateChannel}
              >
                Create Channel
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default CreateChannelDialog;
