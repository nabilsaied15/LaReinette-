$f = "src/pages/AdminDashboard.jsx"
$content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Fix encoding corruption in the KPI block
$content = $content -replace 'rÃ©servations', 'réservations'
$content = $content -replace 'confirmÃ©es', 'confirmées'
$content = $content -replace 'Ã  traiter', 'à traiter'
$content = $content -replace 'AnnulÃ©es', 'Annulées'
$content = $content -replace 'annulations', 'annulations'
$content = $content -replace 'trajets prÃ©vus', 'trajets prévus'
$content = $content -replace 'ValidÃ©es', 'Validées'
$content = $content -replace "â€"", '—'
$content = $content -replace 'â"€â"€ KPI CARDS â"€â"€', '── KPI CARDS ──'

[System.IO.File]::WriteAllText($f, $content, [System.Text.Encoding]::UTF8)
Write-Host "Encoding fixed."
