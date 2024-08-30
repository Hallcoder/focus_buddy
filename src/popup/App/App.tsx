import { Link } from 'react-router-dom';
import logo from '../../logo.svg';
import './App.css';

function App() {
  return (
    <div className="">
      <header className="border-4 border-red-400">
        <img src={logo} className="App-logo" alt="logo" />
        <p className='text-yellow-100'>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to={"/test"}>Go to test page</Link>
      </header>
    </div>
  );
}

export default App;
