import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NoteViewer from './components/NoteViewer';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import { getNotes, getCategories, getTags } from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    tag: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    loadMetadata();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes(filters);
      setNotes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getTags()
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Erreur lors du chargement des métadonnées:', error);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleNoteSaved = (updatedNote = null) => {
    setIsEditing(false);
    setIsCreating(false);
    
    if (updatedNote) {
      // Si on a les données de la note mise à jour, on la garde sélectionnée
      setSelectedNote(updatedNote);
    } else {
      // Sinon, on remet à null (pour la création de nouvelle note)
      setSelectedNote(null);
    }
    
    loadNotes();
    loadMetadata();
  };

  const handleNoteDeleted = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setIsCreating(false);
    loadNotes();
    loadMetadata();
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredNotes = notes.filter(note => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return note.title.toLowerCase().includes(searchTerm) || 
             note.content.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreate={handleCreate} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec filtres et liste des notes */}
          <div className="lg:col-span-1">
            <FilterBar
              filters={filters}
              categories={categories}
              tags={tags}
              onFilterChange={handleFilterChange}
            />
            
            <div className="mt-6">
              <NoteList
                notes={filteredNotes}
                selectedNote={selectedNote}
                onNoteSelect={handleNoteSelect}
                loading={loading}
              />
            </div>
          </div>

          {/* Zone principale */}
          <div className="lg:col-span-3">
            {isCreating ? (
              <NoteEditor
                onSave={handleNoteSaved}
                onCancel={() => setIsCreating(false)}
              />
            ) : isEditing && selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onSave={handleNoteSaved}
                onCancel={() => setIsEditing(false)}
              />
            ) : selectedNote ? (
              <NoteViewer
                note={selectedNote}
                onEdit={handleEdit}
                onDelete={handleNoteDeleted}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  Sélectionnez une note pour commencer
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
