
module {
  public type UserId = Principal;
  public type Timestamp = Int;

  public type FinancialAidPreference = {
    #none;
    #half;
    #full;
  };

  public type FinancialAidTier = {
    #noAid;
    #meritOnly;
    #needBased;
    #fullRide;
  };

  public type GpaType = {
    #unweighted;
    #weighted;
  };
};
