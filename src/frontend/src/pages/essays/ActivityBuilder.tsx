import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CATEGORIES = [
  "Athletics",
  "Arts",
  "Community Service",
  "Academic",
  "Work",
  "Club",
  "Research",
  "Internship",
  "Religious",
  "Other",
];

interface Activity {
  name: string;
  category: string;
  hoursPerWeek: string;
  weeksPerYear: string;
  isLeader: boolean;
  description: string;
}

const BLANK: Activity = {
  name: "",
  category: "",
  hoursPerWeek: "",
  weeksPerYear: "",
  isLeader: false,
  description: "",
};

export default function ActivityBuilder() {
  const [form, setForm] = useState<Activity>(BLANK);
  const [saved, setSaved] = useState<Activity[]>([]);

  const charCount = form.description.length;
  const LIMIT = 150;

  function handleSave() {
    if (!form.name) return;
    setSaved((prev) => [...prev, form]);
    setForm(BLANK);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        🏆 Common App Activity List Builder
      </h2>
      <AnimatedCard>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Add Activity</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="act-name" className="text-xs">
                Activity Name
              </Label>
              <Input
                id="act-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Model UN, Robotics Club..."
                data-ocid="activity.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger data-ocid="activity.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="act-hrs" className="text-xs">
                Hours/Week
              </Label>
              <Input
                id="act-hrs"
                type="number"
                min={1}
                max={40}
                value={form.hoursPerWeek}
                onChange={(e) =>
                  setForm({ ...form, hoursPerWeek: e.target.value })
                }
                placeholder="5"
                data-ocid="activity.hours.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="act-wks" className="text-xs">
                Weeks/Year
              </Label>
              <Input
                id="act-wks"
                type="number"
                min={1}
                max={52}
                value={form.weeksPerYear}
                onChange={(e) =>
                  setForm({ ...form, weeksPerYear: e.target.value })
                }
                placeholder="36"
                data-ocid="activity.weeks.input"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                id="leader"
                type="checkbox"
                checked={form.isLeader}
                onChange={(e) =>
                  setForm({ ...form, isLeader: e.target.checked })
                }
                className="h-4 w-4"
                data-ocid="activity.leader.checkbox"
              />
              <Label htmlFor="leader" className="text-sm">
                I held a leadership role (president, captain, founder, etc.)
              </Label>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label
                htmlFor="act-desc"
                className="text-xs flex justify-between"
              >
                <span>Description</span>
                <span
                  className={
                    charCount > LIMIT
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }
                >
                  {charCount}/{LIMIT}
                </span>
              </Label>
              <Textarea
                id="act-desc"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="What you did, your role, and impact (150 chars max)"
                maxLength={LIMIT}
                data-ocid="activity.description.textarea"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                onClick={handleSave}
                size="sm"
                data-ocid="activity.add.button"
              >
                Add to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
      {saved.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm">
            Your Activity List Preview
          </h3>
          {saved.map((a, i) => (
            <AnimatedCard key={a.name} delay={i * 0.06}>
              <div
                className="p-4 rounded-xl border border-border bg-card flex items-start gap-3"
                data-ocid={`activity.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">
                      {a.name}
                    </p>
                    <Badge variant="secondary" className="text-[10px]">
                      {a.category}
                    </Badge>
                    {a.isLeader && (
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                        👑 Leader
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.hoursPerWeek}h/wk · {a.weeksPerYear} wks/yr
                  </p>
                  {a.description && (
                    <p className="text-xs text-foreground/80 mt-1">
                      {a.description}
                    </p>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
