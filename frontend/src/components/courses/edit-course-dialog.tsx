import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface EditCourseDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCourseDialog({ course, open, onOpenChange }: EditCourseDialogProps) {
  const [professors, setProfessors] = useState<string[]>([]);
  const [assistants, setAssistants] = useState<string[]>([]);
  const [newProfessor, setNewProfessor] = useState("");
  const [newAssistant, setNewAssistant] = useState("");

  useEffect(() => {
    if (course) {
      setProfessors(course.professors);
      setAssistants(course.assistants);
    }
  }, [course]);

  const addProfessor = () => {
    if (newProfessor.trim() && !professors.includes(newProfessor.trim())) {
      setProfessors([...professors, newProfessor.trim()]);
      setNewProfessor("");
    }
  };

  const removeProfessor = (professor: string) => {
    setProfessors(professors.filter((p) => p !== professor));
  };

  const addAssistant = () => {
    if (newAssistant.trim() && !assistants.includes(newAssistant.trim())) {
      setAssistants([...assistants, newAssistant.trim()]);
      setNewAssistant("");
    }
  };

  const removeAssistant = (assistant: string) => {
    setAssistants(assistants.filter((a) => a !== assistant));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Updating course...");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update course information, professors, and assistants.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input id="courseCode" defaultValue={course.code} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select defaultValue={course.academicYear} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/25">2024/25</SelectItem>
                  <SelectItem value="2023/24">2023/24</SelectItem>
                  <SelectItem value="2025/26">2025/26</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input id="courseName" defaultValue={course.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select defaultValue={course.semester} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Winter</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={course.status} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Professors</Label>
              <div className="flex gap-2">
                <Input
                  value={newProfessor}
                  onChange={(e) => setNewProfessor(e.target.value)}
                  placeholder="Add professor name"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProfessor())}
                />
                <Button type="button" onClick={addProfessor} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {professors.map((professor) => (
                  <Badge key={professor} variant="secondary" className="flex items-center gap-1">
                    {professor}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeProfessor(professor)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Teaching Assistants</Label>
              <div className="flex gap-2">
                <Input
                  value={newAssistant}
                  onChange={(e) => setNewAssistant(e.target.value)}
                  placeholder="Add assistant name"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAssistant())}
                />
                <Button type="button" onClick={addAssistant} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {assistants.map((assistant) => (
                  <Badge key={assistant} variant="outline" className="flex items-center gap-1">
                    {assistant}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeAssistant(assistant)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
