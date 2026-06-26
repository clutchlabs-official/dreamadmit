import Common "common";

module {
  public type Award = {
    title : Text;
    description : Text;
  };

  public type StudentProfile = {
    gpa : ?Float;
    weightedGpa : ?Float;
    gpaType : Common.GpaType;
    satScore : ?Nat;
    actScore : ?Nat;
    extracurriculars : [Text];
    workExperience : [Text];
    intendedMajor : Text;
    numberOfCourses : Nat;
    dreamCollege : Text;
    financialAidPreference : Common.FinancialAidPreference;
    studyCountry : Text;
    awards : [Award];
  };

  public type CollegeDeadline = {
    collegeId : Nat;
    collegeName : Text;
    deadlineType : Text;
    deadline : Text;
    notes : Text;
  };

  public type DocumentChecklistItem = {
    collegeId : Nat;
    docType : Text;
    submitted : Bool;
  };

  public type AlumniMessage = {
    collegeId : Nat;
    senderName : Text;
    message : Text;
    timestamp : Int;
  };

  public type AdmissionOfficer = {
    id : Principal;
    collegeId : Nat;
    name : Text;
    role : Text;
  };

  public type OfficerContent = {
    id : Nat;
    collegeId : Nat;
    officerId : Principal;
    contentType : { #tip; #video; #insight };
    title : Text;
    body : Text;
    videoUrl : ?Text;
    createdAt : Int;
  };

  public type CourseRecommendation = {
    fieldOfStudy : Text;
    subTopic : Text;
    courseName : Text;
    description : Text;
    provider : Text;
    level : Text;
  };
};
