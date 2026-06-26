import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ActivityBuilder from "./ActivityBuilder";
import DraftSaver from "./DraftSaver";
import EssayIdeas from "./EssayIdeas";
import PersonalTemplates from "./PersonalTemplates";
import RecGuide from "./RecGuide";
import ResumeBuilder from "./ResumeBuilder";
import SupplementalHelper from "./SupplementalHelper";
import WordCountOptimizer from "./WordCountOptimizer";

const TABS = [
  { id: "ideas", label: "💡 Essay Ideas" },
  { id: "templates", label: "📚 Templates" },
  { id: "activity", label: "🏆 Activity Builder" },
  { id: "supplemental", label: "🏛️ Supplemental" },
  { id: "drafts", label: "💾 Drafts" },
  { id: "wordcount", label: "✂️ Word Count" },
  { id: "rec", label: "👨‍🏫 Rec Guide" },
  { id: "resume", label: "📋 Resume" },
];

export default function EssaysIndex() {
  const [active, setActive] = useState("ideas");

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">✍️</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Essays &amp; Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Every writing tool you need — from brainstorming to your final
            submission.
          </p>
        </div>
      </div>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted/60 p-1.5 rounded-2xl">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              data-ocid={`essays.${t.id}.tab`}
              className="text-xs sm:text-sm rounded-xl transition-all duration-200"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="ideas">
          <EssayIdeas />
        </TabsContent>
        <TabsContent value="templates">
          <PersonalTemplates />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityBuilder />
        </TabsContent>
        <TabsContent value="supplemental">
          <SupplementalHelper />
        </TabsContent>
        <TabsContent value="drafts">
          <DraftSaver />
        </TabsContent>
        <TabsContent value="wordcount">
          <WordCountOptimizer />
        </TabsContent>
        <TabsContent value="rec">
          <RecGuide />
        </TabsContent>
        <TabsContent value="resume">
          <ResumeBuilder />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
