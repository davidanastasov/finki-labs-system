import { BookOpen, Calendar, GraduationCap, Users } from "lucide-react";
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

interface Course {
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

interface CourseDetailsDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailsDialog({ course, open, onOpenChange }: CourseDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course.code} - {course.name}
          </DialogTitle>
          <DialogDescription>
            Course details for {course.academicYear} {course.semester} semester
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course.academicYear}</div>
                <p className="text-xs text-muted-foreground">{course.semester} Semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course.enrolledStudents}</div>
                <p className="text-xs text-muted-foreground">Active enrollments</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Professors
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.professors.map((professor) => (
                  <Badge key={professor} variant="secondary">
                    {professor}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Teaching Assistants</h4>
              <div className="flex flex-wrap gap-2">
                {course.assistants.map((assistant) => (
                  <Badge key={assistant} variant="outline">
                    {assistant}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Course Status</h4>
              <Badge
                variant={
                  course.status === "active"
                    ? "default"
                    : course.status === "completed"
                      ? "secondary"
                      : "outline"
                }
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
