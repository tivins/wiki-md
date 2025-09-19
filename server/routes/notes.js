const express = require('express');
const router = express.Router();
const database = require('../database');

// GET /api/notes - Récupérer toutes les notes avec filtres optionnels
router.get('/', async (req, res) => {
  try {
    const { category, status, tag, sortBy = 'updated_at', sortOrder = 'desc' } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (tag) filters.tag = tag;
    
    const sortOptions = {
      sortBy: sortBy === 'updatedAt' ? 'updated_at' : sortBy,
      sortOrder: sortOrder
    };
    
    const notes = await database.getAllNotes({ ...filters, ...sortOptions });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/:id - Récupérer une note spécifique
router.get('/:id', async (req, res) => {
  try {
    const note = await database.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notes - Créer une nouvelle note
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags, status } = req.body;
    
    console.log('Données reçues:', { title, content, category, tags, status });
    
    // Validation des données requises
    if (!title || !content) {
      return res.status(400).json({ error: 'Le titre et le contenu sont requis' });
    }
    
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category: (category && category.trim()) || 'Général',
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
      status: status || 'brouillon'
    };
    
    console.log('Données traitées:', noteData);
    
    const savedNote = await database.createNote(noteData);
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Erreur lors de la création de la note:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notes/:id - Mettre à jour une note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, tags, status } = req.body;
    
    const noteData = {
      title,
      content,
      category,
      tags: tags || [],
      status
    };
    
    const note = await database.updateNote(req.params.id, noteData);
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/notes/:id - Supprimer une note
router.delete('/:id', async (req, res) => {
  try {
    const result = await database.deleteNote(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/categories - Récupérer toutes les catégories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await database.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/tags - Récupérer tous les tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await database.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
