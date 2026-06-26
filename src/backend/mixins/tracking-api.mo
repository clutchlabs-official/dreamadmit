import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import T "../types/tracking";
import TrackingLib "../lib/tracking";

mixin (
  accessControlState : AccessControl.AccessControlState,
  applicationsStore : Map.Map<Common.UserId, List.List<T.ApplicationEntry>>,
  essayDraftsStore : Map.Map<Common.UserId, List.List<T.EssayDraft>>,
  testScoresStore : Map.Map<Common.UserId, List.List<T.TestScore>>,
  tasksStore : Map.Map<Common.UserId, List.List<T.TaskItem>>,
  stressStore : Map.Map<Common.UserId, List.List<T.StressCheckIn>>,
  trackedScholarshipsStore : Map.Map<Common.UserId, List.List<T.ScholarshipTracked>>,
  trackingCounters : { var nextId : Nat },
) {
  // ── Application Entries ───────────────────────────────────────────────────

  public query ({ caller }) func listMyApplications() : async [T.ApplicationEntry] {
    TrackingLib.listApplications(applicationsStore, caller);
  };

  public shared ({ caller }) func addMyApplication(
    collegeName : Text,
    status : T.ApplicationStatus,
    deadline : ?Text,
    notes : ?Text,
  ) : async T.ApplicationEntry {
    TrackingLib.addApplication(
      applicationsStore,
      trackingCounters,
      caller,
      collegeName,
      status,
      deadline,
      notes,
      Time.now(),
    );
  };

  public shared ({ caller }) func updateMyApplication(
    entryId : Nat,
    status : ?T.ApplicationStatus,
    deadline : ?Text,
    notes : ?Text,
  ) : async ?T.ApplicationEntry {
    TrackingLib.updateApplication(
      applicationsStore,
      caller,
      entryId,
      status,
      deadline,
      notes,
      Time.now(),
    );
  };

  public shared ({ caller }) func deleteMyApplication(
    entryId : Nat,
  ) : async Bool {
    TrackingLib.deleteApplication(applicationsStore, caller, entryId);
  };

  // ── Essay Drafts ──────────────────────────────────────────────────────────

  public query ({ caller }) func listMyEssayDrafts() : async [T.EssayDraft] {
    TrackingLib.listEssayDrafts(essayDraftsStore, caller);
  };

  public shared ({ caller }) func addMyEssayDraft(
    title : Text,
    content : Text,
    tags : [Text],
  ) : async T.EssayDraft {
    TrackingLib.addEssayDraft(
      essayDraftsStore,
      trackingCounters,
      caller,
      title,
      content,
      tags,
      Time.now(),
    );
  };

  public shared ({ caller }) func updateMyEssayDraft(
    draftId : Nat,
    title : ?Text,
    content : ?Text,
    tags : ?[Text],
  ) : async ?T.EssayDraft {
    TrackingLib.updateEssayDraft(
      essayDraftsStore,
      caller,
      draftId,
      title,
      content,
      tags,
      Time.now(),
    );
  };

  public shared ({ caller }) func deleteMyEssayDraft(
    draftId : Nat,
  ) : async Bool {
    TrackingLib.deleteEssayDraft(essayDraftsStore, caller, draftId);
  };

  // ── Test Scores ───────────────────────────────────────────────────────────

  public query ({ caller }) func listMyTestScores() : async [T.TestScore] {
    TrackingLib.listTestScores(testScoresStore, caller);
  };

  public shared ({ caller }) func addMyTestScore(
    testName : Text,
    sectionScores : [(Text, Nat)],
    date : ?Text,
    targetScore : ?Nat,
  ) : async T.TestScore {
    TrackingLib.addTestScore(
      testScoresStore,
      trackingCounters,
      caller,
      testName,
      sectionScores,
      date,
      targetScore,
      Time.now(),
    );
  };

  public shared ({ caller }) func updateMyTestScore(
    scoreId : Nat,
    sectionScores : ?[(Text, Nat)],
    date : ?Text,
    targetScore : ?Nat,
  ) : async ?T.TestScore {
    TrackingLib.updateTestScore(
      testScoresStore,
      caller,
      scoreId,
      sectionScores,
      date,
      targetScore,
    );
  };

  public shared ({ caller }) func deleteMyTestScore(
    scoreId : Nat,
  ) : async Bool {
    TrackingLib.deleteTestScore(testScoresStore, caller, scoreId);
  };

  // ── Tasks ─────────────────────────────────────────────────────────────────

  public query ({ caller }) func listMyTasks() : async [T.TaskItem] {
    TrackingLib.listTasks(tasksStore, caller);
  };

  public shared ({ caller }) func addMyTask(
    title : Text,
    dueDate : ?Text,
    priority : T.TaskPriority,
    category : ?Text,
  ) : async T.TaskItem {
    TrackingLib.addTask(
      tasksStore,
      trackingCounters,
      caller,
      title,
      dueDate,
      priority,
      category,
      Time.now(),
    );
  };

  public shared ({ caller }) func toggleMyTask(
    taskId : Nat,
  ) : async ?T.TaskItem {
    TrackingLib.toggleTask(tasksStore, caller, taskId);
  };

  public shared ({ caller }) func deleteMyTask(
    taskId : Nat,
  ) : async Bool {
    TrackingLib.deleteTask(tasksStore, caller, taskId);
  };

  // ── Stress Check-Ins ──────────────────────────────────────────────────────

  public query ({ caller }) func listMyStressCheckIns() : async [T.StressCheckIn] {
    TrackingLib.listStressCheckIns(stressStore, caller);
  };

  public shared ({ caller }) func addMyStressCheckIn(
    date : Text,
    stressLevel : Nat,
    sleepHours : Float,
    confidenceLevel : Nat,
  ) : async T.StressCheckIn {
    TrackingLib.addStressCheckIn(
      stressStore,
      trackingCounters,
      caller,
      date,
      stressLevel,
      sleepHours,
      confidenceLevel,
      Time.now(),
    );
  };

  // ── Tracked Scholarships ──────────────────────────────────────────────────

  public query ({ caller }) func listMyTrackedScholarships() : async [T.ScholarshipTracked] {
    TrackingLib.listTrackedScholarships(trackedScholarshipsStore, caller);
  };

  public shared ({ caller }) func addMyTrackedScholarship(
    name : Text,
    deadline : ?Text,
    essayRequired : Bool,
    notes : ?Text,
  ) : async T.ScholarshipTracked {
    TrackingLib.addTrackedScholarship(
      trackedScholarshipsStore,
      trackingCounters,
      caller,
      name,
      deadline,
      essayRequired,
      notes,
      Time.now(),
    );
  };

  public shared ({ caller }) func updateMyTrackedScholarship(
    scholarshipId : Nat,
    status : ?T.ScholarshipTrackedStatus,
    appliedDate : ?Text,
    notes : ?Text,
  ) : async ?T.ScholarshipTracked {
    TrackingLib.updateTrackedScholarship(
      trackedScholarshipsStore,
      caller,
      scholarshipId,
      status,
      appliedDate,
      notes,
    );
  };

  public shared ({ caller }) func deleteMyTrackedScholarship(
    scholarshipId : Nat,
  ) : async Bool {
    TrackingLib.deleteTrackedScholarship(trackedScholarshipsStore, caller, scholarshipId);
  };
};
