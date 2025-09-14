import { useCallback, useEffect } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { toast } from "sonner";
import { useCourseStudents } from "@/data/labCourseStudent";
import { useExerciseById } from "@/data/labCourseExercise";
import {
  useBulkUpdateScores,
  useDeleteStudentScore,
  useExerciseScores,
} from "@/data/studentExerciseScore";

export interface StudentScore {
  studentId: string;
  corePoints: string;
  selected: boolean;
  saveStatus: "idle" | "pending" | "saving" | "graded" | "error";
  lastSaved?: number;
}

interface StudentScoringStore {
  // State
  studentScores: Record<string, StudentScore>;
  isSaving: boolean;

  // Actions
  initializeScores: (students: any[], existingScores: any[]) => void;
  updateScore: (studentId: string, field: keyof StudentScore, value: any) => void;
  validateAndUpdateScore: (
    studentId: string,
    value: string,
    exercise: any,
    existingScores: any[],
  ) => void;
  selectAll: (selected: boolean, studentIds: string[]) => void;
  toggleSelection: (studentId: string) => void;
  clearScore: (studentId: string, existingScores: any[]) => void;
  applyPointsAndSave: (points: string, exercise: any, bulkUpdateMutation: any) => Promise<void>;
  saveAllPendingChanges: (
    existingScores: any[],
    deleteScoreMutation: any,
    bulkUpdateMutation: any,
  ) => Promise<void>;
  resetSelections: () => void;

  // Computed/Selectors
  pendingCount: () => number;
  errorCount: () => number;
  completedCount: () => number;
  selectedStudents: () => StudentScore[];
}

const validateScore = (value: string, exercise: any) => {
  if (!value || value === "") return { isValid: true, error: null };

  const points = Number.parseInt(value);
  if (isNaN(points)) return { isValid: false, error: "Invalid number" };
  if (points < 0) return { isValid: false, error: "Must be positive" };
  if (exercise && points > exercise.totalPoints) {
    return { isValid: false, error: `Max ${exercise.totalPoints}` };
  }

  return { isValid: true, error: null };
};

export const useStudentScoringStore = create<StudentScoringStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      studentScores: {},
      isSaving: false,

      // Actions
      initializeScores: (students, existingScores) => {
        set((state) => {
          const existingScoreMap = new Map(
            existingScores.map((score: any) => [score.studentIndex, score]),
          );

          const scores: Record<string, StudentScore> = {};
          students.forEach((student: any) => {
            const existingScore = existingScoreMap.get(student.index);
            const hasPoints = existingScore?.corePoints !== undefined;

            scores[student.index] = {
              studentId: student.index,
              corePoints: existingScore ? existingScore.corePoints.toString() : "",
              selected: false,
              saveStatus: hasPoints ? "graded" : "idle",
            };
          });

          state.studentScores = scores;
        });
      },

      updateScore: (studentId, field, value) => {
        set((state) => {
          (state.studentScores[studentId] as any)[field] = value;
        });
      },

      validateAndUpdateScore: (studentId, value, exercise, existingScores) => {
        set((state) => {
          const { isValid } = validateScore(value, exercise);
          const existingScore = existingScores.find((s: any) => s.studentIndex === studentId);
          const hasChanged = value !== (existingScore?.corePoints.toString() || "");

          state.studentScores[studentId].corePoints = value;

          // Apply validation
          if (!isValid) {
            state.studentScores[studentId].saveStatus = "error";
          } else if (hasChanged) {
            state.studentScores[studentId].saveStatus = "pending";
          } else {
            state.studentScores[studentId].saveStatus = "idle";
          }
        });
      },

      selectAll: (selected, studentIds) => {
        set((state) => {
          studentIds.forEach((studentId) => {
            state.studentScores[studentId].selected = selected;
          });
        });
      },

      toggleSelection: (studentId) => {
        set((state) => {
          state.studentScores[studentId].selected = !state.studentScores[studentId].selected;
        });
      },

      clearScore: (studentId, existingScores) => {
        set((state) => {
          const existingScore = existingScores.find((s: any) => s.studentIndex === studentId);
          state.studentScores[studentId].corePoints = "";
          state.studentScores[studentId].selected = false;
          state.studentScores[studentId].saveStatus = existingScore ? "pending" : "idle";
        });
        toast.success(`Cleared score for student ${studentId}`);
      },

      applyPointsAndSave: async (corePoints, exercise, bulkUpdateMutation) => {
        const { studentScores } = get();
        const selectedStudents = Object.values(studentScores).filter((score) => score.selected);

        if (selectedStudents.length === 0) {
          toast.error("Please select at least one student");
          return;
        }

        const { isValid } = validateScore(corePoints, exercise);
        if (!isValid) {
          toast.error("Invalid point value");
          return;
        }

        const selectedIds = selectedStudents.map((s) => s.studentId);

        // Set saving status
        set((state) => {
          state.isSaving = true;
          selectedIds.forEach((studentId) => {
            state.studentScores[studentId].saveStatus = "saving";
          });
        });

        try {
          const scores = selectedStudents.map((score) => ({
            studentIndex: score.studentId,
            corePoints: Number.parseInt(corePoints),
          }));

          await bulkUpdateMutation.mutateAsync({ scores });

          // Success
          set((state) => {
            selectedIds.forEach((studentId) => {
              state.studentScores[studentId].saveStatus = "graded";
              state.studentScores[studentId].lastSaved = Date.now();
            });
            state.isSaving = false;
          });

          toast.success(
            `Applied and saved ${corePoints} points for ${selectedStudents.length} students`,
          );

          get().resetSelections();
        } catch (error) {
          set((state) => {
            selectedIds.forEach((studentId) => {
              state.studentScores[studentId].saveStatus = "error";
            });
            state.isSaving = false;
          });
          toast.error("Failed to save scores for selected students");
        }
      },

      saveAllPendingChanges: async (existingScores, deleteScoreMutation, bulkUpdateMutation) => {
        const { studentScores } = get();
        const pendingScores = Object.values(studentScores).filter(
          (score) => score.saveStatus === "pending",
        );
        const errorScores = Object.values(studentScores).filter(
          (score) => score.saveStatus === "error",
        );

        if (errorScores.length > 0) {
          toast.error(`Please fix ${errorScores.length} validation error(s) before saving`);
          return;
        }

        if (pendingScores.length === 0) {
          toast.error("No pending changes to save");
          return;
        }

        const pendingIds = pendingScores.map((s) => s.studentId);

        set((state) => {
          state.isSaving = true;
          pendingIds.forEach((studentId) => {
            state.studentScores[studentId].saveStatus = "saving";
          });
        });

        try {
          // Handle deletions and updates
          const scoresToSave = pendingScores.filter(
            (score) => score.corePoints && score.corePoints !== "",
          );
          const scoresToDelete = pendingScores.filter(
            (score) => !score.corePoints || score.corePoints === "",
          );

          // Delete scores
          for (const score of scoresToDelete) {
            const existingScore = existingScores.find(
              (s: any) => s.studentIndex === score.studentId,
            );
            if (existingScore) {
              await deleteScoreMutation.mutateAsync(score.studentId);
            }
          }

          // Update/create scores
          if (scoresToSave.length > 0) {
            const scores = scoresToSave.map((score) => ({
              studentIndex: score.studentId,
              corePoints: Number.parseInt(score.corePoints),
            }));
            await bulkUpdateMutation.mutateAsync({ scores });
          }

          set((state) => {
            pendingIds.forEach((studentId) => {
              state.studentScores[studentId].saveStatus = "graded";
              state.studentScores[studentId].lastSaved = Date.now();
              state.isSaving = false;
            });
          });

          toast.success(`Saved ${pendingScores.length} score changes`);
        } catch (error) {
          set((state) => {
            pendingIds.forEach((studentId) => {
              state.studentScores[studentId].saveStatus = "error";
            });
            state.isSaving = false;
          });
          toast.error("Failed to save some scores");
        }
      },

      resetSelections: () => {
        set((state) => {
          Object.keys(state.studentScores).forEach((studentId) => {
            state.studentScores[studentId].selected = false;
            state.studentScores[studentId].saveStatus = "idle";
          });
        });
      },

      // Selectors
      pendingCount: () => {
        const { studentScores } = get();
        return Object.values(studentScores).filter((s) => s.saveStatus === "pending").length;
      },

      errorCount: () => {
        const { studentScores } = get();
        return Object.values(studentScores).filter((s) => s.saveStatus === "error").length;
      },

      completedCount: () => {
        const { studentScores } = get();
        return Object.values(studentScores).filter((s) => s.corePoints && s.corePoints !== "")
          .length;
      },

      selectedStudents: () => {
        const { studentScores } = get();
        return Object.values(studentScores).filter((s) => s.selected);
      },
    })),
    { name: "student-scoring-store" },
  ),
);

export const useStudentScoring = (courseId: number, exerciseId: number) => {
  const store = useStudentScoringStore();

  // API hooks
  const { data: exercise } = useExerciseById(exerciseId, { courseId });
  const { data: courseStudents, isLoading: isLoadingStudents } = useCourseStudents({
    courseId,
    pageSize: 100,
  });
  const { data: existingScores, isLoading: isLoadingScores } = useExerciseScores(exerciseId);

  const deleteStudentScoreMutation = useDeleteStudentScore(exerciseId);
  const bulkUpdateScoresMutation = useBulkUpdateScores(exerciseId);

  // Initialize scores when data loads
  useEffect(() => {
    if (courseStudents?.items && !isLoadingScores && !store.isSaving) {
      store.initializeScores(courseStudents.items, existingScores || []);
    }
  }, [
    courseStudents?.items,
    existingScores,
    isLoadingScores,
    store.isSaving,
    store.initializeScores,
  ]);

  const computed = {
    isLoading:
      isLoadingStudents || isLoadingScores || Object.keys(store.studentScores).length === 0,
    pendingCount: store.pendingCount(),
    errorCount: store.errorCount(),
    completedCount: store.completedCount(),
    validateScore: (value: string) => validateScore(value, exercise),
  };

  const actions = {
    updateScore: store.updateScore,
    selectAll: store.selectAll,
    toggleSelection: store.toggleSelection,
    validateAndUpdateScore: useCallback(
      (studentId: string, value: string) =>
        store.validateAndUpdateScore(studentId, value, exercise, existingScores || []),
      [store.validateAndUpdateScore, exercise, existingScores],
    ),
    clearScore: useCallback(
      (studentId: string) => store.clearScore(studentId, existingScores || []),
      [store.clearScore, existingScores],
    ),
    applyPointsAndSave: useCallback(
      (points: string) => store.applyPointsAndSave(points, exercise, bulkUpdateScoresMutation),
      [store.applyPointsAndSave, exercise, bulkUpdateScoresMutation],
    ),
    saveAllPendingChanges: useCallback(
      () =>
        store.saveAllPendingChanges(
          existingScores || [],
          deleteStudentScoreMutation,
          bulkUpdateScoresMutation,
        ),
      [
        store.saveAllPendingChanges,
        existingScores,
        deleteStudentScoreMutation,
        bulkUpdateScoresMutation,
      ],
    ),
  };

  return {
    state: store,
    actions,
    computed,
    exercise,
    courseStudents,
    existingScores,
  };
};
