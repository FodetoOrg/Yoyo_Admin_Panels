import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { X, Upload as UploadIcon, ChevronsUpDown, Check, CheckIcon } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command";
  import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
  

export const SearchableMultiSelect = ({ field, value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const selectedValues = value || [];
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start"
          >
            <div className="flex flex-wrap gap-1 truncate">
              {selectedValues.length === 0 && "Select options..."}
              {selectedValues.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedValues.filter((v) => v !== val));
                  }}
                >
                  {options.find((opt) => opt.value === val)?.label}
                  <X className="h-3 w-3 cursor-pointer" />
                </span>
              ))}
            </div>
            <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search options..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-64">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onChange(
                          selectedValues.includes(option.value)
                            ? selectedValues.filter((v) => v !== option.value)
                            : [...selectedValues, option.value]
                        );
                      }}
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValues.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };