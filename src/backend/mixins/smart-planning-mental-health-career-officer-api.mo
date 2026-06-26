import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import T "../types/smart-planning-mental-health-career-officer";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Lib "../lib/smart-planning-mental-health-career-officer";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  internshipsStore : Map.Map<Common.UserId, List.List<T.InternshipEntry>>,
  volunteerStore : Map.Map<Common.UserId, List.List<T.VolunteerEntry>>,
  achievementsStore : Map.Map<Common.UserId, List.List<T.AchievementEntry>>,
  leadershipStore : Map.Map<Common.UserId, List.List<T.LeadershipRole>>,
  summerProgramsStore : Map.Map<Common.UserId, List.List<T.SummerProgram>>,
  moodStore : Map.Map<Common.UserId, List.List<T.MoodCheckIn>>,
  celebrationStore : Map.Map<Common.UserId, List.List<T.CelebrationEvent>>,
  anxietyStore : Map.Map<Common.UserId, List.List<T.AnxietyRating>>,
  careerPathStore : Map.Map<Common.UserId, List.List<T.SavedCareerPath>>,
  salaryBookmarkStore : Map.Map<Common.UserId, List.List<T.SalaryBookmark>>,
  portfolioStore : Map.Map<Common.UserId, List.List<T.PortfolioChecklistItem>>,
  officerProfileStore : Map.Map<Common.UserId, T.OfficerProfile>,
  smartPlanningCounters : { var nextId : Nat },
) {

  // ─── Smart Planning: Internships ──────────────────────────────────────────

  public shared ({ caller }) func addInternship(
    company : Text,
    role : Text,
    startDate : Text,
    endDate : ?Text,
    skills : [Text],
  ) : async T.InternshipEntry {
    let entry : T.InternshipEntry = {
      id = 0;
      company;
      role;
      startDate;
      endDate;
      skills;
      createdAt = Time.now();
    };
    Lib.addInternship(internshipsStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getInternships() : async [T.InternshipEntry] {
    Lib.getInternships(internshipsStore, caller);
  };

  public shared ({ caller }) func deleteInternship(id : Nat) : async Bool {
    Lib.deleteInternship(internshipsStore, caller, id);
  };

  // ─── Smart Planning: Volunteer ────────────────────────────────────────────

  public shared ({ caller }) func addVolunteerEntry(
    activity : Text,
    hours : Float,
    date : Text,
  ) : async T.VolunteerEntry {
    let entry : T.VolunteerEntry = {
      id = 0;
      activity;
      hours;
      date;
      createdAt = Time.now();
    };
    Lib.addVolunteerEntry(volunteerStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getVolunteerEntries() : async [T.VolunteerEntry] {
    Lib.getVolunteerEntries(volunteerStore, caller);
  };

  public shared ({ caller }) func deleteVolunteerEntry(id : Nat) : async Bool {
    Lib.deleteVolunteerEntry(volunteerStore, caller, id);
  };

  // ─── Smart Planning: Achievements ─────────────────────────────────────────

  public shared ({ caller }) func addAchievement(
    name : Text,
    date : Text,
    description : Text,
  ) : async T.AchievementEntry {
    let entry : T.AchievementEntry = {
      id = 0;
      name;
      date;
      description;
      createdAt = Time.now();
    };
    Lib.addAchievement(achievementsStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getAchievements() : async [T.AchievementEntry] {
    Lib.getAchievements(achievementsStore, caller);
  };

  public shared ({ caller }) func deleteAchievement(id : Nat) : async Bool {
    Lib.deleteAchievement(achievementsStore, caller, id);
  };

  // ─── Smart Planning: Leadership ───────────────────────────────────────────

  public shared ({ caller }) func addLeadershipRole(
    organization : Text,
    role : Text,
    startDate : Text,
    endDate : ?Text,
    impact : Text,
  ) : async T.LeadershipRole {
    let entry : T.LeadershipRole = {
      id = 0;
      organization;
      role;
      startDate;
      endDate;
      impact;
      createdAt = Time.now();
    };
    Lib.addLeadershipRole(leadershipStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getLeadershipRoles() : async [T.LeadershipRole] {
    Lib.getLeadershipRoles(leadershipStore, caller);
  };

  public shared ({ caller }) func deleteLeadershipRole(id : Nat) : async Bool {
    Lib.deleteLeadershipRole(leadershipStore, caller, id);
  };

  // ─── Smart Planning: Summer Programs ─────────────────────────────────────

  public shared ({ caller }) func addSummerProgram(
    name : Text,
    provider : Text,
    date : Text,
    status : T.SummerProgramStatus,
  ) : async T.SummerProgram {
    let entry : T.SummerProgram = {
      id = 0;
      name;
      provider;
      date;
      status;
      createdAt = Time.now();
    };
    Lib.addSummerProgram(summerProgramsStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getSummerPrograms() : async [T.SummerProgram] {
    Lib.getSummerPrograms(summerProgramsStore, caller);
  };

  public shared ({ caller }) func deleteSummerProgram(id : Nat) : async Bool {
    Lib.deleteSummerProgram(summerProgramsStore, caller, id);
  };

  // ─── Mental Health: Mood ──────────────────────────────────────────────────

  public shared ({ caller }) func addMoodCheckIn(
    date : Text,
    mood : Nat,
    moodEmoji : Text,
    note : Text,
  ) : async T.MoodCheckIn {
    let entry : T.MoodCheckIn = {
      id = 0;
      date;
      mood;
      moodEmoji;
      note;
      createdAt = Time.now();
    };
    Lib.addMoodCheckIn(moodStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getMoodCheckIns() : async [T.MoodCheckIn] {
    Lib.getMoodCheckIns(moodStore, caller);
  };

  // ─── Mental Health: Celebrations ─────────────────────────────────────────

  public shared ({ caller }) func addCelebrationEvent(
    date : Text,
    description : Text,
  ) : async T.CelebrationEvent {
    let entry : T.CelebrationEvent = {
      id = 0;
      date;
      description;
      createdAt = Time.now();
    };
    Lib.addCelebrationEvent(celebrationStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getCelebrationEvents() : async [T.CelebrationEvent] {
    Lib.getCelebrationEvents(celebrationStore, caller);
  };

  // ─── Mental Health: Anxiety ───────────────────────────────────────────────

  public shared ({ caller }) func addAnxietyRating(
    date : Text,
    confidenceScore : Nat,
    worryScore : Nat,
  ) : async T.AnxietyRating {
    let entry : T.AnxietyRating = {
      id = 0;
      date;
      confidenceScore;
      worryScore;
      createdAt = Time.now();
    };
    Lib.addAnxietyRating(anxietyStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getAnxietyRatings() : async [T.AnxietyRating] {
    Lib.getAnxietyRatings(anxietyStore, caller);
  };

  // ─── Career: Career Paths ─────────────────────────────────────────────────

  public shared ({ caller }) func saveCareerPath(
    major : Text,
    careerTitle : Text,
    description : Text,
  ) : async T.SavedCareerPath {
    let entry : T.SavedCareerPath = {
      id = 0;
      major;
      careerTitle;
      description;
      savedAt = Time.now();
    };
    Lib.saveCareerPath(careerPathStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getSavedCareerPaths() : async [T.SavedCareerPath] {
    Lib.getSavedCareerPaths(careerPathStore, caller);
  };

  public shared ({ caller }) func removeSavedCareerPath(id : Nat) : async Bool {
    Lib.removeSavedCareerPath(careerPathStore, caller, id);
  };

  // ─── Career: Salary Bookmarks ─────────────────────────────────────────────

  public shared ({ caller }) func saveSalaryBookmark(
    major : Text,
    collegeOrRegion : Text,
    medianSalary : ?Nat,
    notes : Text,
  ) : async T.SalaryBookmark {
    let entry : T.SalaryBookmark = {
      id = 0;
      major;
      collegeOrRegion;
      medianSalary;
      notes;
      savedAt = Time.now();
    };
    Lib.saveSalaryBookmark(salaryBookmarkStore, smartPlanningCounters, caller, entry);
  };

  public query ({ caller }) func getSalaryBookmarks() : async [T.SalaryBookmark] {
    Lib.getSalaryBookmarks(salaryBookmarkStore, caller);
  };

  public shared ({ caller }) func removeSalaryBookmark(id : Nat) : async Bool {
    Lib.removeSalaryBookmark(salaryBookmarkStore, caller, id);
  };

  // ─── Career: Portfolio Checklist ──────────────────────────────────────────

  public shared ({ caller }) func upsertPortfolioChecklist(
    items : [T.PortfolioChecklistItem],
  ) : async () {
    Lib.upsertPortfolioChecklist(portfolioStore, caller, items);
  };

  public query ({ caller }) func getPortfolioChecklist() : async [T.PortfolioChecklistItem] {
    Lib.getPortfolioChecklist(portfolioStore, caller);
  };

  // ─── Officer: Profile & Verification ─────────────────────────────────────

  public shared ({ caller }) func submitOfficerProfile(
    institution : Text,
    title : Text,
    govIdFilename : Text,
  ) : async T.OfficerProfile {
    let profile : T.OfficerProfile = {
      userId = caller;
      institution;
      title;
      govIdFilename;
      verificationStatus = #pending;
      submittedAt = Time.now();
      reviewedAt = null;
    };
    Lib.submitOfficerProfile(officerProfileStore, caller, profile);
  };

  public query ({ caller }) func getOfficerProfile() : async ?T.OfficerProfile {
    Lib.getOfficerProfile(officerProfileStore, caller);
  };

  public shared ({ caller }) func updateOfficerVerificationStatus(
    targetUser : Common.UserId,
    status : T.OfficerVerificationStatus,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin required");
    };
    Lib.updateOfficerVerificationStatus(officerProfileStore, targetUser, status, Time.now());
  };

  public query ({ caller }) func listPendingOfficers() : async [T.OfficerProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin required");
    };
    Lib.listPendingOfficers(officerProfileStore);
  };
};
