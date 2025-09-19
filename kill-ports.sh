#!/bin/bash

# Script pour tuer les processus utilisant les ports 3000 et 5000
echo "Recherche des processus utilisant les ports 3000 et 5000..."

# Fonction pour tuer un processus sur un port spécifique
kill_process_on_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pid" ]; then
        echo "Processus trouvé sur le port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        echo "Processus tué sur le port $port"
    else
        echo "Aucun processus trouvé sur le port $port"
    fi
}

# Tuer les processus sur les ports 3000 et 5000
kill_process_on_port 3000
kill_process_on_port 5000

echo "Nettoyage terminé!"
