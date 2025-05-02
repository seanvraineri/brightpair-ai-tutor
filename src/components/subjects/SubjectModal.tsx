
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Subject } from "./SubjectList";
import { useForm } from "react-hook-form";

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  subject: Subject | null;
}

const SubjectModal: React.FC<SubjectModalProps> = ({ open, onClose, onSave, subject }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Subject, "id">>({
    defaultValues: {
      name: subject?.name || "",
      description: subject?.description || ""
    }
  });

  // Reset the form when subject changes
  React.useEffect(() => {
    if (open) {
      reset({
        name: subject?.name || "",
        description: subject?.description || ""
      });
    }
  }, [subject, open, reset]);

  const onSubmit = (data: Omit<Subject, "id">) => {
    onSave({
      id: subject?.id || "",
      ...data
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{subject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Subject name is required" })}
              placeholder="Enter subject name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter subject description"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectModal;
