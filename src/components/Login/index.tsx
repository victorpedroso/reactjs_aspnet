import './styles.css';
import api from '../../api/index';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.api.accountLoginCreate({ email, password });
      const { token, expiration } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        throw new Error('Token não recebido');
      }

      if (expiration) {
        localStorage.setItem('tokenExpiration', expiration);
      } else {
        throw new Error('Data de expiração não recebida');
      }

      localStorage.setItem('email', email);

      console.log('Successful login', response.data);

      navigate('/alunos');
    }
    catch (error) {
      console.error("Error with login", error);
      setError('E-mail ou senha incorretos');
    }
  };

  return (
    <div className='login-container'>
      <section className='form'>
        <form onSubmit={handleSubmit}>
            <h1>Cadastro de alunos</h1>
            <input type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            {error && <p>{error}</p>}
            <button className='button' type='submit'>Login</button>
        </form>
      </section>
    </div>
  )
}

export default Login;
