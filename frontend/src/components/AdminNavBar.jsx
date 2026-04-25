import { Navbar, Nav } from 'rsuite';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Navbar appearance="inverse" style={{ background: '#1a1a2e' }}>
            <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
                Grain.
            </Navbar.Brand>
        <Nav>
            <Nav.Item
                active={location.pathname === '/admin'}
                onSelect={() => navigate('/admin')}
            >
                Orders
            </Nav.Item>
            <Nav.Item
                active={location.pathname === '/admin/menu'}
                onSelect={() => navigate('/admin/menu')}
            >
                Edit Menu
            </Nav.Item>
        </Nav>
        </Navbar>
    );
};

export default AdminNavbar;