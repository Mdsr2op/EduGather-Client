"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const searchSchema = z.object({
  search: z
    .string()
    .min(1, "Search term is required")
    .max(100, "Search term is too long"),
});

export function SearchDialog() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Performing search with:", data); // Simulated search action
      navigate(`/search?query=${encodeURIComponent(data.search)}`);
      reset();
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center  text-primary-500 rounded-xl p-2 shadow-md">
          <FiSearch size={20} className="text-primary-500 mr-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Search Messages
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Enter a keyword to find specific messages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
            />
            {errors.search && (
              <p className="text-sm text-red-500 mt-1">
                {errors.search.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Searching..." : "Search"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
