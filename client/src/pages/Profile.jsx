// pages/Profile.jsx
import React from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div style={{ padding: 32 }}>
      <h1>Trang cá nhân</h1>
      <p><strong>Tên:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </div>
  );
};

export default Profile;
