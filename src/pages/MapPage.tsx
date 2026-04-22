import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { MapPin, Layers, Eye, Filter, AlertTriangle } from 'lucide-react';
import { useApp } from '../store';
import { Link } from 'react-router-dom';

// Custom marker icon
const createMarkerIcon = (riskLevel: string) => {
  const color = riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f59e0b' : '#10b981';
  return new DivIcon({
    className: '',
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      background: ${color};
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px ${color}66;
      border: 2px solid white;
    ">
      <div style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">!</div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Heatmap circles
function HeatmapLayer() {
  const { issues } = useApp();
  
  return (
    <>
      {issues.map(issue => (
        <CircleMarker
          key={`heat-${issue.id}`}
          center={[issue.location.lat, issue.location.lng]}
          radius={issue.riskScore / 3}
          pathOptions={{
            color: 'transparent',
            fillColor: issue.riskLevel === 'high' ? '#ef4444' : issue.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
            fillOpacity: 0.15 + (issue.riskScore / 400),
          }}
        />
      ))}
    </>
  );
}

export default function MapPage() {
  const { issues } = useApp();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredIssues = useMemo(() =>
    categoryFilter === 'all'
      ? issues
      : issues.filter(i => i.category === categoryFilter),
    [issues, categoryFilter]
  );

  const center: [number, number] = [18.52, 73.85];

  const highRiskAreas = issues.filter(i => i.riskLevel === 'high');

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="container" style={{ paddingTop: 20, paddingBottom: 16 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={24} color="var(--color-primary)" /> Issue Map
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              {filteredIssues.length} issues displayed • {highRiskAreas.length} high-risk zones
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              <Layers size={14} /> Heatmap
            </button>

            <select
              className="input"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ width: 160, padding: '8px 12px', fontSize: '0.8125rem' }}
            >
              <option value="all">All Categories</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="resource-wastage">Resource Wastage</option>
              <option value="public-safety">Public Safety</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Predictive Alert Banner */}
      {highRiskAreas.length > 0 && (
        <div className="container" style={{ paddingBottom: 12 }}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))',
              border: '1px solid rgba(245,158,11,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.875rem',
            }}
          >
            <AlertTriangle size={18} color="var(--color-warning)" />
            <span>
              <strong>⚠️ Predictive Alert:</strong> {highRiskAreas.length} high-risk areas detected. 
              These zones have high probability of future issues based on AI analysis.
            </span>
          </motion.div>
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, padding: '0 24px 24px', minHeight: 500 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}
        >
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', minHeight: 500, width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Heatmap overlay */}
            {showHeatmap && <HeatmapLayer />}

            {/* Markers */}
            {filteredIssues.map(issue => (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={createMarkerIcon(issue.riskLevel)}
              >
                <Popup>
                  <div style={{ minWidth: 220, fontFamily: 'var(--font-sans)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className={`badge badge-${issue.riskLevel}`} style={{ fontSize: '0.6875rem' }}>
                        {issue.riskLevel === 'high' ? '🔴' : issue.riskLevel === 'medium' ? '🟡' : '🟢'} {issue.riskLevel} risk
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{issue.id}</span>
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 4 }}>{issue.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4, marginBottom: 8 }}>
                      {issue.description.slice(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{issue.location.address.split(',')[0]}</span>
                      <Link
                        to={`/issue/${issue.id}`}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6366f1',
                          textDecoration: 'none',
                        }}
                      >
                        View Details →
                      </Link>
                    </div>
                    <div className="risk-meter" style={{ marginTop: 8 }}>
                      <div className={`risk-meter-fill ${issue.riskLevel}`} style={{ width: `${issue.riskScore}%` }} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="container" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            High Risk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            Medium Risk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
            Low Risk
          </div>
          {showHeatmap && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }} />
              Heatmap Zone
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
