@echo off
REM Serves the prebuilt static site in .\out at http://localhost:3000
cd /d "%~dp0"
if not exist out\index.html (
  echo Building...
  call npm install && call npm run build
)
start "" http://localhost:3000
npx --yes serve@latest out -l 3000
