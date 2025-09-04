import { BookOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/loaders/table-skeleton";

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
  isLoading?: boolean;
  pageSize?: number;
}

export function StudentTable({ students, isLoading = false, pageSize = 10 }: StudentTableProps) {
  // const [selectedStudent] = useState<Student | null>(null);
  // const [showDetails, setShowDetails] = useState(false);

  const tableHeaders = ["Name", "Email", "Index Number", "Study Track", "Courses"];

  if (isLoading) {
    return <TableSkeleton rows={pageSize} columns={5} headers={tableHeaders} />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
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
              ))
            )}
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
