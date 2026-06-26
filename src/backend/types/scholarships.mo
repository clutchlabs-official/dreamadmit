module {
  public type ScholarshipId = Nat;

  public type Scholarship = {
    id : ScholarshipId;
    name : Text;
    amount : Nat;
    deadline : Text;
    eligibilityMajor : ?Text;
    eligibilityMinGpa : ?Float;
    eligibilityMaxGpa : ?Float;
    requiresFinancialNeed : Bool;
    applyLink : Text;
  };

  public type ScholarshipFilter = {
    major : ?Text;
    minGpa : ?Float;
    requiresFinancialNeed : ?Bool;
  };
};
