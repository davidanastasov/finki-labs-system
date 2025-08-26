import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTable } from "@/components/students/student-table";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useStudyPrograms as useStudyPrograms } from "@/data/studyProgram";
import { useStudents } from "@/data/student";

export const Route = createFileRoute("/students/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  const [studyProgramSearchValue, setStudyProgramSearchValue] = useState<string>("");
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>("");

  const { data: studyPrograms, isLoading: isStudyProgramsLoading } = useStudyPrograms();

  const { data: students } = useStudents({
    search: searchTerm,
    studyProgramCode: selectedProgramCode,
  });

  if (!students) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sans">Student Management</h1>
          <p className="text-muted-foreground font-serif">Manage students and course enrollments</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.count}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyPrograms?.length ?? "-"}</div>
            <p className="text-xs text-muted-foreground">Different programs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>View and manage all students in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <AutoComplete
              selectedValue={selectedProgramCode}
              onSelectedValueChange={setSelectedProgramCode}
              searchValue={studyProgramSearchValue}
              onSearchValueChange={setStudyProgramSearchValue}
              items={
                studyPrograms?.map((studyProgram) => ({
                  label: `${studyProgram.code} - ${studyProgram.name}`,
                  value: studyProgram.code,
                })) ?? []
              }
              isLoading={isStudyProgramsLoading}
              placeholder="Filter Study Program"
              align="end"
            />
          </div>
          <StudentTable
            students={students.result?.map((student) => ({
              firstName: student.name,
              lastName: student.lastName,
              email: student.email,
              studyTrack: student.studyProgram.name,
              id: student.index,
              indexNumber: student.index,
              enrolledCoursesCount: 0,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
