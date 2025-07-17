import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // <-- Importa useNavigate
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
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { Toggle } from "../../components/Forms/Toggle";
import { Select } from "../../components";

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
  cuotasAutomaticas: yup.boolean(),
});

const NewOutcome = () => {
  const { user } = useContext(AuthContext);
  const [gastos, setGastos] = useState([]);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null); // Estado para la imagen seleccionada
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [toggleFrecuenciaActivo, setToggleFrecuenciaActivo] = useState(false);
  const [toggleCuotasActivo, setToggleCuotasActivo] = useState(false);

  const navigate = useNavigate();

  const optionsFrecuencia = [
    { value: "semanal", label: "Semanal" },
    { value: "quincenal", label: "Quincenal" },
    { value: "mensual", label: "Mensual" },
  ];

  const optionsCuotas = [
    { value: 3, label: "3 cuotas" },
    { value: 6, label: "6 cuotas" },
    { value: 12, label: "12 cuotas" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: null,
      descripcion: "",
      nombre: "",
      tipo: "variable",
      estado: "pendiente",
      cuotas: 1,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
      categoria_fk: "",
      cuotasAutomaticas: false,
    },
  });

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `https://back-fbch.onrender.com/gastos/usuario/${user.id}`
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

      if (data.cantidad == null || data.cantidad === "") {
        data.cantidad = 0;
      }

      console.log("Datos del formulario:", data); // Depuración
      const token = Cookies.get("token") || null;

      //Si el toggle de acreditado esta marcado entonces lo acreditamos
      const estado = data.acreditado ? "pagado" : "pendiente";

      const response = await axios.post(
        "https://back-fbch.onrender.com/gastos",
        {
          ...data,
          user_fk: user.id,
          estado: "pendiente",
          pendienteConfirmacion: !data.acreditado,
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

      navigate("/outcomes");
    } catch (error) {
      console.error("Error al crear el gasto:", error.response?.data);
    } finally {
      setLoading(false);
    }
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
              setValue("categoria_fk", category._id, { shouldValidate: true });
              setSelectedCategory(category);
            }}
            selectedCategory={selectedCategory}
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

          {/* Tipo de gasto*/}
          {toggleFrecuenciaActivo ? (
            <div className="toggle-container toggle-container--active">
              <Toggle
                label="Gasto fijo"
                onChange={() =>
                  setToggleFrecuenciaActivo(!toggleFrecuenciaActivo)
                }
                defaultChecked={toggleFrecuenciaActivo}
              />

              <Select
                labelField="Frecuencia del gasto"
                options={optionsFrecuencia}
              />

              {errors.frecuencia && (
                <p className="input-error">{errors.frecuencia.message}</p>
              )}
            </div>
          ) : (
            <div className="toggle-container">
              <Toggle
                label="Gasto fijo"
                onChange={() =>
                  setToggleFrecuenciaActivo(!toggleFrecuenciaActivo)
                }
                defaultChecked={toggleFrecuenciaActivo}
              />

              <p className="toggle-container__message">
                Marcá esta opción si este gasto es recurrente y querés que te
                recordemos pagarlo
              </p>
            </div>
          )}

          {errors.tipo && <p className="input-error">{errors.tipo.message}</p>}

          {/* Campo para las cuotas */}
          {toggleCuotasActivo ? (
            <div className="toggle-container toggle-container--active">
              <Toggle
                label="Gasto en cuotas"
                onChange={setToggleCuotasActivo}
                defaultChecked={toggleCuotasActivo}
              />

              <Select
                labelField="Cantidad de cuotas"
                options={optionsCuotas}
                {...register("cuotas")}
              />
            </div>
          ) : (
            <div className="toggle-container">
              <Toggle
                label="Gasto en cuotas"
                onChange={setToggleCuotasActivo}
                defaultChecked={toggleCuotasActivo}
              />

              <p className="toggle-container__message">
                Marcá esta opción si vas a pagar este total en varias cuotas
              </p>
            </div>
          )}

          {errors.cuotas && (
            <p className="input-error">{errors.cuotas.message}</p>
          )}

          {/* Cobrado o pendiente */}
          {!toggleCuotasActivo && !toggleFrecuenciaActivo && (
            <div className="toggle-container">
              <Toggle
                label="Gasto ya abonado"
                defaultChecked={false}
                {...register("acreditado")}
              />

              <p className="toggle-container__message">
                Marcá esta opción si ya pagaste
                {toggleCuotasActivo && "la primera cuota"}
              </p>
            </div>
          )}

          {(toggleCuotasActivo || toggleFrecuenciaActivo) && (
            <div className="toggle-container">
              <Toggle
                label="Pago automático"
                name="cuotasAutomaticas"
                {...register("cuotasAutomaticas")}
                // defaultChecked={true}
              />

              <p className="toggle-container__message">
                Activá esta función si querés que el gasto se marque como pagado
                automáticamente
              </p>
            </div>
          )}

          <Button
            type="submit"
            label={loading ? "Creando..." : "Agregar gasto"}
            className="btn btn--filled-blue"
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
};

export { NewOutcome };
