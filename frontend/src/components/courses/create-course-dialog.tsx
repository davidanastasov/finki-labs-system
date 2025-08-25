import { X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CreateCourseDialogProps {
  children: React.ReactNode;
}

export function CreateCourseDialog({ children }: CreateCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [professors, setProfessors] = useState<string[]>([]);
  const [assistants, setAssistants] = useState<string[]>([]);
  const [newProfessor, setNewProfessor] = useState("");
  const [newAssistant, setNewAssistant] = useState("");

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
    console.log("Creating course...");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input id="courseCode" placeholder="e.g., CS101" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
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
            <Input id="courseName" placeholder="e.g., Introduction to Computer Science" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Course description and objectives..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Winter</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
