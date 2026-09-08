import React, {
  useState
} from 'react';


function Profile({
  user,
  onComplete
}) {

  const [department, setDepartment] =
    useState(
      user.department || ''
    );

  const [cgpa, setCgpa] =
    useState(
      user.cgpa ?? ''
    );

  const [skills, setSkills] =
    useState(
      user.skills
        ? user.skills.join(', ')
        : ''
    );

  const [github, setGithub] =
    useState(
      user.github || ''
    );

  const [linkedin, setLinkedin] =
    useState(
      user.linkedin || ''
    );

  const [resume, setResume] =
    useState(
      user.resume || ''
    );

  const [profilePicture, setProfilePicture] =
    useState(
      user.profilePicture || ''
    );

  const [designation, setDesignation] =
    useState(
      user.designation || ''
    );

  const [expertise, setExpertise] =
    useState(
      user.expertise
        ? user.expertise.join(', ')
        : ''
    );


  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setMessage('');
      setLoading(true);


      const skillList =
        skills
          .split(',')
          .map(
            skill =>
              skill.trim()
          )
          .filter(
            skill =>
              skill !== ''
          );


      const expertiseList =
        expertise
          .split(',')
          .map(
            item =>
              item.trim()
          )
          .filter(
            item =>
              item !== ''
          );


      if (
        user.role === 'student' &&
        (
          !department ||
          !cgpa ||
          skillList.length === 0
        )
      ) {

        setMessage(
          'Department, CGPA and at least one skill are required.'
        );

        setLoading(false);

        return;
      }


      if (
        user.role === 'teacher' &&
        (
          !department ||
          !designation
        )
      ) {

        setMessage(
          'Department and designation are required.'
        );

        setLoading(false);

        return;
      }


      try {

        const response =
          await fetch(
            'http://localhost:5000/api/profile/me',
            {

              method: 'PUT',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${localStorage.getItem('token')}`

              },

              body:
                JSON.stringify({

                  department,

                  cgpa:
                    cgpa
                      ? Number(cgpa)
                      : undefined,

                  skills:
                    skillList,

                  github,

                  linkedin,

                  resume,

                  profilePicture,

                  designation,

                  expertise:
                    expertiseList

                })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setMessage(
            data.message ||
            'Could not save profile.'
          );

          return;
        }


        onComplete(
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


  return (

    <div className="profile-page">

      <div className="profile-card">

        <h1>
          Complete Your Profile
        </h1>

        <p className="subtitle">
          Add the information needed for team formation.
        </p>


        <form
          onSubmit={handleSubmit}
        >

          <div className="profile-section">

            <h2>
              Basic Information
            </h2>

            <p>
              Name: {user.name}
            </p>

            <p>
              Email: {user.email}
            </p>

            {user.role === 'student' && (

              <p>
                Roll Number:
                {' '}
                {user.rollNumber}
              </p>

            )}

          </div>


          <label>
            Department *
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


          {user.role === 'student' && (

            <>

              <label>
                CGPA *
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                placeholder="Enter CGPA"
                onChange={(e) =>
                  setCgpa(
                    e.target.value
                  )
                }
                required
              />


              <label>

                Skills *

                <span>
                  {' '}
                  (comma separated)
                </span>

              </label>

              <input
                type="text"
                value={skills}
                placeholder="C++, Python, React"
                onChange={(e) =>
                  setSkills(
                    e.target.value
                  )
                }
                required
              />


              <div className="optional-title">
                Optional Information
              </div>


              <label>
                GitHub
              </label>

              <input
                type="text"
                value={github}
                placeholder="GitHub profile link"
                onChange={(e) =>
                  setGithub(
                    e.target.value
                  )
                }
              />


              <label>
                LinkedIn
              </label>

              <input
                type="text"
                value={linkedin}
                placeholder="LinkedIn profile link"
                onChange={(e) =>
                  setLinkedin(
                    e.target.value
                  )
                }
              />


              <label>
                Resume
              </label>

              <input
                type="text"
                value={resume}
                placeholder="Resume link (optional)"
                onChange={(e) =>
                  setResume(
                    e.target.value
                  )
                }
              />


              <label>
                Profile Picture
              </label>

              <input
                type="text"
                value={profilePicture}
                placeholder="Profile picture link (optional)"
                onChange={(e) =>
                  setProfilePicture(
                    e.target.value
                  )
                }
              />

            </>

          )}


          {user.role === 'teacher' && (

            <>

              <label>
                Designation *
              </label>

              <input
                type="text"
                value={designation}
                placeholder="Assistant Professor"
                onChange={(e) =>
                  setDesignation(
                    e.target.value
                  )
                }
                required
              />


              <label>
                Areas of Expertise
              </label>

              <input
                type="text"
                value={expertise}
                placeholder="AI, Web Development"
                onChange={(e) =>
                  setExpertise(
                    e.target.value
                  )
                }
              />


              <div className="optional-title">
                Optional Information
              </div>


              <label>
                Profile Picture
              </label>

              <input
                type="text"
                value={profilePicture}
                placeholder="Profile picture link"
                onChange={(e) =>
                  setProfilePicture(
                    e.target.value
                  )
                }
              />

            </>

          )}


          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? 'Saving...'
              : 'Save & Continue'}

          </button>


          {message && (

            <p className="message">
              {message}
            </p>

          )}

        </form>

      </div>

    </div>
  );
}


export default Profile;