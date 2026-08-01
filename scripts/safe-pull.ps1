param(
    [string]$Remote = "origin",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

try {
    $gitRoot = git rev-parse --show-toplevel 2>$null
} catch {
    Write-Error "safe-pull must run inside a git repository."
    exit 1
}

if (-not $gitRoot) {
    Write-Error "safe-pull could not resolve git repository root."
    exit 1
}

Set-Location $gitRoot

# Remove system-generated metadata files that can break git refs/object parsing on Windows synced folders.
Get-ChildItem -Path ".git" -Recurse -Force -Filter "desktop.ini" |
    Remove-Item -Force -ErrorAction SilentlyContinue

# Continue with normal pull flow.
git pull --tags $Remote $Branch
