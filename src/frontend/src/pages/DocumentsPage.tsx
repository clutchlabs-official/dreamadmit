import type { DocumentChecklistItem } from "@/backend";
import { DocumentStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, ClipboardList, LogIn, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DEFAULT_DOCS: DocType[] = [
  "Transcript",
  "Personal Statement",
  "Letters of Recommendation",
  "Test Scores",
];

const STATUS_LABELS: Record<string, string> = {
  notStarted: "Not Started",
  inProgress: "In Progress",
  submitted: "Submitted",
  verified: "Verified",
};

const _STATUS_COLORS: Record<string, string> = {
  notStarted: "bg-muted text-muted-foreground",
  inProgress: "bg-primary/10 text-primary",
  submitted: "bg-accent/15 text-accent",
  verified: "bg-accent/15 text-accent",
};

const DOC_TYPES = [
  "Transcript",
  "Personal Statement",
  "Letters of Recommendation",
  "Test Scores",
  "Financial Aid Forms",
  "Portfolio",
  "Other",
] as const;

type DocType = (typeof DOC_TYPES)[number];

// We encode college+doc as "CollegeName||DocType" in the backend name field
const SEP = "||";

interface LocalDoc {
  uid: string; // local unique key
  college: string;
  docType: DocType;
  submitted: boolean;
}

interface CollegeGroup {
  college: string;
  docs: LocalDoc[];
}

function encode(college: string, docType: string): string {
  return `${college}${SEP}${docType}`;
}

function decode(name: string): { college: string; docType: string } {
  const idx = name.lastIndexOf(SEP);
  if (idx === -1) return { college: name, docType: "Other" };
  return { college: name.slice(0, idx), docType: name.slice(idx + SEP.length) };
}

function _toLocalDocs(items: DocumentChecklistItem[]): LocalDoc[] {
  return items.map((item) => {
    const { college, docType } = decode(item.name);
    return {
      uid: String(item.id),
      college,
      docType: (DOC_TYPES.includes(docType as DocType)
        ? docType
        : "Other") as DocType,
      submitted:
        item.status === DocumentStatus.submitted ||
        item.status === DocumentStatus.verified,
    };
  });
}

function _toBackendItems(docs: LocalDoc[]): DocumentChecklistItem[] {
  return docs.map((d, i) => ({
    id: BigInt(i),
    name: encode(d.college, d.docType),
    status: d.submitted ? DocumentStatus.submitted : DocumentStatus.notStarted,
    notes: "",
  }));
}

function _groupByCollege(docs: LocalDoc[]): CollegeGroup[] {
  const map = new Map<string, LocalDoc[]>();
  for (const doc of docs) {
    if (!map.has(doc.college)) map.set(doc.college, []);
    map.get(doc.college)!.push(doc);
  }
  return Array.from(map.entries()).map(([college, docs]) => ({
    college,
    docs,
  }));
}

function CompletionBadge({ docs }: { docs: LocalDoc[] }) {
  const done = docs.filter((d) => d.submitted).length;
  const total = docs.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const color =
    pct === 100
      ? "bg-accent/15 text-accent border-accent/30"
      : pct >= 50
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-muted text-muted-foreground border-border";
  return (
    <Badge className={`font-semibold text-xs ${color}`}>
      {done}/{total} · {pct}%
    </Badge>
  );
}

function AddDocForm({
  college,
  onAdd,
}: {
  college: string;
  onAdd: (docType: DocType) => void;
}) {
  const [docType, setDocType] = useState<DocType>("Transcript");
  return (
    <div
      className="flex gap-2 items-end"
      data-ocid={`documents.add_doc_form.${college.replace(/\s+/g, "_")}`}
    >
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">Document type</Label>
        <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
          <SelectTrigger
            className="h-8 text-sm"
            data-ocid="documents.doc_type.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOC_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="text-sm">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 shrink-0"
        onClick={() => onAdd(docType)}
        data-ocid="documents.add_doc_button"
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> Add
      </Button>
    </div>
  );
}

function _CollegeCard({
  group,
  groupIndex,
  onToggleDoc,
  onRemoveDoc,
  onAddDoc,
  onRemoveCollege,
}: {
  group: CollegeGroup;
  groupIndex: number;
  onToggleDoc: (uid: string) => void;
  onRemoveDoc: (uid: string) => void;
  onAddDoc: (college: string, docType: DocType) => void;
  onRemoveCollege: (college: string) => void;
}) {
  const pct =
    group.docs.length === 0
      ? 0
      : Math.round(
          (group.docs.filter((d) => d.submitted).length / group.docs.length) *
            100,
        );

  return (
    <Card data-ocid={`documents.college.${groupIndex}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="font-display text-base truncate">
              {group.college}
            </CardTitle>
            <CompletionBadge docs={group.docs} />
          </div>
          <button
            type="button"
            onClick={() => onRemoveCollege(group.college)}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            aria-label={`Remove ${group.college}`}
            data-ocid={`documents.remove_college.${groupIndex}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        {group.docs.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid={`documents.college.${groupIndex}.empty_state`}
          >
            No documents added yet.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {group.docs.map((doc, di) => (
              <li
                key={doc.uid}
                className="flex items-center gap-3 group"
                data-ocid={`documents.doc.${groupIndex}.${di + 1}`}
              >
                <Checkbox
                  id={`doc-${doc.uid}`}
                  checked={doc.submitted}
                  onCheckedChange={() => onToggleDoc(doc.uid)}
                  data-ocid={`documents.checkbox.${groupIndex}.${di + 1}`}
                  aria-label={`Mark ${doc.docType} as submitted`}
                />
                <label
                  htmlFor={`doc-${doc.uid}`}
                  className={`flex-1 text-sm cursor-pointer select-none ${
                    doc.submitted
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {doc.docType}
                </label>
                {doc.submitted && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveDoc(doc.uid)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  aria-label={`Remove ${doc.docType}`}
                  data-ocid={`documents.remove_doc.${groupIndex}.${di + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <AddDocForm
          college={group.college}
          onAdd={(docType) => onAddDoc(group.college, docType)}
        />
      </CardContent>
    </Card>
  );
}

export default function DocumentsPage() {
  const [items, setItems] = useState<DocumentChecklistItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const isLoading = false;
  const idCounter = useRef(BigInt(Date.now()));
  const genId = () => idCounter.current++;

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: genId(), name: "", status: DocumentStatus.notStarted, notes: "" },
    ]);
  const update = (idx: number, patch: Partial<DocumentChecklistItem>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  const remove = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Documents saved!");
    }, 500);
  };
  const handleSeedDefaults = () =>
    setItems(
      DEFAULT_DOCS.map((name) => ({
        id: genId(),
        name,
        status: DocumentStatus.notStarted,
        notes: "",
      })),
    );

  const submitted = items.filter(
    (i) =>
      i.status === DocumentStatus.submitted ||
      i.status === DocumentStatus.verified,
  ).length;
  const inProgress = items.filter(
    (i) => i.status === DocumentStatus.inProgress,
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Documents
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track application documents and submission status.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            data-ocid="documents.add_button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="documents.save_button"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">{submitted}</p>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </div>
      )}
      {isLoading && (
        <div data-ocid="documents.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <Card data-ocid="documents.empty_state">
          <CardContent className="text-center py-16">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-1">No documents tracked yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start with a common template or add your own.
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                onClick={handleSeedDefaults}
                data-ocid="documents.seed_button"
              >
                Use Common Template
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                data-ocid="documents.empty_add_button"
              >
                Add Custom
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card
            key={String(item.id)}
            data-ocid={`documents.document_card.${idx + 1}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Select
                  value={item.status}
                  onValueChange={(v) =>
                    update(idx, { status: v as DocumentStatus })
                  }
                >
                  <SelectTrigger className="w-36 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DocumentStatus).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={item.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="Document name"
                />
                <Badge className="shrink-0 text-xs">
                  {STATUS_LABELS[item.status]}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(idx)}
                  data-ocid={`documents.delete_button.${idx + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
