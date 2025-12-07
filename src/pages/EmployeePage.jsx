import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import secretSantaService from '../services/secretSantaService'; 
import { useNavigate } from 'react-router-dom';

function EmployeePage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pairData, setPairData] = useState(null); 
    const [message, setMessage] = useState('');

    const REQUIRED_ROLE = 'Uposlenik';

    useEffect(() => {
        const user = authService.getCurrentUser();
        
        if (!user || !user.token) {
            navigate('/login');
            return; 
        }

        if (user.role !== REQUIRED_ROLE) {
            navigate('/login'); 
            return;
        }

        setIsAuthenticated(true);
        fetchMyPair();
        
    }, [navigate]);

    const fetchMyPair = async () => {
        try {
            const data = await secretSantaService.getMyPair();
            setPairData(data);
        } catch (error) {
            setPairData(null); 
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',    
            minHeight: '100vh',
            paddingTop: '50px',      
            width: '100%',
            boxSizing: 'border-box'
        }}>
        <div>
            <h1>Dashboard Uposlenika</h1>
            <button onClick={handleLogout}>Odjavi se</button>
            <hr />

            {message && <p style={{ color: message.startsWith('Greška') ? 'red' : 'green' }}>{message}</p>}

            <h3>Trebate kupiti poklon za:</h3>
            
            {pairData ? (
                <div style={{ border: '1px solid #ccc', padding: '15px', maxWidth: '400px' }}>
                    <h2>{pairData.receiverName} {pairData.receiverSurname}</h2>
                    <p>Kontakt email: <strong>{pairData.receiverEmail}</strong></p>
                </div>
            ) : (
                <p>Nijedna Secret Santa lista još nije generisana.</p>
            )}
        </div>
        </div>
    );
}

export default EmployeePage;