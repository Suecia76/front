import React from "react";
import { StatusBar } from "../../components/StatusBar";
import { IncomeExpenseChart } from "../../components/Charts/IncomeExpenseChart";
import { GoalsProgressByMonthChart } from "../../components/Charts/GoalsProgressByMonthChart";
import { TopBar } from "../../components/Topbar";

const Balances = () => {
  return (
    <>
      <StatusBar label="Balances" />

      <IncomeExpenseChart />
      <GoalsProgressByMonthChart />
    </>
  );
};

export { Balances };
