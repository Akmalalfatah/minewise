# 🚀 MineWise - Start All Services
# Run this script to start Frontend, Backend, and ML API simultaneously

Write-Host "🚀 Starting MineWise Full Stack Application..." -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to start service in new terminal
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [int]$Port,
        [string]$Color
    )
    
    if (Test-Port -Port $Port) {
        Write-Host "⚠️  Port $Port already in use! Please free the port first." -ForegroundColor Yellow
        Write-Host "   Run: Get-NetTCPConnection -LocalPort $Port | Select-Object OwningProcess" -ForegroundColor Gray
        return $false
    }
    
    Write-Host "▶️  Starting $Name (Port $Port)..." -ForegroundColor $Color
    
    # Start in new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; Write-Host '🚀 $Name Server' -ForegroundColor $Color; $Command"
    
    Start-Sleep -Seconds 2
    return $true
}

# Check prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js v18+" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check npm dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Frontend dependencies not installed. Installing..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "⚠️  Backend dependencies not installed. Installing..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

Write-Host ""
Write-Host "🎯 Starting Services..." -ForegroundColor Cyan
Write-Host ""

$rootPath = Get-Location

# Start Frontend (Port 5173)
$frontendStarted = Start-Service `
    -Name "FRONTEND (React + Vite)" `
    -Path $rootPath `
    -Command "npm run dev" `
    -Port 5173 `
    -Color "Cyan"

Start-Sleep -Seconds 3

# Start Backend (Port 4000)
$backendStarted = Start-Service `
    -Name "BACKEND (Node.js + Express)" `
    -Path "$rootPath\backend" `
    -Command "npm run dev" `
    -Port 4000 `
    -Color "Green"

Start-Sleep -Seconds 3

# Start ML API (Port 8000)
Write-Host "▶️  Starting ML API (Port 8000)..." -ForegroundColor Magenta
Write-Host "   NOTE: Requires virtual environment activation" -ForegroundColor Gray

# Check if venv exists
if (-not (Test-Path "machine_learning/venv")) {
    Write-Host "⚠️  Virtual environment not found. Creating..." -ForegroundColor Yellow
    cd machine_learning
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
    cd ..
}

# Start ML API in new terminal with venv activation
$mlCommand = "cd machine_learning; .\venv\Scripts\Activate.ps1; Write-Host 'Installing dependencies...' -ForegroundColor Yellow; pip install -q -r requirements.txt; Write-Host '✅ Dependencies ready' -ForegroundColor Green; Write-Host '🚀 Starting ML API Server...' -ForegroundColor Magenta; python run_api.py"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $mlCommand

Write-Host ""
Write-Host "⏳ Waiting for all services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ MineWise Full Stack Application Started!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Yellow
Write-Host "   • Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "   • Backend:   http://localhost:4000" -ForegroundColor Green
Write-Host "   • ML API:    http://localhost:8000" -ForegroundColor Magenta
Write-Host "   • ML Docs:   http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
Write-Host "🧪 Quick Tests:" -ForegroundColor Yellow
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:4000/api/auth/health'" -ForegroundColor Gray
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:8000/health'" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Open Frontend:" -ForegroundColor Yellow
Write-Host "   Start-Process 'http://localhost:5173'" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  NOTE: Each service runs in a separate PowerShell window." -ForegroundColor Yellow
Write-Host "   Close those windows to stop the services." -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • INTEGRATION_GUIDE.md - Full integration guide" -ForegroundColor Gray
Write-Host "   • QUICK_START.md - Quick start instructions" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
Write-Host ""

# Open browser automatically
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
