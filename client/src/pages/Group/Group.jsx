import React from "react";
import { StatusBar } from "../../components/StatusBar";
import { TopBar } from "../../components/Topbar";

const Group = () => {
  return (
    <>
      <StatusBar label="Grupo" />

      <div>
        <h2>¡Proximamente!</h2>
        <p>
          Visitá nuestras redes sociales y enterate de todo lo que va a tener
          esta sección para vos{" "}
        </p>
      </div>
    </>
  );
};

export { Group };
