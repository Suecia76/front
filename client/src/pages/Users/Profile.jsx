import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { Input } from "../../components";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null); // Para almacenar datos completos del usuario
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    currentPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `https://back-fbch.onrender.comusuarios/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
        setPreviewImage(
          response.data.image
            ? `https://back-fbch.onrender.comuploads/imagenes_perfil/${response.data.image}`
            : null
        );
        setFormData({ email: response.data.email, password: "" });
      } catch (err) {
        console.error("Error al cargar datos del usuario", err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.currentPassword) {
      setError("Debes ingresar tu contraseña actual.");
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      setLoading(false);
      return;
    }
    try {
      const token = Cookies.get("token");
      const formDataToSend = new FormData();

      formDataToSend.append("email", formData.email);
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      // No incluyo imagen para edición, pero podés agregar si querés

      const response = await axios.put(
        `https://back-fbch.onrender.comusuarios/${user.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setUserData(response.data.user);
      setSuccess("Perfil actualizado correctamente.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error al actualizar el perfil:", err.response?.data);
      setError(
        "Hubo un error al actualizar el perfil. Chequeá los datos ingresados"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <p>Cargando datos...</p>;

  return (
    <>
      <StatusBar label={isEditing ? "Editar datos" : "Mi perfil"} />

      <div className="profile">
        {!isEditing ? (
          <div className="profile">
            <p className="profile__info">
              <span className="profile__data">Nombre:</span> {userData.name}
            </p>
            <p className="profile__info">
              <span className="profile__data">Apellido:</span>{" "}
              {userData.lastname}
            </p>
            <p className="profile__info">
              <span className="profile__data">Edad:</span> {userData.age}
            </p>
            <p className="profile__info">
              <span className="profile__data">Teléfono:</span>{" "}
              {userData.phonenumber}
            </p>
            <p className="profile__info">
              <span className="profile__data">Email:</span> {userData.email}
            </p>

            {previewImage && (
              <img
                src={previewImage}
                alt="Foto de perfil"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginTop: "1rem",
                }}
              />
            )}

            <button
              className="btn btn--filled-blue mt-4"
              onClick={() => setIsEditing(true)}
            >
              Editar datos
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile__form mt-6">
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <div className="password">
              <Input
                label="Contraseña actual"
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password__btn"
                tabIndex={-1}
                onClick={() => setShowCurrentPassword((v) => !v)}
              >
                <img
                  className="password__icon"
                  src={
                    showCurrentPassword
                      ? "/assets/icons/hide-password.svg"
                      : "/assets/icons/show-password.svg"
                  }
                  alt="Ver contraseña actual"
                />
              </button>
            </div>

            <div className="password">
              <Input
                label="Nueva contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password__btn"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                <img
                  className="password__icon"
                  src={
                    showPassword
                      ? "/assets/icons/hide-password.svg"
                      : "/assets/icons/show-password.svg"
                  }
                  alt="Ver nueva contraseña"
                />
              </button>
            </div>

            <div className="password">
              <Input
                label="Confirmar nueva contraseña"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password__btn"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                <img
                  className="password__icon"
                  src={
                    showConfirmPassword
                      ? "/assets/icons/hide-password.svg"
                      : "/assets/icons/show-password.svg"
                  }
                  alt="Ver confirmación"
                />
              </button>
            </div>

            {error && <p className="input-error">{error}</p>}
            {success && <p className="text-green-600 mt-2">{success}</p>}

            <div className="profile__actions">
              <button
                type="submit"
                className="btn btn--filled-blue"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export { Profile };
