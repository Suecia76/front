import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { CategoryInput } from "../../components/Forms/CategoryInput";
import { Button } from "../../components/Button";
import { InputCalculator } from "../../components/Forms/InputCalculator";
import Cookies from "js-cookie";
import { Toggle } from "../../components/Forms/Toggle";

const schema = yup.object().shape({
  cantidad: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .required("El monto es obligatorio"),
  descripcion: yup.string(),
  nombre: yup.string().required("El nombre es obligatorio"),
  tipo: yup
    .string()
    .oneOf(["fijo", "variable"], "El tipo debe ser 'fijo' o 'variable'")
    .required("El tipo es obligatorio"),
  estado: yup
    .string()
    .oneOf(["pendiente", "pagado"])
    .required("El estado es obligatorio"),
  cuotas: yup
    .number()
    .oneOf([1, 3, 6, 12], "Las cuotas deben ser 1, 3, 6 o 12")
    .required("Las cuotas son obligatorias"),
  frecuencia: yup
    .string()
    .oneOf(["mensual", "quincenal", "semanal"])
    .default("mensual"),
  fechaInicio: yup
    .date()
    .typeError("Fecha inválida")
    .required("La fecha de inicio es obligatoria"),
  cuotasAutomaticas: yup.boolean().default(true),
});

const EditOutcome = () => {
  const { id } = useParams(); // Obtener el ID del gasto desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario después de editar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: 0,
      descripcion: "",
      nombre: "",
      tipo: "variable",
      estado: "pendiente",
      cuotas: 1,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
      categoria_fk: "",
      cuotasAutomaticas: true,
    },
  });

  const cuotasAutomaticasValue = watch("cuotasAutomaticas");

  useEffect(() => {
    const fetchOutcome = async () => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/gastos/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const outcome = response.data;
        // Cargar los valores del gasto en el formulario
        setValue("cantidad", outcome.cantidad);
        setValue("descripcion", outcome.descripcion);
        setValue("nombre", outcome.nombre);
        setValue("tipo", outcome.tipo); // Cargar el tipo de gasto
        setValue("cuotas", outcome.cuotas || 1); // Cargar las cuotas
        setValue("cuotasAutomaticas", !!outcome.cuotasAutomaticas);
        setValue("frecuencia", outcome.frecuencia || "mensual"); // Cargar la frecuencia
        setValue(
          "fechaInicio",
          outcome.fechaInicio
            ? outcome.fechaInicio.slice(0, 10)
            : new Date().toISOString().slice(0, 10)
        ); // Cargar la fecha de inicio
        setValue("categoria_fk", outcome.categoria_fk);
        setValue("estado", outcome.estado); // Cargar el estado
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el gasto:", error.response?.data);
        setError("Error al cargar el gasto.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutcome();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    console.log("Datos enviados:", data); // <-- Agrega esto
    try {
      const token = Cookies.get("token") || null;
      const response = await axios.put(
        `https://back-fbch.onrender.com/gastos/${id}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Gasto actualizado:", response.data);
      navigate("/outcome/add"); // Redirigir a la lista de gastos
    } catch (error) {
      console.error("Error al actualizar el gasto:", error.response?.data);
      setError("Error al actualizar el gasto.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="editOutcome">
      <h2>Editar Gasto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
        <InputCalculator
          label="Monto"
          placeholder="0"
          name="cantidad"
          {...register("cantidad")}
        />
        {errors.cantidad && <p>{errors.cantidad.message}</p>}

        <Input
          type="text"
          label="Título"
          placeholder="Título del gasto"
          name="nombre"
          {...register("nombre")}
        />
        {errors.nombre && <p>{errors.nombre.message}</p>}

        <Textarea
          label="Descripción"
          name="descripcion"
          placeholder="Escribí la descripción del gasto"
          {...register("descripcion")}
        />
        {errors.descripcion && <p>{errors.descripcion.message}</p>}

        <label htmlFor="estado">Estado</label>
        <select id="estado" {...register("estado")}>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>

        <label htmlFor="tipo">Tipo de gasto</label>
        <select id="tipo" {...register("tipo")}>
          <option value="fijo">Fijo</option>
          <option value="variable">Variable</option>
        </select>
        {errors.tipo && <p>{errors.tipo.message}</p>}

        {/* Campo para las cuotas */}
        <label htmlFor="cuotas">Cuotas</label>
        <select id="cuotas" {...register("cuotas")}>
          <option value={1}>1</option>
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={12}>12</option>
        </select>
        {errors.cuotas && (
          <p className="input-error">{errors.cuotas.message}</p>
        )}

        {/* Campo para las cuotas automáticas */}
        <Toggle
          label="Cuotas automáticas"
          name="cuotasAutomaticas"
          checked={!!cuotasAutomaticasValue}
          {...register("cuotasAutomaticas", { valueAsBoolean: true })}
        />

        {/* Campo para la frecuencia */}
        <label htmlFor="frecuencia">Frecuencia</label>
        <select id="frecuencia" {...register("frecuencia")}>
          <option value="mensual">Mensual</option>
          <option value="quincenal">Quincenal</option>
          <option value="semanal">Semanal</option>
        </select>
        {errors.frecuencia && (
          <p className="input-error">{errors.frecuencia.message}</p>
        )}

        {/* Campo para la fecha de inicio */}
        <Input
          type="date"
          label="Fecha de inicio"
          name="fechaInicio"
          {...register("fechaInicio")}
          error={errors.fechaInicio && errors.fechaInicio.message}
        />

        <CategoryInput {...register("categoria_fk")} />

        <div className="form-actions">
          <Button type="submit" label="Guardar cambios" />
          <Button
            type="button"
            label="Cancelar"
            className="btn-cancel"
            onClick={() => navigate("/outcome/add")}
          />
        </div>
      </form>
    </div>
  );
};

export { EditOutcome };
