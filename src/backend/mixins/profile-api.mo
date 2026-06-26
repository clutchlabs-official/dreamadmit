import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProfileLib "../lib/profile";
import Types "../types/profile";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, Types.StudentProfile>,
) {
  public query ({ caller }) func getStudentProfile() : async ?Types.StudentProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    ProfileLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveStudentProfile(profile : Types.StudentProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    ProfileLib.saveProfile(userProfiles, caller, profile);
  };
};
