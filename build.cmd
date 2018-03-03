@echo off
setlocal

:: use first parameter if available
set _INSCRIPT="%~dpn1.sh"
::  otherwise fall back to .sh of the same name
if not exist "%_INSCRIPT%" set _INSCRIPT="%~dpn0.sh"
if not exist "%_INSCRIPT%" echo Script "%_INSCRIPT%" not found & goto :eof

::echo %_INSCRIPT%

:: Resolve ___.sh to /cygdrive based *nix path and store in %_CYGSCRIPT%
for /f "delims=" %%A in ('cygpath.exe %_INSCRIPT%') do set _CYGSCRIPT=%%A
for /f "delims=" %%A in ('cygpath.exe "%CD%"') do set _CYGPATH=%%A

::echo %_CYGPATH%
::echo %_CYGSCRIPT%

:: Throw away temporary env vars and invoke script, passing any args that were passed to us
endlocal & bash.exe --login -c 'cd %_CYGPATH%;  %_CYGSCRIPT% %*'
