import { useRef } from "react";
import { Save, Users, X } from "lucide-react";
import { QuickActions } from "./quick-actions";
import { StudentSearch } from "./student-search";
import { StatusLegend } from "./status-legend";
import type { StudentScore } from "@/stores/student-exercise-scoring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useStudentScoring } from "@/stores/student-exercise-scoring";

// Utility function to get row styling based on save status
const getRowStyling = (saveStatus: StudentScore["saveStatus"], hasPoints: boolean) => {
  if (saveStatus === "saving") {
    return "bg-blue-50 dark:bg-blue-950/50 border-l-blue-400 dark:border-l-blue-500";
  }
  if (saveStatus === "graded" && hasPoints) {
    return "bg-green-50 dark:bg-green-950/50 border-l-green-400 dark:border-l-green-500";
  }
  if (saveStatus === "error") {
    return "bg-red-50 dark:bg-red-950/50 border-l-red-400 dark:border-l-red-500";
  }
  if (saveStatus === "pending") {
    return "bg-yellow-50 dark:bg-yellow-950/50 border-l-yellow-400 dark:border-l-yellow-500";
  }
  return "border-l-transparent";
};

export function StudentExerciseScoring({
  courseId,
  exerciseId,
}: {
  courseId: number;
  exerciseId: number;
}) {
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const {
    inputValue: searchValue,
    debouncedValue: debouncedSearch,
    setInputValue: setSearchValue,
  } = useDebouncedSearch("", { delay: 300 });

  const { state, actions, computed, exercise, courseStudents } = useStudentScoring(
    courseId,
    exerciseId,
  );

  // Filter students based on search
  const filteredStudents = (courseStudents?.items || []).filter((student) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      student.index.toLowerCase().includes(searchLower) ||
      student.name.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      `${student.name} ${student.lastName}`.toLowerCase().includes(searchLower)
    );
  });

  if (computed.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading student scores...</div>
        </CardContent>
      </Card>
    );
  }

  const selectedCount = filteredStudents.filter((student) => {
    return state.studentScores[student.index].selected;
  }).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Point Entry</CardTitle>
          <CardDescription>
            Click on rows to select students, or use checkboxes. Input automatically selects
            students and saves on blur. Clear with backspace or (×) button.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <StudentSearch
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              debouncedSearch={debouncedSearch}
              filteredCount={filteredStudents.length}
            />

            <QuickActions
              exercise={exercise}
              selectedCount={selectedCount}
              onApplyPoints={actions.applyPointsAndSave}
            />
          </div>

          {/* Student List */}
          {Object.keys(state.studentScores).length > 0 && filteredStudents.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between gap-2 items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Points
                  </CardTitle>

                  <div className="text-sm text-muted-foreground">
                    Progress: {computed.completedCount} / {filteredStudents.length} students
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Color Legend */}
                <StatusLegend />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12 pl-2.5">
                          <Checkbox
                            checked={selectedCount === filteredStudents.length && selectedCount > 0}
                            onCheckedChange={(checked) =>
                              actions.selectAll(
                                checked as boolean,
                                filteredStudents.map((s) => s.index),
                              )
                            }
                          />
                        </TableHead>
                        <TableHead>Index</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const score = state.studentScores[student.index];
                        const validation = computed.validateScore(score.corePoints);

                        return (
                          <TableRow
                            key={student.index}
                            className={`${getRowStyling(score.saveStatus, !!score.corePoints)} border-l-4! cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={(e) => {
                              if (
                                (e.target as HTMLElement).tagName !== "INPUT" &&
                                !(e.target as HTMLElement).closest("button")
                              ) {
                                actions.toggleSelection(student.index);
                              }
                            }}
                          >
                            <TableCell>
                              <Checkbox
                                checked={score.selected}
                                onCheckedChange={(checked) =>
                                  actions.updateScore(student.index, "selected", checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground font-mono">
                                {student.index}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {student.name} {student.lastName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <div className="relative">
                                  <Input
                                    ref={(ref) => {
                                      if (ref) inputRefs.current[student.index] = ref;
                                    }}
                                    type="number"
                                    min="0"
                                    max={exercise?.totalPoints}
                                    value={score.corePoints}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      actions.updateScore(student.index, "corePoints", value);

                                      // Auto-select checkbox when user enters a value
                                      if (value && value !== "" && !score.selected) {
                                        actions.updateScore(student.index, "selected", true);
                                      }

                                      actions.validateAndUpdateScore(student.index, value);
                                    }}
                                    onFocus={() => {
                                      if (!score.selected) {
                                        actions.updateScore(student.index, "selected", true);
                                      }
                                    }}
                                    onBlur={() => {
                                      const currentValue = score.corePoints || "";
                                      actions.validateAndUpdateScore(student.index, currentValue);
                                    }}
                                    className={`w-20 text-center ${
                                      !validation.isValid
                                        ? "border-red-500 bg-red-50 dark:bg-red-950/50 dark:border-red-400"
                                        : "bg-background"
                                    }`}
                                  />

                                  {score.corePoints && score.corePoints !== "" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute -right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        actions.clearScore(student.index);
                                      }}
                                      title="Clear score"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {!validation.isValid && (
                                <div className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
                                  {validation.error}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      {selectedCount} of {filteredStudents.length} students selected
                    </div>
                    {computed.pendingCount > 0 && (
                      <div className="text-yellow-600 dark:text-yellow-400">
                        {computed.pendingCount} pending changes
                      </div>
                    )}
                    {computed.errorCount > 0 && (
                      <div className="text-red-600 dark:text-red-400">
                        {computed.errorCount} validation errors
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={actions.saveAllPendingChanges}
                    disabled={computed.pendingCount === 0 || computed.errorCount > 0}
                    variant={computed.errorCount > 0 ? "secondary" : "default"}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {computed.errorCount > 0
                      ? `Fix ${computed.errorCount} error(s) first`
                      : `Save Pending Changes (${computed.pendingCount})`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
