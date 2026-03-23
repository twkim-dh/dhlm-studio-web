"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

interface ScheduleRow {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  balance: number;
}

interface Result {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule: ScheduleRow[];
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [method, setMethod] = useState<"equal" | "principal">("equal");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const loanAmount = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const loanYears = parseFloat(years);
    if (
      !loanAmount ||
      !annualRate ||
      !loanYears ||
      loanAmount <= 0 ||
      annualRate <= 0 ||
      loanYears <= 0
    )
      return;

    const principal = loanAmount * 10000;
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = Math.round(loanYears * 12);
    const schedule: ScheduleRow[] = [];
    let totalInterest = 0;
    let totalPayment = 0;
    let balance = principal;

    if (method === "equal") {
      // 원리금균등
      const mp =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const monthlyPayment = Math.round(mp);

      for (let m = 1; m <= totalMonths; m++) {
        const interest = Math.round(balance * monthlyRate);
        const princ = Math.min(monthlyPayment - interest, balance);
        balance = Math.max(0, balance - princ);
        totalInterest += interest;
        totalPayment += monthlyPayment;

        if (m <= 12) {
          schedule.push({
            month: m,
            principal: princ,
            interest,
            payment: monthlyPayment,
            balance,
          });
        }
      }

      setResult({
        monthlyPayment,
        totalInterest,
        totalPayment,
        schedule,
      });
    } else {
      // 원금균등
      const monthlyPrincipal = Math.round(principal / totalMonths);
      let firstPayment = 0;

      for (let m = 1; m <= totalMonths; m++) {
        const interest = Math.round(balance * monthlyRate);
        const princ = m === totalMonths ? balance : monthlyPrincipal;
        const payment = princ + interest;
        balance = Math.max(0, balance - princ);
        totalInterest += interest;
        totalPayment += payment;
        if (m === 1) firstPayment = payment;

        if (m <= 12) {
          schedule.push({
            month: m,
            principal: princ,
            interest,
            payment,
            balance,
          });
        }
      }

      setResult({
        monthlyPayment: firstPayment,
        totalInterest,
        totalPayment,
        schedule,
      });
    }
  }

  return (
    <CalculatorLayout title="대출 이자 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대출금액 (만원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 30000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연이율 (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="예: 4.5"
                value={rate}
                onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대출기간 (년)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 30"
                value={years}
                onChange={(e) =>
                  setYears(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상환방식
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["equal", "principal"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    method === m
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m === "equal" ? "원리금균등" : "원금균등"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full mt-4 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-brand-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">
              {method === "equal" ? "월 상환액" : "첫 달 상환액"}
            </p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.monthlyPayment)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500">총 이자</p>
              <p className="text-lg font-bold text-gray-900">
                {formatWon(result.totalInterest)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500">총 상환액</p>
              <p className="text-lg font-bold text-gray-900">
                {formatWon(result.totalPayment)}
              </p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            상환 스케줄 (첫 12개월)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500">
                  <th className="py-2 text-left">회차</th>
                  <th className="py-2 text-right">상환액</th>
                  <th className="py-2 text-right">원금</th>
                  <th className="py-2 text-right">이자</th>
                  <th className="py-2 text-right">잔액</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-b border-gray-100">
                    <td className="py-2">{row.month}</td>
                    <td className="py-2 text-right">
                      {row.payment.toLocaleString("ko-KR")}
                    </td>
                    <td className="py-2 text-right">
                      {row.principal.toLocaleString("ko-KR")}
                    </td>
                    <td className="py-2 text-right">
                      {row.interest.toLocaleString("ko-KR")}
                    </td>
                    <td className="py-2 text-right">
                      {row.balance.toLocaleString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
