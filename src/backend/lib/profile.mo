import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/profile";
import Common "../types/common";

module {
  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.StudentProfile>,
    caller : Principal,
  ) : ?Types.StudentProfile {
    profiles.get(caller);
  };

  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.StudentProfile>,
    caller : Principal,
    profile : Types.StudentProfile,
  ) : () {
    profiles.add(caller, profile);
  };
};
