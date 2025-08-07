import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Input } from "../../components/Forms/Input.jsx";
import { Button } from "../../components/Button.jsx";

// Esquema de validación con Yup
const schema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  lastname: yup.string().required("El apellido es obligatorio"),
  age: yup
    .number()
    .typeError("La edad debe ser un número")
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .required("La edad es obligatoria"),
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),
  phonenumber: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Número de teléfono no válido")
    .required("El teléfono es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Debes confirmar la contraseña"),
});

const FormRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const navigateLogin = (e) => {
    e.preventDefault();
    navigate("/users/login");
  };

  const onSubmit = async (data) => {
    try {
      // Elimina confirmPassword antes de enviar al backend
      const { confirmPassword, ...userData } = data;
      const response = await axios.post(
        "https://app-nttd.onrender.com/usuarios",
        userData
      );
      console.log("Registro exitoso", response.data);
      navigate("/users/login");
    } catch (error) {
      console.error("Error en el registro", error.response?.data);
    }
  };

  return (
    <>
      <div id="register" className="autolayout-2">
        <h1>Registro</h1>
        <form className="autolayout-1" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre"
            placeholder="Escribí tu nombre"
            name="name"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Apellido"
            placeholder="Escribí tu apellido"
            name="lastname"
            {...register("lastname")}
            error={errors.lastname?.message}
          />
          <Input
            type="number"
            label="Edad"
            placeholder="Escribí tu edad"
            name="age"
            {...register("age")}
            error={errors.age?.message}
          />
          <Input
            type="email"
            label="Email"
            placeholder="mail@mail.com"
            name="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            type="tel"
            label="Teléfono"
            placeholder="Escribí tu teléfono"
            name="phonenumber"
            {...register("phonenumber")}
            error={errors.phonenumber?.message}
          />

          <div className="password">
            <Input
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              placeholder="Escribí tu contraseña"
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
                <img
                  className="password__icon"
                  src="/assets/icons/hide-password.svg"
                  alt="Ocultar contraseña"
                />
              ) : (
                <img
                  className="password__icon"
                  src="/assets/icons/show-password.svg"
                  alt="Mostrar contraseña"
                />
              )}
            </button>
          </div>

          <div className="password">
            <Input
              type={showConfirm ? "text" : "password"}
              label="Confirmar contraseña"
              placeholder="Repetí tu contraseña"
              name="confirmPassword"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <button
              type="button"
              className="password__btn"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
            >
              {showConfirm ? (
                <img
                  className="password__icon"
                  src="/assets/icons/hide-password.svg"
                  alt="Ocultar contraseña"
                />
              ) : (
                <img
                  className="password__icon"
                  src="/assets/icons/show-password.svg"
                  alt="Mostrar contraseña"
                />
              )}
            </button>
          </div>

          <Button
            className="btn btn--filled-blue"
            type="submit"
            label="Registrarse"
          />

          <div className="margin-top-2">
            <p className="black-text">¿Ya tenés una cuenta?</p>
            <Button
              className="btn-text-blue"
              type="button"
              label="Iniciá sesión"
              onClick={navigateLogin}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export { FormRegister };
