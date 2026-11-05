# Starts the local helper (if not already up) and opens the app window.
$root = Split-Path $PSScriptRoot
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { $node = "$env:ProgramFiles\nodejs\node.exe" }
# A helper left over from the last run would keep serving old code, so stop ours first (only our own server.js, matched by its command line).
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like "*$root*server*server.js*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 500
Start-Process $node -ArgumentList "`"$root\server\server.js`"" -WindowStyle Hidden -WorkingDirectory $root
for ($i=0; $i -lt 30; $i++) { try { Invoke-RestMethod http://127.0.0.1:47831/api/ping -TimeoutSec 1 | Out-Null; break } catch { Start-Sleep -Milliseconds 200 } }
$exe = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Google\Chrome\Application\chrome.exe","${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe") |
       Where-Object { Test-Path $_ } | Select-Object -First 1
Start-Process $exe -ArgumentList "--app=http://127.0.0.1:47831/", "--window-size=1500,950", "--user-data-dir=`"$env:LOCALAPPDATA\QueensDomainLab`""
