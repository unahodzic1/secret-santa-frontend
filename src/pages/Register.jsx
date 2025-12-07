import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function RegisterPage() {
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        setLoading(true);
        try {
            await authService.register(firstName, lastName, email, password);  
            setMessage('Prijavite se za nastavak korištenja aplikacije.')          
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            setMessage(`Registracija neuspješna: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Registracija uposlenika</h2>
            
            {message && (
                <p style={{ color: message.includes('uspješna') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}

            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Ime:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Prezime:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                    {loading ? 'Registrujem...' : 'Registruj se'}
                </button>
            </form>

            <p style={{ marginTop: '15px' }}>
                <Link to="/login" style={{ fontWeight: 'bold' }}><button>Prijava</button></Link>
            </p>
        </div>
    );
}

export default RegisterPage;