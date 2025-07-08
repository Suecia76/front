import React, {useContext} from "react";
import { StatusBar } from "../../components/StatusBar";
import { IncomeExpenseChart } from "../../components/Charts/IncomeExpenseChart";
import { GoalsProgressByMonthChart } from "../../components/Charts/GoalsProgressByMonthChart";
import { CategoryExpenseChart } from "../../components/Charts/CategoryExpenseChart";
import { AuthContext } from "../../context/AuthContext";
import { TopBar } from "../../components/Topbar";

const Balances = () => {
    const { user } = useContext(AuthContext);
  return (
    <>
      <StatusBar label="Balances" />

      <IncomeExpenseChart />
      <GoalsProgressByMonthChart />
      <CategoryExpenseChart user={user} />
    </>
  );
};

export { Balances };
