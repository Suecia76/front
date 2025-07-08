import React, { useEffect, useContext, useState } from "react";
import { StatusBar } from "../../components";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { Tab } from "../../components/Buttons/Tab";

const Categories = () => {
  const { user } = useContext(AuthContext);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("basic");

  useEffect(() => {
    async function fetchCategories() {
      if (!user) {
        console.error("El usuario no está definido.");
        return;
      }

      setLoading(true);

      try {
        const defaultResponse = await axios.get(
          "https://back-1-1j7o.onrender.com/categorias"
        );

        setDefaultCategories(defaultResponse.data);

        const userResponse = await axios.get(
          `https://back-1-1j7o.onrender.com/categorias/usuario/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        setUserCategories(userResponse.data);
      } catch (err) {
        console.log("Error al cargar las categorías: ", err);
        setError(
          "Error al cargar las categorías. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [user]);

  const tabs = [
    { label: "Básicas", value: "basic" },

    { label: "Personalizadas", value: "custom" },
  ];

  const url = "https://back-1-1j7o.onrender.com/uploads/";

  return (
    <div>
      <StatusBar label="Categorías" />

      <div className="tabs">
        {tabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.value}
            isSelected={selectedTab === tab.value}
            onSelect={() => setSelectedTab(tab.value)}
          />
        ))}
      </div>

      <section className="categories">
        {selectedTab === "custom" ? (
          userCategories.length > 0 ? (
            <>
              {/* Hay categorías personalizadas */}
              <div className="categories__list">
                {userCategories.map((cat) => (
                  <a
                    key={cat._id}
                    className="category"
                    href={`/categories/edit/${cat._id}`}
                  >
                    <img
                      className="category__icon"
                      src={url + cat.imagen || "./default-icon.png"}
                      alt={cat.nombre}
                    />
                    <p>{cat.nombre}</p>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* El usuario no agregó categorías personalizadas aún */}
              <p>Aún no agregaste categorías personalizadas</p>
            </>
          )
        ) : (
          <>
            {/* Mostramos las basicas*/}
            <div className="categories__list">
              {defaultCategories.map((cat) => (
                <div key={cat._id} className="category">
                  <img
                    className="category__icon"
                    src={`${url + cat.imagen}.png` || "./default-icon.png"}
                    alt={cat.nombre}
                  />
                  <div>
                    <p>{cat.nombre}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <a href="/categories/add" className="btn btn--filled-blue">
          Agregar categoría
        </a>
      </section>
    </div>
  );
};

export { Categories };
