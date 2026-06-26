import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Types "types/common";
import ProfileTypes "types/profile";
import ScholarshipTypes "types/scholarships";
import CollegeTypes "types/colleges";
import DeadlinesChatTypes "types/deadlines-chat-portal";
import ProfileApi "mixins/profile-api";
import ScholarshipsApi "mixins/scholarships-api";
import CollegesApi "mixins/colleges-api";
import AiApi "mixins/ai-api";
import FinanceApi "mixins/finance-api";
import DeadlinesChatPortalApi "mixins/deadlines-chat-portal-api";
import ScholarshipsLib "lib/scholarships";
import CollegesLib "lib/colleges";
import Runtime "mo:core/Runtime";

import SmartPlanningTypes "types/smart-planning-mental-health-career-officer";
import SmartPlanningApi "mixins/smart-planning-mental-health-career-officer-api";
import TrackingTypes "types/tracking";
import TrackingApi "mixins/tracking-api";








actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Gemini API key storage (persists via enhanced orthogonal persistence)
  let geminiKeyState = { var key : Text = "" };

  public shared ({ caller }) func setGeminiApiKey(key : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin required");
    };
    geminiKeyState.key := key;
  };

  public query func getGeminiApiKeyStatus() : async Bool {
    geminiKeyState.key.size() > 0;
  };

  let userProfiles = Map.empty<Types.UserId, ProfileTypes.StudentProfile>();

  let scholarshipsCatalog = List.empty<ScholarshipTypes.Scholarship>();
  let scholarshipShortlists = Map.empty<Types.UserId, [ScholarshipTypes.ScholarshipId]>();

  let collegesCatalog = List.empty<CollegeTypes.College>();

  // Deadline tracker and document checklist state
  let deadlinesStore = Map.empty<Types.UserId, [DeadlinesChatTypes.CollegeDeadline]>();
  let checklistStore = Map.empty<Types.UserId, [DeadlinesChatTypes.DocumentChecklistItem]>();

  // Alumni chat state
  let alumniMessagesStore = Map.empty<Nat, List.List<DeadlinesChatTypes.AlumniMessage>>();

  // Admission officer portal state
  let officersStore = Map.empty<Types.UserId, DeadlinesChatTypes.AdmissionOfficer>();
  let officerContentStore = Map.empty<Nat, DeadlinesChatTypes.OfficerContent>();

  // Shared counters for portal IDs
  let portalCounters = { var nextMessageId : Nat = 0; var nextContentId : Nat = 0 };
  // Tracking domain state
  let applicationsStore = Map.empty<Types.UserId, List.List<TrackingTypes.ApplicationEntry>>();
  let essayDraftsStore = Map.empty<Types.UserId, List.List<TrackingTypes.EssayDraft>>();
  let testScoresStore = Map.empty<Types.UserId, List.List<TrackingTypes.TestScore>>();
  let tasksStore = Map.empty<Types.UserId, List.List<TrackingTypes.TaskItem>>();
  let stressStore = Map.empty<Types.UserId, List.List<TrackingTypes.StressCheckIn>>();
  let trackedScholarshipsStore = Map.empty<Types.UserId, List.List<TrackingTypes.ScholarshipTracked>>();
  let trackingCounters = { var nextId : Nat = 0 };

  // Smart Planning / Mental Health / Career / Officer state
  let internshipsStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.InternshipEntry>>();
  let volunteerStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.VolunteerEntry>>();
  let achievementsStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.AchievementEntry>>();
  let leadershipStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.LeadershipRole>>();
  let summerProgramsStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.SummerProgram>>();
  let moodStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.MoodCheckIn>>();
  let celebrationStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.CelebrationEvent>>();
  let anxietyStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.AnxietyRating>>();
  let careerPathStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.SavedCareerPath>>();
  let salaryBookmarkStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.SalaryBookmark>>();
  let portfolioStore = Map.empty<Types.UserId, List.List<SmartPlanningTypes.PortfolioChecklistItem>>();
  let officerProfileStore = Map.empty<Types.UserId, SmartPlanningTypes.OfficerProfile>();
  let smartPlanningCounters = { var nextId : Nat = 0 };

  // Seed catalogs on first deploy (lists are empty until seeded)
  if (scholarshipsCatalog.size() == 0) {
    ScholarshipsLib.seedScholarships(scholarshipsCatalog);
  };
  if (collegesCatalog.size() == 0) {
    CollegesLib.seedColleges(collegesCatalog);
  };

  include ProfileApi(accessControlState, userProfiles);
  include ScholarshipsApi(accessControlState, scholarshipsCatalog, scholarshipShortlists);
  include CollegesApi(collegesCatalog);
  include AiApi(accessControlState, func() { geminiKeyState.key });
  include FinanceApi();
  include DeadlinesChatPortalApi(
    accessControlState,
    deadlinesStore,
    checklistStore,
    alumniMessagesStore,
    officersStore,
    officerContentStore,
    portalCounters,
  );
  include TrackingApi(
    accessControlState,
    applicationsStore,
    essayDraftsStore,
    testScoresStore,
    tasksStore,
    stressStore,
    trackedScholarshipsStore,
    trackingCounters,
  );
  include SmartPlanningApi(
    accessControlState,
    internshipsStore,
    volunteerStore,
    achievementsStore,
    leadershipStore,
    summerProgramsStore,
    moodStore,
    celebrationStore,
    anxietyStore,
    careerPathStore,
    salaryBookmarkStore,
    portfolioStore,
    officerProfileStore,
    smartPlanningCounters,
  );
};

