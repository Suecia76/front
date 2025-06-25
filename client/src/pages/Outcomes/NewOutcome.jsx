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
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { CategoryExpenseChart } from "../../components/Charts/CategoryExpenseChart";
import { Toggle } from "../../components/Forms/Toggle";

const schema = yup.object().shape({
  cantidad: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .required("El monto es obligatorio"),
  descripcion: yup.string(),
  nombre: yup.string().required("El nombre es obligatorio"),
  tipo: yup
    .string()
    .oneOf(["fijo", "variable"])
    .required("El tipo es obligatorio"),
  estado: yup
    .string()
    .oneOf(["pendiente", "pagado"])
    .required("El estado es obligatorio"),
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
  categoria_fk: yup
    .string()
    .required("Por favor selecciona una categoría")
    .notOneOf([""], "Por favor selecciona una categoría"),
});

const NewOutcome = () => {
  const { user } = useContext(AuthContext);
  const [gastos, setGastos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [outcomeToDelete, setOutcomeToDelete] = useState(null);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null); // Estado para la imagen seleccionada
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: 0,
      descripcion: "",
      nombre: "",
      tipo: "variable",
      estado: "pendiente",
      cuotas: 1,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
      categoria_fk: "",
    },
  });

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/gastos/usuario/${user.id}`
        );
        setGastos(response.data);
      } catch (error) {
        console.error("Error al obtener los gastos:", error.response?.data);
      }
    };

    fetchGastos();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token") || null;
      const response = await axios.post(
        "http://localhost:3000/gastos",
        {
          ...data,
          user_fk: user.id,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setGastos([...gastos, response.data.gasto]);
      reset();
      setSelectedCategoryImage(null);
    } catch (error) {
      console.error("Error al crear el gasto:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!outcomeToDelete) return;
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(
        `http://localhost:3000/gastos/${outcomeToDelete._id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setGastos(gastos.filter((gasto) => gasto._id !== outcomeToDelete._id));
      setShowModal(false);
      setOutcomeToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el gasto:", error.response?.data);
    }
  };

  const openDeleteModal = (gasto) => {
    setOutcomeToDelete(gasto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOutcomeToDelete(null);
  };

  return (
    <>
      <StatusBar label="Cargar gasto" />

      <div id="newOutcome">
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
            placeholder="Título del gasto"
            name="nombre"
            {...register("nombre")}
            error={errors.nombre && errors.nombre.message}
          />

          <Textarea
            label="Descripción"
            name="descripcion"
            placeholder="Escribí la descripción del gasto"
            {...register("descripcion")}
            error={errors.descripcion && errors.descripcion.message}
          />

          {/* Campo para el tipo */}
          <label htmlFor="tipo">Tipo de gasto</label>
          <select id="tipo" {...register("tipo")}>
            <option value="fijo">Fijo</option>
            <option value="variable">Variable</option>
          </select>
          {errors.tipo && <p className="input-error">{errors.tipo.message}</p>}

          {/* Campo para el estado */}
          <label htmlFor="estado">Estado del gasto</label>
          <select id="estado" {...register("estado")}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
          {errors.estado && <p>{errors.estado.message}</p>}

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

          {/* Componente CategoryPicker */}
          <CategoryInput
            onCategorySelect={(category) => {
              console.log("Categoría seleccionada:", category); // Depuración
              setValue("categoria_fk", category._id, { shouldValidate: true }); // Actualizar el valor del campo y disparar validación
              setSelectedCategoryImage(
                `http://localhost:3000/uploads/${category.imagen}` // Actualizar la imagen seleccionada
              );
            }}
          />
          {errors.categoria_fk && (
            <p className="input-error">{errors.categoria_fk.message}</p>
          )}

          {/* Mostrar la imagen de la categoría seleccionada */}
          {selectedCategoryImage && (
            <div className="selected-category-image">
              <p>Categoria seleccionada:</p>
              <img
                src={selectedCategoryImage}
                alt="Categoría seleccionada"
                style={{ width: "100px", height: "100px", marginTop: "10px" }}
              />
            </div>
          )}

          <Toggle
            label="Cuotas automáticas"
            name="cuotasAutomaticas"
            {...register("cuotasAutomaticas")}
            defaultChecked={true}
          />

          <Button
            type="submit"
            label={loading ? "Creando..." : "Agregar gasto"}
            className="btn btn--filled-blue"
            disabled={loading}
          />
        </form>
      </div>
      <CategoryExpenseChart user={user} />
      <div>
        <h2>Mis Gastos</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="error-message">{error}</p>}

        {gastos.length > 0 ? (
          <ul>
            {gastos.map((gasto) => (
              <li key={gasto._id}>
                <div>
                  <strong>{gasto.nombre}</strong> - ${gasto.cantidad}
                  <p>{gasto.descripcion}</p>
                </div>
                <div>
                  <button
                    className="btn-delete"
                    onClick={() => openDeleteModal(gasto)}
                  >
                    Eliminar
                  </button>
                  <Link to={`/outcomes/edit/${gasto._id}`} className="btn-edit">
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes gastos registrados.</p>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>¿Estás seguro de que deseas eliminar este gasto?</h3>
              <p>
                <strong>{outcomeToDelete?.nombre}</strong> - $
                {outcomeToDelete?.cantidad}
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
      </div>
    </>
  );
};

export { NewOutcome };
