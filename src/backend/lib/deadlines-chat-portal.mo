import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import Types "../types/deadlines-chat-portal";

module {
  public func getDeadlines(
    deadlinesStore : Map.Map<Common.UserId, [Types.CollegeDeadline]>,
    userId : Common.UserId,
  ) : [Types.CollegeDeadline] {
    switch (deadlinesStore.get(userId)) {
      case (?d) d;
      case null [];
    };
  };

  public func saveDeadlines(
    deadlinesStore : Map.Map<Common.UserId, [Types.CollegeDeadline]>,
    userId : Common.UserId,
    deadlines : [Types.CollegeDeadline],
  ) : () {
    deadlinesStore.add(userId, deadlines);
  };

  public func getDocumentChecklist(
    checklistStore : Map.Map<Common.UserId, [Types.DocumentChecklistItem]>,
    userId : Common.UserId,
  ) : [Types.DocumentChecklistItem] {
    switch (checklistStore.get(userId)) {
      case (?items) items;
      case null [];
    };
  };

  public func saveDocumentChecklist(
    checklistStore : Map.Map<Common.UserId, [Types.DocumentChecklistItem]>,
    userId : Common.UserId,
    items : [Types.DocumentChecklistItem],
  ) : () {
    checklistStore.add(userId, items);
  };

  public func getAlumniMessages(
    messagesStore : Map.Map<Nat, List.List<Types.AlumniMessage>>,
    collegeId : Nat,
  ) : [Types.AlumniMessage] {
    switch (messagesStore.get(collegeId)) {
      case (?msgs) msgs.toArray();
      case null [];
    };
  };

  public func postAlumniMessage(
    messagesStore : Map.Map<Nat, List.List<Types.AlumniMessage>>,
    counterState : { var nextMessageId : Nat },
    collegeId : Nat,
    author : Principal,
    authorName : Text,
    message : Text,
    timestamp : Int,
  ) : () {
    let newMsg : Types.AlumniMessage = {
      messageId = counterState.nextMessageId;
      collegeId;
      author;
      authorName;
      message;
      timestamp;
    };
    counterState.nextMessageId += 1;
    let msgs = switch (messagesStore.get(collegeId)) {
      case (?existing) existing;
      case null {
        let fresh = List.empty<Types.AlumniMessage>();
        messagesStore.add(collegeId, fresh);
        fresh;
      };
    };
    msgs.add(newMsg);
  };

  public func registerOfficer(
    officersStore : Map.Map<Common.UserId, Types.AdmissionOfficer>,
    principal : Principal,
    collegeId : Nat,
    name : Text,
    timestamp : Int,
  ) : () {
    let officer : Types.AdmissionOfficer = {
      principal;
      collegeId;
      name;
      registeredAt = timestamp;
    };
    officersStore.add(principal, officer);
  };

  public func getOfficerProfile(
    officersStore : Map.Map<Common.UserId, Types.AdmissionOfficer>,
    principal : Principal,
  ) : ?Types.AdmissionOfficer {
    officersStore.get(principal);
  };

  public func postOfficerContent(
    contentStore : Map.Map<Nat, Types.OfficerContent>,
    counterState : { var nextContentId : Nat },
    input : Types.OfficerContentInput,
    officerId : Principal,
    timestamp : Int,
  ) : Nat {
    let id = counterState.nextContentId;
    counterState.nextContentId += 1;
    let content : Types.OfficerContent = {
      id;
      collegeId = input.collegeId;
      officerId;
      title = input.title;
      body = input.body;
      videoUrl = input.videoUrl;
      contentType = input.contentType;
      timestamp;
    };
    contentStore.add(id, content);
    id;
  };

  public func getOfficerContent(
    contentStore : Map.Map<Nat, Types.OfficerContent>,
    collegeId : Nat,
  ) : [Types.OfficerContent] {
    let results = List.empty<Types.OfficerContent>();
    for ((_, item) in contentStore.entries()) {
      if (item.collegeId == collegeId) {
        results.add(item);
      };
    };
    results.toArray();
  };
};
