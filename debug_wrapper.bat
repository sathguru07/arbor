@echo off
type nul > C:\Users\Asus-2023\arbor\debug_log.txt
echo Starting Arbor via Wrapper >> C:\Users\Asus-2023\arbor\debug_log.txt
C:\Users\Asus-2023\arbor\crates\target\debug\arbor.exe bridge "C:\Users\Asus-2023\arbor" --viz 2>> C:\Users\Asus-2023\arbor\debug_log.txt
