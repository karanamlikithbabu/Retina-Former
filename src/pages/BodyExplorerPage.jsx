import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Shield,
  Eye,
  Brain,
  Heart,
  CircleDot,
  Zap,
  Footprints,
  ArrowLeft,
  Box,
  Layers,
  Sparkles,
  Compass,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { navigate } from '../router';
import BodyModel3D from '../components/BodyModel3D';
import './Explorer.css';

const ORGANS = [
  { key: 'eyes', icon: Eye, position: [0.0, 1.35, 0.26], x: 0.5, y: 0.16, color: '#06D6A0' },
  { key: 'brain', icon: Brain, position: [0.0, 1.95, 0.30], x: 0.5, y: 0.07, color: '#818CF8' },
  { key: 'heart', icon: Heart, position: [-0.18, 0.92, 0.30], x: 0.45, y: 0.28, color: '#F43F5E' },
  { key: 'kidneys', icon: CircleDot, position: [0.30, -0.32, 0.26], x: 0.58, y: 0.46, color: '#FBBF24' },
  { key: 'nerves', icon: Zap, position: [0.68, 0.02, 0.20], x: 0.72, y: 0.50, color: '#00B4D8' },
  { key: 'blood_vessels', icon: CircleDot, position: [-0.28, -0.72, 0.24], x: 0.44, y: 0.60, color: '#D946EF' },
  { key: 'feet', icon: Footprints, position: [0.32, -2.18, 0.40], x: 0.56, y: 0.93, color: '#34D399' },
];

export default function BodyExplorerPage() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [selectedOrgan, setSelectedOrgan] = useState('heart');
  const [dimension, setDimension] = useState('3d'); // '3d' | '2d'
  const [renderMode, setRenderMode] = useState('clinical'); // 'clinical' | 'hologram' | 'xray'
  const [viewPreset, setViewPreset] = useState('front'); // 'front' | 'side' | 'back' | 'upper' | 'lower'
  const [autoRotate, setAutoRotate] = useState(false);

  // ── 2D Canvas Fallback / Diagram Drawing ──────────────────
  const drawBody2D = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const bodyH = h * 0.85;
    const bodyTop = h * 0.05;
    const scale = bodyH / 600;

    ctx.save();
    ctx.translate(cx, bodyTop);

    // Body silhouette
    const bodyColor = 'rgba(0, 0, 0, 0.04)';
    const bodyStroke = 'rgba(0, 0, 0, 0.15)';
    
    // Head
    ctx.beginPath();
    ctx.ellipse(0, 35 * scale, 30 * scale, 38 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = bodyStroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Neck
    ctx.beginPath();
    ctx.rect(-10 * scale, 70 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Torso
    ctx.beginPath();
    ctx.moveTo(-60 * scale, 90 * scale);
    ctx.quadraticCurveTo(-70 * scale, 200 * scale, -50 * scale, 300 * scale);
    ctx.lineTo(50 * scale, 300 * scale);
    ctx.quadraticCurveTo(70 * scale, 200 * scale, 60 * scale, 90 * scale);
    ctx.closePath();
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = bodyStroke;
    ctx.stroke();

    // Arms
    [[-1, 1], [1, 1]].forEach(([side]) => {
      ctx.beginPath();
      ctx.moveTo(side * 60 * scale, 95 * scale);
      ctx.quadraticCurveTo(side * 90 * scale, 200 * scale, side * 80 * scale, 310 * scale);
      ctx.lineTo(side * 65 * scale, 310 * scale);
      ctx.quadraticCurveTo(side * 75 * scale, 200 * scale, side * 48 * scale, 100 * scale);
      ctx.fillStyle = bodyColor;
      ctx.fill();
      ctx.strokeStyle = bodyStroke;
      ctx.stroke();
    });

    // Legs
    [[-1], [1]].forEach(([side]) => {
      ctx.beginPath();
      ctx.moveTo(side * 15 * scale, 300 * scale);
      ctx.quadraticCurveTo(side * 30 * scale, 400 * scale, side * 25 * scale, 530 * scale);
      ctx.lineTo(side * 5 * scale, 530 * scale);
      ctx.quadraticCurveTo(side * 10 * scale, 400 * scale, side * -5 * scale, 300 * scale);
      ctx.fillStyle = bodyColor;
      ctx.fill();
      ctx.strokeStyle = bodyStroke;
      ctx.stroke();
    });

    // Feet
    [[-1], [1]].forEach(([side]) => {
      ctx.beginPath();
      ctx.ellipse(side * 15 * scale, 540 * scale, 20 * scale, 10 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyColor;
      ctx.fill();
      ctx.strokeStyle = bodyStroke;
      ctx.stroke();
    });

    // Organ highlight dots
    ORGANS.forEach((organ) => {
      const ox = (organ.x - 0.5) * w / scale;
      const oy = organ.y * bodyH;
      const isSelected = selectedOrgan === organ.key;
      const radius = isSelected ? 12 * scale : 8 * scale;

      // Pulse ring for selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(ox, oy, radius + 10 * scale, 0, Math.PI * 2);
        ctx.fillStyle = organ.color + '30';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(ox, oy, radius + 20 * scale, 0, Math.PI * 2);
        ctx.fillStyle = organ.color + '15';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(ox, oy, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? organ.color : organ.color + '70';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(ox, oy, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    });

    ctx.restore();
  }, [selectedOrgan]);

  useEffect(() => {
    if (dimension !== '2d') return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      drawBody2D(ctx, w, h);
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [drawBody2D, dimension]);

  const handleCanvasClick2D = (e) => {
    if (dimension !== '2d') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    let closest = null;
    let closestDist = Infinity;
    ORGANS.forEach((organ) => {
      const dist = Math.sqrt((x - organ.x) ** 2 + (y - organ.y) ** 2);
      if (dist < closestDist && dist < 0.1) {
        closest = organ.key;
        closestDist = dist;
      }
    });
    if (closest) setSelectedOrgan(closest);
  };

  const handleResetCamera = () => {
    setViewPreset('front');
    setAutoRotate(false);
  };

  const selected = ORGANS.find(o => o.key === selectedOrgan);

  const bgThemeClass =
    dimension === '2d'
      ? ''
      : renderMode === 'hologram'
      ? 'explorer-3d-bg-hologram'
      : renderMode === 'xray'
      ? 'explorer-3d-bg-xray'
      : 'explorer-3d-bg-clinical';

  return (
    <div className={`explorer-page full-bleed ${bgThemeClass}`}>
      {/* ── 3D / 2D Viewport Floating Top Toolbar ────────────────── */}
      <div className="explorer-top-bar">
        {/* 3D vs 2D Switcher */}
        <div className="explorer-pill-group">
          <button
            className={`explorer-pill-btn ${dimension === '3d' ? 'active' : ''}`}
            onClick={() => setDimension('3d')}
            title="Interactive 3D Anatomy Model"
          >
            <Box size={14} />
            <span>{t('body_explorer.view_3d') || '3D Anatomy'}</span>
          </button>
          <button
            className={`explorer-pill-btn ${dimension === '2d' ? 'active' : ''}`}
            onClick={() => setDimension('2d')}
            title="Flat 2D Medical Diagram"
          >
            <Layers size={14} />
            <span>{t('body_explorer.view_2d') || '2D Diagram'}</span>
          </button>
        </div>

        {/* 3D Render Shading Mode (Only visible in 3D) */}
        {dimension === '3d' && (
          <div className="explorer-pill-group">
            <button
              className={`explorer-pill-btn ${renderMode === 'clinical' ? 'active' : ''}`}
              onClick={() => setRenderMode('clinical')}
            >
              <Sparkles size={14} />
              <span>{t('body_explorer.mode_clinical') || 'Clinical Glass'}</span>
            </button>
            <button
              className={`explorer-pill-btn ${renderMode === 'hologram' ? 'active' : ''}`}
              onClick={() => setRenderMode('hologram')}
            >
              <Zap size={14} />
              <span>{t('body_explorer.mode_hologram') || 'Cyber Hologram'}</span>
            </button>
            <button
              className={`explorer-pill-btn ${renderMode === 'xray' ? 'active' : ''}`}
              onClick={() => setRenderMode('xray')}
            >
              <Eye size={14} />
              <span>{t('body_explorer.mode_xray') || 'X-Ray'}</span>
            </button>
          </div>
        )}

        {/* View Angles (Only visible in 3D) */}
        {dimension === '3d' && (
          <div className="explorer-pill-group">
            <button
              className={`explorer-pill-btn ${viewPreset === 'front' ? 'active' : ''}`}
              onClick={() => setViewPreset('front')}
            >
              {t('body_explorer.view_front') || 'Front'}
            </button>
            <button
              className={`explorer-pill-btn ${viewPreset === 'side' ? 'active' : ''}`}
              onClick={() => setViewPreset('side')}
            >
              {t('body_explorer.view_side') || 'Side'}
            </button>
            <button
              className={`explorer-pill-btn ${viewPreset === 'back' ? 'active' : ''}`}
              onClick={() => setViewPreset('back')}
            >
              {t('body_explorer.view_back') || 'Back'}
            </button>
            <button
              className={`explorer-pill-btn ${viewPreset === 'upper' ? 'active' : ''}`}
              onClick={() => setViewPreset('upper')}
            >
              {t('body_explorer.view_upper') || 'Upper'}
            </button>
            <button
              className={`explorer-pill-btn ${viewPreset === 'lower' ? 'active' : ''}`}
              onClick={() => setViewPreset('lower')}
            >
              {t('body_explorer.view_lower') || 'Lower'}
            </button>
          </div>
        )}
      </div>

      {/* ── 3D / 2D Floating Bottom Toolbar ──────────────────────── */}
      {dimension === '3d' && (
        <div className="explorer-bottom-bar">
          <div className="explorer-hint-badge">
            <Compass size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{t('body_explorer.controls_hint') || 'Drag to orbit 360° • Scroll to zoom • Click any organ marker to inspect'}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              className={`explorer-action-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={t('body_explorer.auto_rotate') || 'Toggle Auto-Rotation'}
            >
              {autoRotate ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              className="explorer-action-btn"
              onClick={handleResetCamera}
              title={t('body_explorer.reset_camera') || 'Reset View'}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Canvas Viewport (3D or 2D) ────────────────────────────── */}
      <div className="explorer-canvas-container" ref={containerRef}>
        {dimension === '3d' ? (
          <BodyModel3D
            organs={ORGANS}
            selectedOrgan={selectedOrgan}
            onSelectOrgan={setSelectedOrgan}
            renderMode={renderMode}
            autoRotate={autoRotate}
            viewPreset={viewPreset}
            t={t}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="explorer-canvas"
            onClick={handleCanvasClick2D}
          />
        )}
      </div>

      {/* ── Glass Controls Panel ──────────────────────────────────── */}
      <div
        className="explorer-panel animate-slide-left"
        style={{
          left: 0,
          right: 'auto',
          borderRight: '1px solid var(--glass-border)',
          borderLeft: 'none',
        }}
      >
        <button
          className="btn btn-ghost btn-sm mb-4"
          onClick={() => navigate('/result')}
          style={{ width: 'fit-content' }}
        >
          <ArrowLeft size={16} /> {t('common.back')}
        </button>

        <h1 className="text-h2 mb-2">{t('body_explorer.title')}</h1>
        <p className="text-caption mb-6">{t('body_explorer.subtitle')}</p>

        {/* Note */}
        <div className="alert alert-info mb-6">
          <Eye size={16} className="alert-icon" />
          <span style={{ fontSize: 'var(--text-xs)' }}>{t('body_explorer.result_note')}</span>
        </div>

        {/* Selected Organ Info */}
        <div
          className="explorer-info card mb-6"
          style={{
            borderColor: selected?.color || 'var(--border-light)',
            boxShadow: selected ? `0 8px 24px ${selected.color}20` : 'none',
          }}
        >
          {selected ? (
            <div className="animate-fade-in">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selected.color + '25',
                    color: selected.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 12px ${selected.color}40`,
                  }}
                >
                  <selected.icon size={22} />
                </div>
                <div>
                  <h3 className="text-h4" style={{ margin: 0 }}>
                    {t(`body_explorer.${selectedOrgan}`)}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      color: selected.color,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    3D Anatomical Focus
                  </span>
                </div>
              </div>
              <p className="text-body mb-4">{t(`body_explorer.${selectedOrgan}_desc`)}</p>
              <div
                className="badge badge-neutral w-100"
                style={{
                  justifyContent: 'flex-start',
                  padding: 'var(--space-2) var(--space-3)',
                  borderLeft: `3px solid ${selected.color}`,
                }}
              >
                <span className="text-muted mr-2">{t('body_explorer.related_condition')}:</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {t(`body_explorer.${selectedOrgan}_condition`)}
                </strong>
              </div>
            </div>
          ) : (
            <p className="text-body">{t('body_explorer.subtitle')}</p>
          )}
        </div>

        {/* Organ List */}
        <div className="anatomy-list mb-6">
          {ORGANS.map((organ) => {
            const isCurrent = selectedOrgan === organ.key;
            return (
              <button
                key={organ.key}
                className="anatomy-item"
                onClick={() => setSelectedOrgan(organ.key)}
                style={
                  isCurrent
                    ? {
                        color: organ.color,
                        background: organ.color + '15',
                        borderLeft: `3px solid ${organ.color}`,
                        fontWeight: 600,
                        paddingLeft: 'var(--space-4)',
                      }
                    : {}
                }
              >
                <organ.icon
                  size={16}
                  style={{
                    marginRight: '8px',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    color: isCurrent ? organ.color : 'inherit',
                  }}
                />
                {t(`body_explorer.${organ.key}`)}
              </button>
            );
          })}
        </div>

        <div className="disclaimer mt-auto">
          <Shield size={14} className="disclaimer-icon" />
          <span>{t('body_explorer.edu_disclaimer')}</span>
        </div>
      </div>
    </div>
  );
}
