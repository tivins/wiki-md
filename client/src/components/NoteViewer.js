import React from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Tag, Calendar, Folder } from 'lucide-react';
import { deleteNote } from '../services/api';

const NoteViewer = ({ note, onEdit, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await deleteNote(note._id);
        onDelete();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la note');
      }
    }
  };

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

  return (
    <div className="card">
      {/* En-tête de la note */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Folder className="h-4 w-4 mr-1" />
            <span className="font-medium">{note.category}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Modifié le {format(new Date(note.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
            {getStatusLabel(note.status)}
          </span>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu de la note */}
      <div className="p-6">
        <div className="markdown-content">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;
