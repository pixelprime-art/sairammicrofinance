Get-ChildItem -Path "e:\sairammicrofinance\src" -Recurse -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $updated = $content `
        -replace "Nayak Sairam Micro Finance", "Sairam Microfinance" `
        -replace "Nayak Sairam Microfinance", "Sairam Microfinance" `
        -replace "Nayak Sairams", "Sairam Microfinance's" `
        -replace "NAYAK SAIRAM", "SAIRAM MICROFINANCE" `
        -replace "Nayak Sairam", "Sairam Microfinance"
    if ($updated -ne $content) {
        Set-Content -Path $_.FullName -Value $updated -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($_.FullName)"
    }
}
Write-Host "Done."
