import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { Select } from "../../components";
import { Button } from "../../components/Button";
import { StatusBar, ModalWrapper, Dialog } from "../../components";

const schema = yup.object().shape({
  cantidad: yup.number().when("moneda_extranjera", {
    is: true,
    then: (s) =>
      s
        .typeError("Debe ser un número")
        .positive("La cantidad debe ser positiva")
        .required("La cantidad es obligatoria"),
    otherwise: (s) => s.notRequired(),
  }),
  precioMoneda: yup.number().when("moneda_extranjera", {
    is: true,
    then: (s) =>
      s
        .typeError("Debe ser un número")
        .positive("El precio debe ser positivo")
        .required("El precio de la moneda es obligatorio"),
    otherwise: (s) => s.notRequired(),
  }),
});

const AddProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isForeignCurrency, setIsForeignCurrency] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [currency, setCurrency] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: undefined,
      precioMoneda: undefined,
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await axios.get(
          `https://app-nttd.onrender.com/metas/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const goal = response.data.goal ?? response.data;

        // Moneda extranjera
        const hasForeign = Boolean(goal.moneda_extranjera);
        // Después de determinar hasForeign...
        setIsForeignCurrency(hasForeign);

        if (hasForeign) {
          // Desestructuro avance o uso {} si no existe
          const { cantidad, precioMoneda } = goal.avance || {};

          setSymbol(goal.simbolo);
          setCurrency(goal.moneda_extranjera);

          setValue("cantidad", cantidad);
          setValue("precioMoneda", precioMoneda);
        }
      } catch (err) {
        console.error("fetchGoal error:", err);
        setError("Error al cargar la meta.");
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || "";

      const cantidad = parseFloat(data.cantidad || 0);
      const precioMoneda = parseFloat(data.precioMoneda || 0);

      let payload = {};

      if (isForeignCurrency) {
        payload.avance = {
          cantidad,
          precioMoneda,
        };
      } else {
        payload.progreso = Number(data.progreso);
      }

      await axios.put(`https://app-nttd.onrender.com/metas/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/goals");
    } catch (err) {
      console.error("onSubmit error:", err);
      const message =
        err.response?.data?.message || "Error al actualizar la meta.";
      console.error("Detalles del error:", err.response?.data);
      setError(message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <StatusBar label="Añadir progreso" />

      <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
        {isForeignCurrency ? (
          <>
            <Input
              {...register("cantidad")}
              label="Cantidad comprada"
              type="number"
              placeholder="Ej: 100"
            />
            {errors.cantidad && (
              <p className="error-message">{errors.cantidad.message}</p>
            )}

            <Input
              {...register("precioMoneda")}
              label="Precio por unidad (ARS)"
              type="number"
              placeholder="Ej: 1200"
            />
            {errors.precioMoneda && (
              <p className="error-message">{errors.precioMoneda.message}</p>
            )}
          </>
        ) : (
          <>
            <Input
              {...register("progreso")}
              label="Avance manual (ARS)"
              type="number"
              placeholder="Ej: 1000"
            />
          </>
        )}

        <div className="form-actions">
          <Button
            type="submit"
            label="Guardar progreso"
            className="btn btn--filled-blue"
          />
          <Button
            type="button"
            label="Cancelar"
            className="btn btn--outlined"
            onClick={() => navigate(-1)}
          />
        </div>
      </form>
    </>
  );
};

export { AddProgress };
