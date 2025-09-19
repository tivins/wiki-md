import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ filters, categories, tags, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'terminé', label: 'Terminé' },
    { value: 'archivé', label: 'Archivé' }
  ];

  const clearFilters = () => {
    onFilterChange({
      category: '',
      status: '',
      tag: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.category || filters.status || filters.tag || filters.search;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Rechercher dans les notes..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="input-field"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="input-field"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <select
            value={filters.tag}
            onChange={(e) => onFilterChange({ tag: e.target.value })}
            className="input-field"
          >
            <option value="">Tous les tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
