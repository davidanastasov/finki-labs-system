import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateSignatureRequirements } from "@/data/labCourse";

const formSchema = z
  .object({
    requiredLabs: z
      .number({ error: "Required labs must be a number" })
      .min(0, "Required labs must be at least 0"),
    totalLabs: z.number(),
  })
  .refine((data) => data.requiredLabs <= data.totalLabs, {
    message: "Required labs cannot exceed total labs",
    path: ["requiredLabs"],
  });

type FormData = z.infer<typeof formSchema>;

interface SignatureRequirementFormProps {
  courseId: number;
  currentRequiredLabs: number | null;
  totalLabs: number;
  onEditingChange: (isEditing: boolean) => void;
}

export function SignatureRequirementsForm({
  courseId,
  currentRequiredLabs,
  totalLabs,
  onEditingChange,
}: SignatureRequirementFormProps) {
  const updateSignatureRequirementsMutation = useUpdateSignatureRequirements(courseId);
  const { isPending } = updateSignatureRequirementsMutation;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requiredLabs: currentRequiredLabs ?? 0,
      totalLabs,
    },
  });

  const handleSubmit = (data: FormData) => {
    updateSignatureRequirementsMutation.mutate(
      { requiredExercises: data.requiredLabs },
      {
        onSuccess: () => {
          onEditingChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || "Failed to update signature requirement";
          form.setError("root", {
            type: "server",
            message: errorMessage,
          });
        },
      },
    );
  };

  const handleCancel = () => {
    form.reset();
    onEditingChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="requiredLabs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Labs</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseInt(value) || 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalLabs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Labs</FormLabel>
                <FormControl>
                  <Input type="number" value={field.value} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <div className="text-sm text-red-600">{form.formState.errors.root.message}</div>
        )}

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
