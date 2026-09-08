import React, {
  useState
} from 'react';


function Login({
  onLoginSuccess
}) {

  const [isSignup, setIsSignup] =
    useState(false);

  const [role, setRole] =
    useState('student');


  const [name, setName] =
    useState('');

  const [rollNumber, setRollNumber] =
    useState('');

  const [department, setDepartment] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');


  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const handleLogin =
    async (e) => {

      e.preventDefault();

      setMessage('');
      setLoading(true);


      try {

        const response =
          await fetch(
            'http://localhost:5000/api/auth/login',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  email,
                  password,
                  role
                })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setMessage(
            data.message ||
            'Login failed'
          );

          return;
        }


        localStorage.setItem(
          'token',
          data.token
        );


        onLoginSuccess(
          data.user
        );

      } catch (error) {

        setMessage(
          'Unable to connect to the backend server.'
        );

      } finally {

        setLoading(false);
      }
    };


  const handleSignup =
    async (e) => {

      e.preventDefault();

      setMessage('');
      setLoading(true);


      try {

        const response =
          await fetch(
            'http://localhost:5000/api/auth/register',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({

                  name,

                  email,

                  password,

                  role,

                  rollNumber:
                    role === 'student'
                      ? rollNumber
                      : undefined,

                  department

                })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setMessage(
            data.message ||
            'Registration failed'
          );

          return;
        }


        setMessage(
          'Registration successful. Please login.'
        );


        setIsSignup(false);


        setName('');
        setRollNumber('');
        setDepartment('');
        setEmail('');
        setPassword('');


      } catch (error) {

        setMessage(
          'Unable to connect to the backend server.'
        );

      } finally {

        setLoading(false);
      }
    };


  return (

    <div className="login-page">

      <div className="login-background-circle1"></div>
      <div className="login-background-circle2"></div>
      <div className="login-background-circle3"></div>


      <div className="login-card">

        <h1>
          Project Team Formation Portal
        </h1>


        <p className="subtitle">

          {isSignup
            ? 'Create your account'
            : 'Login to continue'}

        </p>


        <div className="role-buttons">

          <button
            type="button"
            className={
              role === 'student'
                ? 'active'
                : ''
            }
            onClick={() =>
              setRole('student')
            }
          >
            Student
          </button>


          <button
            type="button"
            className={
              role === 'teacher'
                ? 'active'
                : ''
            }
            onClick={() =>
              setRole('teacher')
            }
          >
            Teacher
          </button>

        </div>


        <h2>

          {isSignup
            ? `Create ${role} account`
            : `${role === 'student'
              ? 'Student'
              : 'Teacher'} Login`}

        </h2>


        <form
          onSubmit={
            isSignup
              ? handleSignup
              : handleLogin
          }
        >

          {isSignup && (

            <>

              <label>
                Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />


              {role === 'student' && (

                <>

                  <label>
                    Roll Number
                  </label>

                  <input
                    type="text"
                    value={rollNumber}
                    placeholder="Enter roll number"
                    onChange={(e) =>
                      setRollNumber(
                        e.target.value
                      )
                    }
                    required
                  />

                </>

              )}


              <label>
                Department
              </label>

              <input
                type="text"
                value={department}
                placeholder="Enter department"
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
                required
              />

            </>

          )}


          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />


          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Sign Up'
                : 'Login'}

          </button>

        </form>


        {message && (

          <p className="message">
            {message}
          </p>

        )}


        {!isSignup && (

          <button
            className="forgot-button"
            type="button"
            onClick={() =>
              setMessage(
                'Forgot password will be implemented later.'
              )
            }
          >
            Forgot Password?
          </button>

        )}


        <div className="signup-section">

          <p>

            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

          </p>


          <button
            className="signup-button"
            type="button"
            onClick={() => {

              setIsSignup(
                !isSignup
              );

              setMessage('');

            }}
          >

            {isSignup
              ? 'Login'
              : 'Sign Up'}

          </button>

        </div>

      </div>

    </div>
  );
}


export default Login;