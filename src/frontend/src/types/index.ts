// Re-export backend types and add UI-specific type aliases
export type {
  StudentProfile,
  Scholarship,
  College,
  AiSuggestion,
  LoanCalculationResult,
  AmortizationEntry,
  ScholarshipFilter,
  CollegeId,
  ScholarshipId,
  Award,
  CollegeDeadline,
  DocumentChecklistItem,
  AlumniMessage,
  OfficerContent,
  OfficerContentInput,
  AdmissionOfficer,
  AiMatchScore,
  EssayReview,
  InterviewQuestion,
  InterviewFeedback,
  ExtracurricularRecommendation,
  CourseRecommendation,
  AchievementEntry,
  AnxietyRating,
  CelebrationEvent,
  InternshipEntry,
  LeadershipRole,
  MoodCheckIn,
  SummerProgram,
  VolunteerEntry,
  SalaryBookmark,
  SavedCareerPath,
  PortfolioChecklistItem,
} from "@/backend";
export {
  FinancialAidPreference,
  FinancialAidTier,
  UserRole,
  GpaType,
  DeadlineStatus,
  DocumentStatus,
  OfficerContentType,
  SummerProgramStatus,
} from "@/backend";

// UI convenience types — community fields added to College for alumni chat
// (backend is being updated separately to persist these; frontend reads them defensively)
export type CollegeWithCommunity = import("@/backend").College & {
  redditUrl?: string | null;
  discordUrl?: string | null;
};

export type NavItem = {
  label: string;
  path: string;
  icon?: string;
};

export type CompareItem = {
  collegeId: bigint;
  collegeName: string;
};

// GpaType string union alias for form use
export type GpaTypeString = "unweighted" | "weighted";
