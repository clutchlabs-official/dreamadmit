import Types "../types/finance";
import Array "mo:core/Array";
import Float "mo:core/Float";

module {
  public func calculateLoan(
    totalCost : Float,
    expectedAid : Float,
    annualInterestRate : Float,
    repaymentYears : Nat,
  ) : Types.LoanCalculationResult {
    let principal = totalCost - expectedAid;
    let n = repaymentYears * 12;
    let r = annualInterestRate / 100.0 / 12.0;

    let monthlyPayment : Float = if (r == 0.0) {
      principal / n.toFloat();
    } else {
      let factor = Float.pow(1.0 + r, n.toFloat());
      principal * r * factor / (factor - 1.0);
    };

    let totalPayment = monthlyPayment * n.toFloat();
    let totalInterest = totalPayment - principal;

    var balance = principal;
    let breakdown = Array.tabulate(n, func(i) {
      let interestPayment = balance * r;
      let principalPayment = monthlyPayment - interestPayment;
      balance := balance - principalPayment;
      let b = if (balance < 0.0) { 0.0 } else { balance };
      {
        month = i + 1;
        principal = principalPayment;
        interest = interestPayment;
        balance = b;
      };
    });

    {
      monthlyPayment;
      totalPayment;
      totalInterest;
      amortizationBreakdown = breakdown;
    };
  };
};
