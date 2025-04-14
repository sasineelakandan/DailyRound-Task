Installation

1.Clone the repository:

git clone https://github.com/sasineelakandan/DailyRound-Task.git

cd DailyRound-Task
____frontend____

cd frontend

npm install

npm run dev


fortend env:

I reuse my firebase docreserva.site google login setup

VITE_APIKEY=AIzaSyDfamFPdwerB7DYAV-ApkJ_vcxw7DTwAU8
VITE_AUTHDOMAIN=docreserva-booking.firebaseapp.com
VITE_PROJECTID=docreserva-booking
VITE_STORAGEBUCKET=docreserva-booking.firebasestorage.app
VITE_MESSAGINGSENDERID=186431569165
VITE_APPID=1:186431569165:web:f13a8a8ffb9f0712728444
VITE_MEASUREMENTID=G-MQQ7V7VSVE
VITE_AUTH_SERVICE_URL=https://task-budy.onrender.com or http://localhost:5000/

___BackEnd_____

cd backend

npm install

npm start

Bcakend env:
  
  CLIENT='https://taskbudy-nine.vercel.app' or http://localhost:5173/

  DATABASE_URL=mongodb+srv://devasasi:WxAGvVRGeMH8lV82@cluster0.elv16wi.mongodb.net/taskBuddy

  JWT_KEY=123456

  PORT=5000

Important:
   I host the project in render so intial request take some time.

   I set up Google Login for my first website, docreserva.site, and now I’m reusing it for this to-do list project

   hosted Link:https://taskbudy-nine.vercel.app/