@echo off
REM Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python not found. Downloading Python 3.13 installer...
    REM Download the Python 3.13 MSI installer using PowerShell
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.13.0/python-3.13.0-amd64.msi' -OutFile 'python-3.13.0-amd64.msi'"
    
    echo Installing Python 3.13 silently...
    REM Install Python 3.13 silently with msiexec
    msiexec /i python-3.13.0-amd64.msi /quiet /qn /norestart

    REM Optional: wait a few seconds for the installation to complete
    timeout /t 10
)

echo ====================================
echo Upgrading pip and installing required dependencies...
echo ====================================
python -m pip install --upgrade pip
python -m pip install -r ".\requirements.txt"

echo.
echo ====================================
echo Starting local web server...
echo ====================================
start http://localhost:8000
python -m http.server 8000

pause
