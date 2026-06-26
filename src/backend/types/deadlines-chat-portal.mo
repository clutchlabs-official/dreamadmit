module {
  public type DeadlineStatus = {
    #upcoming;
    #completed;
    #missed;
  };

  public type CollegeDeadline = {
    collegeId : Nat;
    collegeName : Text;
    deadlineType : Text;
    dueDate : Int;
    status : DeadlineStatus;
    notes : Text;
  };

  public type DocumentStatus = {
    #notStarted;
    #inProgress;
    #submitted;
    #verified;
  };

  public type DocumentChecklistItem = {
    id : Nat;
    name : Text;
    status : DocumentStatus;
    notes : Text;
    dueDate : ?Int;
  };

  public type AlumniMessage = {
    messageId : Nat;
    collegeId : Nat;
    author : Principal;
    authorName : Text;
    message : Text;
    timestamp : Int;
  };

  public type OfficerContent = {
    id : Nat;
    collegeId : Nat;
    officerId : Principal;
    title : Text;
    body : Text;
    videoUrl : ?Text;
    contentType : OfficerContentType;
    timestamp : Int;
  };

  public type OfficerContentType = {
    #tip;
    #insight;
    #video;
    #announcement;
  };

  public type AdmissionOfficer = {
    principal : Principal;
    collegeId : Nat;
    name : Text;
    registeredAt : Int;
  };

  public type OfficerContentInput = {
    collegeId : Nat;
    title : Text;
    body : Text;
    videoUrl : ?Text;
    contentType : OfficerContentType;
  };
};
