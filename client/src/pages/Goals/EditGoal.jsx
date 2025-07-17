import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components/Forms/Input";
import { Textarea } from "../../components/Forms/Textarea";
import { Button } from "../../components/Button";
import { Select } from "../../components";
import Cookies from "js-cookie";
import { StatusBar, ModalWrapper, Dialog  } from "../../components";


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
  tipo: yup
    .string()
    .oneOf(["montoMensual", "porcentajeMensual"], "Tipo de meta inválido"),
  porcentajeMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El porcentaje debe ser positivo"),
  montoMensual: yup
    .number()
    .typeError("Debe ser un número")
    .positive("El monto debe ser positivo"),
});

const EditGoal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [type, setType] = useState("");

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
      progreso: 0,
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(`http://localhost:3000/metas/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const goal = response.data;
        setValue("nombre", goal.nombre);
        setValue("objetivo", goal.objetivo);
        setValue("descripcion", goal.descripcion);
        setValue("progreso", goal.progreso);

        const tipoValue = goal.tipo?.montoMensual
          ? "montoMensual"
          : "porcentajeMensual";
        setValue("tipo", tipoValue);

        setType(tipoValue);

        setValue("montoMensual", goal.tipo?.montoMensual || 0);
        setValue("porcentajeMensual", goal.tipo?.porcentajeMensual || 0);
      } catch (error) {
        setError("Error al cargar la meta.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token") || null;
      await axios.put(
        `http://localhost:3000/metas/${id}`,
        { ...data },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // console.log("Meta actualizada:", response.data);
      navigate("/goals"); // Redirigir a la lista de metas
    } catch (error) {
      setError("Error al actualizar la meta.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = Cookies.get("token") || null;
      await axios.delete(`http://localhost:3000/metas/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      
      navigate("/goals");
    } catch (error) {
      setError("Error al eliminar la meta.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className="btn-floating__container">
        <Button
          type="button"
          label="Atrás"
          className="btn btn--floating-left"
          onClick={() => navigate("/goals")}
        />
      </div>

      <StatusBar label="Editar Meta" />

      <div id="editGoal">
        <form onSubmit={handleSubmit(onSubmit)} className="autolayout-1">
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
          {errors.descripcion && (
            <p className="error-message">{errors.descripcion.message}</p>
          )}

          <Select
            options={[
              {
                value: null,
                label: "quiero agregar avances manuales",
                selected: true,
              },
              { value: "montoMensual", label: "Monto Mensual" },
              { value: "porcentajeMensual", label: "Porcentaje Mensual" },
            ]}
            labelField="Tipo de Meta"
            {...register("tipo")}
            onChange={(e) => setType(e.target.value)}
          />

          {errors.tipo && (
            <p className="error-message">{errors.tipo.message}</p>
          )}

          {type === "montoMensual" && (
            <Input
              name="montoMensual"
              label="Monto Mensual"
              type="number"
              placeholder="Monto mensual de la meta"
              {...register("montoMensual")}
            />
          )}

          {errors.montoMensual && (
            <p className="error-message">{errors.montoMensual.message}</p>
          )}

          {type === "porcentajeMensual" && (
            <Input
              name="porcentajeMensual"
              label="Porcentaje Mensual"
              type="number"
              placeholder="Porcentaje mensual de la meta"
              {...register("porcentajeMensual")}
            />
          )}

          {errors.porcentajeMensual && (
            <p className="error-message">{errors.porcentajeMensual.message}</p>
          )}

          <Input
            name="progreso"
            label="Progreso"
            type="number"
            placeholder="Progreso actual de la meta"
            {...register("progreso")}
          />
          {errors.progreso && (
            <p className="error-message">{errors.progreso.message}</p>
          )}

          <div className="form-actions">
            <Button
              className="btn btn--filled-blue"
              type="submit"
              label={loading ? "Guardando..." : "Guardar cambios"}
              disabled={loading || deleting}
            />
            <Button
              className="btn btn--filled-red"
              label={deleting ? "Eliminando..." : "Eliminar meta"}
              onClick={openDeleteModal}
              disabled={loading || deleting}
              type="button"
            />
          </div>
        </form>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
          <ModalWrapper small={true}>
            <Dialog 
              title="Confirmar eliminación"
              text="¿Estás seguro de que deseas eliminar esta meta?"
              onClick1={handleDelete}
              onClick2={closeDeleteModal}
              option1= "Eliminar"
              option2="Cancelar"
            />
          </ModalWrapper>
        
        
      )}
    </>
  );
};

export { EditGoal };
