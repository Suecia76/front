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
import { StatusBar } from "../../components";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-1-1j7o.onrender.com/metas/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const goal = response.data;
        setValue("nombre", goal.nombre);
        setValue("objetivo", goal.objetivo);
        setValue("descripcion", goal.descripcion);
        setValue("progreso", goal.progreso);
      } catch (error) {
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
      await axios.put(
        `https://back-1-1j7o.onrender.com/metas/${id}`,
        { ...data },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // console.log("Meta actualizada:", response.data);
      navigate("/goals"); // Redirigir a la lista de metas
    } catch (error) {
      setError("Error al actualizar la meta.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(`https://back-1-1j7o.onrender.com/metas/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      navigate("/goals");
    } catch (error) {
      setError("Error al eliminar la meta.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className="btn-floating__container">
        <Button
          type="button"
          label="Atrás"
          className="btn btn--floating-left"
          onClick={() => navigate("/goals")}
        />
      </div>

      <StatusBar label="Editar Meta" />

      <div id="editGoal">
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
            <Button
              className="btn btn--filled-blue"
              type="submit"
              label={loading ? "Guardando..." : "Guardar cambios"}
              disabled={loading || deleting}
            />
            <Button
              className="btn btn--filled-red"
              label={deleting ? "Eliminando..." : "Eliminar meta"}
              onClick={openDeleteModal}
              disabled={loading || deleting}
              type="button"
            />
          </div>
        </form>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Estás seguro de que deseas eliminar esta meta?</h3>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { EditGoal };
