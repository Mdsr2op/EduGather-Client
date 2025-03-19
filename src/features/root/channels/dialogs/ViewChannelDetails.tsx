// features/channels/dialogs/ViewChannelDetails.tsx

import React from "react";
import { Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { Fragment } from "react";
import { Channel } from "../slices/channelSlice";

type ViewChannelDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
};

const ViewChannelDetails: React.FC<ViewChannelDetailsProps> = ({
  isOpen,
  onClose,
  channel,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center"
        aria-modal="true"
        role="dialog"
        onClick={onClose}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark-6 bg-opacity-80 transition-opacity"></div>
        </Transition.Child>

        {/* Modal Content */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <div
            className="w-full max-w-xl p-6 bg-dark-3 text-light-1 rounded-2xl shadow-xl transform transition-all relative overflow-auto max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-light-3 hover:text-light-1 focus:outline-none"
              onClick={onClose}
              aria-label="Close View Channel Details Modal"
            >
              <FiX size={24} />
            </button>

            {/* Channel Details Content */}
            <h2 className="text-2xl font-bold mb-2">{channel.channelName}</h2>
            <p className="text-light-2 mb-4">
              Channel ID: {channel._id}
            </p>
            <p className="text-light-2">
              {channel.description || "No description provided."}
            </p>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default ViewChannelDetails;
