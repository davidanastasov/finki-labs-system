import { BookOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  indexNumber: string;
  studyTrack: string;
  enrolledCoursesCount: number;
}

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  // const [selectedStudent] = useState<Student | null>(null);
  // const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Index Number</TableHead>
              <TableHead>Study Track</TableHead>
              <TableHead>Courses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{student.indexNumber}</span>
                </TableCell>
                <TableCell>{student.studyTrack}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    {student.enrolledCoursesCount}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* {selectedStudent && (
        <>
          <StudentDetailsDialog
            student={selectedStudent}
            open={showDetails}
            onOpenChange={setShowDetails}
          />
        </>
      )} */}
    </>
  );
}
