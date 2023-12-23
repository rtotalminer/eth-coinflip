
import App from './components/App';
import { createRoot } from 'react-dom/client';

// Global styling
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);