$f = "src/pages/AdminDashboard.jsx"

# Read as Windows-1252 (cp1252) - the encoding that was used when writing
$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$bytes = [System.IO.File]::ReadAllBytes($f)
$content = $enc1252.GetString($bytes)

# Write back as proper UTF-8 with BOM-less
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($f, $content, $utf8NoBom)

Write-Host "Done: re-encoded from cp1252 to UTF-8."
