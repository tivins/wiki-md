#!/bin/bash

echo "Installation de WikiMD - Gestionnaire de notes de cours"
echo "====================================================="
echo

echo "Installation des dépendances principales..."
npm install

echo
echo "Installation des dépendances du serveur..."
cd server
npm install
cd ..

echo
echo "Installation des dépendances du client..."
cd client
npm install
cd ..

echo
echo "Installation terminée !"
echo
echo "Pour démarrer l'application :"
echo "  npm start"
echo
echo "Pour démarrer en mode développement :"
echo "  npm run dev"
echo
echo "Aucune base de données externe requise - SQLite est inclus !"
echo
