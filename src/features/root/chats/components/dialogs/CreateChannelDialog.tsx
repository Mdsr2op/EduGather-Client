import React, { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useCreateChannelMutation } from "@/features/root/channels/slices/channelApiSlice";

type CreateChannelDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string | null; // groupId is required by the mutation
};

const CreateChannelDialog: React.FC<CreateChannelDialogProps> = ({
  isOpen = false,
  setIsOpen,
  groupId,
}) => {
  const [channelName, setChannelName] = useState<string>("");
  const [channelDescription, setChannelDescription] = useState<string>("");

  // Initialize the createChannel mutation hook
  const [createChannel, { isLoading, isError, error }] = useCreateChannelMutation();

  const closeDialog = (): void => {
    setIsOpen(false);
  };

  const handleCreateChannel = async (): Promise<void> => {
    // Optional input validation
    if (!channelName) return;

    try {
      await createChannel({
        groupId,
        channelName,
        description: channelDescription,
      }).unwrap();
      // Clear inputs and close the dialog on success
      setChannelName("");
      setChannelDescription("");
      closeDialog();
    } catch (err) {
      // Error state is handled via isError and error below
      console.error("Channel creation failed", err);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-dark-4 bg-opacity-50 transition-opacity"></div>
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
          <div className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-dark-2 shadow-xl rounded-2xl">
            <div className="text-2xl font-bold leading-6 text-light-1 mb-6">
              Create a Channel
            </div>
            <div className="mt-4">
              <label className="block text-light-2 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-dark-3 text-light-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-light-3"
                placeholder="Enter channel name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-light-2 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 bg-dark-3 text-light-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-light-3"
                placeholder="Enter channel description"
                rows={3}
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
              />
            </div>

            {isError && (
              <div className="mt-2 text-red-500">
                {(error as any)?.data?.message || "Failed to create channel. Please try again."}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-dark-4 text-white rounded-md hover:bg-opacity-80"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                onClick={handleCreateChannel}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Channel"}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default CreateChannelDialog;
