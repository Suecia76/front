import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components/Forms/Input";
import { Button } from "../../components/Button";
import Cookies from "js-cookie";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  imagen: yup.mixed().notRequired(), // La imagen no es obligatoria para la edición
});

const EditCategory = () => {
  const { id } = useParams(); // Obtener el ID de la categoría desde la URL
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
      imagen: null,
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/categorias/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const category = response.data;
        // Cargar los valores de la categoría en el formulario
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

      // Si se seleccionó una nueva imagen, agregarla al FormData
      if (data.imagen && data.imagen.length > 0) {
        const file = data.imagen[0];
        formData.append("imagen", file);
      }

      const response = await axios.put(
        `https://back-fbch.onrender.com/categorias/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Categoría actualizada:", response.data);
      navigate("/categories/add"); // Redirigir a la lista de categorías
    } catch (error) {
      console.error("Error al actualizar la categoría:", error.response?.data);
      setError("Error al actualizar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="editCategory">
      <h2>Editar Categoría</h2>
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
            label="Cancelar"
            className="btn btn-text"
            onClick={() => navigate("/categories/add")}
          />
        </div>
      </form>
    </div>
  );
};

export { EditCategory };
