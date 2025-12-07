import authService from './authService';

const API_BASE_URL = 'https://secret-santa-backend-2hvs.onrender.com/api';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` 
        };
    } else {
        throw new Error("Korisnik nije ulogovan. Neovlašten pristup.");
    }
};


// GET /api/Employees
const getEmployees = async () => {
    const response = await fetch(`${API_BASE_URL}/Employees`, {
        method: 'GET',
        headers: getAuthHeaders() 
    });

    if (!response.ok) {
        throw new Error('Niste administrator.');
    }
    return await response.json();
};

// POST /api/SecretSanta/generate
const generatePairs = async () => {
    const response = await fetch(`${API_BASE_URL}/SecretSanta/generate`, {
        method: 'POST',
        headers: getAuthHeaders() 
    });

    if (!response.ok) {
        throw new Error('Greška pri generisanju Secret Santa liste.');
    }
    return await response.json();
};

// GET /api/Employees/myPair
const getMyPair = async () => {
    const response = await fetch(`${API_BASE_URL}/Employees/myPair`, {
        method: 'GET',
        headers: getAuthHeaders() 
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Secret Santa lista još nije generisana.');
        }
        throw new Error('Greška pri dohvatu vašeg para.');
    }
    return await response.json();
};

// GET /api/SecretSanta/history
const getHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/SecretSanta/history`, {
        method: 'GET',
        headers: getAuthHeaders() 
    });

    if (!response.ok) {
        throw new Error('Greška pri dohvatu historije Secret Santa parova.');
    }
    return await response.json();
};

export default {
    getEmployees,
    generatePairs,
    getMyPair,
    getHistory
};