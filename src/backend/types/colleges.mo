import Common "common";

module {
  public type CollegeId = Nat;

  public type College = {
    id : CollegeId;
    name : Text;
    location : Text;
    country : Text;
    tuition : Nat;
    acceptanceRate : Float;
    financialAidTier : Common.FinancialAidTier;
    majorsOffered : [Text];
    housingInfo : Text;
    website : Text;
    redditUrl : ?Text;
    discordUrl : ?Text;
  };
};
