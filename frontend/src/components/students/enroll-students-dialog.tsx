import { Download, FileText, Info, UserPlus } from "lucide-react";
import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnrollStudentsDialogProps {
  children: React.ReactNode;
}

export function EnrollStudentsDialog({ children }: EnrollStudentsDialogProps) {
  const [open, setOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle enrollment here (UI only)
    console.log("Enrolling students in course...");
    setOpen(false);
  };

  const handleExportTemplate = () => {
    // Handle export template (UI only)
    console.log("Exporting enrollment template...");
  };

  const sampleEnrollment = `studentEmail,courseCode,enrollmentDate,status
alice.johnson@university.edu,CS101,2024-09-01,active
bob.smith@university.edu,CS101,2024-09-01,active
carol.davis@university.edu,CS102,2024-09-01,active`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Enroll Students in Courses
          </DialogTitle>
          <DialogDescription>
            Manage student course enrollments via CSV import/export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is a UI demonstration. In a real implementation, this would process enrollment
              data and update student course registrations.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExportTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Export Current Enrollments
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enrollment Options</CardTitle>
              <CardDescription>Choose how to enroll students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Target Course (Optional)</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course for bulk enrollment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS101">CS101 - Introduction to Computer Science</SelectItem>
                    <SelectItem value="CS102">CS102 - Data Structures and Algorithms</SelectItem>
                    <SelectItem value="CS103">CS103 - Database Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Format for Enrollments
              </CardTitle>
              <CardDescription>Required columns for enrollment data:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div>
                  <h4 className="font-medium">Required Columns:</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• studentEmail - Student's email address</li>
                    <li>• courseCode - Course code (e.g., CS101)</li>
                    <li>• enrollmentDate - Date of enrollment (YYYY-MM-DD)</li>
                    <li>• status - active/inactive/dropped</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample Enrollment Data</CardTitle>
              <CardDescription>Copy this sample format</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {sampleEnrollment}
              </pre>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentData">Enrollment CSV Data</Label>
              <Textarea
                id="enrollmentData"
                value={enrollmentData}
                onChange={(e) => setEnrollmentData(e.target.value)}
                placeholder="Paste your enrollment CSV data here..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!enrollmentData.trim()}>
                Process Enrollments
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
