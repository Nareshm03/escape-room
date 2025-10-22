@echo off
echo Starting Escape Room Application...

echo Installing frontend dependencies...
cd frontend
npm install react-scripts@5.0.1 --save
npm install

echo Starting application...
cd ..
npm run dev

pause