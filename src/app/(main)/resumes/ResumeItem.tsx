"use client";

import LoadingButton from "@/components/LoadingButton";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import { deleteResume } from "./actions";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            contentRef={contentRef}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="size-5 text-gray-600 hover:text-gray-900" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-white shadow-lg rounded-lg border border-gray-200">
            <DropdownMenuItem
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Trash2 className="size-5 text-red-500" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
              onClick={onPrintClick}
            >
              <Printer className="size-5 text-gray-500" />
              <span>Print</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  
        <DeleteConfirmationDialog
          resumeId={resumeId}
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
        />
      </>
    );
  }
  
  interface DeleteConfirmationDialogProps {
    resumeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  function DeleteConfirmationDialog({
    resumeId,
    open,
    onOpenChange,
  }: DeleteConfirmationDialogProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
  
    async function handleDelete() {
      startTransition(async () => {
        try {
          await deleteResume(resumeId);
          onOpenChange(false);
          toast({ description: "Resume deleted successfully." });
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            description: "Something went wrong. Please try again.",
          });
        }
      });
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this resume? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="destructive"
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition"
              onClick={handleDelete}
              loading={isPending}
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  