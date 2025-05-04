"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectSelectedChannelId } from "../../../channels/slices/channelSlice";
import { selectSelectedGroupId } from "../../../groups/slices/groupSlice";
import { toast } from "react-hot-toast";
import SearchResultsDialog from "../../../messages/components/search/SearchResultsDialog";

const searchSchema = z.object({
  search: z
    .string()
    .min(1, "Search term is required")
    .max(100, "Search term is too long"),
});

const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const selectedGroupId = useSelector(selectSelectedGroupId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    try {
      if (!selectedChannelId) {
        toast.error("Please select a channel to search in");
        return;
      }

      // Set the search query and show results dialog
      setSearchQuery(data.search);
      setIsOpen(false);
      setShowResults(true);
      
      // No need to reset the form since we want to keep the query visible
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error("Failed to perform search");
    }
  };

  return (
    <div className="relative">
      <button
        className={`p-2 rounded-full transition-all duration-200 ${
          isOpen || showResults
            ? 'bg-primary-500/20 text-primary-500' 
            : 'hover:bg-dark-4 hover:text-light-1'
        }`}
        onClick={() => setIsOpen(true)}
        title="Search Messages"
      >
        <FiSearch size={18} className="text-current" />
      </button>

      {/* Search Input Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Search Messages
            </DialogTitle>
            <DialogDescription className="text-sm text-light-4">
              {selectedChannelId 
                ? "Enter a keyword to find specific messages in this channel."
                : "Please select a channel first to search for messages."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <Input
                type="text"
                id="search"
                placeholder="Type a keyword to find messages..."
                {...register("search")}
                className={cn(
                  "mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl",
                  errors.search && "border-red-500 focus:ring-red-500"
                )}
                disabled={!selectedChannelId}
              />
              {errors.search && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.search.message}
                </p>
              )}
              {!selectedChannelId && (
                <p className="text-sm text-amber-400 mt-1">
                  Select a channel to enable search
                </p>
              )}
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
                disabled={!selectedChannelId}
              >
                Search
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search Results Dialog */}
      <SearchResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        searchQuery={searchQuery}
        channelId={selectedChannelId || ''}
        groupId={selectedGroupId || ''}
      />
    </div>
  );
};

export default SearchDialog;
