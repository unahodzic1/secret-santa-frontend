import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import secretSantaService from '../services/secretSantaService'; 
import './AdminPage.css'; 

function AdminPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [history, setHistory] = useState([]); 
    const [message, setMessage] = useState('');

    const fetchEmployees = async () => {
        try {
            const data = await secretSantaService.getEmployees();
            setEmployees(data);
        } catch (error) {
            setMessage(`Greška pri dohvatu uposlenika: ${error.message}`);
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await secretSantaService.getHistory();
            setHistory(data);
        } catch (error) {
            setMessage(`Greška pri dohvatu historije parova: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        
        if (!user || user.role !== 'Administrator') {
            navigate('/login');
            return; 
        }

        setIsAuthenticated(true);
        
        fetchEmployees();
        fetchHistory(); 
        
    }, [navigate]); 

    const handleGeneratePairs = async () => {
        setMessage('Generisanje parova...');
        try {
            await secretSantaService.generatePairs();
            setMessage('Parovi uspješno generisani!');
            fetchEmployees(); 
            fetchHistory(); 
        } catch (error) {
            setMessage(`Greška pri generisanju: ${error.message}`);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const allLists = history; 
    
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout}>Odjavi se</button>
            <hr />

            {message && (
                <p className={message.startsWith('Greška') ? 'message-error' : 'message-success'}>
                    {message}
                </p>
            )}

            <h2>Generisanje Secret Santa Liste</h2>
            <button onClick={handleGeneratePairs}>Generiši</button>
            <hr />

            <h3>Lista uposlenika</h3>
            {employees.length === 0 ? (
                <p>Nema registriranih uposlenika za prikaz.</p>
            ) : (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, index) => (
                            <tr key={index}>
                                <td>{emp.name}</td>
                                <td>{emp.surname}</td>
                                <td>{emp.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <hr />

            <h3>Sve generisane liste</h3>
            
            {allLists.length === 0 ? (
                <p>Nije formirana nijedna Secret Santa lista.</p>
            ) : (
                allLists.map((list, listIndex) => ( 
                    <div key={list.listId || listIndex} className="history-list-item">
                        <h4>
                        Lista generisana: {list.createdDate ? new Date(list.createdDate).toLocaleString() : 'Nepoznat datum'} 
                        </h4>
                        
                        {list.unpairedEmployee && (
                            <p className="unpaired-employee">
                                Neupareni uposlenik: {list.unpairedEmployee.name} {list.unpairedEmployee.surname} ({list.unpairedEmployee.email})
                            </p>
                        )}
                        
                        {list.pairs && list.pairs.length > 0 && (
                            <table className="history-table">
                                <thead>
                                    <tr className="history-header-row">
                                        <th>Daje poklon</th>
                                        <th>Dobija poklon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.pairs?.map((pair, pairIndex) => (
                                        <tr key={pairIndex}>
                                            <td>
                                                {pair.giverName} {pair.giverSurname} ({pair.giverEmail})
                                            </td>
                                            <td>
                                                {pair.receiverName} {pair.receiverSurname} ({pair.receiverEmail})
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminPage;