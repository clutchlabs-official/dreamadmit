import Debug "mo:core/Debug";
import Common "common";

module {
  // Application status enum
  public type ApplicationStatus = {
    #applied;
    #waitlisted;
    #deferred;
    #accepted;
    #rejected;
  };

  // Application entry for tracking college applications
  public type ApplicationEntry = {
    id : Nat;
    collegeName : Text;
    status : ApplicationStatus;
    deadline : ?Text;
    notes : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  // Essay draft with versioning
  public type EssayDraft = {
    draftId : Nat;
    title : Text;
    content : Text;
    wordCount : Nat;
    version : Nat;
    timestamp : Common.Timestamp;
    tags : [Text];
  };

  // Test score record
  public type TestScore = {
    id : Nat;
    testName : Text;  // SAT/ACT/JEE/NEET/IELTS/TOEFL
    sectionScores : [(Text, Nat)];  // section name -> score
    date : ?Text;
    targetScore : ?Nat;
    createdAt : Common.Timestamp;
  };

  // Task item for to-do management
  public type TaskPriority = {
    #low;
    #medium;
    #high;
  };

  public type TaskItem = {
    taskId : Nat;
    title : Text;
    dueDate : ?Text;
    completed : Bool;
    priority : TaskPriority;
    category : ?Text;
    createdAt : Common.Timestamp;
  };

  // Stress and wellbeing check-in
  public type StressCheckIn = {
    id : Nat;
    date : Text;
    stressLevel : Nat;       // 1-5
    sleepHours : Float;
    confidenceLevel : Nat;   // 1-5
    createdAt : Common.Timestamp;
  };

  // Scholarship tracking
  public type ScholarshipTrackedStatus = {
    #notStarted;
    #inProgress;
    #submitted;
    #awarded;
    #rejected;
  };

  public type ScholarshipTracked = {
    scholarshipId : Nat;
    name : Text;
    deadline : ?Text;
    status : ScholarshipTrackedStatus;
    essayRequired : Bool;
    appliedDate : ?Text;
    notes : ?Text;
    createdAt : Common.Timestamp;
  };

  // Bundled per-user tracking state
  public type UserTrackingData = {
    applications : [ApplicationEntry];
    essayDrafts : [EssayDraft];
    testScores : [TestScore];
    tasks : [TaskItem];
    stressCheckIns : [StressCheckIn];
    trackedScholarships : [ScholarshipTracked];
    var nextId : Nat;
  };
};
