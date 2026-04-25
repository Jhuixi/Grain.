import { useState, useEffect } from 'react';
import { Modal, Button, Message, toaster, VStack, Text, PinInput } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const AdminProtected = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const adminAuth = sessionStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = async (submittedPin = pin) => {
        if (!submittedPin || submittedPin.length !== 6) {
            toaster.push(
                <Message type="warning" showIcon>Please enter a 6-digit PIN</Message>,
                { placement: 'topCenter', duration: 3000 }
            );
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: submittedPin })
            });
            
            const data = await response.json();
            
            if (data.success) {
                sessionStorage.setItem('adminAuth', 'true');
                setIsAuthenticated(true);
                setPin('');
                toaster.push(
                    <Message type="success" showIcon>Access granted!</Message>,
                    { placement: 'topCenter', duration: 2000 }
                );
            } else {
                toaster.push(
                    <Message type="error" showIcon>Incorrect PIN. Please try again.</Message>,
                    { placement: 'topCenter', duration: 3000 }
                );
                setPin('');
            }
        } catch (error) {
            console.error('Error verifying PIN:', error);
            toaster.push(
                <Message type="error" showIcon>Failed to verify. Please try again.</Message>,
                { placement: 'topCenter', duration: 3000 }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-pin-modal">
                <Modal open={true} backdrop="static" keyboard={false} size="xs">
                    <Modal.Header>
                        <Modal.Title>🔐 Admin Access</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <VStack spacing={16} alignItems="stretch">
                            <Text>Please enter the 6-digit admin PIN to continue.</Text>
                            <PinInput 
                                length={6}
                                value={pin}
                                onChange={(value) => setPin(value)}
                                onComplete={(value) => {
                                    setPin(value);
                                    handleSubmit(value);
                                }}
                                autoFocus
                                size="lg"
                                style={{ justifyContent: 'center' }}
                            />
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => navigate('/')} appearance="subtle">
                            Exit
                        </Button>
                        <Button onClick={() => handleSubmit()} appearance="primary" loading={loading}>
                            Verify
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    return children;
};

export default AdminProtected;