@echo off
ssh-keygen -t rsa -b 4096 -m PEM -f ./src-tauri/src/private.pem -N ""
openssl rsa -in ./src-tauri/src/private.pem -pubout -outform PEM -out ./src-tauri/src/public.pem
rm ./src-tauri/src/private.pem.pub