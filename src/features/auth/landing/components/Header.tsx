import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react"; // Added Sun and Moon icons
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext"; // Import the theme hook

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
  { label: "Join", href: "#join" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme(); // Use the theme hook
  
  return (
    <header
      className={`sticky top-0 z-50 w-full ${theme === 'dark' ? 'bg-dark-1 text-light-1 border-dark-5' : 'bg-light-bg-1 text-light-text-1 border-light-bg-3'} border-b`}
      aria-label="Main Navigation"
    >
      <div className="mx-5 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <a
            href="#home"
            className="flex items-center hover:text-primary-500"
          >
            <img 
              src="/EduGather-logo.png" 
              alt="EduGather Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="text-xl font-semibold">EduGather</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} hover:text-primary-500 transition-colors`}
            >
              {item.label}
            </a>
          ))}

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-dark-3 text-light-1' : 'bg-light-bg-3 text-light-text-1'} hover:text-primary-500 transition-colors`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/sign-in"
            className={`${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} hover:text-primary-500 transition-colors`}
          >
            Login
          </Link>
          <Button
            asChild
            className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium rounded-xl"
          >
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle Button (Mobile) */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-dark-3 text-light-1' : 'bg-light-bg-3 text-light-text-1'} hover:text-primary-500 transition-colors`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={`${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} hover:text-primary-500 focus:outline-none`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent className={`${theme === 'dark' ? 'bg-dark-3 text-light-1' : 'bg-light-bg-2 text-light-text-1'}`}>
              <SheetHeader>
                <SheetTitle className={`${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} text-lg font-semibold`}>
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-col space-y-6">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <a
                      href={item.href}
                      className={`block ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} hover:text-primary-500 transition-colors`}
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link
                    to="/sign-in"
                    className={`${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} hover:text-primary-500 transition-colors`}
                  >
                    Login
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link to="/sign-up">
                    <Button className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium w-full">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
