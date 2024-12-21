// DeleteGroupDialog.tsx
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type DeleteGroupDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupName?: string;
  onDelete: (groupName: string) => void;
};

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  groupName = "Awesome",
  onDelete,
}) => {
  const [confirmationText, setConfirmationText] = useState<string>('');

  const closeDialog = () => {
    setIsOpen(false);
    setConfirmationText('');
  };

  const handleDelete = () => {
    onDelete(groupName);
    closeDialog();
  };

  const isConfirmEnabled = confirmationText === groupName;

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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-2 shadow-xl rounded-2xl">
              {/* Dialog Title */}
              <Dialog.Title as="h3" className="text-2xl font-bold text-light-1 mb-4">
                Delete {groupName}
              </Dialog.Title>

              {/* Dialog Message */}
              <div className="mt-2">
                <p className="text-light-3">
                  Are you sure you want to delete the group '{groupName}'? This action cannot be undone.
                </p>
              </div>

              {/* Confirmation Input */}
              <div className="mt-4">
                <label className="block text-light-3 mb-1">
                  Type '{groupName}' to confirm.
                </label>
                <input
                  type="text"
                  className="mt-2 w-full px-4 py-2 bg-dark-3 text-light-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-light-4"
                  placeholder={`Enter '${groupName}'`}
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-dark-6 text-light-1 rounded-md hover:bg-opacity-80"
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 bg-[#FF4C4C] text-white rounded-md hover:bg-opacity-80 ${
                    isConfirmEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={handleDelete}
                  disabled={!isConfirmEnabled}
                >
                  Delete '{groupName}'
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeleteGroupDialog;
