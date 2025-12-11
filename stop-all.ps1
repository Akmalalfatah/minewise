# 🛑 MineWise - Stop All Services
# Run this script to stop all running services

Write-Host "🛑 Stopping MineWise Services..." -ForegroundColor Red
Write-Host ""

# Function to stop process on port
function Stop-ServiceOnPort {
    param(
        [int]$Port,
        [string]$ServiceName
    )
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        
        if ($connections) {
            $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            
            foreach ($pid in $processIds) {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "⏹️  Stopping $ServiceName (PID: $pid, Port: $Port)..." -ForegroundColor Yellow
                    Stop-Process -Id $pid -Force
                    Write-Host "✅ $ServiceName stopped" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "ℹ️  $ServiceName (Port $Port) - Not running" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  Error stopping $ServiceName : $_" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Stop Frontend (Port 5173)
Stop-ServiceOnPort -Port 5173 -ServiceName "Frontend (React)"

# Stop Backend (Port 4000)
Stop-ServiceOnPort -Port 4000 -ServiceName "Backend (Express)"

# Stop ML API (Port 8000)
Stop-ServiceOnPort -Port 8000 -ServiceName "ML API (FastAPI)"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ All MineWise services stopped!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Port Status Check:" -ForegroundColor Yellow

# Check if ports are free
$ports = @(5173, 4000, 8000)
foreach ($port in $ports) {
    $inUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($inUse) {
        Write-Host "   Port $port : Still in use ⚠️" -ForegroundColor Red
    } else {
        Write-Host "   Port $port : Free ✅" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "To start services again, run: .\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
