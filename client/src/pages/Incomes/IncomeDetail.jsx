import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { DataCard } from '../../components/Cards/DataCard'
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from'js-cookie';
import { StatusBar, Button, IconButton, InputDetail, CategoryPicker, ModalWrapper, Input, Toggle} from '../../components';

const IncomeDetail = () => {
  const {user} = useContext(AuthContext);
  const { id } = useParams()
  const [income, setIncome] = useState({});
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchIncome = async (id) => {
        if (!user?.id) return;

        try {
          const token = Cookies.get("token") || null;
          const res = await axios.get(`http://localhost:3000/ingresos/${id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });
          setIncome(res.data);
        } catch (error) {
          console.error("Error al cargar el ingreso: ", error);
        }
      };

      fetchIncome(id);
    }, [id, user?.id]);

    console.log(income);

  //fetch category
  useEffect(() => {
  const fetchCategory = async (id) => {
    if (!user?.id) return;

    try {
      const token = Cookies.get("token") || null;
      const response = await axios.get(`http://localhost:3000/categorias/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setCategory(response.data);
      console.log("Categoría cargada:", response.data);
    } catch (error) {
      console.error("Error al cargar la categoría:", error.response?.data);
    }
  };

  if (income?.categoria_fk) {
    fetchCategory(income.categoria_fk);
  }
}, [income?.categoria_fk, user?.id]);

const saveHeader = () => {
  console.log("Guardando encabezado...");

  setIsEditing("");
}

const handleClose = () => {
  setIsEditing("");
}

const handleCategoryClick = (category) => {
  setCategory(category);
  setIsEditing("");
  console.log("Categoría seleccionada:", category);   
}

const saveCuotas = () => {
  console.log("Guardando cuotas...");}

const url = "http://localhost:3000/uploads/";

  return (
        <div className='transaction-detail' >
          <StatusBar label="Detalle de ingreso" />
            {/* Header */}
            {
              isEditing === "header"? (
                <div className='transaction-detail__header ' >
                  
                  <div className='transaction-detail__actions'>
                    {/* <Button className="transaction-detail__btn" label="Atrás" icon="Atrás"  onClick={() => setIsEditing("")}/> */}

                    <Button className="transaction-detail__btn" label="Save" icon="edit"  onClick={saveHeader}/>
                  </div>
                  
                  <InputDetail label="Nombre" value={income.nombre} />
                  <InputDetail label="Monto" value={income.cantidad} />
                  
                </div>
              ) : (
                
                <div className='transaction-detail__header'>

                  <div className='transaction-detail__actions'>
                     {/* <Button label="Editar" className=" transaction-detail__btn" onClick={()=> setIsEditing("header")}/> */}

                    <IconButton icon="edit" label="Editar" onClick={()=> setIsEditing("header")} />
                  </div>

                  
                  <h2 className='transaction-detail__title'>{income.nombre}</h2>
                  <p className='transaction-detail__amount'>${income.cantidad}</p>
                </div>
              )
            }

            {/* Cards */}
            <div className='transaction-detail__cards'>
              {/* Categoría */}
              <DataCard title="Categoría" small={true}>
                {category ? //Category loaded
                  (
                    isEditing === "category" ? (// Category is being edited
                     <CategoryPicker onClose={handleClose} handleCategoryClick={handleCategoryClick}/>
                    ):(
                      /* Static */
                    <div>
                      <div className='data-card__actions'>
                          <IconButton onClick={() => setIsEditing("category")} label="Editar" icon="edit" className="data-card__btn"/>
                        </div>
                      <img className='data-card__icon' src={`/assets/icons/${category.imagen}.svg`} alt={category.nombre} />
                      <p className="data-card__text data-card__text--small">{category.nombre}</p>
                  </div>
                    )
                  )
                : (
                  <p>Cargando categoría...</p>
                )}
              </DataCard>

              {/* Cuotas */}
              <DataCard title="Cuotas" small={true}>

              {
                isEditing === "cuotas" ? (
                  
                  <ModalWrapper onClose={handleClose} centered={true}>
                    <div className='modal__content modal__content--fit'>
                      <Input value="" className="modal__input"  label="Cantidad total de cuotas" type="number" />
                      <Input value={income.cuotas} className="modal__input" label="Cantidad total de cuotas" type="number" />

                      <Button className="btn btn--filled-blue" label="Guardar" onClick={saveCuotas}/>
                    </div>
                  
                  </ModalWrapper>
                ):(
                  <div>
                    
                    <div className='data-card__actions'>
                          <IconButton onClick={() => setIsEditing("cuotas")} label="Editar cuotas" icon="edit" className="data-card__btn"/>
                    </div>
                      <p className='data-card__text data-card__text--big'>{income.cuotas}</p>
                  </div>
                )
              }
              </DataCard>

              {
                income.tipo === "fijo" && (
                  <DataCard title = "Ingreso fijo">
                    {
                      isEditing === "frecuencia" ? (
                        <ModalWrapper onClose={handleClose} centered={true}>
                          <div className='modal__content modal__content--fit'>
                            <Toggle label="Ingreso fijo"/>
                            
                            <select id="frecuencia">
                              <option value="fijo">Fijo</option>
                              <option value="variable">Variable</option>
                            </select>
                        </div>
                        </ModalWrapper>
                      ) :(
                        <div>
                              <div className='data-card__actions'>
                                  <IconButton className="data-card__btn" onClick={() => setIsEditing("frecuencia")} label="Editar frecuencia" icon="edit" />
                              </div>

                          <p className='data-card__text data-card__text--medium'>{income.frecuencia}</p>

                        </div>
                      )
                    }
                  </DataCard>
                )
              }

               <DataCard title="Descripción">
                {
                  isEditing === "description" ? (
                    <ModalWrapper onClose={handleClose} centered={true}>
                      <div className='modal__content modal__content--fit'>
                        <select id="des"></select>
                      </div>
                    </ModalWrapper>
                  ) : (
                    <div>
                     <p className=' data-card__text data-card__text--small'>{income.descripcion}</p>

                      <div className='data-card__actions'>
                        <IconButton onClick={() => setIsEditing("description")} label="Editar descripción" icon="edit" />
                    </div>

                    </div>
                  )
                }
                
              </DataCard>
            </div>
            
           
              
            <Button className="btn btn--filled-red" label="Eliminar" />
            
        </div>
  )
}

export {IncomeDetail}
