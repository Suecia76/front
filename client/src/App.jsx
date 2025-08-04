import { Route, Routes, useLocation } from "react-router-dom";
import {
  FormLogin,
  FormRegister,
  Home,
  NewIncome,
  NewOutcome,
  Outcomes,
  Incomes,
  CategoryCreate,
  NewGoal,
  EditOutcome,
  EditIncome,
  EditCategory,
  Categories,
  EditGoal,
  CalendarPage,
  Balances,
  Goals,
  AddProgress,
  Profile,
  Group,
  Confirmaciones,
  IncomeDetail,
  OutcomeDetail,
  Instalar,
} from "./pages";
import { useState, useEffect } from "react";
import Loader from "./components/Animations/Loader";
import { PublicLayout } from "./components/PublicLayout";

import "./App.css";
import { NavBar, TopBar, PrivateRoute } from "./components";

function NotFound() {
  return <h1>404: No se encontro la pantalla</h1>;
}

function App() {
  const [loading, setLoading] = useState(() => {
    // Solo muestra el loader si nunca se mostró antes
    return !localStorage.getItem("loaderShown");
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem("loaderShown", "true");
      }, 1200); // mínimo 1 vuelta

      // Limpiar el temporizador en caso de que el componente se desmonte antes de que se complete el tiempo de espera
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      <Loader isLoading={loading} />
      {!loading && (
        <Routes>
          <Route
            path="/instalar"
            element={
              <PublicLayout>
                {" "}
                <Instalar />{" "}
              </PublicLayout>
            }
          />

          {/* User */}
          <Route path="/users/login" element={<FormLogin />} />

          <Route path="/users/register" element={<FormRegister />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                {" "}
                <Home />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/categories/"
            element={
              <PrivateRoute>
                {" "}
                <Categories />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/categories/add"
            element={
              <PrivateRoute>
                {" "}
                <CategoryCreate />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/categories/edit/:id"
            element={
              <PrivateRoute>
                {" "}
                <EditCategory />{" "}
              </PrivateRoute>
            }
          />

          {/* Incomes */}
          <Route
            path="/incomes"
            element={
              <PrivateRoute>
                {" "}
                <Incomes />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/income/add"
            element={
              <PrivateRoute>
                {" "}
                <NewIncome />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/incomes/edit/:id"
            element={
              <PrivateRoute>
                {" "}
                <EditIncome />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/incomes/:id"
            element={
              <PrivateRoute>
                {" "}
                <IncomeDetail />{" "}
              </PrivateRoute>
            }
          />
          {/* Outcomes */}
          <Route
            path="/outcomes"
            element={
              <PrivateRoute>
                {" "}
                <Outcomes />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/outcomes/:id"
            element={
              <PrivateRoute>
                {" "}
                <OutcomeDetail />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/outcome/add"
            element={
              <PrivateRoute>
                <NewOutcome />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/outcomes/edit/:id"
            element={
              <PrivateRoute>
                <EditOutcome />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                {" "}
                <Goals />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/goals/add"
            element={
              <PrivateRoute>
                {" "}
                <NewGoal />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/goals/edit/:id"
            element={
              <PrivateRoute>
                {" "}
                <EditGoal />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/goals/progress/:id"
            element={
              <PrivateRoute>
                {" "}
                <AddProgress />{" "}
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                {" "}
                <CalendarPage />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/balances"
            element={
              <PrivateRoute>
                {" "}
                <Balances />
              </PrivateRoute>
            }
          />
          <Route
            path="/group"
            element={
              <PrivateRoute>
                {" "}
                <Group />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                {" "}
                <Profile />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/edit/:id"
            element={
              <PrivateRoute>
                <Profile />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmaciones"
            element={
              <PrivateRoute>
                <Confirmaciones />
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
