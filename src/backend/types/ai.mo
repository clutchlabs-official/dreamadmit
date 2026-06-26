module {
  public type AiSuggestion = {
    brainstormingIdeas : [Text];
    talkingPoints : [Text];
    actionableAdvice : [Text];
    targetScoreSuggestions : [Text];
  };

  public type AiMatchScore = {
    collegeId : Nat;
    score : Float;
    reasoning : Text;
  };

  public type EssayReview = {
    grade : Text;
    overallScore : Nat;
    feedback : Text;
    strengths : [Text];
    improvements : [Text];
  };

  public type InterviewQuestion = {
    question : Text;
    category : Text;
  };

  public type InterviewFeedback = {
    question : Text;
    answer : Text;
    feedback : Text;
    score : Nat;
  };

  public type ExtracurricularRecommendation = {
    activity : Text;
    reason : Text;
    impact : Text;
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
