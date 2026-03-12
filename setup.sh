#!/bin/bash

echo "=== Memulai instalasi dependencies Backend ==="
cd backend || exit
pip install -r requirements.txt
echo "Backend selesai!"

# Kembali ke folder utama (root) sebelum masuk ke frontend
cd .. 

echo "=== Memulai instalasi dependencies Frontend ==="
cd frontend || exit
npm install 
echo "Frontend selesai!"

echo "=== Semua instalasi telah selesai! Aplikasi siap dijalankan. ==="