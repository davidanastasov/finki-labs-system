import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLabCourseByIdQueryOptions } from "@/data/labCourse";
import { capitalize } from "@/lib/utils";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

export const Route = createFileRoute("/courses/$courseId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) => {
    const courseId = z.number().parse(Number(params.courseId));
    return queryClient.ensureQueryData(getLabCourseByIdQueryOptions(courseId));
  },
});

export default function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(Number(courseId)));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/courses" search={{ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-sans">{course.subject.name}</h1>
          <p className="text-muted-foreground font-serif">
            {course.semester.year} - {capitalize(course.semester.type)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                      <span className="font-medium">Abbreviation:</span>{" "}
                      {course.subject.abbreviation}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
