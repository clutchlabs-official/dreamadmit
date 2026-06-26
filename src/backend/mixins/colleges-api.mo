import List "mo:core/List";
import Types "../types/colleges";
import Common "../types/common";
import CollegesLib "../lib/colleges";

mixin (
  colleges : List.List<Types.College>,
) {
  public query func getColleges() : async [Types.College] {
    CollegesLib.getAllColleges(colleges);
  };

  public query func getCollegesByFinancialAid(tier : Common.FinancialAidTier) : async [Types.College] {
    CollegesLib.queryCollegesByFinancialAid(colleges, tier);
  };

  public query func getCollegesByCountry(country : Text) : async [Types.College] {
    CollegesLib.queryCollegesByCountry(colleges, country);
  };
};
