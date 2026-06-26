import Debug "mo:core/Debug";
import Types "../types/ai";
import ProfileTypes "../types/profile";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  // Helper: split text on first occurrence of separator, returns ?(before, after) or null
  public func splitFirst(t : Text, sep : Text) : ?(Text, Text) {
    let parts = t.split(#text sep).toArray();
    if (parts.size() < 2) {
      null;
    } else {
      // Rejoin everything after first part as "after" using Array.foldLeft
      let rest = if (parts.size() >= 3) { Array.tabulate(parts.size() - 2, func(idx) { parts[idx + 2] }) } else { [] };
      let after = rest.foldLeft(
        parts[1],
        func(acc, part) { acc # sep # part }
      );
      ?(parts[0], after);
    };
  };

  // Extract a section from text between a label and the next label (or end)
  // Labels to look for as section terminators
  func extractSection(t : Text, sectionLabel : Text) : [Text] {
    let upperLabel = sectionLabel # ":";
    switch (splitFirst(t, upperLabel)) {
      case null [];
      case (?(_, afterLabel)) {
        // Take content until the next known section label or end
        let sectionContent = switch (splitFirst(afterLabel, "\nBRAINSTORMING:")) {
          case (?(before, _)) before;
          case null (switch (splitFirst(afterLabel, "\nTALKING POINTS:")) {
            case (?(before, _)) before;
            case null (switch (splitFirst(afterLabel, "\nACTIONABLE ADVICE:")) {
              case (?(before, _)) before;
              case null (switch (splitFirst(afterLabel, "\nTARGET SCORES:")) {
                case (?(before, _)) before;
                case null afterLabel;
              });
            });
          });
        };
        // Split by newline and filter/trim each line
        let rawLines = sectionContent.split(#text "\n").toArray();
        let mapped = rawLines.map(
          func(line) {
            let trimmed = line.trim(#text " ");
            // Remove common bullet prefixes
            let noBullet = if (trimmed.startsWith(#text "- ")) {
              trimmed.replace(#text "- ", "");
            } else if (trimmed.startsWith(#text "* ")) {
              trimmed.replace(#text "* ", "");
            } else if (trimmed.startsWith(#text "\u{2022} ")) {
              trimmed.replace(#text "\u{2022} ", "");
            } else {
              trimmed;
            };
            noBullet.trim(#text " ");
          }
        );
        mapped.filter<Text>(
          func(line) {
            line.size() > 0 and
            not (line == upperLabel) and
            not (line == sectionLabel) and
            not (line == "BRAINSTORMING:") and
            not (line == "TALKING POINTS:") and
            not (line == "ACTIONABLE ADVICE:") and
            not (line == "TARGET SCORES:");
          }
        );
      };
    };
  };

  public func buildGeminiPrompt(
    profile : ProfileTypes.StudentProfile,
  ) : Text {
    let gpaText = switch (profile.gpa) {
      case null "GPA: Not provided";
      case (?g) "GPA: " # g.toText();
    };
    let satText = switch (profile.satScore) {
      case null "SAT Score: Not provided";
      case (?s) "SAT Score: " # s.toText();
    };
    let actText = switch (profile.actScore) {
      case null "ACT Score: Not provided";
      case (?a) "ACT Score: " # a.toText();
    };
    let aidText = switch (profile.financialAidPreference) {
      case (#none) "Financial Aid: Not needed";
      case (#half) "Financial Aid: Partial aid needed";
      case (#full) "Financial Aid: Full financial aid needed";
    };
    let ecText = if (profile.extracurriculars.size() == 0) {
      "Extracurriculars: None listed";
    } else {
      "Extracurriculars: " # profile.extracurriculars.values().join(", ");
    };
    let weText = if (profile.workExperience.size() == 0) {
      "Work Experience: None listed";
    } else {
      "Work Experience: " # profile.workExperience.values().join(", ");
    };
    let scoresNeeded = profile.gpa == null or profile.satScore == null or profile.actScore == null;
    let scoreInstr = if (scoresNeeded) {
      "provide specific target score ranges for GPA, SAT, and/or ACT based on the dream college.";
    } else {
      "confirm if scores are competitive or suggest improvements.";
    };

    // Country-specific guidance block
    let countryGuidance = if (profile.studyCountry == "" or profile.studyCountry == "US") {
      "";
    } else {
      let visaInfo = if (profile.studyCountry == "UK") {
        "Visa: UK Student visa (Tier 4). You need a Confirmation of Acceptance for Studies (CAS) from your university. Apply online via gov.uk. Process takes ~3 weeks.";
      } else if (profile.studyCountry == "Canada") {
        "Visa: Canadian Study Permit. Apply through IRCC. You will also need a Letter of Acceptance and proof of funds. WES credential evaluation is required for most universities.";
      } else if (profile.studyCountry == "Australia") {
        "Visa: Australian Student visa (subclass 500). Apply through ImmiAccount. Requires Confirmation of Enrolment (CoE) and proof of financial capacity.";
      } else if (profile.studyCountry == "India") {
        "Visa: Indian Student visa (X-1 category). Apply at the Indian High Commission/Consulate with acceptance letter, financial proof, and health certificate.";
      } else if (profile.studyCountry == "Germany") {
        "Visa: German Student visa (National Visa – Type D). You must open a blocked account (Sperrkonto) with approximately €11,208/year as proof of funds. Apply at a German consulate.";
      } else if (profile.studyCountry == "France") {
        "Visa: French Long-Stay Student visa (VLS-TS étudiant). Apply through Campus France for non-EU students. The process involves a Campus France interview in your home country.";
      } else if (profile.studyCountry == "Japan") {
        "Visa: Japanese Student visa. Your university will act as your sponsor and submit a Certificate of Eligibility (CoE) on your behalf. Apply at a Japanese consulate/embassy with the CoE.";
      } else if (profile.studyCountry == "Singapore") {
        "Visa: Singapore Student Pass. Your university applies for an In-Principal Approval (IPA) on your behalf. You must complete the SOLAR e-Service within 2 weeks of arrival.";
      } else if (profile.studyCountry == "UAE") {
        "Visa: UAE Student visa sponsored by your university. The institution handles the visa application process. Typically requires a valid passport, acceptance letter, and medical fitness certificate.";
      } else {
        "Visa: Check the official immigration authority website for " # profile.studyCountry # " for current student visa requirements.";
      };

      let langInfo = if (profile.studyCountry == "UK" or profile.studyCountry == "Australia" or profile.studyCountry == "Singapore" or profile.studyCountry == "UAE") {
        "Language Requirements: IELTS Academic 6.5+ (or TOEFL iBT 90+) required by most universities. Top institutions may require IELTS 7.0+.";
      } else if (profile.studyCountry == "Canada") {
        "Language Requirements: IELTS Academic 6.5+ or TOEFL iBT 90+ for English-language programs. French-taught programs at McGill or Université de Montréal may require DELF/DALF.";
      } else if (profile.studyCountry == "Germany") {
        "Language Requirements: English-taught programs typically require IELTS 6.5+ or TOEFL iBT 88+. German-taught programs require TestDaF TDN 4 or DSH-2 certificate.";
      } else if (profile.studyCountry == "France") {
        "Language Requirements: French-taught programs require DELF B2 or TCF. English-taught programs (e.g. at HEC, Sciences Po) require IELTS 6.5+ or TOEFL iBT 90+.";
      } else if (profile.studyCountry == "Japan") {
        "Language Requirements: Japanese-taught programs require JLPT N2 or N1. English-taught programs (rare but growing) require IELTS 6.5+ or TOEFL iBT 79+.";
      } else if (profile.studyCountry == "India") {
        "Language Requirements: Most programs are taught in English. Some universities may require IELTS or TOEFL for non-native English speakers applying from abroad.";
      } else {
        "Language Requirements: Check with the specific university for English/local language proficiency requirements.";
      };

      let timelineInfo = if (profile.studyCountry == "UK") {
        "Application Timeline: Apply through UCAS (ucas.com). Equal Consideration deadline: January 31. Oxford/Cambridge deadline: October 15. Results released in March–May.";
      } else if (profile.studyCountry == "Canada") {
        "Application Timeline: Applications open September–November for January and September starts. WES credential evaluation takes 7–20 business days and must be done in advance.";
      } else if (profile.studyCountry == "Australia") {
        "Application Timeline: Semester 1 (February) intake: applications July–November. Semester 2 (July) intake: applications January–April. Earlier is better for scholarships.";
      } else if (profile.studyCountry == "India") {
        "Application Timeline: IIT admissions via JEE Main and JEE Advanced (April–June). Central University admissions through CUET exam (May–July). Private university applications open January–May.";
      } else if (profile.studyCountry == "Germany") {
        "Application Timeline: Winter semester (October) intake: apply by July 15. Summer semester (April) intake: apply by January 15. Apply early — visa and blocked account processing takes 8–12 weeks.";
      } else if (profile.studyCountry == "France") {
        "Application Timeline: September intake (main). Apply through Parcoursup for public universities (January–March). Grandes Écoles have their own competitive entrance exams.";
      } else if (profile.studyCountry == "Japan") {
        "Application Timeline: April intake (main) — apply October–December. October intake (some universities) — apply April–June. Entrance exams or screening required.";
      } else if (profile.studyCountry == "Singapore") {
        "Application Timeline: NUS and NTU open applications in October–March for August intake. SAT/ACT scores, academic transcripts, and personal statements required.";
      } else if (profile.studyCountry == "UAE") {
        "Application Timeline: Fall intake (September): apply January–June. Spring intake (January): apply August–November. NYUAD has an early decision cycle in November.";
      } else {
        "Application Timeline: Check the university's official website for current application windows and deadlines.";
      };

      let costInfo = if (profile.studyCountry == "UK") {
        "Cost of Living: London ~£1,200–£1,800/month; other cities £800–£1,200/month. Budget for NHS surcharge (~£470/year) on your student visa.";
      } else if (profile.studyCountry == "Canada") {
        "Cost of Living: Toronto/Vancouver ~CAD 2,000–2,800/month; Montreal ~CAD 1,500–2,000/month. Health insurance is typically mandatory and costs ~CAD 600–900/year.";
      } else if (profile.studyCountry == "Australia") {
        "Cost of Living: Sydney/Melbourne ~AUD 2,000–2,800/month; other cities ~AUD 1,500–2,000/month. Overseas Student Health Cover (OSHC) required, ~AUD 600–700/year.";
      } else if (profile.studyCountry == "India") {
        "Cost of Living: Bangalore/Mumbai ~INR 25,000–40,000/month; smaller cities INR 15,000–25,000/month. Extremely affordable for international students by global standards.";
      } else if (profile.studyCountry == "Germany") {
        "Cost of Living: Munich ~€1,200–1,600/month; Berlin €900–1,200/month. Statutory student health insurance ~€110/month. Public universities charge minimal semester fees (€150–400).";
      } else if (profile.studyCountry == "France") {
        "Cost of Living: Paris ~€1,200–1,800/month; other cities €700–1,000/month. CAF housing assistance available for students. Student meal subsidies at university restaurants (CROUS).";
      } else if (profile.studyCountry == "Japan") {
        "Cost of Living: Tokyo ~JPY 130,000–200,000/month; Kyoto/Osaka ~JPY 80,000–130,000/month. National Health Insurance ~JPY 2,000–3,000/month for students.";
      } else if (profile.studyCountry == "Singapore") {
        "Cost of Living: ~SGD 1,500–2,500/month including rent. Subsidised tuition for NUS/NTU with a tuition grant (requires working in Singapore for 3 years post-graduation).";
      } else if (profile.studyCountry == "UAE") {
        "Cost of Living: Dubai/Abu Dhabi ~AED 5,000–8,000/month. No income tax. Many universities offer on-campus housing which reduces costs significantly.";
      } else {
        "Cost of Living: Research the specific city's cost index. Factor in accommodation, food, transport, and health insurance.";
      };

      let admissionInfo = if (profile.studyCountry == "UK") {
        "Admission Requirements: Personal statement (4,000 characters via UCAS), predicted A-Level/IB grades, two academic references. No standardised tests like SAT/ACT required by most UK universities.";
      } else if (profile.studyCountry == "Canada") {
        "Admission Requirements: High school transcripts, personal statement/essays, letters of recommendation. Some programs require SAT/ACT. WES evaluation needed for foreign credentials.";
      } else if (profile.studyCountry == "Australia") {
        "Admission Requirements: ATAR (Australian Tertiary Admission Rank) equivalent or IB/A-Level scores. Some universities accept SAT/ACT. Portfolio required for creative arts.";
      } else if (profile.studyCountry == "India") {
        "Admission Requirements: IITs require JEE Advanced (extremely competitive, ~0.1% acceptance). Central Universities use CUET. Private universities accept Class 12 board scores, often with their own entrance tests.";
      } else if (profile.studyCountry == "Germany") {
        "Admission Requirements: Abitur or equivalent. Blocked account proof. Some programs require APS certificate (academic evaluation for applicants from certain countries including India, China, Vietnam).";
      } else if (profile.studyCountry == "France") {
        "Admission Requirements: Baccalauréat equivalent. Grandes Écoles require passing competitive entrance exams (concours) — among the hardest in the world. Campus France registration mandatory.";
      } else if (profile.studyCountry == "Japan") {
        "Admission Requirements: Examination for Japanese University Admission for International Students (EJU) for some universities. Others accept SAT/ACT or IB Diploma. Interview may be required.";
      } else if (profile.studyCountry == "Singapore") {
        "Admission Requirements: NUS/NTU accept A-Levels, IB, SAT, or ACT. Strong academic record, co-curricular activities, and interview/aptitude tests are required.";
      } else if (profile.studyCountry == "UAE") {
        "Admission Requirements: High school certificate (with minimum grades), English proficiency, EmSAT score (for UAE applicants) or SAT/ACT, and sometimes an interview.";
      } else {
        "Admission Requirements: Check the specific university's international student admissions page for credential evaluation and test requirements.";
      };

      "\n\nINTERNATIONAL STUDY CONTEXT (" # profile.studyCountry # "):\n" #
      visaInfo # "\n" #
      langInfo # "\n" #
      timelineInfo # "\n" #
      costInfo # "\n" #
      admissionInfo;
    };

    "You are a college admissions counselor. Based on the following student profile, provide specific, actionable college admissions guidance.\n\n" #
    "Student Profile:\n" #
    "Dream College: " # profile.dreamCollege # "\n" #
    "Intended Major: " # profile.intendedMajor # "\n" #
    "Study Country: " # (if (profile.studyCountry == "") "US (default)" else profile.studyCountry) # "\n" #
    "Number of AP/IB Courses: " # profile.numberOfCourses.toText() # "\n" #
    gpaText # "\n" #
    satText # "\n" #
    actText # "\n" #
    aidText # "\n" #
    ecText # "\n" #
    weText # "\n" #
    countryGuidance # "\n\n" #
    "Please respond with EXACTLY these four labeled sections (use these exact labels):\n\n" #
    "BRAINSTORMING:\n" #
    "- [3-5 unique essay angles or personal story hooks]\n\n" #
    "TALKING POINTS:\n" #
    "- [3-4 key strengths or themes to highlight]\n\n" #
    "ACTIONABLE ADVICE:\n" #
    "- [3-5 specific steps to strengthen the application, including country-specific steps if applicable]\n\n" #
    "TARGET SCORES:\n" #
    "- [" # scoreInstr # "]\n";
  };

  public func buildRequestBody(
    prompt : Text,
  ) : Text {
    let escapedPrompt = prompt.replace(#text "\"", "\\\"");
    let escapedPrompt2 = escapedPrompt.replace(#text "\n", "\\n");
    "{\"contents\":[{\"parts\":[{\"text\":\"" # escapedPrompt2 # "\"}]}]}";
  };

  public func parseGeminiResponse(
    rawJson : Text,
  ) : Types.AiSuggestion {
    let fallback : Types.AiSuggestion = {
      brainstormingIdeas = [
        "Focus on a unique personal story that showcases your growth",
        "Explore how your background shaped your academic interests",
        "Highlight a challenge you overcame and lessons learned",
      ];
      talkingPoints = [
        "Academic achievements and intellectual curiosity",
        "Leadership and community involvement",
        "Passion for your intended major",
      ];
      actionableAdvice = [
        "Visit campus or attend virtual info sessions",
        "Connect with current students or alumni",
        "Strengthen your extracurricular narrative",
      ];
      targetScoreSuggestions = [
        "Research median GPA and test scores for your dream college",
        "Consider test prep resources if scores need improvement",
      ];
    };

    // Extract the text content from the Gemini JSON response
    // Gemini returns: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
    // Split on "text":" to get the content
    let textMarker = "\"text\":\"";
    let responseText = switch (splitFirst(rawJson, textMarker)) {
      case null "";
      case (?(_, after)) {
        // The text value ends at an unescaped quote followed by } or ,
        // We unescape \n sequences to get real newlines for section parsing
        let unescaped = after.replace(#text "\\n", "\n");
        // Take up to the closing marker pattern
        switch (splitFirst(unescaped, "\"}")) {
          case (?(content, _)) content;
          case null unescaped;
        };
      };
    };

    if (responseText.size() == 0) {
      return fallback;
    };

    let ideas = extractSection(responseText, "BRAINSTORMING");
    let points = extractSection(responseText, "TALKING POINTS");
    let advice = extractSection(responseText, "ACTIONABLE ADVICE");
    let scores = extractSection(responseText, "TARGET SCORES");

    if (ideas.size() == 0 and points.size() == 0 and advice.size() == 0) {
      fallback;
    } else {
      {
        brainstormingIdeas = if (ideas.size() > 0) ideas else fallback.brainstormingIdeas;
        talkingPoints = if (points.size() > 0) points else fallback.talkingPoints;
        actionableAdvice = if (advice.size() > 0) advice else fallback.actionableAdvice;
        targetScoreSuggestions = if (scores.size() > 0) scores else fallback.targetScoreSuggestions;
      };
    };
  };

  public func calculateMatchScore(
    collegeId : Nat,
    collegeName : Text,
    _profile : ProfileTypes.StudentProfile,
    responseText : Text,
  ) : Types.AiMatchScore {
    // Parse score from response: look for a number between 0-100
    let fallbackScore : Float = 50.0;
    let fallbackReasoning = "Match score calculated based on your academic profile and " # collegeName # "'s admission requirements.";

    // Try to extract a numeric score from the AI response
    let score : Float = if (responseText.size() == 0) {
      fallbackScore;
    } else {
      // Look for pattern like "Score: 75" or "75/100" or just a number in first 100 chars
      let snippet = if (responseText.size() > 200) {
        // take first 200 chars as text slice via split trick
        let parts = responseText.split(#text "\n").toArray();
        if (parts.size() > 0) parts[0] else responseText;
      } else { responseText };

      // Attempt to find a percentage by scanning for digit sequences
      let chars = snippet.toArray();
      var numStr = "";
      var found = false;
      var i = 0;
      label scan for (c in chars.values()) {
        if (c >= '0' and c <= '9') {
          numStr := numStr # Text.fromChar(c);
          found := true;
        } else if (found and numStr.size() > 0) {
          break scan;
        };
        i += 1;
      };
      if (numStr.size() > 0) {
        switch (Nat.fromText(numStr)) {
          case (?n) {
            let f = (n : Int).toFloat();
            if (f >= 0.0 and f <= 100.0) f else fallbackScore;
          };
          case null fallbackScore;
        };
      } else { fallbackScore };
    };

    // Extract reasoning from response or build one
    let reasoning = if (responseText.size() > 0) {
      let cleaned = responseText.replace(#text "\n", " ");
      if (cleaned.size() > 300) {
        let parts = cleaned.split(#text ". ").toArray();
        if (parts.size() > 0) parts[0] # "." else fallbackReasoning;
      } else { cleaned };
    } else { fallbackReasoning };

    { collegeId; score; reasoning };
  };

  public func buildMatchScorePrompt(
    collegeId : Nat,
    collegeName : Text,
    profile : ProfileTypes.StudentProfile,
  ) : Text {
    ignore collegeId;
    let gpaText = switch (profile.gpa) {
      case null "GPA: Not provided";
      case (?g) "GPA: " # g.toText();
    };
    let satText = switch (profile.satScore) {
      case null "SAT: Not provided";
      case (?s) "SAT: " # s.toText();
    };
    let actText = switch (profile.actScore) {
      case null "ACT: Not provided";
      case (?a) "ACT: " # a.toText();
    };
    "You are a college admissions expert. Rate this student's likelihood of admission to " # collegeName # " on a scale of 0-100.\n\n" #
    "Student Profile:\n" #
    "Major: " # profile.intendedMajor # "\n" #
    gpaText # "\n" #
    satText # "\n" #
    actText # "\n" #
    "Extracurriculars: " # (if (profile.extracurriculars.size() > 0) profile.extracurriculars.values().join(", ") else "None") # "\n\n" #
    "Respond with ONLY: Score: [0-100]\nReasoning: [one sentence explaining the score]";
  };

  public func buildEssayReviewPrompt(essay : Text, collegeName : Text) : Text {
    "You are an expert college admissions essay reviewer. Evaluate the following application essay for " # collegeName # ".\n\n" #
    "Essay:\n" # essay # "\n\n" #
    "Respond with EXACTLY these labeled sections:\n" #
    "GRADE: [A+/A/A-/B+/B/B-/C or lower]\n" #
    "SCORE: [0-100]\n" #
    "FEEDBACK: [2-3 sentence overall assessment]\n" #
    "STRENGTHS:\n- [strength 1]\n- [strength 2]\n- [strength 3]\n" #
    "IMPROVEMENTS:\n- [improvement 1]\n- [improvement 2]\n- [improvement 3]";
  };

  public func parseEssayReview(responseText : Text) : Types.EssayReview {
    let fallback : Types.EssayReview = {
      grade = "B";
      overallScore = 70;
      feedback = "Your essay shows promise. Focus on making your personal voice stronger and connecting your experiences to your future goals.";
      strengths = ["Clear writing style", "Relevant topic choice", "Shows self-awareness"];
      improvements = ["Add more specific details", "Strengthen the conclusion", "Show more personality"];
    };
    if (responseText.size() == 0) { return fallback };

    let unescaped = responseText.replace(#text "\\n", "\n");

    let grade = switch (splitFirst(unescaped, "GRADE:")) {
      case null fallback.grade;
      case (?(_, after)) {
        let line = switch (splitFirst(after, "\n")) {
          case (?(l, _)) l;
          case null after;
        };
        let trimmed = line.trim(#text " ");
        if (trimmed.size() > 0 and trimmed.size() <= 3) trimmed else fallback.grade;
      };
    };

    let overallScore = switch (splitFirst(unescaped, "SCORE:")) {
      case null fallback.overallScore;
      case (?(_, after)) {
        let line = switch (splitFirst(after, "\n")) {
          case (?(l, _)) l;
          case null after;
        };
        let trimmed = line.trim(#text " ");
        switch (Nat.fromText(trimmed)) {
          case (?n) if (n <= 100) n else fallback.overallScore;
          case null fallback.overallScore;
        };
      };
    };

    let feedback = switch (splitFirst(unescaped, "FEEDBACK:")) {
      case null fallback.feedback;
      case (?(_, after)) {
        let content = switch (splitFirst(after, "\nSTRENGTHS:")) {
          case (?(before, _)) before;
          case null (switch (splitFirst(after, "\nIMPROVEMENTS:")) {
            case (?(before, _)) before;
            case null after;
          });
        };
        let trimmed = content.trim(#text " ");
        if (trimmed.size() > 0) trimmed else fallback.feedback;
      };
    };

    let strengths = extractSection(unescaped, "STRENGTHS");
    let improvements = extractSection(unescaped, "IMPROVEMENTS");

    {
      grade;
      overallScore;
      feedback;
      strengths = if (strengths.size() > 0) strengths else fallback.strengths;
      improvements = if (improvements.size() > 0) improvements else fallback.improvements;
    };
  };

  public func buildInterviewQuestionsPrompt(collegeName : Text, major : Text) : Text {
    "You are a college admissions interviewer at " # collegeName # ". Generate 5 interview questions for a student applying for " # major # ".\n\n" #
    "Respond with EXACTLY this format for each question:\n" #
    "QUESTION: [question text]\n" #
    "CATEGORY: [Academic/Personal/Motivation/Goals/Character]\n" #
    "---\n" #
    "Provide exactly 5 questions in this format.";
  };

  public func parseInterviewQuestions(responseText : Text) : [Types.InterviewQuestion] {
    let fallback : [Types.InterviewQuestion] = [
      { question = "Why do you want to attend this college?"; category = "Motivation" },
      { question = "What are your academic strengths and weaknesses?"; category = "Academic" },
      { question = "Describe a challenge you overcame and what you learned."; category = "Character" },
      { question = "Where do you see yourself in 10 years?"; category = "Goals" },
      { question = "What makes you unique as an applicant?"; category = "Personal" },
    ];
    if (responseText.size() == 0) { return fallback };

    let unescaped = responseText.replace(#text "\\n", "\n");
    // Split by separator "---"
    let blocks = unescaped.split(#text "---").toArray();
    let questions = List.empty<Types.InterviewQuestion>();
    for (block in blocks.values()) {
      let q = switch (splitFirst(block, "QUESTION:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) {
            case (?(l, _)) l;
            case null after;
          };
          line.trim(#text " ");
        };
      };
      let cat = switch (splitFirst(block, "CATEGORY:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) {
            case (?(l, _)) l;
            case null after;
          };
          line.trim(#text " ");
        };
      };
      if (q.size() > 0) {
        questions.add({ question = q; category = if (cat.size() > 0) cat else "General" });
      };
    };
    if (questions.size() == 0) fallback else questions.toArray();
  };

  public func buildInterviewFeedbackPrompt(
    question : Text,
    answer : Text,
    collegeName : Text,
  ) : Text {
    "You are a college admissions interviewer at " # collegeName # ". Evaluate this interview answer.\n\n" #
    "Question: " # question # "\n" #
    "Student Answer: " # answer # "\n\n" #
    "Respond with EXACTLY:\n" #
    "SCORE: [0-100]\n" #
    "FEEDBACK: [2-3 sentence constructive feedback]";
  };

  public func parseInterviewFeedback(responseText : Text) : Types.InterviewFeedback {
    ignore responseText;
    // This is called with the full question+answer context; parsing handled in mixin
    // Return a placeholder — actual parsing done inline in mixin after outcall
    {
      question = "";
      answer = "";
      feedback = "";
      score = 0;
    };
  };

  public func buildExtracurricularPrompt(profile : ProfileTypes.StudentProfile) : Text {
    let ecText = if (profile.extracurriculars.size() > 0) {
      profile.extracurriculars.values().join(", ");
    } else { "None" };
    "You are a college admissions counselor. Recommend 4-5 extracurricular activities for a student with this profile.\n\n" #
    "Student Profile:\n" #
    "Major: " # profile.intendedMajor # "\n" #
    "Dream College: " # profile.dreamCollege # "\n" #
    "Current Extracurriculars: " # ecText # "\n\n" #
    "Respond with EXACTLY this format for each recommendation:\n" #
    "ACTIVITY: [activity name]\n" #
    "REASON: [why it fits this student]\n" #
    "IMPACT: [how it will strengthen the application]\n" #
    "---\n" #
    "Provide 4-5 recommendations.";
  };

  public func parseExtracurricularRecommendations(responseText : Text) : [Types.ExtracurricularRecommendation] {
    let fallback : [Types.ExtracurricularRecommendation] = [
      { activity = "Research internship or university lab program"; reason = "Demonstrates academic initiative"; impact = "Shows college-level curiosity and work ethic" },
      { activity = "Community service or volunteering"; reason = "Builds leadership and empathy"; impact = "Rounds out your profile with civic engagement" },
      { activity = "Subject-relevant club (e.g. Science/Math Olympiad)"; reason = "Deepens knowledge in your intended major"; impact = "Provides competition credentials" },
    ];
    if (responseText.size() == 0) { return fallback };

    let unescaped = responseText.replace(#text "\\n", "\n");
    let blocks = unescaped.split(#text "---").toArray();
    let recs = List.empty<Types.ExtracurricularRecommendation>();
    for (block in blocks.values()) {
      let activity = switch (splitFirst(block, "ACTIVITY:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      let reason = switch (splitFirst(block, "REASON:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      let impact = switch (splitFirst(block, "IMPACT:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      if (activity.size() > 0) {
        recs.add({ activity; reason = if (reason.size() > 0) reason else "Relevant to your profile"; impact = if (impact.size() > 0) impact else "Strengthens your application" });
      };
    };
    if (recs.size() == 0) fallback else recs.toArray();
  };

  public func buildCourseRecommendationsPrompt(fieldOfStudy : Text, subTopic : Text) : Text {
    "You are an academic advisor. Recommend 5 specific courses for a student interested in " # fieldOfStudy # " with a focus on " # subTopic # ".\n\n" #
    "Respond with EXACTLY this format for each course:\n" #
    "COURSE: [course name]\n" #
    "DESCRIPTION: [1 sentence description]\n" #
    "PROVIDER: [e.g. Coursera, MIT OpenCourseWare, edX, Khan Academy]\n" #
    "LEVEL: [Beginner/Intermediate/Advanced]\n" #
    "---\n" #
    "Provide exactly 5 courses.";
  };

  public func parseCourseRecommendations(responseText : Text) : [Types.CourseRecommendation] {
    let fallback : [Types.CourseRecommendation] = [
      { fieldOfStudy = "General"; subTopic = "Foundations"; courseName = "Introduction to the Field"; description = "A foundational survey course"; provider = "Coursera"; level = "Beginner" },
      { fieldOfStudy = "General"; subTopic = "Core Skills"; courseName = "Core Concepts and Methods"; description = "Covers essential tools and techniques"; provider = "edX"; level = "Intermediate" },
    ];
    if (responseText.size() == 0) { return fallback };

    let unescaped = responseText.replace(#text "\\n", "\n");
    let blocks = unescaped.split(#text "---").toArray();
    let courses = List.empty<Types.CourseRecommendation>();
    for (block in blocks.values()) {
      let courseName = switch (splitFirst(block, "COURSE:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      let description = switch (splitFirst(block, "DESCRIPTION:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      let provider = switch (splitFirst(block, "PROVIDER:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      let level = switch (splitFirst(block, "LEVEL:")) {
        case null "";
        case (?(_, after)) {
          let line = switch (splitFirst(after, "\n")) { case (?(l, _)) l; case null after };
          line.trim(#text " ");
        };
      };
      if (courseName.size() > 0) {
        courses.add({
          fieldOfStudy = "General";
          subTopic = "General";
          courseName;
          description = if (description.size() > 0) description else "";
          provider = if (provider.size() > 0) provider else "Online";
          level = if (level.size() > 0) level else "Intermediate";
        });
      };
    };
    if (courses.size() == 0) fallback else courses.toArray();
  };
};
