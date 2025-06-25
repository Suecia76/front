import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { Button } from "../../components/Button";
import Cookies from "js-cookie";

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
    .positive("El monto debe ser positivo")
    .notRequired()
    .default(0),
});

const EditGoal = () => {
  const { id } = useParams(); // Obtener el ID de la meta desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario después de editar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      objetivo: 0,
      descripcion: "",
      progreso: 0,
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        console.log("ID:", id);
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/metas/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const goal = response.data;
        // Cargar los valores de la meta en el formulario
        setValue("nombre", goal.nombre);
        setValue("objetivo", goal.objetivo);
        setValue("descripcion", goal.descripcion);
        setValue("progreso", goal.progreso);
      } catch (error) {
        console.error("Error al cargar la meta:", error.response?.data);
        setError("Error al cargar la meta.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || null;
      const response = await axios.put(
        `https://back-fbch.onrender.com/metas/${id}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Meta actualizada:", response.data);
      navigate("/goals/add"); // Redirigir a la lista de metas
    } catch (error) {
      console.error("Error al actualizar la meta:", error.response?.data);
      setError("Error al actualizar la meta.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="editGoal">
      <h2>Editar Meta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
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
        {errors.descripcion && (
          <p className="error-message">{errors.descripcion.message}</p>
        )}

        <Input
          name="progreso"
          label="Progreso"
          type="number"
          placeholder="Progreso actual de la meta"
          {...register("progreso")}
        />
        {errors.progreso && (
          <p className="error-message">{errors.progreso.message}</p>
        )}

        <div className="form-actions">
          <Button type="submit" label="Guardar cambios" />
          <Button
            type="button"
            label="Cancelar"
            className="btn-cancel"
            onClick={() => navigate("/goals/add")}
          />
        </div>
      </form>
    </div>
  );
};

export { EditGoal };
