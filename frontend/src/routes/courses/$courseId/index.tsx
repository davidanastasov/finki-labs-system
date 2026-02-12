import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLabCourseByIdQueryOptions } from "@/data/labCourse";
import { capitalize } from "@/lib/utils";
import { SignatureRequirementsForm } from "@/components/courses/signature/signature-requirements-form";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseOverviewComponent,
});

function CourseOverviewComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(Number(courseId)));

  const [isEditing, setIsEditing] = useState(false);

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
            <Button variant="outline" size="sm" onClick={() => setIsEditing((editing) => !editing)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <SignatureRequirementsForm
              courseId={course.id}
              currentRequiredLabs={course.requiredExercisesForSignature}
              totalLabs={course.totalLabs}
              onEditingChange={setIsEditing}
            />
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">
                  {course.requiredExercisesForSignature ?? 0} out of {course.totalLabs} labs
                  required
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
