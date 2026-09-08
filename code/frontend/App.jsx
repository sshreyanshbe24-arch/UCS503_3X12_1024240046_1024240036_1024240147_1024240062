import React, {
  useEffect,
  useState
} from 'react';

import Login from './Login';
import Profile from './Profile';
import Dashboard from './Dashboard';


function App() {

  const [user, setUser] =
    useState(null);

  const [page, setPage] =
    useState('loading');


  useEffect(() => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      setPage('login');
      return;
    }


    const loadUser = async () => {

      try {

        const response =
          await fetch(
            'http://localhost:5000/api/auth/me',
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (!response.ok) {

          localStorage.removeItem(
            'token'
          );

          setPage('login');

          return;
        }


        const profile =
          await response.json();

        setUser(profile);


        if (
          profile.role === 'student'
        ) {

          const complete =
            profile.department &&
            profile.cgpa !== undefined &&
            profile.cgpa !== null &&
            profile.skills &&
            profile.skills.length > 0;


          setPage(
            complete
              ? 'dashboard'
              : 'profile'
          );

        } else if (
          profile.role === 'teacher'
        ) {

          const complete =
            profile.department &&
            profile.designation;


          setPage(
            complete
              ? 'dashboard'
              : 'profile'
          );

        } else {

          setPage('dashboard');
        }

      } catch (error) {

        localStorage.removeItem(
          'token'
        );

        setPage('login');
      }
    };


    loadUser();

  }, []);


  const handleLoginSuccess =
    async (userData) => {

      try {

        const response =
          await fetch(
            'http://localhost:5000/api/profile/me',
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem('token')}`
              }
            }
          );


        const profile =
          await response.json();


        if (!response.ok) {

          setUser(userData);
          setPage('profile');

          return;
        }


        setUser(profile);


        if (
          profile.role === 'student'
        ) {

          const complete =
            profile.department &&
            profile.cgpa !== undefined &&
            profile.cgpa !== null &&
            profile.skills &&
            profile.skills.length > 0;


          setPage(
            complete
              ? 'dashboard'
              : 'profile'
          );

        } else if (
          profile.role === 'teacher'
        ) {

          const complete =
            profile.department &&
            profile.designation;


          setPage(
            complete
              ? 'dashboard'
              : 'profile'
          );

        } else {

          setPage('dashboard');
        }

      } catch (error) {

        setUser(userData);
        setPage('profile');
      }
    };


  const handleProfileComplete =
    (updatedUser) => {

      setUser(updatedUser);

      setPage('dashboard');
    };


  const handleLogout = () => {

    localStorage.removeItem(
      'token'
    );

    setUser(null);

    setPage('login');
  };


  if (page === 'loading') {

    return (
      <div className="loading-page">
        Loading...
      </div>
    );
  }


  if (page === 'login') {

    return (
      <Login
        onLoginSuccess={
          handleLoginSuccess
        }
      />
    );
  }


  if (page === 'profile') {

    return (
      <Profile
        user={user}
        onComplete={
          handleProfileComplete
        }
      />
    );
  }


  if (page === 'dashboard') {

    return (
      <Dashboard
        user={user}
        onEditProfile={() =>
          setPage('profile')
        }
        onLogout={handleLogout}
      />
    );
  }


  return null;
}


export default App;