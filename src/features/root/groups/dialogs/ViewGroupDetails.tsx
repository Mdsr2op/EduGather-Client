// src/components/ViewGroupDetails.tsx

import React from 'react';
import { FiX } from 'react-icons/fi';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';
import GroupInfo from '../components/GroupInfo';
import { User } from '@/features/auth/types';
import { useSelector } from 'react-redux';
import { selectViewGroupDetailsData } from '../slices/groupSlice';
import { Member } from '../types';


type ViewGroupDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ViewGroupDetails: React.FC<ViewGroupDetailsProps> = ({ isOpen, onClose }) => {

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
            className="w-full max-w-3xl p-6 bg-dark-3 text-light-1 rounded-2xl shadow-xl transform transition-all relative overflow-auto max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-light-3 hover:text-light-1 focus:outline-none"
              onClick={onClose}
              aria-label="Close View Group Details Modal"
            >
              <FiX size={24} />
            </button>

            {/* Group Details */}
            <GroupInfo />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default ViewGroupDetails;
