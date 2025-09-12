import { Plus, Search } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Course } from "@/components/courses/course-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseTable } from "@/components/courses/course-table";
import { CourseDialog } from "@/components/courses/course-form-dialog";
import { getAllSemestersQueryOptions } from "@/data/semester";
import { getAllSubjectsQueryOptions } from "@/data/subject";

export const Route = createFileRoute("/courses/")({
  component: CoursesPage,
  loader: ({ context: { queryClient } }) =>
    Promise.allSettled([
      queryClient.ensureQueryData(getAllSubjectsQueryOptions()),
      queryClient.ensureQueryData(getAllSemestersQueryOptions()),
    ]),
});

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    semester: "Fall",
    academicYear: "2024/25",
    professors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
    assistants: ["Alice Smith", "Bob Wilson"],
    enrolledStudents: 45,
    status: "active",
  },
  {
    id: "2",
    code: "CS102",
    name: "Data Structures and Algorithms",
    semester: "Spring",
    academicYear: "2024/25",
    professors: ["Prof. David Brown"],
    assistants: ["Carol Davis", "Eve Martinez"],
    enrolledStudents: 38,
    status: "active",
  },
  {
    id: "3",
    code: "CS101",
    name: "Introduction to Computer Science",
    semester: "Fall",
    academicYear: "2023/24",
    professors: ["Dr. Sarah Johnson"],
    assistants: ["John Doe"],
    enrolledStudents: 42,
    status: "completed",
  },
];

export default function CoursesPage() {
  const [courses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024/25");
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || course.academicYear === selectedYear;
    return matchesSearch && matchesYear;
  });

  const academicYears = Array.from(new Set(courses.map((course) => course.academicYear)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sans">Courses</h1>
        </div>
        <Button onClick={() => setIsNewCourseOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Across all academic years</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Current academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Enrolled across all courses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>View and manage courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Years</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <CourseTable courses={filteredCourses} />
        </CardContent>
      </Card>

      <CourseDialog open={isNewCourseOpen} onOpenChange={setIsNewCourseOpen} />
    </div>
  );
}
