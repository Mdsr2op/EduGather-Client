import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react"; // An icon from lucide or heroicons
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-dark-1 text-light-1 border-b border-dark-5"
      aria-label="Main Navigation"
    >
      <div className="mx-5 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-semibold text-light-1 hover:text-primary-500"
          >
            EduGather
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-light-1 hover:text-primary-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/sign-in"
            className="text-light-1 hover:text-primary-500 transition-colors"
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
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="text-light-1 hover:text-primary-500 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent className="bg-dark-3 text-light-1">
              <SheetHeader>
                <SheetTitle className="text-light-1 text-lg font-semibold">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-col space-y-6">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      to={item.href}
                      className="block text-light-1 hover:text-primary-500 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link
                    to="/sign-in"
                    className="text-light-1 hover:text-primary-500 transition-colors"
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
