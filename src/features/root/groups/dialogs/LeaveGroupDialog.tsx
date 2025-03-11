import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLeaveGroupMutation } from '../slices/groupApiSlice';

type LeaveGroupDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string | null;
  groupName?: string;
};

const LeaveGroupDialog: React.FC<LeaveGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  groupId,
  groupName = "Awesome",
}) => {
  const [leaveGroup, { isLoading, error }] = useLeaveGroupMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
    setLocalError(null);
  };

  const handleLeave = async () => {
    try {
      if (!groupId) return;
      await leaveGroup({ groupId }).unwrap();
      closeDialog();
    } catch (err) {
      setLocalError('Failed to leave the group. Please try again.');
    }
  };

  // Extract error message from RTK Query error or local error
  const errorMessage = error ? 
    (error as any)?.data?.message || (error as any)?.error || 'An error occurred' : 
    localError;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeDialog}>
        <div className="min-h-screen px-4 text-center">
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

          {/* Centering Trick */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* Dialog Box */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-4 shadow-xl rounded-2xl">
              {/* Dialog Title */}
              <Dialog.Title as="h3" className="text-2xl font-bold text-light-1 mb-4">
                Leave {groupName}
              </Dialog.Title>

              {/* Dialog Message */}
              <div className="mt-2">
                <p className="text-light-3">
                  Are you sure you want to leave the group '{groupName}'? You will no longer receive messages from this group.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-2 bg-red-500 bg-opacity-20 rounded">
                  <p className="text-red-500">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-dark-6 text-light-1 rounded-md hover:bg-opacity-80"
                  onClick={closeDialog}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 bg-[#FF4C4C] text-white rounded-md hover:bg-opacity-80 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={handleLeave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Leaving...
                    </span>
                  ) : (
                    `Leave '${groupName}'`
                  )}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LeaveGroupDialog;