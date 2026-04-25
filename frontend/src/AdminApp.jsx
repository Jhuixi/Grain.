import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import AdminNavBar from './components/AdminNavBar';
import AdminProtected from './components/AdminProtected';
import Admin from './pages/admin/Admin';

function AdminApp() {
    return (
        <CustomProvider>
            <Router>
                <div className="admin-app">
                    <AdminNavBar />
                    <div className="admin-main">
                        <AdminProtected>
                            <Routes>
                                <Route path="/admin/*" element={<Admin />} />
                            </Routes>
                        </AdminProtected>
                    </div>
                </div>
            </Router>
        </CustomProvider>
    );
}

export default AdminApp;