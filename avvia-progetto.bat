@echo off
title LUME Platform - Avvio
color 0A
cls
echo ========================================
echo    AVVIO LUME PLATFORM (Next.js + Supabase)
echo ========================================
echo.

:: Ferma eventuali istanze precedenti di Supabase
echo [1/3] Fermo Supabase se in esecuzione...
call npx supabase stop >nul 2>&1
timeout /t 2 /nobreak >nul

:: Avvia Supabase in una nuova finestra
echo [2/3] Avvio Supabase...
start "Supabase" cmd /k "npx supabase start && echo. && echo ✅ Supabase attivo su http://localhost:54323 && echo Premere Ctrl+C per fermare"

:: Attendi qualche secondo per far partire Supabase
timeout /t 5 /nobreak >nul

:: Avvia Next.js in una nuova finestra
echo [3/3] Avvio Next.js...
start "Next.js" cmd /k "npm run dev && echo. && echo ✅ Next.js attivo su http://localhost:3000 && echo Premere Ctrl+C per fermare"

echo.
echo ✅ Tutti i servizi sono in fase di avvio.
echo    - Supabase Studio: http://localhost:54323
echo    - Sito web:        http://localhost:3000
echo.
echo Le finestre dei terminali rimangono aperte.
echo Per fermare tutto, chiudi le finestre o premi Ctrl+C in ciascuna.
echo.
pause