import React from 'react';
import ReactDOM from 'react-dom';

import { DiagnosticPage } from './pages';

const rootNode: Element = document.getElementById('root');

rootNode && ReactDOM.render(<DiagnosticPage />, rootNode);