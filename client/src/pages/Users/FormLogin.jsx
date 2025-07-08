import { useState, useContext } from "react";
import { useEffect } from "react";
import { Input } from "../../components/Forms/Input.jsx";
import { Button } from "../../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation with Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const FormLogin = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);

  if (user) {
    navigate("/");
  }

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(""); // Nuevo estado

  const navigateRegister = (e) => {
    e.preventDefault();
    navigate("/users/register");
    console.log("Going to register");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data) => {
    try {
      setLoginError(""); // Limpia error anterior
      const response = await axios.post(
        "http://localhost:3000/usuarios/login",
        data
      );

      setUser({
        id: response.data.id,
        email: response.data.email,
      });

      Cookies.set("token", response.data.token, { expires: 3 });

      navigate("/");
    } catch (error) {
      setLoginError("Email o contraseña incorrectos"); // Mensaje amigable
    }
  };

  return (
    <div id="login" className="autolayout-2">
      <h1>Iniciar sesión</h1>

      <form className="autolayout-1" onSubmit={handleSubmit(handleLogin)}>
        <Input
          type="email"
          label="Email"
          placeholder="mail@mail.com"
          name="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="password">
          <Input
            type={showPassword ? "text" : "password"}
            label="Contraseña"
            name="password"
            {...register("password")}
            error={errors.password?.message}
          />
          
          <button
            type="button"
            className="password__btn"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <img  className="password__icon" src="/assets/icons/hide-password.svg" alt="Ocultar contraseña" />
            ) : (
              <img className="password__icon"  src="/assets/icons/show-password.svg" alt="Mostrar contraseña" />
            )}
          </button>
        </div>
        {loginError && <div style={{ color: "red" }}>{loginError}</div>}
        <Button
          className="btn btn--filled-blue"
          type="submit"
          label="Iniciar sesión"
        />

        <div className="margin-top-2">
          <p className="black-text">¿Todavía no estás registrado?</p>

          <Button
            className="btn-text-blue"
            type="button"
            label="Registrate"
            onClick={navigateRegister}
          />
        </div>
      </form>
    </div>
  );
};

export { FormLogin };
