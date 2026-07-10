param(
    [string]$Remote = "origin",
    [string]$Branch = "main"
)

# Remove system-generated metadata files that can break git refs/object parsing on Windows synced folders.
Get-ChildItem -Path ".git" -Recurse -Force -Filter "desktop.ini" |
    Remove-Item -Force -ErrorAction SilentlyContinue

# Continue with normal pull flow.
git pull --tags $Remote $Branch
