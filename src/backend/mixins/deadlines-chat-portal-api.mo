import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import DeadlinesChatLib "../lib/deadlines-chat-portal";
import Types "../types/deadlines-chat-portal";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  deadlinesStore : Map.Map<Common.UserId, [Types.CollegeDeadline]>,
  checklistStore : Map.Map<Common.UserId, [Types.DocumentChecklistItem]>,
  alumniMessagesStore : Map.Map<Nat, List.List<Types.AlumniMessage>>,
  officersStore : Map.Map<Common.UserId, Types.AdmissionOfficer>,
  officerContentStore : Map.Map<Nat, Types.OfficerContent>,
  portalCounters : { var nextMessageId : Nat; var nextContentId : Nat },
) {
  // ─── Deadline Tracker ───────────────────────────────────────────────────────

  public shared ({ caller }) func saveMyDeadlines(deadlines : [Types.CollegeDeadline]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    DeadlinesChatLib.saveDeadlines(deadlinesStore, caller, deadlines);
  };

  public query ({ caller }) func getMyDeadlines() : async [Types.CollegeDeadline] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    DeadlinesChatLib.getDeadlines(deadlinesStore, caller);
  };

  // ─── Document Checklist ──────────────────────────────────────────────────────

  public shared ({ caller }) func saveMyDocumentChecklist(items : [Types.DocumentChecklistItem]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    DeadlinesChatLib.saveDocumentChecklist(checklistStore, caller, items);
  };

  public query ({ caller }) func getMyDocumentChecklist() : async [Types.DocumentChecklistItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    DeadlinesChatLib.getDocumentChecklist(checklistStore, caller);
  };

  // ─── Alumni Chat ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func postAlumniMessage(collegeId : Nat, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let authorName = "Student";
    DeadlinesChatLib.postAlumniMessage(
      alumniMessagesStore,
      portalCounters,
      collegeId,
      caller,
      authorName,
      message,
      Time.now(),
    );
  };

  public query func getAlumniMessages(collegeId : Nat) : async [Types.AlumniMessage] {
    DeadlinesChatLib.getAlumniMessages(alumniMessagesStore, collegeId);
  };

  // ─── Admission Officer Portal ────────────────────────────────────────────────

  public shared ({ caller }) func registerOfficer(collegeId : Nat, name : Text) : async () {
    DeadlinesChatLib.registerOfficer(officersStore, caller, collegeId, name, Time.now());
  };

  public shared ({ caller }) func postOfficerContent(content : Types.OfficerContentInput) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Officer role required");
    };
    DeadlinesChatLib.postOfficerContent(officerContentStore, portalCounters, content, caller, Time.now());
  };

  public query func getOfficerContent(collegeId : Nat) : async [Types.OfficerContent] {
    DeadlinesChatLib.getOfficerContent(officerContentStore, collegeId);
  };

  public query ({ caller }) func getMyOfficerProfile() : async ?Types.AdmissionOfficer {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Officer role required");
    };
    DeadlinesChatLib.getOfficerProfile(officersStore, caller);
  };
};
