import './App.css';
import logo from './logo.svg';
import { useAxQuery } from './__.gen';

function App() {
  const x = useAxQuery();
  return (
    <div className="App">
      <pre>
        ++++
        {JSON.stringify(x.data, null, 4)}
        ++++
      </pre>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
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
      </header>
    </div>
  );
}

export default App;
