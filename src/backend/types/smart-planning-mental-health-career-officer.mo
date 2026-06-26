import Common "common";

module {
  // ─── Smart Planning ───────────────────────────────────────────────────────

  public type InternshipEntry = {
    id : Nat;
    company : Text;
    role : Text;
    startDate : Text;
    endDate : ?Text;
    skills : [Text];
    createdAt : Common.Timestamp;
  };

  public type VolunteerEntry = {
    id : Nat;
    activity : Text;
    hours : Float;
    date : Text;
    createdAt : Common.Timestamp;
  };

  public type AchievementEntry = {
    id : Nat;
    name : Text;
    date : Text;
    description : Text;
    createdAt : Common.Timestamp;
  };

  public type LeadershipRole = {
    id : Nat;
    organization : Text;
    role : Text;
    startDate : Text;
    endDate : ?Text;
    impact : Text;
    createdAt : Common.Timestamp;
  };

  public type SummerProgram = {
    id : Nat;
    name : Text;
    provider : Text;
    date : Text;
    status : SummerProgramStatus;
    createdAt : Common.Timestamp;
  };

  public type SummerProgramStatus = {
    #interested;
    #applied;
    #accepted;
    #rejected;
    #completed;
  };

  // ─── Mental Health ────────────────────────────────────────────────────────

  public type MoodCheckIn = {
    id : Nat;
    date : Text;
    mood : Nat;          // 1-5
    moodEmoji : Text;    // emoji string
    note : Text;
    createdAt : Common.Timestamp;
  };

  public type CelebrationEvent = {
    id : Nat;
    date : Text;
    description : Text;
    createdAt : Common.Timestamp;
  };

  public type AnxietyRating = {
    id : Nat;
    date : Text;
    confidenceScore : Nat;  // 1-10
    worryScore : Nat;       // 1-10
    createdAt : Common.Timestamp;
  };

  // ─── Career ───────────────────────────────────────────────────────────────

  public type SavedCareerPath = {
    id : Nat;
    major : Text;
    careerTitle : Text;
    description : Text;
    savedAt : Common.Timestamp;
  };

  public type SalaryBookmark = {
    id : Nat;
    major : Text;
    collegeOrRegion : Text;
    medianSalary : ?Nat;
    notes : Text;
    savedAt : Common.Timestamp;
  };

  public type PortfolioChecklistItem = {
    itemKey : Text;    // stable identifier
    itemLabel : Text;
    completed : Bool;
    updatedAt : Common.Timestamp;
  };

  // ─── Officer Verification ─────────────────────────────────────────────────

  public type OfficerVerificationStatus = {
    #pending;
    #verified;
    #rejected;
  };

  public type OfficerProfile = {
    userId : Common.UserId;
    institution : Text;
    title : Text;
    govIdFilename : Text;   // reference to uploaded document name
    verificationStatus : OfficerVerificationStatus;
    submittedAt : Common.Timestamp;
    reviewedAt : ?Common.Timestamp;
  };
};
