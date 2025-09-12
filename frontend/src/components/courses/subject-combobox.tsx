import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { SubjectsResponse } from "@/services/subject/models";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SubjectComboboxProps {
  subjects: SubjectsResponse;
  onSelect: (subject: SubjectsResponse[number]) => void;
  placeholder?: string;
  value?: string;
}

export function SubjectCombobox({
  subjects,
  onSelect,
  placeholder = "Select subject...",
  value,
}: SubjectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedSubject = value ? subjects.find((subject) => subject.abbreviation === value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between p-4! h-12"
        >
          {selectedSubject ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedSubject.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedSubject.code} • {selectedSubject.abbreviation}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search subjects..." />
          <CommandList>
            <CommandEmpty>No subjects found.</CommandEmpty>
            <CommandGroup>
              {subjects.map((subject) => (
                <CommandItem
                  key={subject.abbreviation}
                  value={`${subject.name} ${subject.abbreviation} ${subject.code}`}
                  onSelect={() => {
                    onSelect(subject);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSubject?.abbreviation === subject.abbreviation
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />

                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {subject.abbreviation} • {subject.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
