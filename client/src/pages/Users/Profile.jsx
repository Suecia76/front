import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // Obtener el usuario del contexto
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null); // Estado para la imagen de perfil
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null); // Vista previa de la imagen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar la selección de la imagen de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Mostrar vista previa
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("token") || null;
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.password) {
        formDataToSend.append("password", formData.password); // Solo enviar si se cambia
      }
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage); // Agregar imagen si se seleccionó
      }

      const response = await axios.put(
        `http://localhost:3000/usuarios/${user.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user); // Actualizar el usuario en el contexto
      console.log("Usuario actualizado:", response.data.user);

      setPreviewImage(
        `http://localhost:3000/uploads/imagenes_perfil/${response.data.user.image}`
      ); // Actualizar la vista previa de la imagen
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err.response?.data);
      setError("Hubo un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <StatusBar label="Mi perfil" />
      
      <form onSubmit={handleSubmit} className="profile-form">
        {/* <div className="form-group">
          <label htmlFor="profileImage">Foto de perfil</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className="image-preview">
              <img
                src={previewImage}
                alt="Vista previa"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
          )}
        </div> */}


        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Deja en blanco para no cambiarla"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button
          type="submit"
          className="btn btn--filled-blue"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export { Profile };
