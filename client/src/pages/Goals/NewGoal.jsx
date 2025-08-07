import { useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/Forms/Input";
import { Button } from "../../components/Button";
import { Select } from "../../components";
import { Textarea } from "../../components/Forms/Textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Toggle } from "../../components";
import { StatusBar } from "../../components/StatusBar";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

// Esquema de validación para el formulario de creación de metas
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  objetivo: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .required("El objetivo es obligatorio"),
  descripcion: yup.string(),
  progreso: yup
    .number()
    .typeError("Debe ser un número")
    .min(0, "El progreso no puede ser negativo")
    .default(0)
    .notRequired(),
  tipo: yup
    .string()
    .oneOf(["montoMensual", "", "porcentajeMensual"], "Tipo de meta inválido")
    .notRequired(),
  porcentajeMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El porcentaje debe ser positivo")
    .notRequired(),
  montoMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .notRequired(),
  moneda_extranjera: yup.boolean().default(false),
  monedaNombre: yup.string().when("moneda_extranjera", {
    is: true,
    then: (schema) => schema.required("El nombre de la moneda es obligatorio"),
    otherwise: (schema) => schema.notRequired(),
  }),
  monedaSimbolo: yup.string().when("moneda_extranjera", {
    is: true,
    then: (schema) =>
      schema
        .required("El símbolo de la moneda es obligatorio")
        .max(5, "El símbolo no puede tener más de 5 caracteres"),
    otherwise: (schema) => schema.notRequired(),
  }),
  /* cantidad: yup.number().when("moneda_extranjera", {
    is: true,
    then: (schema) =>
      schema
        .typeError("Debe ser un número")
        .positive("La cantidad debe ser positiva")
        .required("La cantidad es obligatoria"),
    otherwise: (schema) => schema.notRequired(),
  }), */
  /*  precioMoneda: yup.number().when("moneda_extranjera", {
    is: true,
    then: (schema) =>
      schema
        .typeError("Debe ser un número")
        .positive("El precio debe ser positivo")
        .required("El precio de la moneda es obligatorio"),
    otherwise: (schema) => schema.notRequired(),
  }), */
});

const NewGoal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]); // Lista de metas
  const [error, setError] = useState(null); // Estado para errores
  const [type, setType] = useState(""); // Tipo de meta seleccionado
  const [isForeignCurrency, setIsForeignCurrency] = useState(false);

  // Formulario para crear metas
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      objetivo: undefined,
      descripcion: "",
      progreso: 0,
      tipo: "",
      porcentajeMensual: undefined,
      montoMensual: undefined,
      moneda_extranjera: false,
      monedaNombre: "",
      monedaSimbolo: "",
      // cantidad: undefined,
      // precioMoneda: undefined,
    },
  });

  const onSubmit = async (data) => {
    try {
      const progresoPrevio = parseFloat(data.progreso || 0);
      const cantidad = parseFloat(data.cantidad || 0);
      const precioMoneda = parseFloat(data.precioMoneda || 0);
      const objetivo = parseFloat(data.objetivo || 0);

      const avanceExtranjero = isForeignCurrency ? cantidad * precioMoneda : 0;
      const progresoFinal = progresoPrevio + avanceExtranjero;

      const payload = {
        ...data,
        user_fk: user.id,
        progreso: progresoFinal,
        porcentaje: undefined,
        moneda_extranjera: isForeignCurrency
          ? { nombre: data.monedaNombre, simbolo: data.monedaSimbolo }
          : null,
        avance: isForeignCurrency ? { cantidad, precioMoneda } : undefined,
      };

      if (isForeignCurrency) {
        delete payload.tipo;
        delete payload.montoMensual;
        delete payload.porcentajeMensual;
      }

      const token = Cookies.get("token") || "";
      const response = await axios.post(
        "https://back-fbch.onrender.com/metas",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Si querés asegurarte que porcentaje esté actualizado, podés hacer:
      // const createdGoal = response.data.goal;
      // luego pedir el goal completo actualizado, o confiar en backend.

      setGoals((prev) => [...prev, response.data.goal]);
      reset();
      navigate("/goals");
    } catch (error) {
      console.error("Error al crear la meta:", error);
      setError("Error al crear la meta.");
    }
  };

  return (
    <>
      <StatusBar label="Nueva meta" />

      <div id="new-goal">
        <form
          onSubmit={handleSubmit(onSubmit, (errs) =>
            console.log("Errores de validación:", errs)
          )}
          className="autolayout-1"
        >
          <Input
            name="nombre"
            label="Nombre"
            type="text"
            placeholder="Nombre de la meta"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="error-message">{errors.nombre.message}</p>
          )}

          <Input
            sign="$"
            name="objetivo"
            label="Objetivo"
            type="number"
            placeholder="Objetivo de la meta"
            {...register("objetivo")}
          />
          {errors.objetivo && (
            <p className="error-message">{errors.objetivo.message}</p>
          )}

          <Textarea
            name="descripcion"
            label="Descripción"
            placeholder="Descripción de la meta"
            {...register("descripcion")}
          />

          <Toggle
            label="¿Es en moneda extranjera?"
            checked={isForeignCurrency}
            onChange={() => setIsForeignCurrency(!isForeignCurrency)}
          />

          {isForeignCurrency && (
            <>
              <Input
                name="monedaNombre"
                label="Nombre de la moneda"
                type="text"
                placeholder="Ej: Dólar, Euro"
                {...register("monedaNombre")}
              />
              <Input
                name="monedaSimbolo"
                label="Símbolo"
                type="text"
                placeholder="Ej: USD, EUR"
                {...register("monedaSimbolo")}
              />
              {/* <Input
                name="cantidad"
                label="Cantidad comprada"
                type="hidden"
                placeholder="Cantidad de la moneda"
                {...register("cantidad")}
              />
              <Input
                name="precioMoneda"
                label="Precio por unidad (ARS)"
                type="hidden"
                placeholder="Precio de la moneda en ARS"
                {...register("precioMoneda")}
              /> */}
            </>
          )}

          {!isForeignCurrency && (
            <>
              <Select
                labelField="Tipo de meta"
                register={register("tipo")}
                options={[
                  { value: "", label: "Agregar avances manualmente." },
                  {
                    value: "montoMensual",
                    label: "Ahorrar un monto fijo por mes",
                  },
                  {
                    value: "porcentajeMensual",
                    label: "Ahorrar un porcentaje del ingreso mensual",
                  },
                ]}
                onChange={(e) => {
                  const selected = e.target.value;
                  setType(selected);
                  setValue("tipo", selected);

                  // 🔥 Limpiar el campo opuesto
                  if (selected === "montoMensual") {
                    setValue("porcentajeMensual", undefined);
                  } else if (selected === "porcentajeMensual") {
                    setValue("montoMensual", undefined);
                  } else {
                    setValue("porcentajeMensual", undefined);
                    setValue("montoMensual", undefined);
                  }
                }}
              />

              {type === "porcentajeMensual" && (
                <Input
                  name="porcentajeMensual"
                  label="Porcentaje Mensual"
                  type="number"
                  {...register("porcentajeMensual")}
                  sign="%"
                />
              )}
              {type === "montoMensual" && (
                <Input
                  name="montoMensual"
                  label="Monto Mensual"
                  type="number"
                  {...register("montoMensual")}
                />
              )}
            </>
          )}

          <Input
            name="progreso"
            label="Dinero ya ahorrado destinado a esta meta"
            type="number"
            placeholder="Ej: 5000"
            {...register("progreso")}
            sign="$"
          />

          <Button
            type="submit"
            label="Crear meta"
            className="btn btn--filled-blue margin-top-2"
          />
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export { NewGoal };
