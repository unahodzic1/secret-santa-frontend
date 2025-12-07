import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await authService.login(email, password);
            
            if (response.userRole === "Administrator") {
                navigate('/admin');
            } else if (response.userRole === "Uposlenik") {
                navigate('/employee');
            } else {
                setMessage('Nepoznata korisnička uloga.');
                authService.logout(); 
            }
        } catch (error) {
            setMessage(error.message || 'Neuspjela prijava. Pokušajte ponovo.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
            <h2>Prijava</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Lozinka:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Prijavi se
                </button>
            </form>
            {message && <p style={{ color: 'red', marginTop: '15px' }}>{message}</p>}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>
                        <Link to="/register" style={{ marginLeft: '5px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                        <button>Registracija</button>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;