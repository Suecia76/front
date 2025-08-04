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
import { Toggle } from "../../components/Forms/Toggle";
import Cookies from "js-cookie";

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
  cuotas: yup
    .number()
    .oneOf([1, 3, 6, 12], "Las cuotas deben ser 1, 3, 6 o 12")
    .default(1),
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

const EditIncome = () => {
  const { id } = useParams(); // Obtener el ID del ingreso desde la URL
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
      categoria_fk: "",
      cuotas: 1,
      cuotasAutomaticas: true,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
    },
  });

  // Para que el toggle refleje el valor actual
  const cuotasAutomaticasValue = watch("cuotasAutomaticas");

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/ingresos/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const income = response.data;

        // Cargar los valores del ingreso en el formulario
        setValue("cantidad", income.cantidad);
        setValue("descripcion", income.descripcion);
        setValue("nombre", income.nombre);
        setValue("tipo", income.tipo); // Cargar el tipo de ingreso
        setValue("categoria_fk", income.categoria_fk);
        setValue("cuotas", income.cuotas || 1);
        setValue("cuotasAutomaticas", income.cuotasAutomaticas ?? true);
        setValue("frecuencia", income.frecuencia || "mensual");
        setValue(
          "fechaInicio",
          income.fechaInicio
            ? income.fechaInicio.slice(0, 10)
            : new Date().toISOString().slice(0, 10)
        );
      } catch (error) {
        console.error("Error al cargar el ingreso:", error.response?.data);
        setError("Error al cargar el ingreso.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || null;
      const response = await axios.put(
        `https://back-fbch.onrender.com/ingresos/${id}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Ingreso actualizado:", response.data);
      navigate("/income/add"); // Redirigir a la lista de ingresos
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error.response?.data);
      setError("Error al actualizar el ingreso.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="editIncome">
      <h2>Editar Ingreso</h2>
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
          placeholder="Título del ingreso"
          name="nombre"
          {...register("nombre")}
        />
        {errors.nombre && <p>{errors.nombre.message}</p>}

        <Textarea
          label="Descripción"
          name="descripcion"
          placeholder="Escribí la descripción del ingreso"
          {...register("descripcion")}
        />
        {errors.descripcion && <p>{errors.descripcion.message}</p>}

        <label htmlFor="tipo">Tipo de ingreso</label>
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
          {...register("cuotasAutomaticas")}
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
            onClick={() => navigate("/income/add")}
          />
        </div>
      </form>
    </div>
  );
};

export { EditIncome };
