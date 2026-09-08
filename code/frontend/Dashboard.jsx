import React, {
  useEffect,
  useState
} from 'react';

function Dashboard({
  user,
  onEditProfile,
  onLogout
}) {

  const [view, setView] =
    useState('home');

  const [posts, setPosts] =
    useState([]);

  const [message, setMessage] =
    useState('');

  // TEACHER POST
  const [postTitle, setPostTitle] =
    useState('');

  const [postType, setPostType] =
    useState('Hackathon');

  const [postDescription, setPostDescription] =
    useState('');

  const [postSkills, setPostSkills] =
    useState('');

  const token =
    localStorage.getItem('token');


  // ==========================================
  // API HELPER
  // ==========================================

  const apiFetch = async (
    url,
    options = {}
  ) => {

    return fetch(
      `http://localhost:5000${url}`,
      {
        ...options,

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {})
        }
      }
    );
  };


  // ==========================================
  // LOAD POSTS
  // ==========================================

  const loadPosts = async () => {

    const response =
      await apiFetch(
        '/api/posts'
      );

    if (response.ok) {

      const data =
        await response.json();

      setPosts(data);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadPosts();

  }, []);


  // ==========================================
  // PUBLISH TEACHER POST
  // ==========================================

  const publishPost =
    async (e) => {

      e.preventDefault();

      setMessage('');

      const skills =
        postSkills
          .split(',')
          .map(
            skill =>
              skill.trim()
          )
          .filter(
            skill =>
              skill !== ''
          );


      const response =
        await apiFetch(
          '/api/posts',
          {
            method: 'POST',

            body:
              JSON.stringify({
                title:
                  postTitle,

                type:
                  postType,

                description:
                  postDescription,

                requiredSkills:
                  skills
              })
          }
        );


      const data =
        await response.json();


      setMessage(
        data.message
      );


      if (response.ok) {

        setPostTitle('');

        setPostDescription('');

        setPostSkills('');

        setPostType(
          'Hackathon'
        );

        await loadPosts();
      }
    };


  // ==========================================
  // PROFILE
  // ==========================================

  const renderProfile =
    () => (

      <section className="profile-summary">

        <div className="profile-avatar">

          {user.profilePicture
            ? (
              <img
                src={
                  user.profilePicture
                }
                alt="Profile"
              />
            )
            : (
              user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : 'U'
            )}

        </div>


        <div className="profile-summary-info">

          <h2>
            {user.name}
          </h2>

          <p>
            {user.email}
          </p>

          <p>
            {user.department}
          </p>


          {user.role === 'student' && (

            <>

              <p>
                CGPA:
                {' '}
                {user.cgpa}
              </p>

              <p>
                Skills:
                {' '}
                {user.skills?.join(', ')}
              </p>

            </>

          )}


          {user.role === 'teacher' && (

            <>

              <p>
                {user.designation}
              </p>

              <p>
                Expertise:
                {' '}
                {user.expertise?.join(', ')}
              </p>

            </>

          )}

        </div>


        <button
          className="edit-button"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>

      </section>

    );


  // ==========================================
  // STUDENT OPTIONS
  // ==========================================

  const renderStudentOptions =
    () => (

      <section className="dashboard-grid">

        <button
          className="dashboard-option"
          onClick={() =>
            setView('join')
          }
        >

          <h3>
            Join a Team
          </h3>

          <p>
            Coming Soon
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('myteams')
          }
        >

          <h3>
            My Teams
          </h3>

          <p>
            Coming Soon
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('feed')
          }
        >

          <h3>
            Feed
          </h3>

          <p>
            Hackathons and projects
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('calendar')
          }
        >

          <h3>
            Calendar
          </h3>

          <p>
            Coming Soon
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('notifications')
          }
        >

          <h3>
            Notifications
          </h3>

          <p>
            Coming Soon
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('invite')
          }
        >

          <h3>
            Invite a Member
          </h3>

          <p>
            Coming Soon
          </p>

        </button>

      </section>

    );


  // ==========================================
  // TEACHER OPTIONS
  // ==========================================

  const renderTeacherOptions =
    () => (

      <section className="dashboard-grid teacher-grid">

        <button
          className="dashboard-option"
          onClick={() =>
            setView('post')
          }
        >

          <h3>
            Post
          </h3>

          <p>
            Create hackathon/project post
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('feed')
          }
        >

          <h3>
            Feed
          </h3>

          <p>
            View published posts
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('calendar')
          }
        >

          <h3>
            Calendar
          </h3>

          <p>
            Coming Soon
          </p>

        </button>


        <button
          className="dashboard-option"
          onClick={() =>
            setView('notifications')
          }
        >

          <h3>
            Notifications
          </h3>

          <p>
            Coming Soon
          </p>

        </button>

      </section>

    );


  // ==========================================
  // COMING SOON
  // ==========================================

  const renderComingSoon =
    (title) => (

      <section
        className="feature-section coming-soon-section"
      >

        <div className="section-heading">

          <h2>
            {title}
          </h2>

          <button
            className="back-button"
            onClick={() =>
              setView('home')
            }
          >
            Back
          </button>

        </div>


        <div className="coming-soon-box">

          <h2>
            Coming Soon
          </h2>

          <p>
            This functionality will be added
            in a future version.
          </p>

        </div>

      </section>

    );


  // ==========================================
  // FEED
  // ==========================================

  const renderFeed =
    () => (

      <section className="feature-section">

        <div className="section-heading">

          <h2>
            Feed
          </h2>

          <button
            className="back-button"
            onClick={() =>
              setView('home')
            }
          >
            Back
          </button>

        </div>


        {posts.length === 0 ? (

          <p className="empty-message">
            No projects or hackathons
            available currently.
          </p>

        ) : (

          <div className="card-list">

            {posts.map(
              post => (

                <div
                  className="feature-card"
                  key={post._id}
                >

                  <div className="post-header">

                    <div>

                      <h3>
                        {post.title}
                      </h3>

                      <p>
                        Posted by:
                        {' '}
                        {post.teacher?.name}
                      </p>

                    </div>


                    <span className="type-badge">
                      {post.type}
                    </span>

                  </div>


                  <p>
                    {post.description}
                  </p>


                  <p>

                    <strong>
                      Required Skills:
                    </strong>

                    {' '}

                    {post.requiredSkills?.join(', ') ||
                      'Not specified'}

                  </p>


                  {user.role === 'student' && (

                    <button
                      className="primary-small-button"
                      onClick={() =>
                        setMessage(
                          'Create a Team functionality is Coming Soon.'
                        )
                      }
                    >
                      Create a Team
                    </button>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>

    );


  // ==========================================
  // TEACHER POST
  // ==========================================

  const renderPost =
    () => (

      <section className="feature-section">

        <div className="section-heading">

          <h2>
            Create a Post
          </h2>

          <button
            className="back-button"
            onClick={() =>
              setView('home')
            }
          >
            Back
          </button>

        </div>


        <form
          className="post-form"
          onSubmit={
            publishPost
          }
        >

          <label>
            Title
          </label>

          <input
            type="text"
            value={
              postTitle
            }
            placeholder="AI Innovation Hackathon"
            onChange={(e) =>
              setPostTitle(
                e.target.value
              )
            }
            required
          />


          <label>
            Type
          </label>

          <select
            value={
              postType
            }
            onChange={(e) =>
              setPostType(
                e.target.value
              )
            }
          >

            <option value="Hackathon">
              Hackathon
            </option>

            <option value="Project">
              Project
            </option>

          </select>


          <label>
            Description
          </label>

          <textarea
            value={
              postDescription
            }
            placeholder="Describe the hackathon or project..."
            onChange={(e) =>
              setPostDescription(
                e.target.value
              )
            }
            required
          />


          <label>
            Required Skills
          </label>

          <input
            type="text"
            value={
              postSkills
            }
            placeholder="Python, ML, React"
            onChange={(e) =>
              setPostSkills(
                e.target.value
              )
            }
          />


          <button
            type="submit"
            className="primary-button"
          >
            Publish Post
          </button>

        </form>

      </section>

    );


  // ==========================================
  // CONTENT
  // ==========================================

  const renderContent =
    () => {

      if (
        view === 'home'
      ) {

        return (
          user.role === 'student'
            ? renderStudentOptions()
            : renderTeacherOptions()
        );

      }


      if (
        view === 'join'
      ) {
        return renderComingSoon(
          'Join a Team'
        );
      }


      if (
        view === 'myteams'
      ) {
        return renderComingSoon(
          'My Teams'
        );
      }


      if (
        view === 'feed'
      ) {
        return renderFeed();
      }


      if (
        view === 'invite'
      ) {
        return renderComingSoon(
          'Invite a Member'
        );
      }


      if (
        view === 'notifications'
      ) {
        return renderComingSoon(
          'Notifications'
        );
      }


      if (
        view === 'calendar'
      ) {
        return renderComingSoon(
          'Calendar'
        );
      }


      if (
        view === 'post'
      ) {
        return renderPost();
      }


      return null;
    };


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="logo-section">
          <img src="/logo.png" alt="Logo" />
        </div>

        <div>

          <h1>
            Project Team Formation Portal
          </h1>

          <p>

            {user.role === 'student'
              ? 'Student Dashboard'
              : 'Teacher Dashboard'}

          </p>

        </div>


        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      <main className="dashboard-content">

        {renderProfile()}


        {message && (

          <p className="dashboard-message">
            {message}
          </p>

        )}


        {renderContent()}

      </main>


      <footer className="dashboard-footer">

        <p>
          Developed by
        </p>

        <p>
          Shreyansh • Akshin • Chandan • Ayush
        </p>

      </footer>

    </div>

  );

}

export default Dashboard;