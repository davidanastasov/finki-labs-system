import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { MultiSelect } from "../../ui/multi-select";
import type { MultiSelectGroup } from "../../ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStudents } from "@/data/student";
import { useAddStudentsToLabCourse } from "@/data/labCourseStudent";

type FormData = z.infer<typeof formSchema>;
const formSchema = z.object({
  studentIds: z.array(z.string()).min(1, "At least one student is required"),
});

interface AddStudentToCourseDialogProps {
  courseId: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddStudentToCourseDialog({
  courseId,
  open,
  onOpenChange: setOpen,
}: AddStudentToCourseDialogProps) {
  const { data: allStudents } = useStudents({ page: 1, pageSize: 100 });

  const addStudentToLabCourseMutation = useAddStudentsToLabCourse(courseId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentIds: [],
    },
  });

  const aboutToAddStudentsLength = form.watch("studentIds").length;

  const resetForm = () => {
    form.reset({
      studentIds: [],
    });
  };

  const handleSubmit = (data: FormData) => {
    form.clearErrors("root");

    addStudentToLabCourseMutation.mutate(
      { studentIds: data.studentIds },
      {
        onSuccess: () => {
          setOpen?.(false);
          resetForm();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || "Failed to create course";
          form.setError("root", {
            type: "server",
            message: errorMessage,
          });
        },
      },
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen?.(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const studentOptions = React.useMemo(() => {
    if (!allStudents || allStudents.items.length === 0) return [];

    const StudentGroups = Object.groupBy(allStudents.items, (student) => student.studyProgram.code);

    return Object.entries(StudentGroups).map<MultiSelectGroup>(([studyProgramCode, students]) => ({
      heading: studyProgramCode.replace(/_/g, " "),
      options: students!.map((student) => ({
        label: `${student.name} ${student.lastName}`,
        value: student.index,
      })),
    }));
  }, [allStudents]);

  const isPending = addStudentToLabCourseMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[91vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Students to Course</DialogTitle>
          <DialogDescription>Select existing students to enroll in this course</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="studentIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Students</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={studentOptions}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select students..."
                        modalPopover
                        enableGroupSelection
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <div className="rounded-md bg-destructive/15 p-3">
                <div className="text-sm text-destructive">{form.formState.errors.root.message}</div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Add Selected Students ({aboutToAddStudentsLength})
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
