import React from "react";

const Navigation = () => {
  return (
    <div id="navigation">
      <nav>
        <ul>
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/users/login">Login</a>
          </li>
          <li>
            <a href="/users/register">Registro</a>
          </li>{" "}
          <li>
            <a href="/categories/add">Categorias</a>
          </li>
          <li>
            <a href="/goals">Metas de ahorro</a>
          </li>
          <li>
            <a href="/income/add">Agregar ingreso</a>
          </li>
          <li>
            <a href="/outcome/add">Agregar gasto</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
