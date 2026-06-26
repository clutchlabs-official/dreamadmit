import List "mo:core/List";
import Types "../types/colleges";
import Common "../types/common";

module {
  public func getAllColleges(
    colleges : List.List<Types.College>,
  ) : [Types.College] {
    colleges.toArray();
  };

  public func queryCollegesByFinancialAid(
    colleges : List.List<Types.College>,
    tier : Common.FinancialAidTier,
  ) : [Types.College] {
    colleges.toArray().filter(func(c : Types.College) : Bool {
      c.financialAidTier == tier;
    });
  };

  public func queryCollegesByCountry(
    colleges : List.List<Types.College>,
    country : Text,
  ) : [Types.College] {
    colleges.toArray().filter(func(c : Types.College) : Bool {
      c.country == country;
    });
  };

  public func seedColleges(
    colleges : List.List<Types.College>,
  ) : () {
    // (id, name, location, country, tuition, acceptanceRate, financialAidTier, majorsOffered, housingInfo, website, redditUrl, discordUrl)
    let data : [(Nat, Text, Text, Text, Nat, Float, Common.FinancialAidTier, [Text], Text, Text, ?Text, ?Text)] = [
      // US — 8 colleges
      (1, "Massachusetts Institute of Technology", "Cambridge, MA", "US", 57986, 0.04, #meritOnly, ["Engineering", "Computer Science", "Physics", "Mathematics", "Economics"], "On-campus housing guaranteed for all 4 years", "https://mit.edu", ?"https://www.reddit.com/r/mit/", null),
      (2, "Harvard University", "Cambridge, MA", "US", 57261, 0.04, #fullRide, ["Liberal Arts", "Law", "Medicine", "Business", "Engineering"], "Historic residential houses system", "https://harvard.edu", ?"https://www.reddit.com/r/harvard/", null),
      (3, "Stanford University", "Stanford, CA", "US", 56169, 0.04, #fullRide, ["Engineering", "Computer Science", "Business", "Biology", "Psychology"], "8 residence areas with 80+ residences", "https://stanford.edu", ?"https://www.reddit.com/r/stanford/", null),
      (4, "Columbia University", "New York, NY", "US", 65524, 0.07, #needBased, ["Engineering", "Journalism", "Business", "Law", "Medicine"], "On-campus housing in NYC", "https://columbia.edu", ?"https://www.reddit.com/r/columbia/", null),
      (5, "Carnegie Mellon University", "Pittsburgh, PA", "US", 60892, 0.15, #meritOnly, ["Computer Science", "Engineering", "Drama", "Business", "Architecture"], "On-campus housing first year", "https://cmu.edu", ?"https://www.reddit.com/r/carnegiemellon/", null),
      (6, "University of California Los Angeles", "Los Angeles, CA", "US", 44066, 0.14, #needBased, ["Film", "Engineering", "Business", "Pre-Med", "Computer Science"], "On-campus housing for freshmen guaranteed", "https://ucla.edu", ?"https://www.reddit.com/r/UCLA/", null),
      (7, "University of Michigan", "Ann Arbor, MI", "US", 52266, 0.26, #needBased, ["Engineering", "Business", "Law", "Medicine", "Education"], "Residential halls and co-ops", "https://umich.edu", ?"https://www.reddit.com/r/uofmichigan/", null),
      (8, "Purdue University", "West Lafayette, IN", "US", 28794, 0.60, #meritOnly, ["Engineering", "Agriculture", "Computer Science", "Business", "Pharmacy"], "Residential halls and apartments", "https://purdue.edu", ?"https://www.reddit.com/r/Purdue/", null),
      // UK — 7 colleges
      (9, "University of Oxford", "Oxford, England", "UK", 35000, 0.17, #needBased, ["Law", "Medicine", "Philosophy", "Engineering", "Economics"], "College-based accommodation system", "https://ox.ac.uk", ?"https://www.reddit.com/r/oxforduni/", null),
      (10, "University of Cambridge", "Cambridge, England", "UK", 35000, 0.21, #needBased, ["Natural Sciences", "Engineering", "Mathematics", "Law", "Medicine"], "College system with guaranteed rooms for first year", "https://cam.ac.uk", ?"https://www.reddit.com/r/cambridge/", null),
      (11, "Imperial College London", "London, England", "UK", 38000, 0.14, #meritOnly, ["Engineering", "Medicine", "Science", "Business", "Computing"], "Halls of residence and student accommodation", "https://imperial.ac.uk", ?"https://www.reddit.com/r/imperialcollege/", null),
      (12, "University College London", "London, England", "UK", 33000, 0.63, #needBased, ["Engineering", "Medicine", "Architecture", "Laws", "Social Sciences"], "Halls of residence across London", "https://ucl.ac.uk", ?"https://www.reddit.com/r/ucl/", null),
      (13, "London School of Economics", "London, England", "UK", 24500, 0.70, #needBased, ["Economics", "Political Science", "Sociology", "Law", "International Relations"], "Halls of residence in central London", "https://lse.ac.uk", ?"https://www.reddit.com/r/LSE/", null),
      (14, "University of Edinburgh", "Edinburgh, Scotland", "UK", 27750, 0.46, #needBased, ["Medicine", "Engineering", "Business", "Law", "Arts"], "Halls and self-catered accommodation", "https://ed.ac.uk", ?"https://www.reddit.com/r/Edinburgh/", null),
      (15, "University of Manchester", "Manchester, England", "UK", 26500, 0.57, #needBased, ["Business", "Engineering", "Medicine", "Computer Science", "Arts"], "Large student village on campus", "https://manchester.ac.uk", ?"https://www.reddit.com/r/manchester/", null),
      // Canada — 6 colleges
      (16, "University of Toronto", "Toronto, Ontario", "Canada", 45000, 0.43, #needBased, ["Engineering", "Medicine", "Law", "Business", "Arts & Science"], "On-campus colleges with guaranteed first-year housing", "https://utoronto.ca", ?"https://www.reddit.com/r/uoft/", null),
      (17, "McGill University", "Montreal, Quebec", "Canada", 40000, 0.46, #needBased, ["Medicine", "Engineering", "Law", "Business", "Arts"], "Residences on lower and upper campus", "https://mcgill.ca", ?"https://www.reddit.com/r/mcgill/", null),
      (18, "University of British Columbia", "Vancouver, British Columbia", "Canada", 38000, 0.52, #needBased, ["Engineering", "Business", "Medicine", "Arts", "Science"], "Student neighbourhoods and residences", "https://ubc.ca", ?"https://www.reddit.com/r/UBC/", null),
      (19, "University of Waterloo", "Waterloo, Ontario", "Canada", 42000, 0.53, #meritOnly, ["Computer Science", "Engineering", "Mathematics", "Business", "Science"], "On-campus villages and off-campus student housing", "https://uwaterloo.ca", ?"https://www.reddit.com/r/uwaterloo/", null),
      (20, "Queen's University", "Kingston, Ontario", "Canada", 36000, 0.42, #needBased, ["Engineering", "Business", "Arts", "Medicine", "Law"], "First-year residences guaranteed", "https://queensu.ca", ?"https://www.reddit.com/r/queensuniversity/", null),
      (21, "Western University", "London, Ontario", "Canada", 33000, 0.58, #needBased, ["Business", "Engineering", "Medicine", "Law", "Social Science"], "Residential colleges on campus", "https://uwo.ca", ?"https://www.reddit.com/r/uwo/", null),
      // Australia — 6 colleges
      (22, "Australian National University", "Canberra, ACT", "Australia", 36000, 0.35, #needBased, ["Science", "Engineering", "Law", "Economics", "Arts"], "Residential colleges on campus", "https://anu.edu.au", ?"https://www.reddit.com/r/anu/", null),
      (23, "University of Melbourne", "Melbourne, Victoria", "Australia", 38000, 0.41, #needBased, ["Medicine", "Law", "Engineering", "Business", "Arts"], "Residential colleges and student housing", "https://unimelb.edu.au", ?"https://www.reddit.com/r/unimelb/", null),
      (24, "University of Sydney", "Sydney, New South Wales", "Australia", 37000, 0.30, #needBased, ["Medicine", "Law", "Engineering", "Business", "Arts"], "Residential colleges and university accommodation", "https://sydney.edu.au", ?"https://www.reddit.com/r/usyd/", null),
      (25, "University of Queensland", "Brisbane, Queensland", "Australia", 34000, 0.55, #needBased, ["Engineering", "Business", "Medicine", "Science", "Agriculture"], "Residential colleges and apartments", "https://uq.edu.au", ?"https://www.reddit.com/r/UQreddit/", null),
      (26, "Monash University", "Clayton, Victoria", "Australia", 33000, 0.60, #needBased, ["Engineering", "Business", "Medicine", "Law", "Arts"], "Multiple campuses with student residences", "https://monash.edu", ?"https://www.reddit.com/r/monash/", null),
      (27, "University of New South Wales", "Sydney, New South Wales", "Australia", 35000, 0.49, #meritOnly, ["Engineering", "Business", "Law", "Medicine", "Science"], "Village on campus and nearby student housing", "https://unsw.edu.au", ?"https://www.reddit.com/r/UNSW/", null),
      // India — 6 colleges
      (28, "Indian Institute of Technology Bombay", "Mumbai, Maharashtra", "India", 3500, 0.01, #meritOnly, ["Engineering", "Design", "Science", "Management", "Humanities"], "Hostel accommodation on campus for all students", "https://iitb.ac.in", ?"https://www.reddit.com/r/iitbombay/", null),
      (29, "Indian Institute of Technology Delhi", "New Delhi", "India", 3200, 0.01, #meritOnly, ["Engineering", "Computer Science", "Mathematics", "Physics", "Management"], "Residential campus with hostels", "https://iitd.ac.in", ?"https://www.reddit.com/r/iitdelhi/", null),
      (30, "Indian Institute of Science", "Bangalore, Karnataka", "India", 1800, 0.03, #meritOnly, ["Science", "Engineering", "Design", "Management"], "On-campus hostel accommodation", "https://iisc.ac.in", ?"https://www.reddit.com/r/IISc/", null),
      (31, "University of Delhi", "New Delhi", "India", 1200, 0.15, #needBased, ["Arts", "Commerce", "Science", "Law", "Social Work"], "College-based hostels across the university", "https://du.ac.in", ?"https://www.reddit.com/r/DelhiUniversity/", null),
      (32, "Jawaharlal Nehru University", "New Delhi", "India", 500, 0.12, #fullRide, ["Social Sciences", "International Studies", "Languages", "Environmental Sciences", "Biotechnology"], "Residential campus with subsidised hostels", "https://jnu.ac.in", ?"https://www.reddit.com/r/JNU/", null),
      (33, "Manipal Academy of Higher Education", "Manipal, Karnataka", "India", 8000, 0.65, #meritOnly, ["Medicine", "Engineering", "Management", "Architecture", "Pharmacy"], "Large on-campus hostel facilities", "https://manipal.edu", ?"https://www.reddit.com/r/manipaluniversity/", null),
      // Germany — 6 colleges
      (34, "Technical University of Munich", "Munich, Bavaria", "Germany", 3500, 0.09, #meritOnly, ["Engineering", "Computer Science", "Natural Sciences", "Medicine", "Management"], "Student dorms via Studentenwerk Munich", "https://tum.de", ?"https://www.reddit.com/r/tumunich/", null),
      (35, "Ludwig Maximilian University of Munich", "Munich, Bavaria", "Germany", 3000, 0.30, #needBased, ["Medicine", "Law", "Economics", "Natural Sciences", "Humanities"], "Student dormitories available through city", "https://lmu.de", ?"https://www.reddit.com/r/LMUMunich/", null),
      (36, "Heidelberg University", "Heidelberg, Baden-Württemberg", "Germany", 3200, 0.20, #needBased, ["Medicine", "Law", "Social Sciences", "Natural Sciences", "Humanities"], "Student housing through Studentenwerk Heidelberg", "https://uni-heidelberg.de", ?"https://www.reddit.com/r/UniHeidelberg/", null),
      (37, "Humboldt University of Berlin", "Berlin", "Germany", 2800, 0.25, #needBased, ["Arts", "Law", "Economics", "Natural Sciences", "Social Sciences"], "Student residences via Studentenwerk Berlin", "https://hu-berlin.de", ?"https://www.reddit.com/r/humboldtuni/", null),
      (38, "RWTH Aachen University", "Aachen, North Rhine-Westphalia", "Germany", 3200, 0.68, #meritOnly, ["Engineering", "Computer Science", "Natural Sciences", "Business", "Medicine"], "Student dorms near campus", "https://rwth-aachen.de", ?"https://www.reddit.com/r/rwth/", null),
      (39, "Freie Universität Berlin", "Berlin", "Germany", 2700, 0.40, #needBased, ["Political Science", "Law", "History", "Natural Sciences", "Computer Science"], "Student villages and dorms in Berlin", "https://fu-berlin.de", ?"https://www.reddit.com/r/fuberlin/", null),
      // France — 6 colleges
      (40, "École Normale Supérieure Paris", "Paris, Île-de-France", "France", 4000, 0.03, #meritOnly, ["Mathematics", "Physics", "Biology", "Humanities", "Social Sciences"], "On-campus housing for admitted students", "https://ens.psl.eu", ?"https://www.reddit.com/r/ENS/", null),
      (41, "École Polytechnique", "Palaiseau, Île-de-France", "France", 15000, 0.06, #meritOnly, ["Engineering", "Computer Science", "Mathematics", "Physics", "Economics"], "On-campus student residences", "https://polytechnique.edu", ?"https://www.reddit.com/r/polytechnique/", null),
      (42, "Sciences Po Paris", "Paris, Île-de-France", "France", 14000, 0.30, #needBased, ["Political Science", "Law", "Economics", "International Affairs", "Journalism"], "Student halls in Paris and regional campuses", "https://sciencespo.fr", ?"https://www.reddit.com/r/sciencespo/", null),
      (43, "Université Paris-Saclay", "Orsay, Île-de-France", "France", 3500, 0.45, #needBased, ["Science", "Engineering", "Medicine", "Mathematics", "Social Sciences"], "Student residences on campus", "https://universite-paris-saclay.fr", ?"https://www.reddit.com/r/parisxsaclay/", null),
      (44, "HEC Paris", "Jouy-en-Josas, Île-de-France", "France", 50000, 0.12, #meritOnly, ["Business", "Management", "Finance", "Marketing", "Entrepreneurship"], "On-campus residences", "https://hec.edu", ?"https://www.reddit.com/r/HECParis/", null),
      (45, "Sorbonne University", "Paris, Île-de-France", "France", 4500, 0.50, #needBased, ["Arts", "Humanities", "Science", "Medicine", "Engineering"], "CROUS student residences across Paris", "https://sorbonne-universite.fr", ?"https://www.reddit.com/r/sorbonne/", null),
      // Japan — 6 colleges
      (46, "University of Tokyo", "Tokyo", "Japan", 7000, 0.33, #meritOnly, ["Engineering", "Science", "Medicine", "Law", "Economics"], "On-campus dormitories including international student housing", "https://u-tokyo.ac.jp", ?"https://www.reddit.com/r/utokyo/", null),
      (47, "Kyoto University", "Kyoto", "Japan", 7000, 0.40, #meritOnly, ["Science", "Engineering", "Medicine", "Law", "Humanities"], "University dormitories and international houses", "https://kyoto-u.ac.jp", ?"https://www.reddit.com/r/kyotouniversity/", null),
      (48, "Osaka University", "Osaka", "Japan", 6500, 0.45, #meritOnly, ["Engineering", "Medicine", "Science", "Economics", "Foreign Studies"], "Student dormitories on multiple campuses", "https://osaka-u.ac.jp", ?"https://www.reddit.com/r/osakauniversity/", null),
      (49, "Waseda University", "Tokyo", "Japan", 12000, 0.30, #meritOnly, ["Engineering", "Political Science", "Economics", "International Studies", "Arts"], "Student dormitories and international residences", "https://waseda.jp", ?"https://www.reddit.com/r/waseda/", null),
      (50, "Keio University", "Tokyo", "Japan", 13000, 0.25, #meritOnly, ["Economics", "Medicine", "Law", "Engineering", "Business"], "Campus residences and international student housing", "https://keio.ac.jp", ?"https://www.reddit.com/r/keiouniversity/", null),
      (51, "Tohoku University", "Sendai, Miyagi", "Japan", 6500, 0.55, #meritOnly, ["Science", "Engineering", "Medicine", "Economics", "Arts"], "Dormitory facilities for domestic and international students", "https://tohoku.ac.jp", ?"https://www.reddit.com/r/tohokuuniversity/", null),
      // Singapore — 6 colleges
      (52, "National University of Singapore", "Singapore", "Singapore", 22000, 0.17, #needBased, ["Engineering", "Computing", "Business", "Law", "Medicine"], "Residential colleges with themed living-learning communities", "https://nus.edu.sg", ?"https://www.reddit.com/r/nus/", null),
      (53, "Nanyang Technological University", "Singapore", "Singapore", 21000, 0.22, #needBased, ["Engineering", "Business", "Science", "Humanities", "Art, Design & Media"], "Halls of residence and student apartments", "https://ntu.edu.sg", ?"https://www.reddit.com/r/NTUsg/", null),
      (54, "Singapore Management University", "Singapore", "Singapore", 25000, 0.35, #meritOnly, ["Business", "Law", "Economics", "Social Sciences", "Information Systems"], "Off-campus student residences nearby", "https://smu.edu.sg", ?"https://www.reddit.com/r/SMU/", null),
      (55, "Singapore University of Technology and Design", "Singapore", "Singapore", 20000, 0.20, #meritOnly, ["Engineering", "Architecture", "Industrial Design", "Information Systems", "Humanities"], "On-campus hostel accommodation", "https://sutd.edu.sg", ?"https://www.reddit.com/r/SUTD/", null),
      (56, "Singapore Institute of Technology", "Singapore", "Singapore", 18000, 0.55, #needBased, ["Engineering", "Hospitality", "Health Sciences", "Information Technology", "Business"], "Student residences at various campuses", "https://singaporetech.edu.sg", ?"https://www.reddit.com/r/singaporetech/", null),
      (57, "INSEAD Asia Campus", "Singapore", "Singapore", 85000, 0.30, #meritOnly, ["Business", "MBA", "Finance", "Entrepreneurship", "Management"], "Partner accommodation and student residences", "https://insead.edu", ?"https://www.reddit.com/r/INSEAD/", null),
      // UAE — 6 colleges
      (58, "New York University Abu Dhabi", "Abu Dhabi", "UAE", 58000, 0.04, #fullRide, ["Science", "Engineering", "Social Sciences", "Humanities", "Arts"], "On-campus housing for all undergraduates", "https://nyuad.nyu.edu", ?"https://www.reddit.com/r/NYUAD/", null),
      (59, "Khalifa University", "Abu Dhabi", "UAE", 11000, 0.15, #meritOnly, ["Engineering", "Science", "Medicine", "Computer Science", "Business"], "On-campus student residences", "https://ku.ac.ae", ?"https://www.reddit.com/r/khalifauniversity/", null),
      (60, "American University of Sharjah", "Sharjah", "UAE", 18000, 0.55, #meritOnly, ["Engineering", "Architecture", "Business", "Arts", "Sciences"], "Residential campus with student housing", "https://aus.edu", ?"https://www.reddit.com/r/aus/", null),
      (61, "University of Sharjah", "Sharjah", "UAE", 9000, 0.60, #needBased, ["Engineering", "Medicine", "Business", "Law", "Fine Arts"], "On-campus accommodation for students", "https://sharjah.ac.ae", ?"https://www.reddit.com/r/sharjah/", null),
      (62, "Zayed University", "Abu Dhabi & Dubai", "UAE", 14000, 0.70, #needBased, ["Business", "Communication", "Education", "Interdisciplinary", "Sustainability"], "On-campus housing and off-campus options", "https://zu.ac.ae", ?"https://www.reddit.com/r/ZayedUniversity/", null),
      (63, "Rochester Institute of Technology Dubai", "Dubai", "UAE", 24000, 0.65, #meritOnly, ["Engineering", "Computer Science", "Business", "Engineering Technology", "Computing & Information Sciences"], "Student residences in Dubai", "https://rit.edu/dubai", ?"https://www.reddit.com/r/ritdubai/", null),
    ];
    for ((id, name, location, country, tuition, acceptanceRate, financialAidTier, majorsOffered, housingInfo, website, redditUrl, discordUrl) in data.vals()) {
      colleges.add({
        id;
        name;
        location;
        country;
        tuition;
        acceptanceRate;
        financialAidTier;
        majorsOffered;
        housingInfo;
        website;
        redditUrl;
        discordUrl;
      });
    };
  };
};
