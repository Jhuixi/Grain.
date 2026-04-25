// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
	const { user, token, logout } = useAuth();
	const navigate = useNavigate();

	// Change password
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setPasswordError('');
		setPasswordSuccess('');

		if (newPassword !== confirmPassword) {
			setPasswordError('New passwords do not match');
			return;
		}

		if (newPassword.length < 6) {
			setPasswordError('Password must be at least 6 characters');
			return;
		}

		setIsChangingPassword(true);

		try {
			const response = await fetch(`http://localhost:5001/api/auth/change-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});

			const data = await response.json();

			if (data.success) {
				setPasswordSuccess('Password changed successfully!');
				// Clear form
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
				// Hide form after 2 seconds
				setTimeout(() => {
				setShowPasswordForm(false);
				setPasswordSuccess('');
				}, 2000);
			} else {
				setPasswordError(data.message || 'Failed to change password');
			}
		} catch (error) {
			console.error('Error changing password:', error);
			setPasswordError('Failed to change password. Please try again.');
		} finally {
			setIsChangingPassword(false);
		}
	};

	const formatDate = (dateValue) => {
		if (!dateValue) return 'Just joined';
		try {
		const date = new Date(dateValue);
		if (isNaN(date.getTime())) return 'Date unavailable';
		return date.toLocaleDateString('en-SG', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		} catch (error) {
		return 'Date unavailable';
		}
	};

	if (!user) {
		return (
		<div className="profile-page">
			<div className="profile-container">
			<div className="profile-card">
				<p>Please log in to view your profile.</p>
				<button onClick={() => navigate('/login')} className="auth-btn">
				Go to Login
				</button>
			</div>
			</div>
		</div>
		);
	}

	return (
		<div className="profile-page">
		<div className="profile-container">
			<div className="profile-card">
			<div className="profile-avatar">
				<div className="avatar-circle">
				{user.username?.charAt(0).toUpperCase() || '?'}
				</div>
			</div>
			
			<h1>My Profile</h1>
			
			<div className="profile-info">
				<div className="info-row">
				<span className="info-label">Username</span>
				<span className="info-value">{user.username || 'N/A'}</span>
				</div>
				<div className="info-row">
				<span className="info-label">Email</span>
				<span className="info-value">{user.email || 'N/A'}</span>
				</div>
				<div className="info-row">
				<span className="info-label">Member Since</span>
				<span className="info-value">{formatDate(user.created_at)}</span>
				</div>
			</div>

			{/* Change Password Section */}
			<div className="password-section">
				<button 
				className="change-password-btn"
				onClick={() => setShowPasswordForm(!showPasswordForm)}
				>
				{showPasswordForm ? 'Cancel' : 'Change Password'}
				</button>

				{showPasswordForm && (
				<form onSubmit={handleChangePassword} className="password-form">
					<div className="form-group">
					<label>Current Password</label>
					<input
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						placeholder="Enter current password"
						required
					/>
					</div>

					<div className="form-group">
					<label>New Password</label>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="Enter new password (min 6 characters)"
						required
					/>
					</div>

					<div className="form-group">
					<label>Confirm New Password</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm new password"
						required
					/>
					</div>

					{passwordError && <div className="password-error">{passwordError}</div>}
					{passwordSuccess && <div className="password-success">{passwordSuccess}</div>}

					<button 
					type="submit" 
					className="update-password-btn"
					disabled={isChangingPassword}
					>
					{isChangingPassword ? 'Updating...' : 'Update Password'}
					</button>
				</form>
				)}
			</div>
			
			<div className="profile-actions">
				<button onClick={() => navigate('/orders')} className="history-btn">
				📋 View Order History
				</button>
				<button onClick={handleLogout} className="logout-btn">
				Sign Out
				</button>
			</div>
			</div>
		</div>
		</div>
	);
};

export default Profile;