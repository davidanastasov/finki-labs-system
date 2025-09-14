import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  exercise: { totalPoints: number } | undefined;
  selectedCount: number;
  onApplyPoints: (points: string) => void;
}

export function QuickActions({ exercise, selectedCount, onApplyPoints }: QuickActionsProps) {
  const [customPoints, setCustomPoints] = React.useState("");

  if (!exercise) return null;

  // Quick entry preset values
  const presetValues = [0, 5, 10, exercise.totalPoints];

  function handleApplyPoints(points: string) {
    onApplyPoints(points);
    setCustomPoints("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Apply point values to selected students. Click preset badges or enter custom value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Custom Value */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="number"
                min="0"
                max={exercise.totalPoints}
                placeholder="Custom points"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                className="w-48 pr-16"
              />
              {customPoints && (
                <Badge
                  variant="default"
                  className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-xs px-2 py-0.5"
                  onClick={() => handleApplyPoints(customPoints)}
                >
                  Apply
                </Badge>
              )}
            </div>
          </div>

          {/* Preset Values */}
          <div className="flex gap-2 flex-wrap">
            {presetValues.map((value) => (
              <Badge
                key={value}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                onClick={() => handleApplyPoints(value.toString())}
              >
                {value} pts
              </Badge>
            ))}
          </div>

          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground">
              Will be applied to {selectedCount} students
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
