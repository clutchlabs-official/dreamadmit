import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCourseRecommendations } from "@/hooks/useQueries";
import type { CourseRecommendation } from "@/types";
import { BookOpen } from "lucide-react";
import { useState } from "react";

const FIELDS_OF_STUDY = [
  { id: "cs", label: "Computer Science", icon: "💻" },
  { id: "business", label: "Business & Finance", icon: "📈" },
  { id: "medicine", label: "Medicine & Health", icon: "🏥" },
  { id: "law", label: "Law", icon: "⚖️" },
  { id: "engineering", label: "Engineering", icon: "⚙️" },
  { id: "arts", label: "Arts & Design", icon: "🎨" },
  { id: "social", label: "Social Sciences", icon: "🌍" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "environment", label: "Environmental Science", icon: "🌿" },
  { id: "psychology", label: "Psychology", icon: "🧠" },
];

const SUB_TOPICS: Record<string, string[]> = {
  cs: [
    "Artificial Intelligence",
    "Web Development",
    "Data Science",
    "Cybersecurity",
    "Mobile Development",
    "Cloud Computing",
    "Blockchain",
  ],
  business: [
    "Accounting",
    "Marketing",
    "Entrepreneurship",
    "Finance",
    "International Business",
    "Supply Chain",
    "Human Resources",
  ],
  medicine: [
    "Pre-Med",
    "Nursing",
    "Pharmacy",
    "Dentistry",
    "Public Health",
    "Biomedical Science",
    "Physical Therapy",
  ],
  law: [
    "Corporate Law",
    "Criminal Law",
    "International Law",
    "Environmental Law",
    "Human Rights",
    "Intellectual Property",
    "Family Law",
  ],
  engineering: [
    "Mechanical",
    "Electrical",
    "Civil",
    "Chemical",
    "Software",
    "Aerospace",
    "Biomedical",
  ],
  arts: [
    "Graphic Design",
    "Film & Media",
    "Fine Arts",
    "Architecture",
    "Fashion Design",
    "Game Design",
    "Photography",
  ],
  social: [
    "Political Science",
    "Economics",
    "Sociology",
    "Anthropology",
    "International Relations",
    "History",
    "Geography",
  ],
  education: [
    "Early Childhood",
    "Special Education",
    "Curriculum Design",
    "Educational Technology",
    "Higher Education",
    "STEM Education",
  ],
  environment: [
    "Climate Science",
    "Conservation Biology",
    "Renewable Energy",
    "Environmental Policy",
    "Marine Science",
    "Ecology",
  ],
  psychology: [
    "Clinical Psychology",
    "Cognitive Science",
    "Behavioral Science",
    "Neuropsychology",
    "Counseling",
    "Forensic Psychology",
  ],
};

const _LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-accent/10 text-accent border-accent/20",
  Intermediate: "bg-primary/10 text-primary border-primary/20",
  Advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

type _Step = "field" | "subtopic" | "results";

export default function CourseFinderPage() {
  const [field, setField] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [searched, setSearched] = useState(false);
  const subTopics = field ? (SUB_TOPICS[field] ?? []) : [];
  const getCoursesMutation = useGetCourseRecommendations();
  const isLoading = getCoursesMutation.isPending;
  const isError = getCoursesMutation.isError;

  const handleSearch = async () => {
    setSearched(true);
    const res = await getCoursesMutation.mutateAsync({
      fieldOfStudy: field,
      subTopic,
    });
    setCourses(res);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Course Finder
          </h1>
        </div>
        <p className="text-muted-foreground">
          Discover recommended courses by field of study and sub-topic.
        </p>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Courses</CardTitle>
          <CardDescription>
            Choose a field then drill into a sub-topic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Field of Study</Label>
              <Select
                value={field}
                onValueChange={(v) => {
                  setField(v);
                  setSubTopic("");
                }}
              >
                <SelectTrigger data-ocid="course-finder.field_select">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {FIELDS_OF_STUDY.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.icon} {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sub-Topic</Label>
              <Select
                value={subTopic}
                onValueChange={setSubTopic}
                disabled={!field}
              >
                <SelectTrigger data-ocid="course-finder.subtopic_select">
                  <SelectValue
                    placeholder={
                      field ? "Select sub-topic" : "Pick a field first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subTopics.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            data-ocid="course-finder.search_button"
            disabled={!field || !subTopic || isLoading}
            onClick={handleSearch}
            className="w-full"
          >
            {isLoading ? "Searching…" : "Find Courses"}
          </Button>
        </CardContent>
      </Card>
      {isLoading && (
        <div
          data-ocid="course-finder.loading_state"
          className="grid sm:grid-cols-2 gap-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {isError && (
        <Card
          className="border-destructive/50 bg-destructive/5"
          data-ocid="course-finder.error_state"
        >
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Failed to load courses. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
      {!isLoading && courses.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {courses.length} courses found
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.map((c) => (
              <Card
                key={c.courseName}
                data-ocid={`course-finder.course_card.${c.courseName}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-snug">
                      {c.courseName}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {c.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-primary font-medium">
                    {c.provider}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-2">
                    {c.description}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {c.fieldOfStudy}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {c.subTopic}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {!isLoading && searched && courses.length === 0 && !isError && (
        <Card data-ocid="course-finder.empty_state">
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No courses found. Try a different sub-topic.
            </p>
          </CardContent>
        </Card>
      )}
      {!searched && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="course-finder.initial_state"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>Choose a field and sub-topic to discover courses.</p>
        </div>
      )}
    </div>
  );
}
