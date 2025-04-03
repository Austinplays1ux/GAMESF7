import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (value: string) => {
    onChange([...selected, value]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          onChange(selected.slice(0, -1));
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  // If clicking outside, close the dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && !e.composedPath().includes(inputRef.current as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div 
          className="flex flex-wrap gap-1 border rounded-md px-3 py-2 w-full bg-background text-foreground cursor-pointer glass-input"
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          {selected.map((selectedValue) => {
            const option = options.find((o) => o.value === selectedValue);
            const label = option ? option.label : selectedValue;
            return (
              <Badge key={selectedValue} variant="secondary" className="bg-purple-600/20 text-white hover:bg-purple-600/30">
                {label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(selectedValue);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(selectedValue);
                  }}
                >
                  <X className="h-3 w-3 text-white hover:text-gray-200" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {
              // Delay closing to allow for click selection
              setTimeout(() => setOpen(false), 200);
            }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="ml-2 bg-transparent outline-none placeholder:text-gray-400 text-white flex-1 min-w-[100px] h-8"
          />
        </div>
        <div className="relative">
          {open && options.length > 0 && (
            <div className="absolute w-full z-50 top-2 rounded-md border bg-[#150A29] border-purple-500/20 text-white shadow-lg shadow-purple-950/30 outline-none mt-2 max-h-64 overflow-y-auto">
              <CommandGroup className="overflow-visible">
                {options
                  .filter((option) => {
                    // Filter out options that are already selected
                    if (selected.includes(option.value)) return false;
                    // If the input is empty, show all options
                    if (!inputValue.trim()) return true;
                    // Otherwise, filter by the input value
                    return option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase());
                  })
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer hover:bg-purple-600/20"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                {options.filter((option) => {
                  if (selected.includes(option.value)) return false;
                  if (!inputValue.trim()) return true;
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }).length === 0 && (
                  <p className="py-2 px-4 text-sm text-gray-400">
                    No items found.
                  </p>
                )}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}