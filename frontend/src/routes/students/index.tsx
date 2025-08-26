import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTable } from "@/components/students/student-table";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useStudyPrograms as useStudyPrograms } from "@/data/studyProgram";

const mockStudents = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@university.edu",
    role: "student" as const,
    indexNumber: "2023/0001",
    studyTrack: "Computer Science",
    enrolledCourses: ["CS101", "CS102"],
    totalPoints: 85,
    averageScore: 8.5,
    status: "active" as const,
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@university.edu",
    role: "student" as const,
    indexNumber: "2023/0002",
    studyTrack: "Computer Science",
    enrolledCourses: ["CS101"],
    totalPoints: 72,
    averageScore: 7.2,
    status: "active" as const,
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@university.edu",
    role: "student" as const,
    indexNumber: "2023/0003",
    studyTrack: "Information Systems",
    enrolledCourses: ["CS101", "CS102", "CS103"],
    totalPoints: 94,
    averageScore: 9.4,
    status: "active" as const,
  },

  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@university.edu",
    role: "student" as const,
    indexNumber: "2022/0045",
    studyTrack: "Computer Science",
    enrolledCourses: ["CS102"],
    totalPoints: 67,
    averageScore: 6.7,
    status: "inactive" as const,
  },
];

export const Route = createFileRoute("/students/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole] = useState("all");
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [selectedStatus] = useState("all");

  const [studyProgramSearchValue, setStudyProgramSearchValue] = useState<string>("");
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>("");

  const { data: studyPrograms, isLoading: isStudyProgramsLoading } = useStudyPrograms();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || student.role === selectedRole;
    const matchesTrack = selectedTrack === "all" || student.studyTrack === selectedTrack;
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesRole && matchesTrack && matchesStatus;
  });

  const totalStudents = students.length;

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
            <div className="text-2xl font-bold">{totalStudents}</div>
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
          <StudentTable students={filteredStudents} />
        </CardContent>
      </Card>
    </div>
  );
}
