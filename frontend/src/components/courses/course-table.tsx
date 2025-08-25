import { useState } from "react";
import { Edit, Eye, MoreHorizontal, Users } from "lucide-react";
import { CourseDetailsDialog } from "./course-details-dialog";
import { EditCourseDialog } from "./edit-course-dialog";
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
import { Link } from "@tanstack/react-router";

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  academicYear: string;
  professors: string[];
  assistants: string[];
  enrolledStudents: number;
  status: "active" | "completed" | "draft";
}

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowEdit(true);
  };

  console.log(courses);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Professors</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={`${course.id}-${course.academicYear}`}
                className="cursor-pointer hover:bg-muted/50"
              >
                <Link to={`/courses`} className="contents">
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.academicYear}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.professors.slice(0, 2).map((prof, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {prof}
                        </Badge>
                      ))}
                      {course.professors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.professors.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {course.enrolledStudents}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "active"
                          ? "default"
                          : course.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                </Link>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(course)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(course)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCourse && (
        <>
          <CourseDetailsDialog
            course={selectedCourse}
            open={showDetails}
            onOpenChange={setShowDetails}
          />
          <EditCourseDialog course={selectedCourse} open={showEdit} onOpenChange={setShowEdit} />
        </>
      )}
    </>
  );
}
