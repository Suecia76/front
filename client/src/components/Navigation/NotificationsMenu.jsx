import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

const NotificationsMenu = ({ open }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user.id) return;
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `https://back-1-1j7o.onrender.com/notificaciones/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };
    if (open) fetchNotifications();
  }, [open, user]);

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `https://back-1-1j7o.onrender.com/notificaciones/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error al borrar notificación:", err);
    }
  };

  return (
    <div className="notifications">
      {open && (
        <div className="notifications__container">
          {notifications.length > 0 ? (
            <ul className="notifications__list">
              {notifications.map((n) => (
                <li className="notifications__item" key={n._id}>
                  {n.imagen && (
                    <img
                      src={n.imagen}
                      alt="icono"
                      style={{ width: 32, height: 32, marginRight: 8 }}
                    />
                  )}
                  <div>
                    <strong>{n.titulo}</strong>
                    <div>{n.body}</div>
                    <small>{new Date(n.fecha).toLocaleString()}</small>
                  </div>
                  <button
                    className="notifications__delete"
                    onClick={() => handleDelete(n._id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="notifications__empty">No tienes notificaciones</div>
          )}
        </div>
      )}
    </div>
  );
};

NotificationsMenu.displayName = "NotificationsMenu";
NotificationsMenu.propTypes = {
  open: PropTypes.bool,
};

export { NotificationsMenu };
