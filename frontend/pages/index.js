import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Try multiple ways to connect to backend
  const BACKEND_URLS = [
    'http://backend:3001',
    'http://localhost:3001',
    'http://host.docker.internal:3001',
    '/api'
  ];
  
  let currentBackendUrl = '';

  // Test backend connection on component mount
  useEffect(() => {
    checkAllBackendConnections();
  }, []);

  const checkAllBackendConnections = async () => {
    for (const url of BACKEND_URLS) {
      try {
        const response = await fetch(`${url}/auth/health`);
        if (response.ok) {
          currentBackendUrl = url;
          setBackendStatus('connected');
          console.log(`✅ Connected to backend at: ${url}`);
          return;
        }
      } catch (error) {
        console.log(`❌ Failed to connect at: ${url}`);
      }
    }
    setBackendStatus('error');
  };

  const getBackendUrl = () => {
    if (currentBackendUrl) return currentBackendUrl;
    
    if (typeof window !== 'undefined') {
      const isDocker = window.location.hostname !== 'localhost';
      return isDocker ? 'http://backend:3001' : 'http://localhost:3001';
    }
    return 'http://localhost:3001';
  };

  const handleSubmit = async (e) => {  // Removed TypeScript type
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'signin' : 'signup';
      const baseUrl = getBackendUrl();
      
      const requestBody = { email, password };
      if (!isLogin) {
        requestBody.name = name;
      }

      console.log(`📡 Sending request to: ${baseUrl}/auth/${endpoint}`);

      const response = await fetch(`${baseUrl}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${isLogin ? 'Login' : 'Registration'} successful! 🎉`);
        
        if (isLogin) {
          if (data.user) {
            localStorage.setItem('user', JSON.stringify({
              name: data.user.name,
              email: data.user.email
            }));
          }
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setMessage('');
            setPassword('');
            setName('');
          }, 2000);
        }
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Cannot connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>🔐 Auth System</h1>
        
        <div style={styles.status}>
          <div style={styles.statusIndicator}>
            Backend Status: 
            <span style={{
              ...styles.statusBadge,
              backgroundColor: backendStatus === 'connected' ? '#d4edda' : '#f8d7da',
              color: backendStatus === 'connected' ? '#155724' : '#721c24',
            }}>
              {backendStatus === 'connected' ? '✅ Connected' : 
               backendStatus === 'checking' ? '⏳ Checking...' : '❌ Disconnected'}
            </span>
          </div>
          {backendStatus === 'connected' && (
            <div style={styles.backendInfo}>
              📍 Connected to: {currentBackendUrl || getBackendUrl()}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={styles.formElement}>
          <h2 style={styles.subtitle}>
            {isLogin ? 'Welcome Back! 👋' : 'Create Account ✨'}
          </h2>
          
          {!isLogin && (
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required={!isLogin}
                style={styles.input}
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)"
              required
              style={styles.input}
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || backendStatus !== 'connected'}
            style={{
              ...styles.button,
              ...(loading || backendStatus !== 'connected' ? styles.buttonDisabled : {})
            }}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>⏳ Processing...</span>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={styles.toggleButton}
          disabled={loading}
        >
          {isLogin ? '❓ Need an account? Sign Up' : '🔑 Have an account? Sign In'}
        </button>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
            color: message.includes('successful') ? '#155724' : '#721c24',
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  form: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    animation: 'slideUp 0.5s ease',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '25px',
  },
  status: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid #e9ecef',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '13px',
  },
  backendInfo: {
    fontSize: '12px',
    color: '#6c757d',
    wordBreak: 'break-all',
  },
  formElement: {
    marginBottom: '25px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.3s, box-shadow 0.3s',
    marginTop: '10px',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  loadingSpinner: {
    display: 'inline-block',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  message: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

// Add global styles for animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    input:focus {
      border-color: #667eea !important;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  `;
  document.head.appendChild(style);
}