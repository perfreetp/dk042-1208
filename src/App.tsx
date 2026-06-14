import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import { Pipelines } from './pages/Pipelines';
import { Releases } from './pages/Releases';
import { Environments } from './pages/Environments';
import { Issues } from './pages/Issues';
import { Metrics } from './pages/Metrics';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/pipelines" element={<Pipelines />} />
          <Route path="/pipelines/:id" element={<Pipelines />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/environments" element={<Environments />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/metrics" element={<Metrics />} />
        </Route>
      </Routes>
    </Router>
  );
}
