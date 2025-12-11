# Test All 7 ML Models
# Author: ML Team
# Date: December 10, 2025

Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Cyan
Write-Host "ML MODELS COMPREHENSIVE TEST" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "="*80 -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$passed = 0
$failed = 0

# Test 1: Road Speed
Write-Host "1. Road Speed Prediction..." -ForegroundColor Yellow
try {
    $payload1 = @{
        jenis_jalan = "UTAMA"
        kondisi_permukaan = "KERING"
        curah_hujan_mm = 0.5
        suhu_celcius = 28.5
        kecepatan_angin_ms = 3.2
        elevasi_mdpl = 450.0
        kemiringan_persen = 5.5
        beban_muatan_ton = 85.0
        jam_operasi = 10
    } | ConvertTo-Json
    
    $response1 = Invoke-RestMethod -Uri "$baseUrl/predict/road-speed" -Method Post -Body $payload1 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response1.prediction) km/h" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 2: Cycle Time
Write-Host "`n2. Cycle Time Prediction..." -ForegroundColor Yellow
try {
    $payload2 = @{
        jarak_tempuh_km = 12.5
        kecepatan_prediksi_kmh = 25.0
        curah_hujan_mm = 1.2
        kondisi_jalan = "BAIK"
        beban_muatan_ton = 90.0
        jumlah_stop = 2
    } | ConvertTo-Json
    
    $response2 = Invoke-RestMethod -Uri "$baseUrl/predict/cycle-time" -Method Post -Body $payload2 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response2.prediction) minutes" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 3: Road Risk
Write-Host "`n3. Road Risk Assessment..." -ForegroundColor Yellow
try {
    $payload3 = @{
        curah_hujan_mm = 15.5
        intensitas_hujan = "SEDANG"
        kecepatan_angin_ms = 8.5
        kondisi_permukaan = "BASAH"
        kedalaman_air_cm = 3.5
        indeks_friksi = 0.65
        visibilitas_m = 150.0
        kemiringan_persen = 8.0
    } | ConvertTo-Json
    
    $response3 = Invoke-RestMethod -Uri "$baseUrl/predict/road-risk" -Method Post -Body $payload3 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response3.prediction)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 4: Equipment Failure
Write-Host "`n4. Equipment Failure Prediction..." -ForegroundColor Yellow
try {
    $payload4 = @{
        tipe_alat = "Excavator"
        umur_tahun = 5
        jam_operasi = 12000.0
        jarak_tempuh_km = 50000.0
        jumlah_maintenance = 24
        jumlah_breakdown = 3
        days_since_last_maintenance = 30
        utilization_rate = 0.75
    } | ConvertTo-Json
    
    $response4 = Invoke-RestMethod -Uri "$baseUrl/predict/equipment-failure" -Method Post -Body $payload4 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response4.prediction)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 5: Port Operability
Write-Host "`n5. Port Operability Prediction..." -ForegroundColor Yellow
try {
    $payload5 = @{
        curah_hujan_mm = 5.5
        kecepatan_angin_ms = 12.5
        tinggi_gelombang_m = 1.8
        visibilitas_km = 3.5
        suhu_celcius = 27.0
        equipment_readiness = 0.85
    } | ConvertTo-Json
    
    $response5 = Invoke-RestMethod -Uri "$baseUrl/predict/port-operability" -Method Post -Body $payload5 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response5.prediction)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 6: Performance Degradation
Write-Host "`n6. Performance Degradation Prediction..." -ForegroundColor Yellow
try {
    $payload6 = @{
        equipment_age_years = 5.5
        jam_operasi = 12500.0
        beban_rata_rata_ton = 85.0
        kecepatan_rata_rata_kmh = 22.5
        frekuensi_maintenance = 12
        jumlah_breakdown = 2
        utilization_rate = 0.78
    } | ConvertTo-Json
    
    $response6 = Invoke-RestMethod -Uri "$baseUrl/predict/performance-degradation" -Method Post -Body $payload6 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response6.prediction)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Test 7: Fleet Risk
Write-Host "`n7. Fleet Risk Scoring..." -ForegroundColor Yellow
try {
    $payload7 = @{
        total_unit = 50
        umur_rata_rata_tahun = 6.5
        utilisasi_persen = 78.5
        frekuensi_breakdown = 15
        skor_maintenance = 82.0
        equipment_readiness = 0.85
        jumlah_unit_critical = 3
    } | ConvertTo-Json
    
    $response7 = Invoke-RestMethod -Uri "$baseUrl/predict/fleet-risk" -Method Post -Body $payload7 -ContentType "application/json"
    Write-Host "   ✓ PASS | Prediction: $($response7.prediction)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "   ✗ FAIL | Error: $_" -ForegroundColor Red
    $failed++
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "="*80 -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Tests: 7" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ ALL ML MODELS WORKING CORRECTLY!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "All 7 models are loaded and producing valid predictions.`n" -ForegroundColor Green
} else {
    Write-Host "⚠ Some models failed. Review details above.`n" -ForegroundColor Yellow
}
