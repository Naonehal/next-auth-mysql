import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import withSession from "../utils/ironSessionMiddleware";

const Profile = () => {
  // Initialize user state with default values
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile details when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/getUserProfile');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/updateUserProfile', user);
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            disabled // username should not be editable
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete('/api/deleteUser'); // Assuming you use the DELETE method for deleting users
      if (response.status === 200) {
        // Redirect to login page after successful deletion
        router.push('/login');
      }
    } catch (error) {
      console.error('Error deleting account:',  error.response.data);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/logout');
      if (response.status === 200) {
        // Redirect to login page after successful logout
        router.push('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard. This page is protected and requires authentication.</p>
      <Profile />
      <button onClick={handleDeleteAccount}>Delete Account</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export const getServerSideProps = withSession(async (context) => {
  const user = context.req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});