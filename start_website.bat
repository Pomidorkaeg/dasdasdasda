@echo off
title Автоматическая настройка и запуск сайта

:: Проверка прав администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Запустите этот файл от имени администратора!
    pause
    exit /b
)

:: Создание рабочей директории
cd /d %~dp0
mkdir website 2>nul
cd website

:: Создание HTML файла
echo ^<!DOCTYPE html^>^
<html^>^
<head^>^
    <title^>Мой сайт^</title^>^
</head^>^
<body^>^
    <h1^>Добро пожаловать!^</h1^>^
</body^>^
</html^> > index.html

:: Скачивание и установка Python
echo Проверка наличия Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Установка Python...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.11.5/python-3.11.5-amd64.exe -OutFile python_installer.exe"
    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    del python_installer.exe
)

:: Перезагрузка переменных окружения
call refreshenv.cmd 2>nul
if %errorlevel% neq 0 (
    echo Обновление переменных окружения...
    for /f "delims=" %%i in ('powershell -Command "[System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')"') do set "PATH=%%i"
)

:: Запуск сервера и открытие браузера
echo Запуск сервера...
start python -m http.server 8080

:: Ждем 3 секунды и открываем браузер
timeout /t 3 >nul
start http://localhost:8080
echo Сайт запущен! Для завершения работы закройте это окно.
pause
