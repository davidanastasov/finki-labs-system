import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLabCourseByIdQueryOptions } from "@/data/labCourse";
import { capitalize } from "@/lib/utils";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseOverviewComponent,
});

function CourseOverviewComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(Number(courseId)));

  return (
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
  );
}
