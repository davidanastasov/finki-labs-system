import { FileText, Info, Upload } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportStudentsDialogProps {
  children: React.ReactNode;
}

export function ImportStudentsDialog({ children }: ImportStudentsDialogProps) {
  const [open, setOpen] = useState(false);
  const [csvData, setCsvData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle CSV import here (UI only)
    console.log("Importing students from CSV...");
    setOpen(false);
  };

  const sampleCsv = `firstName,lastName,email,role,indexNumber,studyTrack,status
John,Doe,john.doe@university.edu,student,2024/0001,Computer Science,active
Jane,Smith,jane.smith@university.edu,student,2024/0002,Information Systems,active
Dr. Michael,Johnson,michael.johnson@university.edu,teacher,,,active`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Students & Teachers
          </DialogTitle>
          <DialogDescription>
            Import users from CSV file with flexible column configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is a UI demonstration. In a real implementation, this would process CSV files and
              import user data into the database.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Format Requirements
              </CardTitle>
              <CardDescription>
                Your CSV file should include the following columns (order can vary):
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Required for All Users:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• firstName</li>
                    <li>• lastName</li>
                    <li>• email</li>
                    <li>• role (student/teacher)</li>
                    <li>• status (active/inactive)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required for Students:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• indexNumber</li>
                    <li>• studyTrack</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample CSV Data</CardTitle>
              <CardDescription>Copy this sample format or upload your own CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{sampleCsv}</pre>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvData">CSV Data</Label>
              <Textarea
                id="csvData"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste your CSV data here or use the file upload button..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV File
              </Button>
              <span className="text-sm text-muted-foreground">or paste data directly above</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!csvData.trim()}>
                Import Users
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
