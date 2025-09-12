import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultiSelect } from "../ui/multi-select";
import type { MultiSelectGroup } from "../ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubjectCombobox } from "@/components/courses/subject-combobox";
import { useProfessors } from "@/data/professor";
import { useSemesters } from "@/data/semester";
import { useCreateLabCourse, useLabCourseById, useUpdateLabCourse } from "@/data/labCourse";
import { useSubjects } from "@/data/subject";
import { capitalize } from "@/lib/utils";

type FormData = z.infer<typeof formSchema>;
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  semester: z.string().min(1, "Semester is required"),
  description: z.string().optional(),
  professors: z.array(z.string()).min(1, "At least one professor is required"),
  assistants: z.array(z.string()).optional(),
});

interface CourseDialogProps {
  courseId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CourseDialog({ courseId, open, onOpenChange: setOpen }: CourseDialogProps) {
  const isEditMode = courseId !== undefined;

  const { data: allProfessors = [] } = useProfessors();
  const { data: allSemesters = [], isLoading: isLoadingSemesters } = useSemesters();
  const { data: allSubjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { data: courseData, isLoading: isLoadingCourse } = useLabCourseById(courseId!, {
    queryConfig: { enabled: isEditMode && open },
  });

  const createLabCourseMutation = useCreateLabCourse();
  const updateLabCourseMutation = useUpdateLabCourse();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      semester: "",
      description: "",
      professors: [],
      assistants: [],
    },
  });

  // Get selected semester info
  const selectedSemesterCode = form.watch("semester");
  const selectedSemester = selectedSemesterCode
    ? allSemesters.find((s) => s.code === selectedSemesterCode)
    : null;
  const subjects = React.useMemo(
    () =>
      allSubjects.filter((subject) =>
        selectedSemester ? subject.semester === selectedSemester.semesterType : true,
      ),
    [selectedSemester, allSubjects],
  );

  const activeSemester = React.useMemo(
    () => allSemesters.find((s) => s.isActive) || null,
    [allSemesters],
  );

  // Auto-select current semester if no semester is selected
  useEffect(() => {
    if (!isEditMode && activeSemester && !form.getValues("semester")) {
      form.setValue("semester", activeSemester.code);
    }
  }, [activeSemester, form, isEditMode]);

  // Load course data for edit mode
  useEffect(() => {
    if (isEditMode && courseData) {
      form.reset({
        subject: courseData.subject.abbreviation,
        semester: courseData.semester.code,
        description: courseData.description || "",
        professors: courseData.professors.map((professor) => professor.id),
        assistants: courseData.assistants.map((assistant) => assistant.id),
      });
    }
  }, [courseData, form, isEditMode, open]);

  // Clear subject selection when semester changes
  useEffect(() => {
    const currentSubject = form.getValues("subject");

    if (selectedSemesterCode && currentSubject) {
      const isCurrentSubjectValid = subjects.some(
        (subject) => subject.abbreviation === currentSubject,
      );

      if (!isCurrentSubjectValid) {
        form.setValue("subject", "");
      }
    }
  }, [selectedSemesterCode, subjects, form]);

  const resetForm = () => {
    if (isEditMode) {
      // Reset to current course data
      if (courseData) {
        form.setValue("semester", courseData.semester.code);
        form.setValue("subject", courseData.subject.abbreviation);
        form.setValue("description", courseData.description || "");
        form.setValue(
          "professors",
          courseData.professors.map((professor) => professor.id),
        );
        form.setValue(
          "assistants",
          courseData.assistants.map((assistant) => assistant.id),
        );
      }
    } else {
      // Reset to defaults for create mode
      form.reset({
        semester: activeSemester?.code,
      });
    }
  };

  const handleSubmit = (data: FormData) => {
    form.clearErrors("root");

    if (isEditMode && courseId) {
      updateLabCourseMutation.mutate(
        {
          id: courseId,
          semesterCode: data.semester,
          subjectAbbreviation: data.subject,
          description: data.description || undefined,
          professorIds: data.professors,
          assistantIds: data.assistants ?? [],
        },
        {
          onSuccess: () => {
            setOpen?.(false);
          },
          onError: (error: any) => {
            const errorMessage = error?.message || "Failed to update course";
            form.setError("root", {
              type: "server",
              message: errorMessage,
            });
          },
        },
      );
    } else {
      createLabCourseMutation.mutate(
        {
          semesterCode: data.semester,
          subjectAbbreviation: data.subject,
          description: data.description || undefined,
          professorIds: data.professors,
          assistantIds: data.assistants ?? [],
        },
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
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen?.(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const professorOptions = React.useMemo(() => {
    if (allProfessors.length === 0) return [];

    const professorGroups = Object.groupBy(allProfessors, (professor) => professor.title);

    return Object.entries(professorGroups).map<MultiSelectGroup>(([role, professors]) => ({
      heading: role.replace(/_/g, " ").toLowerCase(),
      options: professors.map((professor) => ({ label: professor.name, value: professor.id })),
    }));
  }, [allProfessors]);

  const isPending = createLabCourseMutation.isPending || updateLabCourseMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[91vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Course" : "Create New Course"}</DialogTitle>
        </DialogHeader>

        {isEditMode && isLoadingCourse ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading course data...</div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingSemesters ? "Loading semesters..." : "Select semester"
                              }
                            >
                              {field.value && selectedSemester && (
                                <span>
                                  {selectedSemester.year} -{" "}
                                  {capitalize(selectedSemester.semesterType)}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allSemesters.map((semester) => (
                            <SelectItem key={semester.code} value={semester.code}>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                  {semester.year} - {capitalize(semester.semesterType)}
                                </span>
                                {semester.isActive && (
                                  <span className="text-muted-foreground text-xs">Active</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <SubjectCombobox
                          subjects={subjects}
                          onSelect={(subject) => form.setValue("subject", subject.abbreviation)}
                          value={field.value}
                          placeholder={
                            isLoadingSubjects ? "Loading subjects..." : "Select subject..."
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Course description and objectives..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professors</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={professorOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select professors..."
                          hideSelectAll
                          modalPopover
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assistants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teaching Assistants</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={professorOptions}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select assistant..."
                          hideSelectAll
                          modalPopover
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors.root && (
                <div className="rounded-md bg-destructive/15 p-3">
                  <div className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                      ? "Update Course"
                      : "Create Course"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
