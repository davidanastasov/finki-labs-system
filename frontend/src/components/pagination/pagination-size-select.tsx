import type { PageSizeOption } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";

interface PaginationSizeSelectProps {
  defaultValue?: PageSizeOption;
  onChange: (value: PageSizeOption) => void;
}

export default function PaginationSizeSelect({
  defaultValue = DEFAULT_PAGE_SIZE,
  onChange,
}: PaginationSizeSelectProps) {
  const options = PAGE_SIZE_OPTIONS;

  function handleChange(value: string) {
    onChange(Number(value) as PageSizeOption);
  }

  return (
    <div className="flex items-center gap-1">
      <span>Show</span>

      <Select defaultValue={defaultValue.toString()} onValueChange={handleChange}>
        <SelectTrigger className="h-6 w-16 bg-muted px-1.5 py-0.5 font-light">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
