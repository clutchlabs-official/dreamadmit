import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/scholarships";
import Common "../types/common";
import ScholarshipsLib "../lib/scholarships";

mixin (
  accessControlState : AccessControl.AccessControlState,
  scholarships : List.List<Types.Scholarship>,
  shortlists : Map.Map<Common.UserId, [Types.ScholarshipId]>,
) {
  public query func getScholarships() : async [Types.Scholarship] {
    ScholarshipsLib.getAllScholarships(scholarships);
  };

  public query func queryScholarships(filter : Types.ScholarshipFilter) : async [Types.Scholarship] {
    ScholarshipsLib.queryScholarships(scholarships, filter);
  };

  public query ({ caller }) func getMyScholarshipShortlist() : async [Types.ScholarshipId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    ScholarshipsLib.getShortlist(shortlists, caller);
  };

  public shared ({ caller }) func saveMyScholarshipShortlist(ids : [Types.ScholarshipId]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    ScholarshipsLib.saveShortlist(shortlists, caller, ids);
  };
};
