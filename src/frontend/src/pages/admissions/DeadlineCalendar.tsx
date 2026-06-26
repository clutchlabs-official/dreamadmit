import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Deadline {
  college: string;
  emoji: string;
  type: "ED1" | "ED2" | "RD" | "EA";
  day: number;
  month: number;
}

const DEADLINES: Deadline[] = [
  { college: "MIT", emoji: "🏛️", type: "ED1", day: 1, month: 11 },
  { college: "Stanford", emoji: "🌲", type: "ED1", day: 1, month: 11 },
  { college: "Harvard", emoji: "🎓", type: "EA", day: 1, month: 11 },
  { college: "Yale", emoji: "🔵", type: "ED1", day: 1, month: 11 },
  { college: "UMich", emoji: "〽️", type: "EA", day: 1, month: 11 },
  { college: "Tulane", emoji: "🌿", type: "ED2", day: 15, month: 1 },
  { college: "Georgetown", emoji: "🦅", type: "ED2", day: 1, month: 1 },
  { college: "UNC Chapel Hill", emoji: "🐏", type: "RD", day: 15, month: 1 },
  { college: "USC", emoji: "✌️", type: "RD", day: 1, month: 1 },
  { college: "BU", emoji: "🐾", type: "RD", day: 1, month: 1 },
  { college: "Northeastern", emoji: "🐾", type: "EA", day: 1, month: 11 },
  { college: "UC Berkeley", emoji: "🐻", type: "RD", day: 30, month: 11 },
];

const TYPE_COLORS: Record<string, string> = {
  ED1: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300",
  ED2: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
  EA: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  RD: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300",
};

const MONTHS = [
  { name: "November 2025", month: 11 },
  { name: "January 2026", month: 1 },
];

export default function DeadlineCalendar() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display text-xl font-bold text-foreground">
          📅 Application Deadline Calendar
        </h2>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TYPE_COLORS).map(([type, cls]) => (
            <span
              key={type}
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
      {MONTHS.map((m) => {
        const monthly = DEADLINES.filter((d) => d.month === m.month).sort(
          (a, b) => a.day - b.day,
        );
        return (
          <AnimatedCard key={m.name}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{m.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthly.map((d, _i) => (
                    <div
                      key={d.college}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/70 transition-colors"
                    >
                      <span className="text-xl">{d.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {d.college}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {m.name.split(" ")[0]} {d.day},{" "}
                          {m.name.split(" ")[1]}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${TYPE_COLORS[d.type]}`}
                        data-ocid={`calendar.${d.type.toLowerCase()}.badge`}
                      >
                        {d.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        );
      })}
    </div>
  );
}
