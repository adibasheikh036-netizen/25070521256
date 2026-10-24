@echo off
setlocal
title Student Portal - Setup
cd /d "%~dp0"

echo.
echo  ==================================================
echo     Adiba Sheikh Student Portal - one-time setup
echo  ==================================================
echo.

where node >nul 2>nul
if errorlevel 1 goto no_node

for /f "tokens=1,2 delims=." %%a in ('node -v') do (
  set "NODE_MAJOR=%%a"
  set "NODE_MINOR=%%b"
)
if not defined NODE_MAJOR goto no_node
set "NODE_MAJOR=%NODE_MAJOR:v=%"

if %NODE_MAJOR% LSS 20 goto old_node
if %NODE_MAJOR% EQU 21 goto old_node
if %NODE_MAJOR% EQU 20 if %NODE_MINOR% LSS 19 goto old_node
if %NODE_MAJOR% EQU 22 if %NODE_MINOR% LSS 12 goto old_node
echo  [OK] Node.js v%NODE_MAJOR%.%NODE_MINOR% found

if not exist "server\.env" copy /y "server\.env.example" "server\.env" >nul
echo  [OK] Settings file: server\.env

echo.
echo  [1/2] Installing server packages - Express, Mongoose ...
cd /d "%~dp0server"
call npm install --no-audit --no-fund
if errorlevel 1 goto npm_failed

echo.
echo  [2/2] Installing client packages - React, Vite ...
cd /d "%~dp0client"
call npm install --no-audit --no-fund
if errorlevel 1 goto npm_failed

cd /d "%~dp0"
echo.
echo  ==================================================
echo     Setup complete!  Now double-click start.bat
echo  ==================================================
echo.
if /i not "%~1"=="--no-pause" pause
exit /b 0

:no_node
echo  [X] Node.js is not installed.
echo      Download the LTS version from https://nodejs.org
echo      Install it with the default options, then run setup.bat again.
goto fail

:old_node
echo  [X] Your Node.js version is too old: v%NODE_MAJOR%.%NODE_MINOR%
echo      Install the LTS version from https://nodejs.org and run setup.bat again.
goto fail

:npm_failed
echo.
echo  [X] Installing packages failed.
echo      Check your internet connection and run setup.bat again.
goto fail

:fail
echo.
if /i not "%~1"=="--no-pause" pause
exit /b 1
