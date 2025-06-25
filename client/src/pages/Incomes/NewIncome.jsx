import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { CategoryInput } from "../../components/Forms/CategoryInput";
import { Button } from "../../components/Button";
import { InputCalculator } from "../../components/Forms/InputCalculator";
import { StatusBar } from "../../components/StatusBar";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { IconButton } from "../../components/Buttons/IconButton";
import { Toggle } from "../../components/Forms/Toggle";

const schema = yup.object().shape({
  cantidad: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Ingresa un monto válido")
    .required("El monto es obligatorio"),
  descripcion: yup.string(),
  nombre: yup.string().required("El nombre es obligatorio"),
  tipo: yup
    .string()
    .oneOf(["fijo", "variable"], "El tipo debe ser 'fijo' o 'variable'")
    .required("El tipo es obligatorio"),
  categoria_fk: yup
    .string()
    .required("Por favor selecciona una categoría")
    .notOneOf([""], "Por favor selecciona una categoría"),
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
});

const NewIncome = () => {
  const { user } = useContext(AuthContext);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: 0,
      descripcion: "",
      nombre: "",
      tipo: "variable",
      categoria_fk: "",
      cuotas: 1,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    const fetchIngresos = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/ingresos/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setIngresos(response.data);
      } catch (error) {
        console.error("Error al obtener los ingresos:", error.response?.data);
        setError("Error al cargar los ingresos.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token") || null;
      console.log("Token:", token);
      console.log("Datos enviados:", data);

      const response = await axios.post(
        "https://back-fbch.onrender.com/ingresos",
        {
          ...data,
          user_fk: user.id,
          estado: "pendiente",
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Creaste un ingreso correctamente", response.data);

      setIngresos([...ingresos, response.data.ingreso]);
      reset();
      setSelectedCategoryImage(null); // Reiniciar la imagen seleccionada
    } catch (error) {
      console.error("Error al crear el ingreso:", error.response?.data);
      setError("Error al crear el ingreso.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!incomeToDelete) return;
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(
        `https://back-fbch.onrender.com/ingresos/${incomeToDelete._id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setIngresos(
        ingresos.filter((ingreso) => ingreso._id !== incomeToDelete._id)
      );
      setShowModal(false);
      setIncomeToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el ingreso:", error.response?.data);
    }
  };

  const openDeleteModal = (ingreso) => {
    setIncomeToDelete(ingreso);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIncomeToDelete(null);
  };

  return (
    <>
      <StatusBar label="Nuevo ingreso" />
      <div id="newIncome">
        <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
          <InputCalculator
            label="Monto"
            placeholder="0"
            name="cantidad"
            {...register("cantidad")}
            error={errors.cantidad && errors.cantidad.message}
          />
          <Input
            type="text"
            label="Título"
            placeholder="Título del ingreso"
            name="nombre"
            {...register("nombre")}
            error={errors.nombre && errors.nombre.message}
          />
          <Textarea
            label="Descripción"
            name="descripcion"
            placeholder="Escribí la descripción del ingreso"
            {...register("descripcion")}
            error={errors.descripcion && errors.descripcion.message}
          />
          <label htmlFor="tipo">Tipo de ingreso</label>
          <select id="tipo" {...register("tipo")}>
            <option value="fijo">Fijo</option>
            <option value="variable">Variable</option>
          </select>
          {errors.tipo && <p className="input-error">{errors.tipo.message}</p>}
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

          <CategoryInput
            onCategorySelect={(category) => {
              setValue("categoria_fk", category._id, { shouldValidate: true });
              setSelectedCategory(category);
            }}
            selectedCategory={selectedCategory}
          />
          {errors.categoria_fk && (
            <p className="input-error">{errors.categoria_fk.message}</p>
          )}
          <Toggle
            label="Cuotas automáticas"
            name="cuotasAutomaticas"
            {...register("cuotasAutomaticas")}
            defaultChecked={true}
          />

          <Button
            type="submit"
            label={loading ? "Creando..." : "Agregar ingreso"}
            className="btn btn--filled-blue"
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
};

export { NewIncome };
