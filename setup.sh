#!/bin/bash

echo "Memulai instalasi dependencies backend..."

# Berpindah ke folder backend
cd backend || exit

# Menginstal library dari requirements.txt
pip install -r requirements.txt

echo "Instalasi selesai!"