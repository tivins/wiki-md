@echo off
echo Installation de WikiMD - Gestionnaire de notes de cours
echo =====================================================
echo.

echo Installation des dependances principales...
call npm install

echo.
echo Installation des dependances du serveur...
cd server
call npm install
cd ..

echo.
echo Installation des dependances du client...
cd client
call npm install
cd ..

echo.
echo Installation terminee !
echo.
echo Pour demarrer l'application :
echo   npm start
echo.
echo Pour demarrer en mode developpement :
echo   npm run dev
echo.
echo Aucune base de donnees externe requise - SQLite est inclus !
echo.
pause
