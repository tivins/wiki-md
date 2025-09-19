import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, X, Eye, Edit3 } from 'lucide-react';
import { createNote, updateNote } from '../services/api';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Général',
    tags: '',
    status: 'brouillon'
  });
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'Général',
        tags: note.tags ? note.tags.join(', ') : '',
        status: note.status || 'brouillon'
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (note) {
        const updatedNote = await updateNote(note._id, noteData);
        onSave(updatedNote);
      } else {
        await createNote(noteData);
        onSave();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la note');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'terminé', label: 'Terminé' },
    { value: 'archivé', label: 'Archivé' }
  ];

  return (
    <div className="card">
      {/* En-tête de l'éditeur */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {note ? 'Modifier la note' : 'Nouvelle note'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`btn-secondary flex items-center space-x-2 ${
                isPreview ? 'bg-primary-100 text-primary-700' : ''
              }`}
            >
              {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{isPreview ? 'Éditer' : 'Aperçu'}</span>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Titre de la note"
                required
                disabled={isPreview}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                placeholder="Catégorie"
                disabled={isPreview}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="tag1, tag2, tag3"
                disabled={isPreview}
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez les tags par des virgules
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                disabled={isPreview}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Zone de contenu */}
      <div className="p-6">
        {isPreview ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
            <div className="markdown-content">
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu (Markdown) *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input-field h-96 resize-none"
              placeholder="Écrivez votre note en Markdown..."
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Utilisez la syntaxe Markdown pour formater votre texte
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={saving || !formData.title.trim() || !formData.content.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
