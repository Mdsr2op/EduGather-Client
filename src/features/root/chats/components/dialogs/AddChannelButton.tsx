

import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

const AddChannelButton = () => {
  return (
    <Button
      className="flex items-center justify-around w-full  bg-primary-500 hover:bg-primary-600 cursor-pointer rounded mt-2"
    >
      <FiPlus size={20} className="text-light1" />
      <span className="mr-8 self-center text-light1">Add Channel</span>
    </Button>
  );
};

export default AddChannelButton;
