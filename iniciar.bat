@echo off
title LABEXP - Servidor de Plataforma
echo ========================================================
echo   Iniciando LABEXP: Empleo y Desarrollo Profesional
echo ========================================================
echo.

cd /d "%~dp0"

REM Detectar ejecutable de Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set NODE_EXE=node
) else if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    set NODE_EXE="%APPDATA%\Antigravity\bin\agy-node.cmd"
) else (
    echo [ERROR] No se encontro Node.js en el sistema.
    pause
    exit /b 1
)

echo Abriendo navegador en http://localhost:3000 ...
start http://localhost:3000

echo Iniciando servidor en el puerto 3000...
echo Presiona Ctrl + C para detener el servidor.
echo.
%NODE_EXE% server.js

pause
