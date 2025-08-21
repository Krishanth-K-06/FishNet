import React, { useState } from 'react';
import tokenData from '../token.json'; // Adjust the path as necessary// Adjust the path as necessary
import { Link } from 'react-router-dom'; // <-- Add this at the top with your other imports

const FishPage = () => {
    const [fishName, setFishName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem("tokens");
    return saved ? Number(saved) : tokenData.tokens;
  });
// Hardcoded token value for now

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fishName.trim()) {
            showMessage('Please enter a fish name.', 'error');
            return;
        }

        setIsLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Geolocation obtained:', { latitude, longitude });

                    try {
                        const response = await fetch('http://127.0.0.1:8000/fish', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                native_name: fishName.trim(),
                                latitude: latitude,
                                longitude: longitude
                            }),
                        });

                        const result = await response.json();
                        showMessage(result.popup, result.status);
                    } catch (error) {
                        console.error('Error recording fish:', error);
                        showMessage('Failed to record fish. Server error.', 'error');
                    } finally {
                        setIsLoading(false);
                    }
                },
                (error) => {
                    setIsLoading(false);
                    let errorMessage = 'Unable to retrieve your location.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Location access denied.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "Location request timed out.";
                            break;
                        default:
                            errorMessage = "Unknown location error.";
                            break;
                    }
                    showMessage(errorMessage, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setIsLoading(false);
            showMessage('Geolocation is not supported by your browser.', 'error');
        }
    };

    return (
        <>
            {/* Internal CSS */}
            <style>{`
                body {
                    margin: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #e0f7fa, #e6f0ff, #dbeafe, #f0f4ff);

                }
                .header {
                    display: flex;
                    justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(16px);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          color: white;

                }
                .header .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #38bdf8;
                    text-shadow: 1px 1px 2px black;
                }
                .nav-links {
                    display: flex;
                    gap: 25px;
                    font-size: 16px;
                }
                .nav-links a {
                    color: black;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                .nav-links a:hover {
                    color: #38bdf8;
                }
                .token {
                    background-color: #38bdf8;
                    padding: 8px 16px;
                    border-radius: 20px;
                    color: black;
                    right: 80px;
                    position: relative;
                    font-weight: bold;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }

                .form-container {
                    margin-top: 120px;
                    background: white;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                    padding: 40px;
                    left: 50px;
                    top: 60px;
                    position: relative;
                    color:black;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .input, .submit {
                    width: 80%;
                    padding: 15px;
                    font-size: 18px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    outline: none;
                }

                .submit {
                    width: 88%;
                    background: black;
                    color: white;
                    border: none;
                    transition: background 0.2s ease;
                }

                .submit:hover {
                    background: #1d4ed8;
                }

                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 10px auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .message {
                    padding: 15px;
                    text-align: center;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .success {
                    background-color: #d1fae5;
                    color: #065f46;
                }

                .error {
                    background-color: #fee2e2;
                    color: #991b1b;
                }

                .alert {
                    background-color: #fef3c7;
                    color: #92400e;
                }
            `}</style>

            {/* Header Section */}
            <header className="header">
                <div className="logo">FISHNET</div>
                <nav className="nav-links">
                    <Link to="/">HomePage</Link>
                    <Link to="/proe">Profile</Link>
                    <Link to="/visit">Visit</Link>
                </nav>
                <div className="token">💰 {tokens} Coins</div>
            </header>

            {/* Form Section */}
            <div className="form-container">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}> Update Now!</h2>

                {isLoading && <div className="spinner"></div>}

                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter fish name (e.g., வஞ்சிரம்)"
                        value={fishName}
                        onChange={(e) => setFishName(e.target.value)}
                    />
                    <button className="submit" type="submit" disabled={isLoading}>
                        Record Fish
                    </button>
                </form>

                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}
            </div>
        </>
    );
};

export default FishPage;
