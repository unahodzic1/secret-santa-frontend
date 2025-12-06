import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); // Resetuj poruke

        try {
            const response = await authService.login(email, password);
            
            // Provjera uloge i preusmjeravanje
            if (response.userRole === "Administrator") {
                navigate('/admin');
            } else if (response.userRole === "Uposlenik") {
                navigate('/employee');
            } else {
                setMessage('Nepoznata korisnička uloga.');
                authService.logout(); // Izbaci nepoznatog korisnika
            }
        } catch (error) {
            // Prikazivanje greške iz servisa (npr. 'Pogrešan email ili lozinka.')
            setMessage(error.message || 'Neuspjela prijava. Pokušajte ponovo.');
        }
    };

    return (
        <div>
            <h2>Prijava</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="password">Lozinka:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Prijavi se</button>
            </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
}

export default LoginPage;