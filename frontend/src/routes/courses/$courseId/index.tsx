import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { getLabCourseByIdQueryOptions, useCourseSignatureConditions } from "@/data/labCourse";
import { capitalize } from "@/lib/utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseOverviewComponent,
});

function CourseOverviewComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(Number(courseId)));

  const { data: signatureConditions } = useCourseSignatureConditions(Number(courseId));

  const [isEditingConditions, setIsEditingConditions] = useState(false);
  const [editableConditions, setEditableConditions] = useState({
    requiredLabs: 1,
    totalLabs: 1,
    description: "",
  });

  useEffect(() => {
    if (signatureConditions) {
      setEditableConditions(signatureConditions);
    }
  }, [signatureConditions]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {course.description || "No description available."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Subject Details</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Code:</span> {course.subject.code}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Abbreviation:</span> {course.subject.abbreviation}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <Badge variant={course.status === "ACTIVE" ? "default" : "secondary"}>
                {capitalize(course.status)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Professors</h3>
              <div className="space-x-1 space-y-1">
                {course.professors.length > 0 ? (
                  course.professors.map((professor) => (
                    <Badge key={professor.id} variant="secondary">
                      {professor.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No professors assigned</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Teaching Assistants</h3>
              <div className="space-x-1 space-y-1">
                {course.assistants.length > 0 ? (
                  course.assistants.map((assistant) => (
                    <Badge key={assistant.id} variant="outline">
                      {assistant.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No assistants assigned</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Conditions Card */}
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Signature Conditions</CardTitle>
              <br></br>
              <CardDescription>
                Requirements for students to receive course signature
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingConditions(!isEditingConditions)}
            >
              <Settings className="mr-2 h-4 w-4" />
              {isEditingConditions ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingConditions ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="requiredLabs">Required Labs</Label>
                  <Input
                    id="requiredLabs"
                    type="number"
                    min="0"
                    value={editableConditions.requiredLabs}
                    onChange={(e) =>
                      setEditableConditions({
                        ...editableConditions,
                        requiredLabs: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="totalLabs">Total Labs</Label>
                  <Input
                    id="totalLabs"
                    type="number"
                    min="1"
                    value={editableConditions.totalLabs}
                    onChange={(e) =>
                      setEditableConditions({
                        ...editableConditions,
                        totalLabs: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="conditions">Additional Requirements</Label>
                <Textarea
                  id="conditions"
                  value={editableConditions.description}
                  onChange={(e) =>
                    setEditableConditions({
                      ...editableConditions,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setIsEditingConditions(false);
                    // TODO: овде повикај mutation за зачувување на бекенд
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditableConditions(signatureConditions);
                    setIsEditingConditions(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">
                  {editableConditions.requiredLabs} out of {editableConditions.totalLabs} labs
                  required
                </p>
              </div>
              <p className="text-muted-foreground text-sm">{editableConditions.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
