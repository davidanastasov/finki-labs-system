import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, FlaskConical } from "lucide-react";
import { Separator } from "../ui/separator";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { ExerciseFileManager } from "./exercise-file-manager";
import type { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateExercise, useExerciseById, useUpdateExercise } from "@/data/labCourseExercise";
import { ExerciseStatus } from "@/services/exercise/models";
import { formatDateRange } from "@/lib/date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = z.infer<typeof formSchema>;
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title must not exceed 255 characters"),
    description: z
      .string()
      .max(10000, "Description content must not exceed 10,000 characters")
      .optional(),
    labDate: z.date({ error: "Lab date is required" }),
    dueDate: z.date({ error: "Due date is required" }),
    totalPoints: z
      .number({ error: "Total points is required" })
      .min(1, "Total points must be at least 1"),
    status: z.enum(ExerciseStatus, { error: "Status is required" }),
  })
  .refine((data) => data.labDate <= data.dueDate, {
    message: "Lab date must be before or same as due date",
    path: ["labDate"],
  });

interface ExerciseDialogProps {
  exerciseId?: number;
  labCourseId: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExerciseDialog({
  exerciseId,
  labCourseId,
  open,
  onOpenChange: setOpen,
}: ExerciseDialogProps) {
  const isEditMode = exerciseId !== undefined;
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const { data: exerciseData, isLoading: isLoadingExercise } = useExerciseById(exerciseId!, {
    courseId: labCourseId,
    queryConfig: { enabled: isEditMode && open },
  });

  const createExerciseMutation = useCreateExercise(labCourseId);
  const updateExerciseMutation = useUpdateExercise();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      labDate: undefined,
      dueDate: undefined,
      totalPoints: undefined,
      status: ExerciseStatus.DRAFT,
    },
  });

  const dateRange: DateRange = {
    from: form.watch("labDate"),
    to: form.watch("dueDate"),
  };

  // Load exercise data for edit mode
  useEffect(() => {
    if (isEditMode && exerciseData && open) {
      const labDate = exerciseData.labDate ? new Date(exerciseData.labDate) : undefined;
      const dueDate = exerciseData.dueDate ? new Date(exerciseData.dueDate) : undefined;

      form.reset({
        title: exerciseData.title,
        description: exerciseData.description || "",
        labDate,
        dueDate,
        totalPoints: exerciseData.totalPoints,
        status: exerciseData.status,
      });

      setFiles(null);
      setFilesToRemove([]);
    }
  }, [exerciseData, form, isEditMode, open]);

  const resetForm = () => {
    if (isEditMode && exerciseData) {
      // Reset to current exercise data
      const labDate = exerciseData.labDate ? new Date(exerciseData.labDate) : undefined;
      const dueDate = exerciseData.dueDate ? new Date(exerciseData.dueDate) : undefined;

      form.reset({
        title: exerciseData.title,
        description: exerciseData.description || "",
        labDate,
        dueDate,
        totalPoints: exerciseData.totalPoints,
        status: exerciseData.status,
      });
    } else {
      // Reset to defaults for create mode
      form.reset({
        title: "",
        description: "",
        labDate: undefined,
        dueDate: undefined,
        totalPoints: undefined,
        status: ExerciseStatus.DRAFT,
      });
    }

    setFiles(null);
    setFilesToRemove([]);
  };

  const handleSubmit = (data: FormData) => {
    form.clearErrors("root");

    const requestData = {
      title: data.title,
      description: data.description || undefined,
      labDate: format(data.labDate, "yyyy-MM-dd"),
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
      totalPoints: data.totalPoints,
      labCourseId,
      status: data.status,
    };

    if (isEditMode && exerciseId) {
      updateExerciseMutation.mutate(
        {
          data: {
            id: exerciseId,
            ...requestData,
          },
          files: files || undefined,
          removeFiles: filesToRemove.length > 0 ? filesToRemove : undefined,
        },
        {
          onSuccess: () => {
            setOpen?.(false);
          },
          onError: (error: any) => {
            const errorMessage = error?.message || "Failed to update exercise";
            form.setError("root", {
              type: "server",
              message: errorMessage,
            });
          },
        },
      );
    } else {
      createExerciseMutation.mutate(
        {
          data: requestData,
          files: files || undefined,
        },
        {
          onSuccess: () => {
            setOpen?.(false);
            resetForm();
          },
          onError: (error: any) => {
            const errorMessage = error?.message || "Failed to create exercise";
            form.setError("root", {
              type: "server",
              message: errorMessage,
            });
          },
        },
      );
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen?.(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const isPending = createExerciseMutation.isPending || updateExerciseMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!max-w-6xl min-h-[60vh] max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Exercise" : "Create New Lab Exercise"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the laboratory exercise"
              : "Add a new laboratory exercise for this course"}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isLoadingExercise ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="text-muted-foreground">Loading exercise data...</div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-1 flex-col h-full gap-6"
            >
              <div className="grid grid-cols-[1fr_auto_2fr] gap-6 flex-1">
                {/* Left Column - 1/3 width */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercise Title *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="labDate"
                      render={() => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lab Date Range *</FormLabel>
                          <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !dateRange.from && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                  formatDateRange(dateRange)
                                ) : (
                                  <span>Select lab and due dates</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                              <Calendar
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={dateRange}
                                onSelect={(newDateRange) => {
                                  if (!newDateRange) return;

                                  if (newDateRange.from) {
                                    form.setValue("labDate", newDateRange.from, {
                                      shouldValidate: true,
                                    });
                                    form.clearErrors("labDate");
                                  }

                                  if (newDateRange.to) {
                                    form.setValue("dueDate", newDateRange.to, {
                                      shouldValidate: true,
                                    });
                                    form.clearErrors("dueDate");
                                  }
                                }}
                                captionLayout="dropdown"
                                className="rounded-lg border shadow-sm"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="totalPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Points *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : parseInt(value) || undefined,
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem key={field.value}>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="min-w-1/2">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ExerciseStatus.DRAFT}>Draft</SelectItem>
                            <SelectItem value={ExerciseStatus.PUBLISHED}>Published</SelectItem>
                            <SelectItem value={ExerciseStatus.ARCHIVED}>Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator orientation="vertical" />

                {/* Right Column - 2/3 width */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <MinimalTiptapEditor
                            {...field}
                            className="w-full min-h-[200px]"
                            editorContentClassName="p-5 max-h-[512px] overflow-auto"
                            output="html"
                            placeholder="Enter your description..."
                            editorClassName="focus:outline-hidden"
                            immediatelyRender
                            editable
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ExerciseFileManager
                    existingFiles={exerciseData?.files}
                    newFiles={files}
                    onNewFilesChange={setFiles}
                    filesToRemove={filesToRemove}
                    onFilesToRemoveChange={setFilesToRemove}
                  />
                </div>
              </div>

              {form.formState.errors.root && (
                <div className="text-sm text-red-600">{form.formState.errors.root.message}</div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  {isPending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                      ? "Update Exercise"
                      : "Create Lab Exercise"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
