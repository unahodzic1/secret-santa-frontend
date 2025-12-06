const API_BASE_URL = 'http://localhost:5015/api'; 

const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const register = async (firstName, lastName, email, password, role) => {
    const dataToSend = { 
        firstName, 
        lastName, 
        email, 
        password, 
        role: role
    };

    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.join(', ') || 'Greška pri registraciji.');
    }
    return true; 
};

const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Pogrešan email ili password.');
        }
        throw new Error('Greška pri prijavi.');
    }

    const data = await response.json(); 

    if (data.token && data.userRole) {
        localStorage.setItem("user", JSON.stringify({
            token: data.token,
            role: data.userRole 
        }));
    }

    return data;
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register,
    login,
    logout,
    getCurrentUser
};