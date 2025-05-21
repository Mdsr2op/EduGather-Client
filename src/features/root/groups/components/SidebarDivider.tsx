// SidebarDivider.js
import { useTheme } from "@/context/ThemeContext";

const SidebarDivider = () => {
  const { theme } = useTheme();
  
  return <hr className={`w-full ${theme === 'dark' ? 'border-dark-4' : 'border-light-bg-4'} my-4`} />;
};

export default SidebarDivider;
