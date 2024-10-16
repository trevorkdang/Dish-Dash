"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './profile.module.css'; // Import the CSS module

export default function Profile() {
  const [image, setImage] = useState('/images/DishDash-DefaultProfile.png'); // Default picture
  const [preview, setPreview] = useState(null); // Preview of the image
  const [showFileInput, setShowFileInput] = useState(true); // Toggle file input visibility
  const [showUploadButton, setShowUploadButton] = useState(false); // Show 'Upload' button only after previewing
  const [isEditingPicture, setIsEditingPicture] = useState(false); // Toggle between "Change" button and file input

  const [editMode, setEditMode] = useState(false);

  const [username, setUsername] = useState("Michael Thompson");
  const [email, setEmail] = useState("michael@example.com");
  const [password, setPassword] = useState("********");

  const uploadedVideos = [
    { id: 1, thumbnail: "/images/mock-video-1.png" },
  ];

  const savedVideos = [
    { id: 1, thumbnail: "/images/mock-video-2.png" },
  ];

  // Handle profile picture selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview of the selected image
        setShowUploadButton(true); // Show the upload button once the preview is ready
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture upload (set preview as actual profile picture)
  const handleUpload = (e) => {
    e.preventDefault();
    if (preview) {
      setImage(preview); // Set the uploaded image as the actual profile picture
      setPreview(null); // Clear preview after upload
      setShowUploadButton(false); // Hide upload button after upload
      setIsEditingPicture(false); // Exit edit mode for the profile picture
    }
  };

  // Toggle edit mode for changing the profile picture
  const handleChangePicture = () => {
    setIsEditingPicture(true); // Enable editing to allow selecting a new profile picture
    setShowFileInput(true); // Show file input again
    setShowUploadButton(false); // Hide upload button until a new image is chosen
  };

  // Toggle edit mode for profile details
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  // Save changes for user details
  const saveChanges = () => {
    setEditMode(false);
  };

  // Render the mock video layout (just images with links)
  const renderVideos = (videos) => {
    return (
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {videos.map((video) => (
          <div key={video.id} style={{ cursor: 'pointer' }}>
            <Link href={`/video/${video.id}`}>
              <img
                src={video.thumbnail}
                alt={`Video ${video.id}`}
                style={{ width: '200px', borderRadius: '10px' }}
              />
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* User profile section */}
      <div className={styles.profileSection}>
        <img
          src={preview || image}
          alt="User's Profile"
          className={styles.profileImage}
        />

        {/* File input and buttons to upload or change picture */}
        {isEditingPicture ? (
          <div>
            {showFileInput && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            )}
            {showUploadButton && (
              <button
                type="button"
                className={styles.uploadButton}
                onClick={handleUpload}
              >
                Upload
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleChangePicture}
          >
            Change Picture
          </button>
        )}
      </div>

      {/* User Information Edit Section */}
      <div className={styles.editSection}>
        <h2 className={styles.sectionTitle}>Profile Information</h2>
        <span className={styles.editIcon} onClick={toggleEdit}>✏️</span>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editMode}
            className={editMode ? styles.editableField : styles.nonEditableField}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editMode}
            className={editMode ? styles.editableField : styles.nonEditableField}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!editMode}
            className={editMode ? styles.editableField : styles.nonEditableField}
          />
        </div>
        {editMode && (
          <button onClick={saveChanges} className={styles.saveButton}>
            Save Changes
          </button>
        )}
      </div>

      {/* Uploaded Videos Section */}
      <div>
        <h2 className={styles.sectionTitle}>Your Videos</h2>
        {renderVideos(uploadedVideos)}
      </div>

      {/* Saved Videos Section */}
      <div>
        <h2 className={styles.sectionTitle}>Saved Recipes</h2>
        {renderVideos(savedVideos)}
      </div>

      {/* Delete Account Section */}
      <div className={styles.deleteAccountSection}>
        <h2>Delete Account</h2>
        <button className={styles.deleteButton}>Delete Account</button>
      </div>
    </div>
  );
}