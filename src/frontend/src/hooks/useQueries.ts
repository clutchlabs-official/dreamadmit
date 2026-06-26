import { createActor } from "@/backend";
import type {
  AchievementEntry,
  AnxietyRating,
  CelebrationEvent,
  InternshipEntry,
  LeadershipRole,
  MoodCheckIn,
  PortfolioChecklistItem,
  SalaryBookmark,
  SavedCareerPath,
  SummerProgram,
  SummerProgramStatus,
  VolunteerEntry,
} from "@/types";
import type {
  AdmissionOfficer,
  AiMatchScore,
  AlumniMessage,
  College,
  CollegeDeadline,
  CourseRecommendation,
  DocumentChecklistItem,
  EssayReview,
  ExtracurricularRecommendation,
  FinancialAidTier,
  InterviewFeedback,
  InterviewQuestion,
  LoanCalculationResult,
  OfficerContent,
  OfficerContentInput,
  Scholarship,
  ScholarshipFilter,
  ScholarshipId,
  StudentProfile,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useStudentProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<StudentProfile | null>({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useSaveStudentProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveStudentProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    },
  });
}

export function useScholarships() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<Scholarship[]>({
    queryKey: ["scholarships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScholarships();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useQueryScholarships(filter: ScholarshipFilter) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<Scholarship[]>({
    queryKey: ["scholarships", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryScholarships(filter);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useScholarshipShortlist() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<ScholarshipId[]>({
    queryKey: ["scholarshipShortlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyScholarshipShortlist();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useSaveScholarshipShortlist() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: ScholarshipId[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveMyScholarshipShortlist(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholarshipShortlist"] });
    },
  });
}

export function useColleges() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<College[]>({
    queryKey: ["colleges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getColleges();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCollegesByCountry(country: string) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<College[]>({
    queryKey: ["colleges", "country", country],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollegesByCountry(country);
    },
    enabled: !!actor && !actorFetching && country.length > 0,
  });
}

export function useCollegesByFinancialAid(tier: FinancialAidTier) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<College[]>({
    queryKey: ["colleges", "financialAid", tier],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollegesByFinancialAid(tier);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAiSuggestions() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.getAiSuggestions(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSuggestions"] });
    },
  });
}

export function useCollegeMatchScore() {
  const { actor } = useActor(createActor);
  return useMutation<
    AiMatchScore,
    Error,
    { collegeId: bigint; collegeName: string; profile: StudentProfile }
  >({
    mutationFn: async ({ collegeId, collegeName, profile }) => {
      if (!actor) throw new Error("Not connected");
      return actor.getCollegeMatchScore(collegeId, collegeName, profile);
    },
  });
}

export function useCalculateLoan() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      totalCost: number;
      expectedAid: number;
      annualInterestRate: number;
      repaymentYears: bigint;
    }): Promise<LoanCalculationResult> => {
      if (!actor) throw new Error("Not connected");
      return actor.calculateLoan(
        params.totalCost,
        params.expectedAid,
        params.annualInterestRate,
        params.repaymentYears,
      );
    },
  });
}

export function useReviewEssay() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      essay: string;
      collegeName: string;
    }): Promise<EssayReview> => {
      if (!actor) throw new Error("Not connected");
      return actor.reviewEssay(params.essay, params.collegeName);
    },
  });
}

export function useInterviewQuestions() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      collegeName: string;
      major: string;
    }): Promise<InterviewQuestion[]> => {
      if (!actor) throw new Error("Not connected");
      return actor.getInterviewQuestions(params.collegeName, params.major);
    },
  });
}

export function useSubmitInterviewAnswer() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      question: string;
      answer: string;
      collegeName: string;
    }): Promise<InterviewFeedback> => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInterviewAnswer(
        params.question,
        params.answer,
        params.collegeName,
      );
    },
  });
}

export function useExtracurricularRecommendations() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (
      profile: StudentProfile,
    ): Promise<ExtracurricularRecommendation[]> => {
      if (!actor) throw new Error("Not connected");
      return actor.getExtracurricularRecommendations(profile);
    },
  });
}

export function useGetCourseRecommendations() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      fieldOfStudy: string;
      subTopic: string;
    }): Promise<CourseRecommendation[]> => {
      if (!actor) throw new Error("Not connected");
      return actor.getCourseRecommendations(
        params.fieldOfStudy,
        params.subTopic,
      );
    },
  });
}

export function useAlumniMessages(collegeId: bigint, refetchInterval = 30000) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<AlumniMessage[]>({
    queryKey: ["alumniMessages", collegeId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlumniMessages(collegeId);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval,
  });
}

export function usePostAlumniMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      collegeId: bigint;
      message: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Not connected");
      return actor.postAlumniMessage(params.collegeId, params.message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alumniMessages", variables.collegeId.toString()],
      });
    },
  });
}

export function useOfficerContent(collegeId: bigint) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<OfficerContent[]>({
    queryKey: ["officerContent", collegeId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOfficerContent(collegeId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePostOfficerContent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: OfficerContentInput): Promise<bigint> => {
      if (!actor) throw new Error("Not connected");
      return actor.postOfficerContent(content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["officerContent", variables.collegeId.toString()],
      });
    },
  });
}

export function useRegisterOfficer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      collegeId: bigint;
      name: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Not connected");
      return actor.registerOfficer(params.collegeId, params.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOfficerProfile"] });
    },
  });
}

export function useMyOfficerProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<AdmissionOfficer | null>({
    queryKey: ["myOfficerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyOfficerProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

// ── Mental Health & Wellness hooks ────────────────────────────────────────────

export function useMoodCheckIns() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<MoodCheckIn[]>({
    queryKey: ["moodCheckIns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodCheckIns();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddMoodCheckIn() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      mood,
      moodEmoji,
      note,
    }: {
      date: string;
      mood: bigint;
      moodEmoji: string;
      note: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMoodCheckIn(date, mood, moodEmoji, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodCheckIns"] });
    },
  });
}

export function useAnxietyRatings() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<AnxietyRating[]>({
    queryKey: ["anxietyRatings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnxietyRatings();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddAnxietyRating() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      confidenceScore,
      worryScore,
    }: {
      date: string;
      confidenceScore: bigint;
      worryScore: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAnxietyRating(date, confidenceScore, worryScore);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anxietyRatings"] });
    },
  });
}

export function useCelebrationEvents() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<CelebrationEvent[]>({
    queryKey: ["celebrationEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCelebrationEvents();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddCelebrationEvent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      description,
    }: {
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCelebrationEvent(date, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["celebrationEvents"] });
    },
  });
}

export function useGeminiApiKeyStatus() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["geminiApiKeyStatus"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getGeminiApiKeyStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveCareerPath() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    SavedCareerPath,
    Error,
    { major: string; careerTitle: string; description: string }
  >({
    mutationFn: async ({ major, careerTitle, description }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCareerPath(major, careerTitle, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCareerPaths"] });
    },
  });
}

export function useGetSavedCareerPaths() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<SavedCareerPath[]>({
    queryKey: ["savedCareerPaths"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavedCareerPaths();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useRemoveSavedCareerPath() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeSavedCareerPath(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCareerPaths"] });
    },
  });
}

export function useSaveSalaryBookmark() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    SalaryBookmark,
    Error,
    {
      major: string;
      collegeOrRegion: string;
      medianSalary: bigint | null;
      notes: string;
    }
  >({
    mutationFn: async ({ major, collegeOrRegion, medianSalary, notes }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveSalaryBookmark(
        major,
        collegeOrRegion,
        medianSalary,
        notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryBookmarks"] });
    },
  });
}

export function useGetSalaryBookmarks() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<SalaryBookmark[]>({
    queryKey: ["salaryBookmarks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSalaryBookmarks();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useRemoveSalaryBookmark() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeSalaryBookmark(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryBookmarks"] });
    },
  });
}

export function useUpsertPortfolioChecklist() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, PortfolioChecklistItem[]>({
    mutationFn: async (items) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertPortfolioChecklist(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioChecklist"] });
    },
  });
}

export function useGetPortfolioChecklist() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<PortfolioChecklistItem[]>({
    queryKey: ["portfolioChecklist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolioChecklist();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useSetGeminiApiKey() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setGeminiApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiApiKeyStatus"] });
    },
  });
}
// ─── Smart Planning ─────────────────────────────────────────────────────────

export function useInternships() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<InternshipEntry[]>({
    queryKey: ["internships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInternships();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddInternship() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      company: string;
      role: string;
      startDate: string;
      endDate: string | null;
      skills: string[];
    }): Promise<InternshipEntry> => {
      if (!actor) throw new Error("Not connected");
      return actor.addInternship(
        params.company,
        params.role,
        params.startDate,
        params.endDate,
        params.skills,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
}

export function useDeleteInternship() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInternship(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
}

export function useVolunteerEntries() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<VolunteerEntry[]>({
    queryKey: ["volunteerEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVolunteerEntries();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddVolunteerEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      activity: string;
      hours: number;
      date: string;
    }): Promise<VolunteerEntry> => {
      if (!actor) throw new Error("Not connected");
      return actor.addVolunteerEntry(
        params.activity,
        params.hours,
        params.date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteerEntries"] });
    },
  });
}

export function useDeleteVolunteerEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVolunteerEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteerEntries"] });
    },
  });
}

export function useAchievements() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<AchievementEntry[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAchievements();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddAchievement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      date: string;
      description: string;
    }): Promise<AchievementEntry> => {
      if (!actor) throw new Error("Not connected");
      return actor.addAchievement(params.name, params.date, params.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}

export function useDeleteAchievement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAchievement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}

export function useLeadershipRoles() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<LeadershipRole[]>({
    queryKey: ["leadershipRoles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeadershipRoles();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddLeadershipRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      organization: string;
      role: string;
      startDate: string;
      endDate: string | null;
      impact: string;
    }): Promise<LeadershipRole> => {
      if (!actor) throw new Error("Not connected");
      return actor.addLeadershipRole(
        params.organization,
        params.role,
        params.startDate,
        params.endDate,
        params.impact,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadershipRoles"] });
    },
  });
}

export function useDeleteLeadershipRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteLeadershipRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadershipRoles"] });
    },
  });
}

export function useSummerPrograms() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery<SummerProgram[]>({
    queryKey: ["summerPrograms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSummerPrograms();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useAddSummerProgram() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      provider: string;
      date: string;
      status: SummerProgramStatus;
    }): Promise<SummerProgram> => {
      if (!actor) throw new Error("Not connected");
      return actor.addSummerProgram(
        params.name,
        params.provider,
        params.date,
        params.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summerPrograms"] });
    },
  });
}

export function useDeleteSummerProgram() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSummerProgram(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summerPrograms"] });
    },
  });
}
