import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components/Forms/Input";
import { Button } from "../../components/Button";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { ModalWrapper } from "../../components/Modals/ModalWrapper";
import { Dialog } from "../../components/Modals/Dialog";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  imagen: yup.mixed().notRequired(),
});

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      imagen: null,
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categorias/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const category = response.data;
        setValue("nombre", category.nombre);
      } catch (error) {
        console.error("Error al cargar la categoría:", error.response?.data);
        setError("Error al cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = Cookies.get("token") || null;
      const formData = new FormData();

      formData.append("nombre", data.nombre);

      if (data.imagen && data.imagen.length > 0) {
        const file = data.imagen[0];
        formData.append("imagen", file);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/categorias/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Categoría actualizada:", response.data);
      navigate("/categories");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error.response?.data);
      setError("Error al actualizar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token") || null;
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/categorias/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      navigate("/categories");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error.response?.data);
      setError("Error al eliminar la categoría.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <StatusBar label="Editar Categoría" />
      <div id="editCategory">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="autolayout-1 display-flex flex-start"
          encType="multipart/form-data"
        >
          <Input
            type="text"
            label="Nombre"
            placeholder="Nombre de la categoría"
            name="nombre"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="error-message">{errors.nombre.message}</p>
          )}

          <Input
            label="Subir imágen"
            id="imagen"
            type="file"
            name="imagen"
            {...register("imagen")}
          />
          {errors.imagen && (
            <p className="error-message">{errors.imagen.message}</p>
          )}

          <div className="form-actions">
            <Button
              type="submit"
              label="Guardar cambios"
              className="btn btn--filled-blue"
            />
            <Button
              type="button"
              label="Eliminar"
              className="btn btn--filled-red"
              onClick={() => setShowDeleteModal(true)}
            />
          </div>
        </form>
      </div>
      {showDeleteModal && (
        <ModalWrapper centered={true}>
          <Dialog
            title="Confirmar eliminación"
            text="¿Estás seguro de que deseas eliminar esta categoría?"
            option1={"Eliminar"}
            option2={"Cancelar"}
            onClick1={handleDelete}
            onClick2={() => setShowDeleteModal(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export { EditCategory };
