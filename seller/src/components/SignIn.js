import { useState } from 'react';
import API from '../api';  

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/signin', { email, password });
            
            console.log(response.data);
            alert('Signed in successfully!');

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-box" onSubmit={handleSubmit}>
                <h1>Seller Sign In</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="small-text">Create an account if you are a new seller</p>
            </form>
        </div>
    );
}

export default SignIn;