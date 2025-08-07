import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/Forms/Input";
import { Button } from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../../components/Topbar";
import Cookies from "js-cookie";
import { StatusBar } from "../../components";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  imagen: yup.mixed().required("La imagen es obligatoria"),
});

const CategoryCreate = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imagen, setImagen] = useState(null); // Estado para la imagen

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
    },
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categorias/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setCategorias(response.data);
        navigate("/categories/add");
      } catch (error) {
        console.error("Error al obtener las categorías:", error.response?.data);
        setError("Error al cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token") || null;
      const formData = new FormData();

      // Agregar el nombre y el user_fk al FormData
      formData.append("nombre", data.nombre);
      formData.append("user_fk", user.id); // Agregar el ID del usuario autenticado

      // Verificar si se seleccionó una imagen
      if (data.imagen && data.imagen.length > 0) {
        const file = data.imagen[0];
        formData.append("imagen", file);
      } else {
        setError("La imagen es obligatoria.");
        setLoading(false);
        return;
      }

      // Depurar el contenido del FormData
      console.log("Contenido del FormData antes de enviar:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/categorias`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      setCategorias([...categorias, response.data]);
      reset();
      setImagen(null);
    } catch (error) {
      console.error("Error al crear la categoría:", error.response?.data);
      setError("Error al crear la categoría.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    console.log("Evento detectado en el input de imagen:", event);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Archivo seleccionado:", file);
      setImagen(file);
      setValue("imagen", file); // Actualiza el valor en react-hook-form
    }
  };

  /* const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/categorias/${categoryToDelete._id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setCategorias(
        categorias.filter((categoria) => categoria._id !== categoryToDelete._id)
      );
      setShowModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error.response?.data);
    }
  }; */

  /* const openDeleteModal = (categoria) => {
    setCategoryToDelete(categoria);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCategoryToDelete(null);
  }; */

  let url = `${import.meta.env.VITE_BACKEND_URL}/uploads/`;

  return (
    <>
      <StatusBar label="Agregar categoría" />
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="autolayout-1 display-flex flex-start"
        encType="multipart/form-data" // Importante para enviar archivos
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

        {/* Campo para subir imagen */}
        <Input
          id="imagen"
          type="file"
          onChange={handleImageChange} // Guardamos la imagen en el estado
          name="imagen"
          {...register("imagen")}
        />
        {errors.imagen && (
          <p className="error-message">{errors.imagen.message}</p>
        )}

        <div className="form-actions">
          <Button
            type="submit"
            label={loading ? "Creando..." : "Agregar Categoría"}
            className="btn btn--filled-blue"
            disabled={loading}
          />

          <Button
            label="Cancelar"
            className="btn btn--text"
            onClick={() => navigate("/categories")}
          />
        </div>
      </form>
    </>
  );
};

export { CategoryCreate };
