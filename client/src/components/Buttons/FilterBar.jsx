import React from "react";
import { Input } from "../Forms/Input";
import { Select } from "../Forms/Select";

const FilterBar = ({
  search,
  setSearch,
  sort,
  setSort,
  sortOptions = [],
  placeholder = "Buscar...",
}) => (
  <div className="filters">
    <div className="filters__searchbar">
      <img className="filters__icon" src="/assets/icons/search.svg" alt="" />
      <Input
        className="filters__searchbar-input"
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></Input>
    </div>

    <div className="filters__options">
      <img
        className="filters__icon"
        src="/assets/icons/sort.svg"
        alt="filtros"
      />
      <Select
        label="Filtrar por"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        options={sortOptions}
      />
    </div>
  </div>
);

export { FilterBar };
