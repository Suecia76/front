import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/Forms/Input";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/Forms/Textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { StatusBar } from "../../components/StatusBar";
import * as yup from "yup";
import { GoalsList } from "../../components/Goals/GoalsList";

// Esquema de validación para el formulario de creación de metas
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

// Esquema de validación para el formulario de avances
const advanceSchema = yup.object().shape({
  avance: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .required("El monto del avance es obligatorio"),
});

const NewGoal = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]); // Lista de metas
  const [error, setError] = useState(null); // Estado para errores
  const [showModal, setShowModal] = useState(false); // Controlar visibilidad del modal
  const [goalToDelete, setGoalToDelete] = useState(null); // Meta seleccionada para eliminar
  const [goalToUpdate, setGoalToUpdate] = useState(null); // Meta seleccionada para agregar avance
  const [showAdvanceModal, setShowAdvanceModal] = useState(false); // Modal para agregar avance

  // Formulario para crear metas
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      objetivo: 0,
      descripcion: "",
      progreso: 0,
    },
  });

  // Formulario para agregar avances
  const {
    register: registerAdvance,
    handleSubmit: handleAdvanceSubmit,
    formState: { errors: advanceErrors },
    reset: resetAdvanceForm,
  } = useForm({
    resolver: yupResolver(advanceSchema),
    defaultValues: {
      avance: 0,
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      if (!user) return;
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/metas/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setGoals(response.data);
      } catch (error) {
        console.error(error);
        setError("Error al obtener las metas.");
      }
    };
    fetchGoal();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || null;
      const response = await axios.post(
        "https://back-fbch.onrender.com/metas",
        {
          ...data,
          user_fk: user.id,
          progreso: data.progreso || 0,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setGoals([...goals, response.data.goal]);
      reset(); // Reiniciar el formulario de creación
    } catch (error) {
      console.error("Error al crear la meta:", error);
      setError("Error al crear la meta.");
    }
  };

  const handleDelete = async () => {
    if (!goalToDelete) return;
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(
        `https://back-fbch.onrender.com/metas/${goalToDelete._id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      // Actualizar la lista de metas después de eliminar
      setGoals(goals.filter((goal) => goal._id !== goalToDelete._id));
      setShowModal(false); // Cerrar el modal
      setGoalToDelete(null); // Limpiar la meta seleccionada
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
      setError("Error al eliminar la meta.");
    }
  };

  const handleAdvanceSubmitAction = async (data) => {
    if (!goalToUpdate) return;
    try {
      const token = Cookies.get("token") || null;
      const updatedProgreso = goalToUpdate.progreso + parseFloat(data.avance);
      const response = await axios.put(
        `https://back-fbch.onrender.com/metas/${goalToUpdate._id}`,
        {
          progreso: updatedProgreso,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      // Actualizar la meta en la lista
      setGoals(
        goals.map((goal) =>
          goal._id === goalToUpdate._id
            ? { ...goal, progreso: response.data.progreso }
            : goal
        )
      );
      setShowAdvanceModal(false); // Cerrar el modal
      setGoalToUpdate(null); // Limpiar la meta seleccionada
      resetAdvanceForm(); // Reiniciar el formulario de avances
    } catch (error) {
      console.error("Error al agregar avance:", error);
      setError("Error al agregar avance.");
    }
  };

  const openDeleteModal = (goal) => {
    setGoalToDelete(goal); // Establecer la meta seleccionada
    setShowModal(true); // Mostrar el modal
  };

  const openAdvanceModal = (goal) => {
    setGoalToUpdate(goal); // Establecer la meta seleccionada
    setShowAdvanceModal(true); // Mostrar el modal para agregar avance
  };

  const closeModal = () => {
    setShowModal(false); // Cerrar el modal
    setGoalToDelete(null); // Limpiar la meta seleccionada
  };

  const closeAdvanceModal = () => {
    setShowAdvanceModal(false); // Cerrar el modal
    setGoalToUpdate(null); // Limpiar la meta seleccionada
    resetAdvanceForm(); // Reiniciar el formulario de avances
  };

  return (
    <>
      <StatusBar label="Nueva meta" />
      <div id="newIncome">
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Input
            name="progreso"
            label="Progreso"
            type="number"
            placeholder="Progreso actual de la meta"
            {...register("progreso")}
          />
          <Button
            type="submit"
            label="Crear meta"
            className="btn btn--filled-blue margin-top-2"
          />
        </form>
        {/* Modal de confirmación para eliminar */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>¿Estás seguro de que deseas eliminar esta meta?</h3>
              <p>
                <strong>{goalToDelete?.nombre}</strong> - $
                {goalToDelete?.objetivo}
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="btn-confirm" onClick={handleDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal para agregar avance */}
        {showAdvanceModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Agregar Avance</h3>
              <form onSubmit={handleAdvanceSubmit(handleAdvanceSubmitAction)}>
                <Input
                  name="avance"
                  label="Monto del avance"
                  type="number"
                  placeholder="Ingresa el monto del avance"
                  {...registerAdvance("avance")}
                />
                {advanceErrors.avance && (
                  <p className="error-message">
                    {advanceErrors.avance.message}
                  </p>
                )}
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={closeAdvanceModal}>
                    Cancelar
                  </button>
                  <Button className="btn-confirm" type="submit">
                    Agregar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <GoalsList goals={goals} />{" "}
      {/* Componente para mostrar la lista de metas */}
      {error && <p className="error-message">{error}</p>}
      {goals.length > 0 ? (
        <ul className="goals">
          {goals.map((goal) => (
            <li key={goal._id}>
              <div>
                <strong>{goal.nombre}</strong> - ${goal.objetivo}
                <p>{goal.descripcion}</p>
                <p>Progreso: ${goal.progreso}</p>
              </div>
              <div>
                <button
                  className="btn-delete"
                  onClick={() => openDeleteModal(goal)}
                >
                  Eliminar
                </button>
                <Link to={`/goals/edit/${goal._id}`} className="btn-edit">
                  Editar
                </Link>
                <button
                  className="btn-advance"
                  onClick={() => openAdvanceModal(goal)}
                >
                  Agregar Avance
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes metas registradas.</p>
      )}
    </>
  );
};

export { NewGoal };
