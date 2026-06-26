import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CollegeDeadline {
    status: DeadlineStatus;
    collegeName: string;
    deadlineType: string;
    dueDate: bigint;
    collegeId: bigint;
    notes: string;
}
export interface AiMatchScore {
    reasoning: string;
    score: number;
    collegeId: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AdmissionOfficer {
    principal: Principal;
    name: string;
    collegeId: bigint;
    registeredAt: bigint;
}
export interface TaskItem {
    title: string;
    createdAt: Timestamp;
    completed: boolean;
    dueDate?: string;
    taskId: bigint;
    category?: string;
    priority: TaskPriority;
}
export interface SavedCareerPath {
    id: bigint;
    major: string;
    description: string;
    savedAt: Timestamp;
    careerTitle: string;
}
export interface InterviewFeedback {
    question: string;
    feedback: string;
    answer: string;
    score: bigint;
}
export interface LeadershipRole {
    id: bigint;
    impact: string;
    endDate?: string;
    createdAt: Timestamp;
    role: string;
    organization: string;
    startDate: string;
}
export interface ExtracurricularRecommendation {
    impact: string;
    activity: string;
    reason: string;
}
export interface EssayDraft {
    title: string;
    content: string;
    wordCount: bigint;
    tags: Array<string>;
    version: bigint;
    timestamp: Timestamp;
    draftId: bigint;
}
export interface OfficerProfile {
    title: string;
    userId: UserId;
    institution: string;
    submittedAt: Timestamp;
    reviewedAt?: Timestamp;
    govIdFilename: string;
    verificationStatus: OfficerVerificationStatus;
}
export interface AiSuggestion {
    talkingPoints: Array<string>;
    targetScoreSuggestions: Array<string>;
    actionableAdvice: Array<string>;
    brainstormingIdeas: Array<string>;
}
export interface VolunteerEntry {
    id: bigint;
    hours: number;
    date: string;
    createdAt: Timestamp;
    activity: string;
}
export interface DocumentChecklistItem {
    id: bigint;
    status: DocumentStatus;
    name: string;
    dueDate?: bigint;
    notes: string;
}
export interface ApplicationEntry {
    id: bigint;
    status: ApplicationStatus;
    collegeName: string;
    createdAt: Timestamp;
    deadline?: string;
    updatedAt: Timestamp;
    notes?: string;
}
export interface AnxietyRating {
    id: bigint;
    date: string;
    worryScore: bigint;
    createdAt: Timestamp;
    confidenceScore: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface LoanCalculationResult {
    totalInterest: number;
    amortizationBreakdown: Array<AmortizationEntry>;
    totalPayment: number;
    monthlyPayment: number;
}
export interface ScholarshipFilter {
    major?: string;
    requiresFinancialNeed?: boolean;
    minGpa?: number;
}
export interface PortfolioChecklistItem {
    completed: boolean;
    itemLabel: string;
    updatedAt: Timestamp;
    itemKey: string;
}
export interface SalaryBookmark {
    id: bigint;
    major: string;
    medianSalary?: bigint;
    notes: string;
    savedAt: Timestamp;
    collegeOrRegion: string;
}
export type Timestamp = bigint;
export interface OfficerContentInput {
    title: string;
    contentType: OfficerContentType;
    body: string;
    collegeId: bigint;
    videoUrl?: string;
}
export interface InterviewQuestion {
    question: string;
    category: string;
}
export interface MoodCheckIn {
    id: bigint;
    date: string;
    mood: bigint;
    note: string;
    createdAt: Timestamp;
    moodEmoji: string;
}
export interface Award {
    title: string;
    description: string;
}
export interface OfficerContent {
    id: bigint;
    title: string;
    officerId: Principal;
    contentType: OfficerContentType;
    body: string;
    collegeId: bigint;
    timestamp: bigint;
    videoUrl?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TestScore {
    id: bigint;
    targetScore?: bigint;
    date?: string;
    createdAt: Timestamp;
    testName: string;
    sectionScores: Array<[string, bigint]>;
}
export type ScholarshipId = bigint;
export interface Scholarship {
    id: ScholarshipId;
    requiresFinancialNeed: boolean;
    applyLink: string;
    name: string;
    deadline: string;
    eligibilityMinGpa?: number;
    eligibilityMajor?: string;
    amount: bigint;
    eligibilityMaxGpa?: number;
}
export type CollegeId = bigint;
export interface SummerProgram {
    id: bigint;
    status: SummerProgramStatus;
    provider: string;
    date: string;
    name: string;
    createdAt: Timestamp;
}
export interface College {
    id: CollegeId;
    country: string;
    acceptanceRate: number;
    name: string;
    housingInfo: string;
    tuition: bigint;
    website: string;
    redditUrl?: string;
    majorsOffered: Array<string>;
    discordUrl?: string;
    location: string;
    financialAidTier: FinancialAidTier;
}
export interface InternshipEntry {
    id: bigint;
    endDate?: string;
    createdAt: Timestamp;
    role: string;
    company: string;
    skills: Array<string>;
    startDate: string;
}
export interface AchievementEntry {
    id: bigint;
    date: string;
    name: string;
    createdAt: Timestamp;
    description: string;
}
export interface AmortizationEntry {
    month: bigint;
    principal: number;
    balance: number;
    interest: number;
}
export interface EssayReview {
    overallScore: bigint;
    strengths: Array<string>;
    improvements: Array<string>;
    feedback: string;
    grade: string;
}
export interface StudentProfile {
    gpa?: number;
    extracurriculars: Array<string>;
    intendedMajor: string;
    numberOfCourses: bigint;
    studyCountry: string;
    actScore?: bigint;
    workExperience: Array<string>;
    awards: Array<Award>;
    gpaType: GpaType;
    financialAidPreference: FinancialAidPreference;
    satScore?: bigint;
    dreamCollege: string;
    weightedGpa?: number;
}
export interface StressCheckIn {
    id: bigint;
    stressLevel: bigint;
    date: string;
    createdAt: Timestamp;
    confidenceLevel: bigint;
    sleepHours: number;
}
export interface CourseRecommendation {
    provider: string;
    description: string;
    level: string;
    subTopic: string;
    courseName: string;
    fieldOfStudy: string;
}
export interface AlumniMessage {
    messageId: bigint;
    authorName: string;
    author: Principal;
    collegeId: bigint;
    message: string;
    timestamp: bigint;
}
export interface ScholarshipTracked {
    status: ScholarshipTrackedStatus;
    essayRequired: boolean;
    name: string;
    createdAt: Timestamp;
    deadline?: string;
    appliedDate?: string;
    notes?: string;
    scholarshipId: bigint;
}
export interface CelebrationEvent {
    id: bigint;
    date: string;
    createdAt: Timestamp;
    description: string;
}
export enum ApplicationStatus {
    applied = "applied",
    waitlisted = "waitlisted",
    rejected = "rejected",
    accepted = "accepted",
    deferred = "deferred"
}
export enum DeadlineStatus {
    upcoming = "upcoming",
    completed = "completed",
    missed = "missed"
}
export enum DocumentStatus {
    notStarted = "notStarted",
    verified = "verified",
    submitted = "submitted",
    inProgress = "inProgress"
}
export enum FinancialAidPreference {
    full = "full",
    half = "half",
    none = "none"
}
export enum FinancialAidTier {
    fullRide = "fullRide",
    noAid = "noAid",
    needBased = "needBased",
    meritOnly = "meritOnly"
}
export enum GpaType {
    unweighted = "unweighted",
    weighted = "weighted"
}
export enum OfficerContentType {
    tip = "tip",
    video = "video",
    announcement = "announcement",
    insight = "insight"
}
export enum OfficerVerificationStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum ScholarshipTrackedStatus {
    notStarted = "notStarted",
    submitted = "submitted",
    awarded = "awarded",
    rejected = "rejected",
    inProgress = "inProgress"
}
export enum SummerProgramStatus {
    applied = "applied",
    completed = "completed",
    rejected = "rejected",
    accepted = "accepted",
    interested = "interested"
}
export enum TaskPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(name: string, date: string, description: string): Promise<AchievementEntry>;
    addAnxietyRating(date: string, confidenceScore: bigint, worryScore: bigint): Promise<AnxietyRating>;
    addCelebrationEvent(date: string, description: string): Promise<CelebrationEvent>;
    addInternship(company: string, role: string, startDate: string, endDate: string | null, skills: Array<string>): Promise<InternshipEntry>;
    addLeadershipRole(organization: string, role: string, startDate: string, endDate: string | null, impact: string): Promise<LeadershipRole>;
    addMoodCheckIn(date: string, mood: bigint, moodEmoji: string, note: string): Promise<MoodCheckIn>;
    addMyApplication(collegeName: string, status: ApplicationStatus, deadline: string | null, notes: string | null): Promise<ApplicationEntry>;
    addMyEssayDraft(title: string, content: string, tags: Array<string>): Promise<EssayDraft>;
    addMyStressCheckIn(date: string, stressLevel: bigint, sleepHours: number, confidenceLevel: bigint): Promise<StressCheckIn>;
    addMyTask(title: string, dueDate: string | null, priority: TaskPriority, category: string | null): Promise<TaskItem>;
    addMyTestScore(testName: string, sectionScores: Array<[string, bigint]>, date: string | null, targetScore: bigint | null): Promise<TestScore>;
    addMyTrackedScholarship(name: string, deadline: string | null, essayRequired: boolean, notes: string | null): Promise<ScholarshipTracked>;
    addSummerProgram(name: string, provider: string, date: string, status: SummerProgramStatus): Promise<SummerProgram>;
    addVolunteerEntry(activity: string, hours: number, date: string): Promise<VolunteerEntry>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateLoan(totalCost: number, expectedAid: number, annualInterestRate: number, repaymentYears: bigint): Promise<LoanCalculationResult>;
    deleteAchievement(id: bigint): Promise<boolean>;
    deleteInternship(id: bigint): Promise<boolean>;
    deleteLeadershipRole(id: bigint): Promise<boolean>;
    deleteMyApplication(entryId: bigint): Promise<boolean>;
    deleteMyEssayDraft(draftId: bigint): Promise<boolean>;
    deleteMyTask(taskId: bigint): Promise<boolean>;
    deleteMyTestScore(scoreId: bigint): Promise<boolean>;
    deleteMyTrackedScholarship(scholarshipId: bigint): Promise<boolean>;
    deleteSummerProgram(id: bigint): Promise<boolean>;
    deleteVolunteerEntry(id: bigint): Promise<boolean>;
    getAchievements(): Promise<Array<AchievementEntry>>;
    getAiSuggestions(profile: StudentProfile): Promise<AiSuggestion>;
    getAlumniMessages(collegeId: bigint): Promise<Array<AlumniMessage>>;
    getAnxietyRatings(): Promise<Array<AnxietyRating>>;
    getCallerUserRole(): Promise<UserRole>;
    getCelebrationEvents(): Promise<Array<CelebrationEvent>>;
    getCollegeMatchScore(collegeId: bigint, collegeName: string, profile: StudentProfile): Promise<AiMatchScore>;
    getColleges(): Promise<Array<College>>;
    getCollegesByCountry(country: string): Promise<Array<College>>;
    getCollegesByFinancialAid(tier: FinancialAidTier): Promise<Array<College>>;
    getCourseRecommendations(fieldOfStudy: string, subTopic: string): Promise<Array<CourseRecommendation>>;
    getExtracurricularRecommendations(profile: StudentProfile): Promise<Array<ExtracurricularRecommendation>>;
    getGeminiApiKeyStatus(): Promise<boolean>;
    getInternships(): Promise<Array<InternshipEntry>>;
    getInterviewQuestions(collegeName: string, major: string): Promise<Array<InterviewQuestion>>;
    getLeadershipRoles(): Promise<Array<LeadershipRole>>;
    getMoodCheckIns(): Promise<Array<MoodCheckIn>>;
    getMyDeadlines(): Promise<Array<CollegeDeadline>>;
    getMyDocumentChecklist(): Promise<Array<DocumentChecklistItem>>;
    getMyOfficerProfile(): Promise<AdmissionOfficer | null>;
    getMyScholarshipShortlist(): Promise<Array<ScholarshipId>>;
    getOfficerContent(collegeId: bigint): Promise<Array<OfficerContent>>;
    getOfficerProfile(): Promise<OfficerProfile | null>;
    getPortfolioChecklist(): Promise<Array<PortfolioChecklistItem>>;
    getSalaryBookmarks(): Promise<Array<SalaryBookmark>>;
    getSavedCareerPaths(): Promise<Array<SavedCareerPath>>;
    getScholarships(): Promise<Array<Scholarship>>;
    getStudentProfile(): Promise<StudentProfile | null>;
    getSummerPrograms(): Promise<Array<SummerProgram>>;
    getVolunteerEntries(): Promise<Array<VolunteerEntry>>;
    isCallerAdmin(): Promise<boolean>;
    listMyApplications(): Promise<Array<ApplicationEntry>>;
    listMyEssayDrafts(): Promise<Array<EssayDraft>>;
    listMyStressCheckIns(): Promise<Array<StressCheckIn>>;
    listMyTasks(): Promise<Array<TaskItem>>;
    listMyTestScores(): Promise<Array<TestScore>>;
    listMyTrackedScholarships(): Promise<Array<ScholarshipTracked>>;
    listPendingOfficers(): Promise<Array<OfficerProfile>>;
    postAlumniMessage(collegeId: bigint, message: string): Promise<void>;
    postOfficerContent(content: OfficerContentInput): Promise<bigint>;
    queryScholarships(filter: ScholarshipFilter): Promise<Array<Scholarship>>;
    registerOfficer(collegeId: bigint, name: string): Promise<void>;
    removeSalaryBookmark(id: bigint): Promise<boolean>;
    removeSavedCareerPath(id: bigint): Promise<boolean>;
    reviewEssay(essay: string, collegeName: string): Promise<EssayReview>;
    saveCareerPath(major: string, careerTitle: string, description: string): Promise<SavedCareerPath>;
    saveMyDeadlines(deadlines: Array<CollegeDeadline>): Promise<void>;
    saveMyDocumentChecklist(items: Array<DocumentChecklistItem>): Promise<void>;
    saveMyScholarshipShortlist(ids: Array<ScholarshipId>): Promise<void>;
    saveSalaryBookmark(major: string, collegeOrRegion: string, medianSalary: bigint | null, notes: string): Promise<SalaryBookmark>;
    saveStudentProfile(profile: StudentProfile): Promise<void>;
    setGeminiApiKey(key: string): Promise<void>;
    submitInterviewAnswer(question: string, answer: string, collegeName: string): Promise<InterviewFeedback>;
    submitOfficerProfile(institution: string, title: string, govIdFilename: string): Promise<OfficerProfile>;
    toggleMyTask(taskId: bigint): Promise<TaskItem | null>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateMyApplication(entryId: bigint, status: ApplicationStatus | null, deadline: string | null, notes: string | null): Promise<ApplicationEntry | null>;
    updateMyEssayDraft(draftId: bigint, title: string | null, content: string | null, tags: Array<string> | null): Promise<EssayDraft | null>;
    updateMyTestScore(scoreId: bigint, sectionScores: Array<[string, bigint]> | null, date: string | null, targetScore: bigint | null): Promise<TestScore | null>;
    updateMyTrackedScholarship(scholarshipId: bigint, status: ScholarshipTrackedStatus | null, appliedDate: string | null, notes: string | null): Promise<ScholarshipTracked | null>;
    updateOfficerVerificationStatus(targetUser: UserId, status: OfficerVerificationStatus): Promise<boolean>;
    upsertPortfolioChecklist(items: Array<PortfolioChecklistItem>): Promise<void>;
}
