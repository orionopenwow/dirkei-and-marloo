# Generates app\icon.png / app\icon.ico and a desktop shortcut that runs scripts\launcher.ps1.
# Safe to re-run (e.g. after moving the project folder).
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot
$app = Join-Path $root 'app'
$bmp = New-Object System.Drawing.Bitmap 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::FromArgb(0,0,0,0))
function Diamond($m){ $pts=@(
  (New-Object System.Drawing.PointF 128,$m),(New-Object System.Drawing.PointF (256-$m),128),
  (New-Object System.Drawing.PointF 128,(256-$m)),(New-Object System.Drawing.PointF $m,128)); ,$pts }
$g.FillPolygon((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,6,16,38))),(Diamond 6))
$g.DrawPolygon((New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255,212,174,69)),10),(Diamond 10))
$g.FillPolygon((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,31,120,224))),(Diamond 50))
$g.DrawPolygon((New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255,111,211,255)),5),(Diamond 50))
$g.FillPolygon((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,212,174,69))),(Diamond 98))
$g.Dispose()
$bmp.Save("$app\icon.png",[System.Drawing.Imaging.ImageFormat]::Png)
$png = [IO.File]::ReadAllBytes("$app\icon.png")
$ms = New-Object IO.MemoryStream; $w = New-Object IO.BinaryWriter $ms
$w.Write([uint16]0);$w.Write([uint16]1);$w.Write([uint16]1)
$w.Write([byte]0);$w.Write([byte]0);$w.Write([byte]0);$w.Write([byte]0)
$w.Write([uint16]1);$w.Write([uint16]32);$w.Write([uint32]$png.Length);$w.Write([uint32]22);$w.Write($png)
[IO.File]::WriteAllBytes("$app\icon.ico",$ms.ToArray())

$sh = (New-Object -ComObject WScript.Shell).CreateShortcut("$([Environment]::GetFolderPath('Desktop'))\Queen's Domain.lnk")
$sh.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$sh.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PSScriptRoot\launcher.ps1`""
$sh.WindowStyle = 7
$sh.IconLocation = "$app\icon.ico"
$sh.WorkingDirectory = $root
$sh.Save()
"Shortcut updated -> $PSScriptRoot\launcher.ps1"
