@echo off
setlocal
title Student Portal - Launcher
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto no_node

rem First run: install the packages automatically
if not exist "server\node_modules\" goto first_run
if not exist "client\node_modules\" goto first_run
goto launch

:first_run
echo.
echo  First run - installing packages, please wait...
call "%~dp0setup.bat" --no-pause
if errorlevel 1 goto failed

:launch
echo.
echo  Starting the API server ...  (window: Portal SERVER)
start "Portal SERVER - keep this open" /D "%~dp0server" cmd /k npm run dev

rem Give the server a moment to connect to MongoDB
ping -n 4 127.0.0.1 >nul

echo  Starting the React app  ...  (window: Portal CLIENT)
start "Portal CLIENT - keep this open" /D "%~dp0client" cmd /k npm run dev

echo.
echo  ==================================================
echo   The browser opens http://localhost:5173 by itself.
echo   Keep the SERVER and CLIENT windows open.
echo   To stop the app, close those two windows.
echo  ==================================================
echo.
ping -n 6 127.0.0.1 >nul
exit /b 0

:no_node
echo.
echo  [X] Node.js is not installed.
echo      Download the LTS version from https://nodejs.org
echo.
pause
exit /b 1

:failed
echo.
pause
exit /b 1
