import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { Select } from "../../components";
import { Button } from "../../components/Button";
import { StatusBar, ModalWrapper, Dialog } from "../../components";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  objetivo: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .required("El objetivo es obligatorio"),
  descripcion: yup.string(),
  tipo: yup
    .string()
    .oneOf(["", "montoMensual", "porcentajeMensual"], "Tipo de meta inválido"),
  montoMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo")
    .when("tipo", {
      is: "montoMensual",
      then: (s) => s.required("El monto mensual es obligatorio"),
      otherwise: (s) => s.notRequired(),
    }),
  porcentajeMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El porcentaje debe ser positivo")
    .when("tipo", {
      is: "porcentajeMensual",
      then: (s) => s.required("El porcentaje mensual es obligatorio"),
      otherwise: (s) => s.notRequired(),
    }),
  moneda_extranjera: yup.boolean().default(false),
  monedaNombre: yup.string().when("moneda_extranjera", {
    is: true,
    then: (s) => s.required("El nombre de la moneda es obligatorio"),
    otherwise: (s) => s.notRequired(),
  }),
  monedaSimbolo: yup.string().when("moneda_extranjera", {
    is: true,
    then: (s) => s.required("El símbolo de la moneda es obligatorio").max(5),
    otherwise: (s) => s.notRequired(),
  }),
});

const EditGoal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [type, setType] = useState("");
  const [isForeignCurrency, setIsForeignCurrency] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      objetivo: 0,
      descripcion: "",
      tipo: "",
      montoMensual: undefined,
      porcentajeMensual: undefined,
      moneda_extranjera: false,
      monedaNombre: "",
      monedaSimbolo: "",
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await axios.get(
          `https://app-nttd.onrender.com/metas/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const goal = response.data.goal ?? response.data;

        setValue("nombre", goal.nombre);
        setValue("objetivo", goal.objetivo);
        setValue("descripcion", goal.descripcion);

        const tipoValue = goal.tipo?.montoMensual
          ? "montoMensual"
          : goal.tipo?.porcentajeMensual
          ? "porcentajeMensual"
          : "";
        setValue("tipo", tipoValue);
        setType(tipoValue);

        if (tipoValue === "montoMensual") {
          setValue("montoMensual", goal.tipo.montoMensual);
        } else if (tipoValue === "porcentajeMensual") {
          setValue("porcentajeMensual", goal.tipo.porcentajeMensual);
        }

        const hasForeign = Boolean(goal.moneda_extranjera);
        setIsForeignCurrency(hasForeign);
        setValue("moneda_extranjera", hasForeign);

        if (hasForeign) {
          setValue("monedaNombre", goal.moneda_extranjera.nombre || "");
          setValue("monedaSimbolo", goal.moneda_extranjera.simbolo || "");
        }

        setGoal(goal);
      } catch (err) {
        console.error("fetchGoal error:", err);
        setError("Error al cargar la meta.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || "";

      const payload = {
        ...data,
        moneda_extranjera: isForeignCurrency
          ? { nombre: data.monedaNombre, simbolo: data.monedaSimbolo }
          : null,
      };

      await axios.put(`https://app-nttd.onrender.com/metas/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Updated");
      navigate("/goals");
    } catch (err) {
      console.error("onSubmit error:", err);
      setError("Error al actualizar la meta.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = Cookies.get("token") || "";
      await axios.delete(`https://app-nttd.onrender.com/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/goals");
    } catch (err) {
      console.error("delete error:", err);
      setError("Error al eliminar la meta.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      {/* <div className="btn-floating__container">
        <Button
          type="button"
          label="Atrás"
          className="btn btn--floating-right"
          onClick={() => navigate("/goals")}
        />
      </div> */}

      <StatusBar label="Editar Meta" />

      <div id="editGoal">
        {!goal.tipo.porcentajeMensual && !goal.tipo.montoMensual && (
          <div className="editGoal__actions">
            <a className="btn btn--filled-blue" href={`/goals/progress/${id}`}>
              Añadir progreso
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
          <Input {...register("nombre")} label="Nombre" placeholder="..." />
          {errors.nombre && (
            <p className="error-message">{errors.nombre.message}</p>
          )}

          <Input
            {...register("objetivo")}
            label="Objetivo"
            type="number"
            placeholder="..."
          />
          {errors.objetivo && (
            <p className="error-message">{errors.objetivo.message}</p>
          )}

          <Textarea
            {...register("descripcion")}
            label="Descripción"
            placeholder="..."
          />

          <Select
            {...register("tipo")}
            labelField="Tipo de meta"
            options={[
              { value: "", label: "Avances manuales" },
              { value: "montoMensual", label: "Monto Mensual" },
              { value: "porcentajeMensual", label: "Porcentaje Mensual" },
            ]}
            onChange={(e) => {
              const selected = e.target.value;
              setType(selected);
              setValue("tipo", selected);

              // 🔥 Limpiamos el campo que no corresponde
              if (selected === "montoMensual") {
                setValue("porcentajeMensual", undefined);
              } else if (selected === "porcentajeMensual") {
                setValue("montoMensual", undefined);
              } else {
                setValue("porcentajeMensual", undefined);
                setValue("montoMensual", undefined);
              }
            }}
            disabled={isForeignCurrency}
          />

          {errors.tipo && (
            <p className="error-message">{errors.tipo.message}</p>
          )}

          {!isForeignCurrency && type === "montoMensual" && (
            <>
              <Input
                {...register("montoMensual")}
                label="Monto Mensual"
                type="number"
                placeholder="..."
              />
              {errors.montoMensual && (
                <p className="error-message">{errors.montoMensual.message}</p>
              )}
            </>
          )}

          {!isForeignCurrency && type === "porcentajeMensual" && (
            <>
              <Input
                {...register("porcentajeMensual")}
                label="Porcentaje Mensual"
                type="number"
                placeholder="..."
              />
              {errors.porcentajeMensual && (
                <p className="error-message">
                  {errors.porcentajeMensual.message}
                </p>
              )}
            </>
          )}

          {isForeignCurrency && (
            <>
              <Input
                {...register("monedaNombre")}
                label="Nombre de la moneda"
                placeholder="Ej: Dólar"
              />
              {errors.monedaNombre && (
                <p className="error-message">{errors.monedaNombre.message}</p>
              )}

              <Input
                {...register("monedaSimbolo")}
                label="Símbolo"
                placeholder="Ej: USD"
              />
              {errors.monedaSimbolo && (
                <p className="error-message">{errors.monedaSimbolo.message}</p>
              )}

              <p>
                Importante: Tené en cuenta que el progreso que tenés guardado
                considera la moneda original en la que fue creada la meta.
              </p>
            </>
          )}

          <div className="form-actions">
            <Button
              type="submit"
              label="Guardar cambios"
              className="btn btn--filled-blue"
              disabled={deleting}
            />
            <Button
              type="button"
              label={deleting ? "Eliminando..." : "Eliminar meta"}
              className="btn btn--filled-red"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            />
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <ModalWrapper small>
          <Dialog
            title="Confirmar eliminación"
            text="¿Estás seguro de eliminar esta meta?"
            option1="Eliminar"
            option2="Cancelar"
            onClick1={handleDelete}
            onClick2={() => setShowDeleteModal(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export { EditGoal };
