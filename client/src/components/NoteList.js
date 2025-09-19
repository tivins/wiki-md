import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Clock, Tag } from 'lucide-react';

const NoteList = ({ notes, selectedNote, onNoteSelect, loading }) => {
  const getStatusColor = (status) => {
    const colors = {
      brouillon: 'bg-gray-100 text-gray-800',
      en_cours: 'bg-blue-100 text-blue-800',
      terminé: 'bg-green-100 text-green-800',
      archivé: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.brouillon;
  };

  const getStatusLabel = (status) => {
    const labels = {
      brouillon: 'Brouillon',
      en_cours: 'En cours',
      terminé: 'Terminé',
      archivé: 'Archivé'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="card p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="card p-4">
        <div className="text-center text-gray-500 py-8">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune note trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Notes ({notes.length})
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notes.map(note => (
          <div
            key={note._id}
            onClick={() => onNoteSelect(note)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
              selectedNote && selectedNote._id === note._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {note.title}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                {getStatusLabel(note.status)}
              </span>
            </div>
            
            <p className="text-gray-600 text-xs line-clamp-2 mb-2">
              {note.content.substring(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {note.category}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(note.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                </span>
              </div>
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
