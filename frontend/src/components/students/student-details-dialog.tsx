import { Award, BookOpen, GraduationCap, Hash, Mail, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher";
  indexNumber: string;
  studyTrack: string;
  enrolledCourses: string[];
  totalPoints: number;
  averageScore: number;
  status: "active" | "inactive";
}

interface StudentDetailsDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, open, onOpenChange }: StudentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {student.firstName} {student.lastName}
          </DialogTitle>
          <DialogDescription>
            {student.role === "student" ? "Student" : "Teacher"} details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Role</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={student.role === "teacher" ? "default" : "secondary"}>
                  {student.role}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>

            {student.role === "student" && (
              <>
                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Index Number
                  </h4>
                  <p className="text-sm font-mono">{student.indexNumber}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Study Track
                  </h4>
                  <p className="text-sm">{student.studyTrack}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{student.enrolledCourses.length}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.enrolledCourses.map((course) => (
                          <Badge key={course} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {student.averageScore > 0 ? student.averageScore.toFixed(1) : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.totalPoints} total points
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
