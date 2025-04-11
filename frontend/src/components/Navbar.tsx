
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const { displayName, photoURL } = location.state || {};
     useEffect(() => {
        if (displayName && photoURL) {
          localStorage.setItem('displayName', displayName);
          localStorage.setItem('photoURL', photoURL);
        }
      }, [displayName,photoURL]);

      const storedDisplayName = localStorage.getItem('displayName');
      const storedPhoto = localStorage.getItem('photoURL');
      const photo = storedPhoto ?? undefined;
  return (
    <div>
       <header className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img src="task buddy logo.png" alt="logo" className="w-5 h-5" />
                <h1 className="text-xl font-bold">TaskBuddy</h1>
                <div className="flex gap-2">
      
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <img
                    src={photo}
                    alt="Profile Photo"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="ml-3  font-bold text-gray-600 text-sm">{storedDisplayName}</span>
                </div>
              </div>
            </header>
      
    </div>
  )
}

export default Navbar
