import React from 'react';
import { Plus, BookOpen } from 'lucide-react';

const Header = ({ onCreate }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">WikiMD</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Notes de cours
            </span>
          </div>
          
          <button
            onClick={onCreate}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle note</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
