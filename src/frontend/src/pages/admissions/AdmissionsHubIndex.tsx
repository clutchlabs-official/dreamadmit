import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import DeadlineCalendar from "./DeadlineCalendar";
import EDvsRD from "./EDvsRD";
import GapYear from "./GapYear";
import HiddenGems from "./HiddenGems";
import ReachMatchSafety from "./ReachMatchSafety";
import VirtualTours from "./VirtualTours";
import WaitlistDeferral from "./WaitlistDeferral";

const TABS = [
  { id: "gems", label: "Hidden Gems", comp: HiddenGems },
  { id: "sorter", label: "Reach/Match/Safety", comp: ReachMatchSafety },
  { id: "calendar", label: "Deadline Calendar", comp: DeadlineCalendar },
  { id: "ed-rd", label: "ED vs RD", comp: EDvsRD },
  { id: "waitlist", label: "Waitlist & Deferral", comp: WaitlistDeferral },
  { id: "gap", label: "Gap Year", comp: GapYear },
  { id: "tours", label: "Virtual Tours", comp: VirtualTours },
];

export default function AdmissionsHubIndex() {
  const [active, setActive] = useState("gems");

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admissions Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Every admissions tool in one place — find, sort, and strategise your
            college list.
          </p>
        </div>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted/60 p-1.5 rounded-2xl">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              data-ocid={`admissions.${t.id}.tab`}
              className="text-xs sm:text-sm rounded-xl transition-all duration-200"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <t.comp />
          </TabsContent>
        ))}
      </Tabs>
    </PageTransition>
  );
}
