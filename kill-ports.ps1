# Script pour tuer les processus utilisant les ports 3000 et 5000
Write-Host "Recherche des processus utilisant les ports 3000 et 5000..." -ForegroundColor Yellow

# Fonction pour tuer un processus sur un port spécifique
function Kill-ProcessOnPort {
    param([int]$Port)
    
    try {
        # Trouver le processus utilisant le port
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        
        if ($process) {
            Write-Host "Processus trouvé sur le port $Port (PID: $process)" -ForegroundColor Red
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "Processus tué sur le port $Port" -ForegroundColor Green
        } else {
            Write-Host "Aucun processus trouvé sur le port $Port" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Erreur lors de la recherche sur le port $Port - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Tuer les processus sur les ports 3000 et 5000
Kill-ProcessOnPort -Port 3000
Kill-ProcessOnPort -Port 5000

Write-Host "Nettoyage terminé!" -ForegroundColor Green
