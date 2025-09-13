import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLabCourseByIdQueryOptions } from "@/data/labCourse";
import { capitalize } from "@/lib/utils";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

const paramsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/courses/$courseId")({
  component: RouteComponent,
  params: {
    parse: (params) => paramsSchema.parse(params),
  },
  loader: ({ context: { queryClient }, params }) => {
    const courseId = z.number().parse(Number(params.courseId));
    return queryClient.ensureQueryData(getLabCourseByIdQueryOptions(courseId));
  },
});

export default function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(courseId));

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const getActiveTab = () => {
    if (pathname.includes("/labs")) return "labs";
    if (pathname.includes("/students")) return "students";
    return "overview";
  };

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

      <Tabs value={getActiveTab()} className="space-y-6">
        <TabsList>
          <Link to="/courses/$courseId" params={{ courseId }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </Link>
          <Link to="/courses/$courseId/exercises" params={{ courseId }}>
            <TabsTrigger value="labs">Exercises</TabsTrigger>
          </Link>
          <Link
            to="/courses/$courseId/students"
            search={{ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }}
            params={{ courseId }}
          >
            <TabsTrigger value="students">Students</TabsTrigger>
          </Link>
        </TabsList>

        <Outlet />
      </Tabs>
    </div>
  );
}
