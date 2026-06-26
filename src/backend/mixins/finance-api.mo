import Types "../types/finance";
import FinanceLib "../lib/finance";

mixin () {
  public query func calculateLoan(
    totalCost : Float,
    expectedAid : Float,
    annualInterestRate : Float,
    repaymentYears : Nat,
  ) : async Types.LoanCalculationResult {
    FinanceLib.calculateLoan(totalCost, expectedAid, annualInterestRate, repaymentYears);
  };
};
