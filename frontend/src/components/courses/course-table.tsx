import { useState } from "react";
import { Edit, MoreHorizontal, Trash2, Users } from "lucide-react";
import { CourseDialog } from "./course-form-dialog";
import { CourseDeleteConfirmDialog } from "./course-delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/loaders/table-skeleton";
import { capitalize } from "@/lib/utils";

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  academicYear: string;
  professors: string[];
  assistants: string[];
  enrolledStudents: number;
  status: "ACTIVE" | "INACTIVE";
}

interface CourseTableProps {
  courses: Course[];
  isLoading?: boolean;
  pageSize?: number;
}

export function CourseTable({ courses, isLoading = false, pageSize = 10 }: CourseTableProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowEdit(true);
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const tableHeaders = [
    "Course Code",
    "Course Name",
    "Semester",
    "Academic Year",
    "Professors",
    "Students",
    "Status",
    "Actions",
  ];

  if (isLoading) {
    return <TableSkeleton rows={pageSize} columns={8} headers={tableHeaders} />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className={index === 7 ? "w-[70px]" : undefined}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={`${course.id}-${course.academicYear}`}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{capitalize(course.semester)}</TableCell>
                  <TableCell>{course.academicYear}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.professors.slice(0, 4).map((prof, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prof}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        +{Math.max(course.professors.length - 4, 0) + course.assistants.length}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />-
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === "ACTIVE" ? "default" : "outline"}>
                      {capitalize(course.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(course)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCourse && (
        <CourseDialog
          courseId={Number(selectedCourse.id)}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}

      <CourseDeleteConfirmDialog
        course={courseToDelete}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
