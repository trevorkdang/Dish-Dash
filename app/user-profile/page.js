"use client"; // Add this line for Next.js 13+ Client Component

import { useState } from 'react';

export default function Profile() {
  const [image, setImage] = useState('/default-profile.png'); // Default picture
  const [preview, setPreview] = useState(null);

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (mock upload)
  const handleUpload = (e) => {
    e.preventDefault();
    if (preview) {
      setImage(preview); // Set the uploaded image as profile picture
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>User's Profile</h1>
      <img
        src={preview || image}
        alt="User's Profile"
        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
      />
      <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Upload
        </button>
      </form>
    </div>
  );
}