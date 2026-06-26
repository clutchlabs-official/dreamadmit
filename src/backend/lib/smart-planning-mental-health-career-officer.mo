import Common "../types/common";
import T "../types/smart-planning-mental-health-career-officer";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // ─── Smart Planning ───────────────────────────────────────────────────────

  public func addInternship(
    store : Map.Map<Common.UserId, List.List<T.InternshipEntry>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.InternshipEntry,
  ) : T.InternshipEntry {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.InternshipEntry = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.InternshipEntry>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getInternships(
    store : Map.Map<Common.UserId, List.List<T.InternshipEntry>>,
    userId : Common.UserId,
  ) : [T.InternshipEntry] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func deleteInternship(
    store : Map.Map<Common.UserId, List.List<T.InternshipEntry>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func addVolunteerEntry(
    store : Map.Map<Common.UserId, List.List<T.VolunteerEntry>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.VolunteerEntry,
  ) : T.VolunteerEntry {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.VolunteerEntry = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.VolunteerEntry>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getVolunteerEntries(
    store : Map.Map<Common.UserId, List.List<T.VolunteerEntry>>,
    userId : Common.UserId,
  ) : [T.VolunteerEntry] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func deleteVolunteerEntry(
    store : Map.Map<Common.UserId, List.List<T.VolunteerEntry>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func addAchievement(
    store : Map.Map<Common.UserId, List.List<T.AchievementEntry>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.AchievementEntry,
  ) : T.AchievementEntry {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.AchievementEntry = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.AchievementEntry>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getAchievements(
    store : Map.Map<Common.UserId, List.List<T.AchievementEntry>>,
    userId : Common.UserId,
  ) : [T.AchievementEntry] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func deleteAchievement(
    store : Map.Map<Common.UserId, List.List<T.AchievementEntry>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func addLeadershipRole(
    store : Map.Map<Common.UserId, List.List<T.LeadershipRole>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.LeadershipRole,
  ) : T.LeadershipRole {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.LeadershipRole = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.LeadershipRole>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getLeadershipRoles(
    store : Map.Map<Common.UserId, List.List<T.LeadershipRole>>,
    userId : Common.UserId,
  ) : [T.LeadershipRole] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func deleteLeadershipRole(
    store : Map.Map<Common.UserId, List.List<T.LeadershipRole>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func addSummerProgram(
    store : Map.Map<Common.UserId, List.List<T.SummerProgram>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.SummerProgram,
  ) : T.SummerProgram {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.SummerProgram = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.SummerProgram>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getSummerPrograms(
    store : Map.Map<Common.UserId, List.List<T.SummerProgram>>,
    userId : Common.UserId,
  ) : [T.SummerProgram] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func deleteSummerProgram(
    store : Map.Map<Common.UserId, List.List<T.SummerProgram>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  // ─── Mental Health ────────────────────────────────────────────────────────

  public func addMoodCheckIn(
    store : Map.Map<Common.UserId, List.List<T.MoodCheckIn>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.MoodCheckIn,
  ) : T.MoodCheckIn {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.MoodCheckIn = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.MoodCheckIn>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getMoodCheckIns(
    store : Map.Map<Common.UserId, List.List<T.MoodCheckIn>>,
    userId : Common.UserId,
  ) : [T.MoodCheckIn] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func addCelebrationEvent(
    store : Map.Map<Common.UserId, List.List<T.CelebrationEvent>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.CelebrationEvent,
  ) : T.CelebrationEvent {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.CelebrationEvent = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.CelebrationEvent>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getCelebrationEvents(
    store : Map.Map<Common.UserId, List.List<T.CelebrationEvent>>,
    userId : Common.UserId,
  ) : [T.CelebrationEvent] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func addAnxietyRating(
    store : Map.Map<Common.UserId, List.List<T.AnxietyRating>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.AnxietyRating,
  ) : T.AnxietyRating {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.AnxietyRating = { entry with id; createdAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.AnxietyRating>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getAnxietyRatings(
    store : Map.Map<Common.UserId, List.List<T.AnxietyRating>>,
    userId : Common.UserId,
  ) : [T.AnxietyRating] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  // ─── Career ───────────────────────────────────────────────────────────────

  public func saveCareerPath(
    store : Map.Map<Common.UserId, List.List<T.SavedCareerPath>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.SavedCareerPath,
  ) : T.SavedCareerPath {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.SavedCareerPath = { entry with id; savedAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.SavedCareerPath>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getSavedCareerPaths(
    store : Map.Map<Common.UserId, List.List<T.SavedCareerPath>>,
    userId : Common.UserId,
  ) : [T.SavedCareerPath] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func removeSavedCareerPath(
    store : Map.Map<Common.UserId, List.List<T.SavedCareerPath>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func saveSalaryBookmark(
    store : Map.Map<Common.UserId, List.List<T.SalaryBookmark>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    entry : T.SalaryBookmark,
  ) : T.SalaryBookmark {
    let id = counters.nextId;
    counters.nextId += 1;
    let newEntry : T.SalaryBookmark = { entry with id; savedAt = Time.now() };
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.SalaryBookmark>();
        store.add(userId, l);
        l;
      };
    };
    list.add(newEntry);
    newEntry;
  };

  public func getSalaryBookmarks(
    store : Map.Map<Common.UserId, List.List<T.SalaryBookmark>>,
    userId : Common.UserId,
  ) : [T.SalaryBookmark] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  public func removeSalaryBookmark(
    store : Map.Map<Common.UserId, List.List<T.SalaryBookmark>>,
    userId : Common.UserId,
    id : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?l) {
        let sizeBefore = l.size();
        let filtered = l.filter(func(e) { e.id != id });
        l.clear();
        l.append(filtered);
        l.size() < sizeBefore;
      };
    };
  };

  public func upsertPortfolioChecklist(
    store : Map.Map<Common.UserId, List.List<T.PortfolioChecklistItem>>,
    userId : Common.UserId,
    items : [T.PortfolioChecklistItem],
  ) : () {
    let list = switch (store.get(userId)) {
      case (?l) l;
      case null {
        let l = List.empty<T.PortfolioChecklistItem>();
        store.add(userId, l);
        l;
      };
    };
    // Replace entire checklist with provided items
    list.clear();
    for (item in items.vals()) {
      list.add(item);
    };
  };

  public func getPortfolioChecklist(
    store : Map.Map<Common.UserId, List.List<T.PortfolioChecklistItem>>,
    userId : Common.UserId,
  ) : [T.PortfolioChecklistItem] {
    switch (store.get(userId)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  // ─── Officer Verification ─────────────────────────────────────────────────

  public func submitOfficerProfile(
    store : Map.Map<Common.UserId, T.OfficerProfile>,
    userId : Common.UserId,
    profile : T.OfficerProfile,
  ) : T.OfficerProfile {
    let newProfile : T.OfficerProfile = { profile with userId; submittedAt = Time.now(); verificationStatus = #pending; reviewedAt = null };
    store.add(userId, newProfile);
    newProfile;
  };

  public func getOfficerProfile(
    store : Map.Map<Common.UserId, T.OfficerProfile>,
    userId : Common.UserId,
  ) : ?T.OfficerProfile {
    store.get(userId);
  };

  public func updateOfficerVerificationStatus(
    store : Map.Map<Common.UserId, T.OfficerProfile>,
    userId : Common.UserId,
    status : T.OfficerVerificationStatus,
    reviewedAt : Common.Timestamp,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?p) {
        store.add(userId, { p with verificationStatus = status; reviewedAt = ?reviewedAt });
        true;
      };
    };
  };

  public func listPendingOfficers(
    store : Map.Map<Common.UserId, T.OfficerProfile>,
  ) : [T.OfficerProfile] {
    let result = List.empty<T.OfficerProfile>();
    for ((_, p) in store.entries()) {
      if (p.verificationStatus == #pending) {
        result.add(p);
      };
    };
    result.toArray();
  };
};
