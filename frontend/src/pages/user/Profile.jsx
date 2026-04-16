// frontend/src/pages/Profile.jsx
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	if (!user) {
		return null;
	}
// In Profile.jsx, add this temporarily
console.log('Full user object:', user);
console.log('created_at value:', user.created_at);
	return (
		<div className="profile-page">
			<div className="profile-container">
				<div className="profile-card">
					<div className="profile-avatar">
						<div className="avatar-circle">
						{user.username?.charAt(0).toUpperCase()}
						</div>
					</div>
					
					<h1>My Profile</h1>
					
					<div className="profile-info">
						<div className="info-row">
							<span className="info-label">Username</span>
							<span className="info-value">{user.username}</span>
						</div>
						<div className="info-row">
							<span className="info-label">Email</span>
							<span className="info-value">{user.email}</span>
						</div>
						<div className="info-row">
							<span className="info-label">Member Since</span>
							<span className="info-value">
								{new Date(user.created_at).toLocaleDateString()}
							</span>
						</div>
					</div>
					<div className="profile-actions">
						<button onClick={() => navigate('/orders')} className="history-btn">
							View Order History
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