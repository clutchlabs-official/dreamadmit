import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { College } from "@/types";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CollegeSearchSelectProps {
  colleges: College[];
  selectedIds: bigint[];
  onSelect: (college: College) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function CollegeSearchSelect({
  colleges,
  selectedIds,
  onSelect,
  disabled = false,
  placeholder = "Search colleges…",
}: CollegeSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = colleges.filter(
    (c) =>
      !selectedIds.includes(c.id) &&
      (c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        data-ocid="compare.add_college_button"
        className="w-full justify-between gap-2 text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0" />
          {placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter…"
              data-ocid="compare.search_input"
              className="w-full rounded-sm bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                No colleges found
              </li>
            ) : (
              filtered.map((college) => (
                <li
                  key={String(college.id)}
                  onClick={() => {
                    onSelect(college);
                    setOpen(false);
                    setQuery("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(college);
                      setOpen(false);
                      setQuery("");
                    }
                  }}
                  className="flex items-center justify-between gap-2 cursor-pointer px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <span>
                    <span className="font-medium">{college.name}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {college.location}
                    </span>
                  </span>
                  {selectedIds.includes(college.id) && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </li>
              ))
            )}
          </ul>
          {filtered.length > 0 && (
            <div className="px-3 py-2 border-t border-border">
              <Badge variant="secondary" className="text-xs">
                {filtered.length} available
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
