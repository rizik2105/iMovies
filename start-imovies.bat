@echo off
title IMovies Cinema Reservation Platform
color 0A

echo ========================================================
echo          🎬 IMovies Cinema Ticketing Platform
echo ========================================================
echo.
echo Starting backend server with auto-MongoDB detection...
echo Starting Vite frontend client...
echo.

:: Open browser after 3 seconds
start /b "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

:: Start both client and server concurrently
npm run dev
pause
