import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/scholarships";
import Common "../types/common";

module {
  public func getAllScholarships(
    scholarships : List.List<Types.Scholarship>,
  ) : [Types.Scholarship] {
    scholarships.toArray();
  };

  public func queryScholarships(
    scholarships : List.List<Types.Scholarship>,
    filter : Types.ScholarshipFilter,
  ) : [Types.Scholarship] {
    scholarships.toArray().filter(func(s : Types.Scholarship) : Bool {
      let majorOk = switch (filter.major) {
        case null true;
        case (?m) {
          switch (s.eligibilityMajor) {
            case null true;
            case (?em) em == m;
          };
        };
      };
      let gpaOk = switch (filter.minGpa) {
        case null true;
        case (?fg) {
          switch (s.eligibilityMinGpa) {
            case null true;
            case (?sg) fg >= sg;
          };
        };
      };
      let aidOk = switch (filter.requiresFinancialNeed) {
        case null true;
        case (?need) s.requiresFinancialNeed == need;
      };
      majorOk and gpaOk and aidOk;
    });
  };

  public func getShortlist(
    shortlists : Map.Map<Common.UserId, [Types.ScholarshipId]>,
    caller : Principal,
  ) : [Types.ScholarshipId] {
    switch (shortlists.get(caller)) {
      case (?ids) ids;
      case null [];
    };
  };

  public func saveShortlist(
    shortlists : Map.Map<Common.UserId, [Types.ScholarshipId]>,
    caller : Principal,
    ids : [Types.ScholarshipId],
  ) : () {
    shortlists.add(caller, ids);
  };

  public func seedScholarships(
    scholarships : List.List<Types.Scholarship>,
  ) : () {
    let data : [(Nat, Text, Nat, Text, ?Text, ?Float, ?Float, Bool, Text)] = [
      (1, "Gates Scholarship", 20000, "Jan 15", null, ?3.3, null, true, "https://gatesfoundation.org/ideas/gates-scholarship"),
      (2, "Coca-Cola Scholars Program", 20000, "Oct 31", null, ?3.0, null, false, "https://coca-colascholarsfoundation.org"),
      (3, "Questbridge National College Match", 10000, "Sep 27", null, ?3.7, null, true, "https://questbridge.org"),
      (4, "National Merit Scholarship", 2500, "Feb 12", null, ?3.5, null, false, "https://nationalmerit.org"),
      (5, "Dell Scholars Program", 20000, "Dec 1", null, ?2.4, null, true, "https://dellscholars.org"),
      (6, "Jack Kent Cooke Foundation", 55000, "Nov 17", null, ?3.5, null, true, "https://jkcf.org"),
      (7, "Elks Most Valuable Student", 12500, "Nov 5", null, null, null, false, "https://elks.org/scholars"),
      (8, "Davidson Fellows Scholarship", 50000, "Feb 12", ?"STEM", null, null, false, "https://davidsongifted.org/fellows-scholarship"),
      (9, "Regeneron Science Talent Search", 40000, "Nov 9", ?"Science", null, null, false, "https://societyforscience.org/regeneron-sts"),
      (10, "Intel International Science Fair", 75000, "Mar 10", ?"Science", null, null, false, "https://societyforscience.org/isef"),
      (11, "Hispanic Scholarship Fund", 5000, "Feb 15", null, ?3.0, null, true, "https://hsf.net"),
      (12, "United Negro College Fund", 10000, "Mar 1", null, ?2.5, null, true, "https://uncf.org"),
      (13, "Asian & Pacific Islander American Scholarship Fund", 20000, "Jan 10", null, ?2.7, null, true, "https://apiasf.org"),
      (14, "American Indian College Fund", 3000, "May 31", null, ?2.0, null, true, "https://collegefund.org"),
      (15, "Society of Women Engineers", 15000, "Feb 15", ?"Engineering", ?3.0, null, false, "https://swe.org"),
      (16, "Google Generation Google Scholarship", 10000, "Dec 1", ?"Computer Science", ?3.2, null, false, "https://buildyourfuture.withgoogle.com/scholarships"),
      (17, "Microsoft Tuition Scholarship", 10000, "Jan 15", ?"Computer Science", ?3.0, null, false, "https://microsoft.com/en-us/diversity/programs/scholarships"),
      (18, "Amazon Future Engineer Scholarship", 40000, "Jan 31", ?"Computer Science", ?3.0, null, true, "https://amazonfutureengineer.com"),
      (19, "Tylenol Future Care Scholarship", 10000, "Jun 15", ?"Healthcare", ?3.0, null, false, "https://tylenol.com/news/scholarship"),
      (20, "AXA Achievement Scholarship", 10000, "Dec 15", null, ?3.0, null, false, "https://axa.com/en/about-us/our-commitment/education/axa-achievement-scholarships"),
      (21, "Ron Brown Scholar Program", 10000, "Jan 9", null, ?3.0, null, true, "https://ronbrown.org"),
      (22, "Siemens Competition in Math, Science", 100000, "Sep 21", ?"STEM", null, null, false, "https://siemens-foundation.org"),
      (23, "Rhodes Scholarship", 50000, "Oct 1", null, ?3.7, null, false, "https://rhodeshouse.ox.ac.uk"),
      (24, "Fulbright U.S. Student Program", 30000, "Oct 14", null, ?3.0, null, false, "https://fulbrightprogram.org"),
      (25, "Horatio Alger Scholarship", 25000, "Oct 25", null, ?2.0, null, true, "https://horatioalger.org/scholarships"),
      (26, "National Association for Black Journalists", 5000, "Mar 15", ?"Journalism", ?2.5, null, false, "https://nabj.org"),
      (27, "American Association of University Women", 12000, "Dec 1", null, ?3.0, null, false, "https://aauw.org/resources/programs/fellowships-grants"),
      (28, "Buick Achievers Scholarship", 25000, "Feb 1", ?"Engineering", ?3.0, null, false, "https://buickachievers.com"),
    ];
    for ((id, name, amount, deadline, eligibilityMajor, eligibilityMinGpa, eligibilityMaxGpa, requiresFinancialNeed, applyLink) in data.vals()) {
      scholarships.add({
        id;
        name;
        amount;
        deadline;
        eligibilityMajor;
        eligibilityMinGpa;
        eligibilityMaxGpa;
        requiresFinancialNeed;
        applyLink;
      });
    };
  };
};
