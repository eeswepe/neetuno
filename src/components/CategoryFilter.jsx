import { Tags, X } from "lucide-react";
import React from "react";
import Button from "./ui/Button";

const CategoryFilter = ({
  categoryCounts,
  onSetFilter,
  activeFilter,
  onClearFilter
}) => {
  const sortedCategories = Object.entries(categoryCounts).sort(([, countA], [,countB]) => countB - countA)

  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-8 shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Tags size={18} className="me-2 text-indigo-400" />
          Filter Berdasarkan Kategori
        </h3>
        {activeFilter && (
          <Button onClick={onClearFilter} variant="secondary" className="!p-2 h-8 w-8 !rounded-full">
            <X size={16} />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedCategories.map(([category, count]) => (
          <button
            key={category}
            onClick={() => onSetFilter(category)}
            className={`badge text-sm p-3 transition-colors ${
              activeFilter === category 
                ? 'badge-primary' 
                : 'badge-outline badge-secondary hover:bg-gray-700'
            }`}
          >
            {category} <span className="ms-1.5 font-mono text-xs opacity-70">{count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
