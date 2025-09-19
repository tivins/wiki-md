@echo off
echo Nettoyage des ports et demarrage de l'application...
echo.

REM Exécuter le script PowerShell pour tuer les processus
powershell -ExecutionPolicy Bypass -File "kill-ports.ps1"

echo.
echo Demarrage de l'application...
npm start

pause
