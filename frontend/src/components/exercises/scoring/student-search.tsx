import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  debouncedSearch: string;
  filteredCount: number;
}

export function StudentSearch({
  searchValue,
  onSearchChange,
  debouncedSearch,
  filteredCount,
}: StudentSearchProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or index..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {debouncedSearch && (
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {filteredCount} students matching "{debouncedSearch}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}
