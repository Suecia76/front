import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { CategoryInput } from "../../components/Forms/CategoryInput";
import { Button } from "../../components/Button";
import { InputCalculator } from "../../components/Forms/InputCalculator";
import { StatusBar } from "../../components/StatusBar";
import Cookies from "js-cookie";
import { Toggle } from "../../components/Forms/Toggle";
import { Select } from "../../components";

const schema = yup.object().shape({
  cantidad: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Ingresa un monto válido")
    .required("El monto es obligatorio"),
  descripcion: yup.string(),
  nombre: yup.string().required("El nombre es obligatorio"),
  tipo: yup
    .string()
    .oneOf(["fijo", "variable"], "El tipo debe ser 'fijo' o 'variable'")
    .required("El tipo es obligatorio"),
  categoria_fk: yup
    .string()
    .required("Por favor selecciona una categoría")
    .notOneOf([""], "Por favor selecciona una categoría"),
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
  cuotasAutomaticas: yup.boolean(),
});

const NewIncome = () => {
  const { user } = useContext(AuthContext);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toggleFrecuenciaActivo, setToggleFrecuenciaActivo] = useState(false);

  const [toggleCuotasActivo, setToggleCuotasActivo] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cantidad: null,
      descripcion: "",
      nombre: "",
      tipo: "variable",
      categoria_fk: "",
      cuotas: 1,
      frecuencia: "mensual",
      fechaInicio: new Date().toISOString().slice(0, 10),
      cuotasAutomaticas: false,
    },
  });

  useEffect(() => {
    const fetchIngresos = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ingresos/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setIngresos(response.data);
      } catch (error) {
        console.error("Error al obtener los ingresos:", error.response?.data);
        setError("Error al cargar los ingresos.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token") || null;
      console.log("Token:", token);
      console.log("Datos enviados:", data);

      // Si el toggle de cuotas está desactivado, forzar 1
      if (!toggleCuotasActivo) {
        data.cuotas = 1;
      }

      if (data.cantidad == null || data.cantidad === "") {
        data.cantidad = 0;
      }

      //Si el toggle de acreditado esta marcado entonces lo acreditamos
      const estado = data.acreditado ? "pagado" : "pendiente";

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ingresos`,
        {
          ...data,
          user_fk: user.id,
          estado: "pendiente",
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Creaste un ingreso correctamente", response.data);

      setIngresos([...ingresos, response.data.ingreso]);
      reset();

      setSelectedCategoryImage(null); // Reiniciar la imagen seleccionada

      navigate("/incomes");
    } catch (error) {
      console.error("Error al crear el ingreso:", error.response?.data);
      setError("Error al crear el ingreso.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <StatusBar label="Nuevo ingreso" />

      <div id="newIncome">
        <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
          {/* Monto */}
          <InputCalculator
            label="Monto"
            placeholder="0"
            name="cantidad"
            {...register("cantidad")}
            error={errors.cantidad && errors.cantidad.message}
            setValue={setValue}
          />

          {/* Nombre */}
          <Input
            type="text"
            label="Título"
            placeholder="Título del ingreso"
            name="nombre"
            {...register("nombre")}
            error={errors.nombre && errors.nombre.message}
          />

          {/* Descripción */}
          <Textarea
            label="Descripción"
            name="descripcion"
            placeholder="Escribí la descripción del ingreso"
            {...register("descripcion")}
            error={errors.descripcion && errors.descripcion.message}
          />

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

          {/* Tipo de ingreso */}
          {toggleFrecuenciaActivo ? (
            <div className="toggle-container toggle-container--active">
              <Toggle
                label="Ingreso fijo"
                onChange={() =>
                  setToggleFrecuenciaActivo(!toggleFrecuenciaActivo)
                }
                defaultChecked={toggleFrecuenciaActivo}
              />

              <Select
                labelField="Frecuencia del ingreso"
                options={optionsFrecuencia}
              />
            </div>
          ) : (
            <div className="toggle-container">
              <Toggle
                label="Ingreso fijo"
                onChange={() =>
                  setToggleFrecuenciaActivo(!toggleFrecuenciaActivo)
                }
                defaultChecked={toggleFrecuenciaActivo}
              />

              <p className="toggle-container__message">
                Marcá esta opción si este ingreso es recurrente y querés que te
                recordemos acreditarlo
              </p>
            </div>
          )}

          {errors.tipo && <p className="input-error">{errors.tipo.message}</p>}

          {/* Campo para las cuotas */}
          {!toggleFrecuenciaActivo &&
            (toggleCuotasActivo ? (
              <div className="toggle-container toggle-container--active">
                <Toggle
                  label="Ingreso en cuotas"
                  onChange={(val) => {
                    setToggleCuotasActivo(val);
                    if (!val) {
                      setValue("cuotas", 1);
                    }
                  }}
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
                  label="Ingreso en cuotas"
                  onChange={setToggleCuotasActivo}
                  defaultChecked={toggleCuotasActivo}
                />
                <p className="toggle-container__message">
                  Marcá esta opción si vas a cobrar este total en varias cuotas
                </p>
              </div>
            ))}

          {(toggleFrecuenciaActivo || toggleCuotasActivo) && (
            <div className="toggle-container">
              <Toggle
                label="Acreditación automática"
                name="cuotasAutomaticas"
                {...register("cuotasAutomaticas")}
                // defaultChecked={true}
              />

              <p className="toggle-container__message">
                Activá esta función si querés que el ingreso se acredite
                automáticamente en tu saldo cada mes
              </p>
            </div>
          )}

          {/* Cobrado o pendiente solo se muestra si no es una transacción en cuotas o fija*/}
          {!toggleCuotasActivo && !toggleFrecuenciaActivo && (
            <div className="toggle-container">
              <Toggle
                label="Dinero ya acreditado"
                defaultChecked={false}
                {...register("acreditado")}
              />
              <p className="toggle-container__message">
                Marcá esta opción si ya tenés el dinero.No disponible para
                ingresos fijos o en cuotas
              </p>
            </div>
          )}

          {errors.cuotas && (
            <p className="input-error">{errors.cuotas.message}</p>
          )}

          {/* Campo para la fecha de inicio */}
          {/*   <Input
            type="date"
            label="Fecha de cobro"
            name="fechaInicio"
            {...register("fechaInicio")}
            error={errors.fechaInicio && errors.fechaInicio.message}
          /> */}

          <input
            type="hidden"
            {...register("cuotasAutomaticas")}
            value={true}
          />

          <Button
            type="submit"
            label={loading ? "Creando..." : "Agregar ingreso"}
            className="btn btn--filled-blue"
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
};

export { NewIncome };
