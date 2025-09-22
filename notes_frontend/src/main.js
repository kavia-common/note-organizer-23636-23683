import './styles/theme.css';
import './styles/app.css';
import { createApp } from './app/App';

// Entry point: initialize the app into #app
const mountEl = document.getElementById('app');
createApp(mountEl);
