module {
  public type LoanCalculationResult = {
    monthlyPayment : Float;
    totalPayment : Float;
    totalInterest : Float;
    amortizationBreakdown : [AmortizationEntry];
  };

  public type AmortizationEntry = {
    month : Nat;
    principal : Float;
    interest : Float;
    balance : Float;
  };
};
