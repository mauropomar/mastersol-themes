@echo off
set pgpassword=postgres
set FECHA=%DATE%
set FECHA=%FECHA:/=%
CD "D:\Mis_cosas\MICHEL\TRABAJO\mastersol"
"C:\Program Files\PostgreSQL\12\bin\pg_dump.exe" -h localhost -p 5432 -U postgres -t public.5cdf18_v_test -f "pg_mastersol_%FECHA%.sql" mastersol