const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, 'wikimd.db');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Erreur de connexion SQLite:', err.message);
          reject(err);
        } else {
          console.log('SQLite connecté');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  initializeTables() {
    return new Promise((resolve, reject) => {
      const createNotesTable = `
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT DEFAULT 'Général',
          status TEXT DEFAULT 'brouillon',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const createTagsTable = `
        CREATE TABLE IF NOT EXISTS note_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note_id INTEGER,
          tag TEXT NOT NULL,
          FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
        )
      `;

      this.db.serialize(() => {
        this.db.run(createNotesTable, (err) => {
          if (err) {
            console.error('Erreur création table notes:', err.message);
            reject(err);
            return;
          }
        });

        this.db.run(createTagsTable, (err) => {
          if (err) {
            console.error('Erreur création table tags:', err.message);
            reject(err);
            return;
          }
          console.log('Tables initialisées');
          resolve();
        });
      });
    });
  }

  // Méthodes pour les notes
  getAllNotes(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT n.*, 
               GROUP_CONCAT(nt.tag) as tags
        FROM notes n
        LEFT JOIN note_tags nt ON n.id = nt.note_id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (filters.category) {
        query += ' AND n.category = ?';
        params.push(filters.category);
      }
      
      if (filters.status) {
        query += ' AND n.status = ?';
        params.push(filters.status);
      }
      
      if (filters.tag) {
        query += ' AND n.id IN (SELECT note_id FROM note_tags WHERE tag = ?)';
        params.push(filters.tag);
      }
      
      query += ' GROUP BY n.id';
      
      if (filters.sortBy) {
        const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY n.${filters.sortBy} ${sortOrder}`;
      } else {
        query += ' ORDER BY n.updated_at DESC';
      }

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const notes = rows.map(row => ({
            _id: row.id,
            title: row.title,
            content: row.content,
            category: row.category,
            status: row.status,
            tags: row.tags ? row.tags.split(',') : [],
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(notes);
        }
      });
    });
  }

  getNoteById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT n.*, 
               GROUP_CONCAT(nt.tag) as tags
        FROM notes n
        LEFT JOIN note_tags nt ON n.id = nt.note_id
        WHERE n.id = ?
        GROUP BY n.id
      `;

      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const note = {
            _id: row.id,
            title: row.title,
            content: row.content,
            category: row.category,
            status: row.status,
            tags: row.tags ? row.tags.split(',') : [],
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
          resolve(note);
        }
      });
    });
  }

  createNote(noteData) {
    return new Promise((resolve, reject) => {
      const { title, content, category, tags, status } = noteData;
      const db = this.db; // Stocker la référence à la base de données
      const self = this; // Stocker la référence à l'instance
      
      db.run(
        'INSERT INTO notes (title, content, category, status) VALUES (?, ?, ?, ?)',
        [title, content, category, status],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          const noteId = this.lastID;
          
          // Insérer les tags
          if (tags && tags.length > 0) {
            const tagInserts = tags.map(tag => 
              new Promise((resolveTag, rejectTag) => {
                db.run(
                  'INSERT INTO note_tags (note_id, tag) VALUES (?, ?)',
                  [noteId, tag.trim()],
                  (err) => {
                    if (err) rejectTag(err);
                    else resolveTag();
                  }
                );
              })
            );
            
            Promise.all(tagInserts)
              .then(() => {
                self.getNoteById(noteId).then(resolve).catch(reject);
              })
              .catch(reject);
          } else {
            self.getNoteById(noteId).then(resolve).catch(reject);
          }
        }
      );
    });
  }

  updateNote(id, noteData) {
    return new Promise((resolve, reject) => {
      const { title, content, category, tags, status } = noteData;
      const db = this.db; // Stocker la référence à la base de données
      const self = this; // Stocker la référence à l'instance
      
      db.run(
        'UPDATE notes SET title = ?, content = ?, category = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, category, status, id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          // Supprimer les anciens tags
          db.run('DELETE FROM note_tags WHERE note_id = ?', [id], (err) => {
            if (err) {
              reject(err);
              return;
            }
            
            // Insérer les nouveaux tags
            if (tags && tags.length > 0) {
              const tagInserts = tags.map(tag => 
                new Promise((resolveTag, rejectTag) => {
                  db.run(
                    'INSERT INTO note_tags (note_id, tag) VALUES (?, ?)',
                    [id, tag.trim()],
                    (err) => {
                      if (err) rejectTag(err);
                      else resolveTag();
                    }
                  );
                })
              );
              
              Promise.all(tagInserts)
                .then(() => {
                  self.getNoteById(id).then(resolve).catch(reject);
                })
                .catch(reject);
            } else {
              self.getNoteById(id).then(resolve).catch(reject);
            }
          });
        }
      );
    });
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Note supprimée avec succès' });
        }
      });
    });
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT DISTINCT category FROM notes WHERE category IS NOT NULL', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const categories = rows.map(row => row.category);
          resolve(categories);
        }
      });
    });
  }

  getTags() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT DISTINCT tag FROM note_tags WHERE tag IS NOT NULL', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const tags = rows.map(row => row.tag);
          resolve(tags);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Erreur fermeture SQLite:', err.message);
        } else {
          console.log('Connexion SQLite fermée');
        }
      });
    }
  }
}

module.exports = new Database();
