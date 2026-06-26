import OutCall "mo:caffeineai-http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/ai";
import ProfileTypes "../types/profile";
import AiLib "../lib/ai";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  apiKeyGetter : () -> Text,
) {
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getAiSuggestions(profile : ProfileTypes.StudentProfile) : async Types.AiSuggestion {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildGeminiPrompt(profile);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.parseGeminiResponse(rawResponse);
  };

  public shared ({ caller }) func getCollegeMatchScore(
    collegeId : Nat,
    collegeName : Text,
    profile : ProfileTypes.StudentProfile,
  ) : async Types.AiMatchScore {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildMatchScorePrompt(collegeId, collegeName, profile);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.calculateMatchScore(collegeId, collegeName, profile, rawResponse);
  };

  public shared ({ caller }) func reviewEssay(
    essay : Text,
    collegeName : Text,
  ) : async Types.EssayReview {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildEssayReviewPrompt(essay, collegeName);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.parseEssayReview(rawResponse);
  };

  public shared ({ caller }) func getInterviewQuestions(
    collegeName : Text,
    major : Text,
  ) : async [Types.InterviewQuestion] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildInterviewQuestionsPrompt(collegeName, major);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.parseInterviewQuestions(rawResponse);
  };

  public shared ({ caller }) func submitInterviewAnswer(
    question : Text,
    answer : Text,
    collegeName : Text,
  ) : async Types.InterviewFeedback {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildInterviewFeedbackPrompt(question, answer, collegeName);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    // Parse score from response inline
    let score = switch (AiLib.splitFirst(rawResponse.replace(#text "\\n", "\n"), "SCORE:")) {
      case null 70;
      case (?(_, after)) {
        let line = switch (AiLib.splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
        switch (Nat.fromText(line.trim(#text " "))) {
          case (?n) if (n <= 100) n else 70;
          case null 70;
        };
      };
    };
    let feedbackText = switch (AiLib.splitFirst(rawResponse.replace(#text "\\n", "\n"), "FEEDBACK:")) {
      case null "Good attempt. Keep practicing to refine your answers.";
      case (?(_, after)) {
        let trimmed = after.trim(#text " ");
        if (trimmed.size() > 0) trimmed else "Good attempt. Keep practicing to refine your answers.";
      };
    };
    { question; answer; feedback = feedbackText; score };
  };

  public shared ({ caller }) func getExtracurricularRecommendations(
    profile : ProfileTypes.StudentProfile,
  ) : async [Types.ExtracurricularRecommendation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildExtracurricularPrompt(profile);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.parseExtracurricularRecommendations(rawResponse);
  };

  public shared ({ caller }) func getCourseRecommendations(
    fieldOfStudy : Text,
    subTopic : Text,
  ) : async [Types.CourseRecommendation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let prompt = AiLib.buildCourseRecommendationsPrompt(fieldOfStudy, subTopic);
    let body = AiLib.buildRequestBody(prompt);
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKeyGetter();
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let rawResponse = await OutCall.httpPostRequest(url, headers, body, transform);
    AiLib.parseCourseRecommendations(rawResponse);
  };
};
