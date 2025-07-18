import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataCard } from "../../components/Cards/DataCard";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import {
  StatusBar,
  Button,
  IconButton,
  InputDetail,
  CategoryPicker,
  ModalWrapper,
  Input,
  Toggle,
  Select,
  Textarea,
} from "../../components";
import { ConfirmTransaction } from "../../components/Forms/ConfirmTransaction";
import { Dialog } from "../../components/Modals/Dialog";

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
    .oneOf(["fijo", "variable"], "El tipo debe ser 'fijo' o 'variable'")
    .required("El tipo es obligatorio"),
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
  cuotasAutomaticas: yup.boolean().default(true),
});

const IncomeDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [income, setIncome] = useState({});
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleFrecuenciaActivo, setToggleFrecuenciaActivo] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toggleCuotasActivo, setToggleCuotasActivo] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const optionsFrecuencia = [
    { value: "semanal", label: "Semanal" },
    { value: "quincenal", label: "Quincenal" },
    { value: "mensual", label: "Mensual" },
  ];

  /* fetch Income */
  useEffect(() => {
    const fetchIncome = async (id) => {
      if (!user?.id) return;

      try {
        const token = Cookies.get("token") || null;

        const res = await axios.get(
          `https://back-fbch.onrender.com/ingresos/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setIncome(res.data);

        reset({
          nombre: res.data.nombre,
          cantidad: res.data.cantidad,
          descripcion: res.data.descripcion,
          tipo: res.data.tipo,
          cuotas: res.data.cuotas,
          frecuencia: res.data.frecuencia,
          fechaInicio: res.data.fechaInicio,
          cuotasAutomaticas: res.data.cuotasAutomaticas,
        });

        if (res.data.tipo === "fijo") {
          setToggleFrecuenciaActivo(true);
        }

        // Cargar los valores del ingreso en el formulario
      } catch (error) {
        console.error("Error al cargar el ingreso: ", error);
      }
    };

    fetchIncome(id);
  }, [id, reset, setValue, user?.id]);

  const onSubmit = async (data) => {
    console.log("data submitted: ", data);

    try {
      const token = Cookies.get("token") || null;

      await axios.put(`https://back-fbch.onrender.com/ingresos/${id}`, data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Ingreso actualizado");

      setIsEditing("");
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error.response?.data);
      setErrorMessage("Error al guardar los cambios.");
    }
  };

  console.log(income);
  //fetch category
  useEffect(() => {
    const fetchCategory = async (id) => {
      if (!user?.id) return;

      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/categorias/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setCategory(response.data);
      } catch (error) {
        console.error("Error al cargar la categoría:", error.response?.data);
      }
    };

    if (income?.categoria_fk) {
      fetchCategory(income.categoria_fk);
    }
  }, [income?.categoria_fk, user?.id]);

  const handleClose = () => {
    setIsEditing("");
  };

  const handleCategoryClick = (category) => {
    setCategory(category);

    setValue("categoria_fk", category._id); // ajustá según tu modelo

    handleSubmit(onSubmit)();
    setIsEditing("");
    console.log("Categoría seleccionada:", category);
  };

  const handleConfirmTransaction = async () => {
    //Backend code
    try {
      console.log("Confirmando");

      const token = Cookies.get("token") || null;

      console.log(token);

      const res = await axios.post(
        `https://back-fbch.onrender.com/ingresos/${id}/confirmar`,
        {},
        /* {
            // ...getValues(), 
            // pendienteConfirmacion: false,
           }, */
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Ingreso confirmado: ", res.data);
      setIncome(res.data);
      setConfirmationModalOpened(false);
    } catch (err) {
      console.log("Error al confirmar la transacción", err);
    }
  };

  const url = "https://back-fbch.onrender.com/uploads/";

  const cuotas = watch("cuotas");

  async function handleDeleteIncome(id) {
    console.log("Eliminando", id);

    try {
      const token = Cookies.get("token") || null;

      await axios.delete(`https://back-fbch.onrender.com/ingresos/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Ingreso eliminado");
      navigate("/incomes");
    } catch (err) {
      console.log("Error al eliminar el ingreso: ", err);
    }
  }

  const optionsCuotas = [
    { value: 1, label: "1 cuota" },
    { value: 3, label: "3 cuotas" },
    { value: 6, label: "6 cuotas" },
    { value: 12, label: "12 cuotas" },
  ];
  return (
    <>
      <StatusBar label="Detalle de ingreso" />
      {income.pendienteConfirmacion && (
        <ConfirmTransaction
          type="ingreso"
          openModal={() => setConfirmationModalOpened(true)}
        />
      )}

      {confirmationModalOpened && (
        <ModalWrapper small={true}>
          <Dialog
            title="Confirmar ingreso"
            text="Si confirmas que recibiste este ingreso, se sumará el valor a tu balance actual"
            option1="Confirmar"
            option2="Cancelar"
            onClick1={handleConfirmTransaction}
            onClick2={() => setConfirmationModalOpened(false)}
          />
        </ModalWrapper>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="transaction-detail">
        {/* Header */}
        {isEditing === "header" ? (
          <div className="transaction-detail__header ">
            <div className="transaction-detail__actions">
              <Button
                className="transaction-detail__btn"
                label="Guardar"
                icon="edit"
                type="submit"
              />
            </div>

            <InputDetail
              label="Nombre"
              {...register("nombre")}
              error={errors.nombre?.message}
            />
            <InputDetail
              typeCantidad="true"
              label="Monto"
              {...register("cantidad")}
              error={errors.cantidad?.message}
            />
          </div>
        ) : (
          <div className="transaction-detail__header">
            <div className="transaction-detail__actions">
              <IconButton
                icon="edit"
                label="Editar"
                onClick={() => setIsEditing("header")}
              />
            </div>

            <h2 className="transaction-detail__title">{watch("nombre")}</h2>

            <p className="transaction-detail__amount">${watch("cantidad")}</p>
          </div>
        )}

        {/* Cards */}
        <div className="transaction-detail__cards">
          {/* Categoría */}
          <DataCard title="Categoría" small={true}>
            {category ? ( //Category loaded
              isEditing === "category" ? ( // Category is being edited
                <CategoryPicker
                  onClose={handleClose}
                  handleCategoryClick={handleCategoryClick}
                />
              ) : (
                /* Static */
                <div>
                  <div className="data-card__actions">
                    <IconButton
                      onClick={() => setIsEditing("category")}
                      label="Editar"
                      icon="edit"
                      className="data-card__btn"
                    />
                  </div>
                  {category?.predeterminada === true ? (
                    <img
                      className="data-card__icon"
                      src={
                        category?.imagen
                          ? `/./assets/icons/${category.imagen}.png`
                          : "/./assets/icons/default.svg"
                      }
                      alt={category?.nombre || "icono"}
                    />
                  ) : (
                    <img
                      className="data-card__icon"
                      src={
                        category?.imagen
                          ? `https://back-fbch.onrender.com/uploads/${category.imagen}`
                          : "/./assets/icons/default.svg"
                      }
                      alt={category?.nombre || "icono"}
                    />
                  )}

                  <p className="data-card__text data-card__text--small">
                    {category.nombre}
                  </p>
                </div>
              )
            ) : (
              <p>Cargando categoría...</p>
            )}
          </DataCard>

          {/* Cuotas */}
          <DataCard title="Cuotas" small={true}>
            {isEditing === "cuotas" ? (
              <ModalWrapper onClose={handleClose} centered={true}>
                <div className="modal__content modal__content--fit">
                  <Select
                    labelField="Cantidad de cuotas"
                    options={optionsCuotas}
                    {...register("cuotas")}
                  />
                  {errors.cuotas && (
                    <p className="input-error">{errors.cuotas.message}</p>
                  )}

                  <Button
                    className="btn btn--filled-blue"
                    label="Guardar"
                    type="submit"
                  />
                </div>
              </ModalWrapper>
            ) : (
              <div>
                <div className="data-card__actions">
                  <IconButton
                    onClick={() => setIsEditing("cuotas")}
                    label="Editar cuotas"
                    icon="edit"
                    className="data-card__btn"
                  />
                </div>
                <p className="data-card__text data-card__text--big">
                  {watch("cuotas")}
                </p>
              </div>
            )}
          </DataCard>

          {/* Frecuencia */}

          <DataCard title={`Tipo de ingreso`}>
            {isEditing === "frecuencia" ? (
              <ModalWrapper centered={true}>
                <div className="modal__content modal__content--fit">
                  <Toggle
                    label="Ingreso fijo"
                    onChange={setToggleFrecuenciaActivo}
                    defaultChecked={toggleFrecuenciaActivo}
                  />

                  {toggleFrecuenciaActivo && (
                    <Select
                      options={optionsFrecuencia}
                      {...register("frecuencia")}
                    />
                  )}

                  <Button
                    className="btn btn--filled-blue"
                    label="Guardar"
                    type="button"
                    onClick={handleSubmit(() => {
                      //Actualizamos los valores
                      if (!toggleFrecuenciaActivo) {
                        setValue("tipo", "variable");
                        setValue("frecuencia", "mensual");
                      } else {
                        setValue("tipo", "fijo");
                      }

                      onSubmit(getValues());
                      setIsEditing("");
                    })}
                  />

                  <Button
                    className="btn"
                    label="Cancelar"
                    onClick={() => setIsEditing("")}
                  />
                </div>
              </ModalWrapper>
            ) : (
              <>
                <div className="data-card__actions">
                  <IconButton
                    className="data-card__btn"
                    onClick={() => setIsEditing("frecuencia")}
                    label="Editar frecuencia"
                    icon="edit"
                  />
                </div>

                {watch("tipo") === "fijo" ? (
                  <p className="data-card__text data-card__text--medium">
                    {watch("frecuencia")}
                  </p>
                ) : (
                  <p className="data-card__text data-card__text--medium">
                    Único
                  </p>
                )}
              </>
            )}
          </DataCard>

          {/* Descripción */}
          <DataCard title="Descripción">
            {isEditing === "description" ? (
              <ModalWrapper centered={true}>
                <div className="modal__content modal__content--fit">
                  <Textarea
                    content={watch("descripcion")}
                    {...register("descripcion")}
                  />

                  <Button className="btn btn--filled-blue" label="Guardar" />
                  <Button className="btn" label="Cancelar" type="submit" />
                </div>
              </ModalWrapper>
            ) : (
              <div>
                <p className=" data-card__text data-card__text--small">
                  {watch("descripcion")}
                </p>

                <div className="data-card__actions">
                  <IconButton
                    onClick={() => setIsEditing("description")}
                    label="Editar descripción"
                    icon="edit"
                  />
                </div>
              </div>
            )}
          </DataCard>
        </div>

        <Button
          className="btn btn--filled-red"
          label="Eliminar Ingreso"
          onClick={() => setDeleteModalOpened(true)}
        />
        {deleteModalOpened && (
          <ModalWrapper centered={true}>
            <Dialog
              title="Eliminar ingreso"
              text="¿Estás seguro de que deseas eliminar este ingreso?"
              option1="Eliminar"
              option2="Cancelar"
              onClick1={() => handleDeleteIncome(income._id)}
              onClick2={() => setDeleteModalOpened(false)}
            />
          </ModalWrapper>
        )}
      </form>
    </>
  );
};

export { IncomeDetail };
