import List "mo:core/List";
import Map "mo:core/Map";
import Common "../types/common";
import T "../types/tracking";

module {
  // ── Application Entries ─────────────────────────────────────────────────────

  public func listApplications(
    store : Map.Map<Common.UserId, List.List<T.ApplicationEntry>>,
    userId : Common.UserId,
  ) : [T.ApplicationEntry] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addApplication(
    store : Map.Map<Common.UserId, List.List<T.ApplicationEntry>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    collegeName : Text,
    status : T.ApplicationStatus,
    deadline : ?Text,
    notes : ?Text,
    now : Common.Timestamp,
  ) : T.ApplicationEntry {
    let id = counters.nextId;
    counters.nextId += 1;
    let entry : T.ApplicationEntry = {
      id;
      collegeName;
      status;
      deadline;
      notes;
      createdAt = now;
      updatedAt = now;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.ApplicationEntry>();
        store.add(userId, l);
        l;
      };
    };
    list.add(entry);
    entry;
  };

  public func updateApplication(
    store : Map.Map<Common.UserId, List.List<T.ApplicationEntry>>,
    userId : Common.UserId,
    entryId : Nat,
    status : ?T.ApplicationStatus,
    deadline : ?Text,
    notes : ?Text,
    now : Common.Timestamp,
  ) : ?T.ApplicationEntry {
    switch (store.get(userId)) {
      case null { null };
      case (?list) {
        var result : ?T.ApplicationEntry = null;
        list.mapInPlace(func(e) {
          if (e.id == entryId) {
            let updated : T.ApplicationEntry = {
              e with
              status = switch (status) { case (?s) s; case null e.status };
              deadline = switch (deadline) { case (?d) ?d; case null e.deadline };
              notes = switch (notes) { case (?n) ?n; case null e.notes };
              updatedAt = now;
            };
            result := ?updated;
            updated;
          } else { e };
        });
        result;
      };
    };
  };

  public func deleteApplication(
    store : Map.Map<Common.UserId, List.List<T.ApplicationEntry>>,
    userId : Common.UserId,
    entryId : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null { false };
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(e : T.ApplicationEntry) : Bool { e.id != entryId });
        store.add(userId, filtered);
        filtered.size() < before;
      };
    };
  };

  // ── Essay Drafts ─────────────────────────────────────────────────────────────

  public func listEssayDrafts(
    store : Map.Map<Common.UserId, List.List<T.EssayDraft>>,
    userId : Common.UserId,
  ) : [T.EssayDraft] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addEssayDraft(
    store : Map.Map<Common.UserId, List.List<T.EssayDraft>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    title : Text,
    content : Text,
    tags : [Text],
    now : Common.Timestamp,
  ) : T.EssayDraft {
    let draftId = counters.nextId;
    counters.nextId += 1;
    let wordCount = content.split(#text " ").size();
    let draft : T.EssayDraft = {
      draftId;
      title;
      content;
      wordCount;
      version = 1;
      timestamp = now;
      tags;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.EssayDraft>();
        store.add(userId, l);
        l;
      };
    };
    list.add(draft);
    draft;
  };

  public func updateEssayDraft(
    store : Map.Map<Common.UserId, List.List<T.EssayDraft>>,
    userId : Common.UserId,
    draftId : Nat,
    title : ?Text,
    content : ?Text,
    tags : ?[Text],
    now : Common.Timestamp,
  ) : ?T.EssayDraft {
    switch (store.get(userId)) {
      case null { null };
      case (?list) {
        var result : ?T.EssayDraft = null;
        list.mapInPlace(func(d) {
          if (d.draftId == draftId) {
            let newContent = switch (content) { case (?c) c; case null d.content };
            let updated : T.EssayDraft = {
              d with
              title = switch (title) { case (?t) t; case null d.title };
              content = newContent;
              wordCount = newContent.split(#text " ").size();
              version = d.version + 1;
              timestamp = now;
              tags = switch (tags) { case (?tg) tg; case null d.tags };
            };
            result := ?updated;
            updated;
          } else { d };
        });
        result;
      };
    };
  };

  public func deleteEssayDraft(
    store : Map.Map<Common.UserId, List.List<T.EssayDraft>>,
    userId : Common.UserId,
    draftId : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null { false };
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(d : T.EssayDraft) : Bool { d.draftId != draftId });
        store.add(userId, filtered);
        filtered.size() < before;
      };
    };
  };

  // ── Test Scores ──────────────────────────────────────────────────────────────

  public func listTestScores(
    store : Map.Map<Common.UserId, List.List<T.TestScore>>,
    userId : Common.UserId,
  ) : [T.TestScore] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addTestScore(
    store : Map.Map<Common.UserId, List.List<T.TestScore>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    testName : Text,
    sectionScores : [(Text, Nat)],
    date : ?Text,
    targetScore : ?Nat,
    now : Common.Timestamp,
  ) : T.TestScore {
    let id = counters.nextId;
    counters.nextId += 1;
    let score : T.TestScore = {
      id;
      testName;
      sectionScores;
      date;
      targetScore;
      createdAt = now;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.TestScore>();
        store.add(userId, l);
        l;
      };
    };
    list.add(score);
    score;
  };

  public func updateTestScore(
    store : Map.Map<Common.UserId, List.List<T.TestScore>>,
    userId : Common.UserId,
    scoreId : Nat,
    sectionScores : ?[(Text, Nat)],
    date : ?Text,
    targetScore : ?Nat,
  ) : ?T.TestScore {
    switch (store.get(userId)) {
      case null { null };
      case (?list) {
        var result : ?T.TestScore = null;
        list.mapInPlace(func(s) {
          if (s.id == scoreId) {
            let updated : T.TestScore = {
              s with
              sectionScores = switch (sectionScores) { case (?sc) sc; case null s.sectionScores };
              date = switch (date) { case (?d) ?d; case null s.date };
              targetScore = switch (targetScore) { case (?t) ?t; case null s.targetScore };
            };
            result := ?updated;
            updated;
          } else { s };
        });
        result;
      };
    };
  };

  public func deleteTestScore(
    store : Map.Map<Common.UserId, List.List<T.TestScore>>,
    userId : Common.UserId,
    scoreId : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null { false };
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(s : T.TestScore) : Bool { s.id != scoreId });
        store.add(userId, filtered);
        filtered.size() < before;
      };
    };
  };

  // ── Tasks ────────────────────────────────────────────────────────────────────

  public func listTasks(
    store : Map.Map<Common.UserId, List.List<T.TaskItem>>,
    userId : Common.UserId,
  ) : [T.TaskItem] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addTask(
    store : Map.Map<Common.UserId, List.List<T.TaskItem>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    title : Text,
    dueDate : ?Text,
    priority : T.TaskPriority,
    category : ?Text,
    now : Common.Timestamp,
  ) : T.TaskItem {
    let taskId = counters.nextId;
    counters.nextId += 1;
    let task : T.TaskItem = {
      taskId;
      title;
      dueDate;
      completed = false;
      priority;
      category;
      createdAt = now;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.TaskItem>();
        store.add(userId, l);
        l;
      };
    };
    list.add(task);
    task;
  };

  public func toggleTask(
    store : Map.Map<Common.UserId, List.List<T.TaskItem>>,
    userId : Common.UserId,
    taskId : Nat,
  ) : ?T.TaskItem {
    switch (store.get(userId)) {
      case null { null };
      case (?list) {
        var result : ?T.TaskItem = null;
        list.mapInPlace(func(t) {
          if (t.taskId == taskId) {
            let updated : T.TaskItem = { t with completed = not t.completed };
            result := ?updated;
            updated;
          } else { t };
        });
        result;
      };
    };
  };

  public func deleteTask(
    store : Map.Map<Common.UserId, List.List<T.TaskItem>>,
    userId : Common.UserId,
    taskId : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null { false };
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(t : T.TaskItem) : Bool { t.taskId != taskId });
        store.add(userId, filtered);
        filtered.size() < before;
      };
    };
  };

  // ── Stress Check-Ins ─────────────────────────────────────────────────────────

  public func listStressCheckIns(
    store : Map.Map<Common.UserId, List.List<T.StressCheckIn>>,
    userId : Common.UserId,
  ) : [T.StressCheckIn] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addStressCheckIn(
    store : Map.Map<Common.UserId, List.List<T.StressCheckIn>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    date : Text,
    stressLevel : Nat,
    sleepHours : Float,
    confidenceLevel : Nat,
    now : Common.Timestamp,
  ) : T.StressCheckIn {
    let id = counters.nextId;
    counters.nextId += 1;
    let checkIn : T.StressCheckIn = {
      id;
      date;
      stressLevel;
      sleepHours;
      confidenceLevel;
      createdAt = now;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.StressCheckIn>();
        store.add(userId, l);
        l;
      };
    };
    list.add(checkIn);
    checkIn;
  };

  // ── Tracked Scholarships ─────────────────────────────────────────────────────

  public func listTrackedScholarships(
    store : Map.Map<Common.UserId, List.List<T.ScholarshipTracked>>,
    userId : Common.UserId,
  ) : [T.ScholarshipTracked] {
    switch (store.get(userId)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func addTrackedScholarship(
    store : Map.Map<Common.UserId, List.List<T.ScholarshipTracked>>,
    counters : { var nextId : Nat },
    userId : Common.UserId,
    name : Text,
    deadline : ?Text,
    essayRequired : Bool,
    notes : ?Text,
    now : Common.Timestamp,
  ) : T.ScholarshipTracked {
    let scholarshipId = counters.nextId;
    counters.nextId += 1;
    let tracked : T.ScholarshipTracked = {
      scholarshipId;
      name;
      deadline;
      status = #notStarted;
      essayRequired;
      appliedDate = null;
      notes;
      createdAt = now;
    };
    let list = switch (store.get(userId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.ScholarshipTracked>();
        store.add(userId, l);
        l;
      };
    };
    list.add(tracked);
    tracked;
  };

  public func updateTrackedScholarship(
    store : Map.Map<Common.UserId, List.List<T.ScholarshipTracked>>,
    userId : Common.UserId,
    scholarshipId : Nat,
    status : ?T.ScholarshipTrackedStatus,
    appliedDate : ?Text,
    notes : ?Text,
  ) : ?T.ScholarshipTracked {
    switch (store.get(userId)) {
      case null { null };
      case (?list) {
        var result : ?T.ScholarshipTracked = null;
        list.mapInPlace(func(sc) {
          if (sc.scholarshipId == scholarshipId) {
            let updated : T.ScholarshipTracked = {
              sc with
              status = switch (status) { case (?s) s; case null sc.status };
              appliedDate = switch (appliedDate) { case (?d) ?d; case null sc.appliedDate };
              notes = switch (notes) { case (?n) ?n; case null sc.notes };
            };
            result := ?updated;
            updated;
          } else { sc };
        });
        result;
      };
    };
  };

  public func deleteTrackedScholarship(
    store : Map.Map<Common.UserId, List.List<T.ScholarshipTracked>>,
    userId : Common.UserId,
    scholarshipId : Nat,
  ) : Bool {
    switch (store.get(userId)) {
      case null { false };
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(sc : T.ScholarshipTracked) : Bool { sc.scholarshipId != scholarshipId });
        store.add(userId, filtered);
        filtered.size() < before;
      };
    };
  };
};
