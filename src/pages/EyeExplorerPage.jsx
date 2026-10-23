import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Info, Shield, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { navigate } from '../router';
import './Explorer.css';

const PARTS = ['cornea', 'lens', 'vitreous', 'retina', 'macula', 'optic_nerve', 'blood_vessels'];
const STAGES = ['normal', 'mild', 'moderate', 'severe', 'proliferative'];

export default function EyeExplorerPage() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [stage, setStage] = useState('normal');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  // Draw realistic eye on canvas
  const drawEye = useCallback((ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 400 * zoom;
    const rot = rotation * Math.PI / 180;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(cx, cy);

    // Background glow
    const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 180 * scale);
    bgGrad.addColorStop(0, 'rgba(0, 0, 0, 0.03)');
    bgGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(-w/2, -h/2, w, h);

    // Base geometry params
    const scleraR = 140 * scale;
    const corneaR = 80 * scale;
    const corneaOffset = -110 * scale;
    
    // Rotate entire eye structure
    ctx.rotate(rot);

    // --- SCLERA & VITREOUS (Main Globe) ---
    // Outer white shell (sclera)
    ctx.beginPath();
    ctx.arc(0, 0, scleraR, 0, Math.PI * 2);
    const scleraGrad = ctx.createRadialGradient(-30 * scale, -30 * scale, scleraR * 0.1, 0, 0, scleraR);
    scleraGrad.addColorStop(0, '#FFFFFF');
    scleraGrad.addColorStop(0.7, '#F1F5F9');
    scleraGrad.addColorStop(1, '#CBD5E1');
    ctx.fillStyle = scleraGrad;
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 20;
    ctx.fill(); // re-fill to apply shadow around it
    ctx.shadowBlur = 0; // reset

    // Inner cavity (Vitreous humor)
    ctx.beginPath();
    ctx.arc(0, 0, scleraR - 8 * scale, 0, Math.PI * 2);
    const vitreousGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, scleraR);
    vitreousGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)'); // Dark interior
    vitreousGrad.addColorStop(1, 'rgba(60, 10, 20, 0.95)'); // Dark red towards retina
    ctx.fillStyle = selectedPart === 'vitreous' ? 'rgba(6, 214, 160, 0.15)' : vitreousGrad;
    ctx.fill();

    // --- RETINA (Inner lining) ---
    ctx.beginPath();
    ctx.arc(0, 0, scleraR - 8 * scale, -Math.PI * 0.65, Math.PI * 0.65);
    ctx.strokeStyle = selectedPart === 'retina' ? 'var(--accent-primary)' : '#EF4444'; // Reddish retina
    ctx.lineWidth = selectedPart === 'retina' ? 6 * scale : 4 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // --- MACULA (Fovea indentation) ---
    const maculaAngle = Math.PI * 0.1; // Slightly below center back
    const mx = Math.cos(maculaAngle) * (scleraR - 8 * scale);
    const my = Math.sin(maculaAngle) * (scleraR - 8 * scale);
    ctx.beginPath();
    ctx.arc(mx, my, 12 * scale, 0, Math.PI * 2);
    const maculaGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 12 * scale);
    maculaGrad.addColorStop(0, '#F59E0B');
    maculaGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = selectedPart === 'macula' ? 'rgba(6, 214, 160, 0.6)' : maculaGrad;
    ctx.fill();
    if (selectedPart === 'macula') {
      ctx.strokeStyle = 'var(--accent-primary)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // --- OPTIC NERVE ---
    ctx.beginPath();
    const nerveY = -15 * scale;
    const nerveX = scleraR - 5 * scale;
    ctx.moveTo(nerveX, nerveY - 18 * scale);
    ctx.quadraticCurveTo(nerveX + 40 * scale, nerveY - 10 * scale, nerveX + 80 * scale, nerveY - 30 * scale);
    ctx.lineTo(nerveX + 80 * scale, nerveY + 20 * scale);
    ctx.quadraticCurveTo(nerveX + 40 * scale, nerveY + 20 * scale, nerveX, nerveY + 18 * scale);
    const nerveGrad = ctx.createLinearGradient(nerveX, 0, nerveX + 80 * scale, 0);
    nerveGrad.addColorStop(0, '#FDE68A'); // Pale yellow at disc
    nerveGrad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = selectedPart === 'optic_nerve' ? 'rgba(6, 214, 160, 0.3)' : nerveGrad;
    ctx.fill();
    // Optic disc indentation
    ctx.beginPath();
    ctx.ellipse(nerveX, nerveY, 6 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();

    // --- BLOOD VESSELS ---
    const vesselColor = selectedPart === 'blood_vessels' ? 'var(--accent-primary)' : '#DC2626';
    const vesselWidth = selectedPart === 'blood_vessels' ? 3 * scale : 1.5 * scale;
    drawVessels(ctx, scale, vesselColor, vesselWidth, stage, scleraR - 8 * scale, nerveX, nerveY);

    // --- DISEASE STAGES ---
    if (stage !== 'normal') {
      drawDiseaseOverlay(ctx, scale, stage, scleraR - 8 * scale);
    }

    // --- LENS ---
    const lensX = corneaOffset + 40 * scale;
    ctx.beginPath();
    ctx.ellipse(lensX, 0, 16 * scale, 45 * scale, 0, 0, Math.PI * 2);
    const lensGrad = ctx.createRadialGradient(lensX, -10 * scale, 0, lensX, 0, 45 * scale);
    lensGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    lensGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.6)');
    lensGrad.addColorStop(1, 'rgba(148, 163, 184, 0.4)');
    ctx.fillStyle = selectedPart === 'lens' ? 'rgba(6, 214, 160, 0.4)' : lensGrad;
    ctx.fill();
    if (selectedPart === 'lens') {
      ctx.strokeStyle = 'var(--accent-primary)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // --- CORNEA (Front bulge) ---
    // Clip to cut out the front of the sclera
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(corneaOffset + 25 * scale, 0, 65 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw cornea curve
    ctx.beginPath();
    ctx.arc(corneaOffset, 0, corneaR, -Math.PI * 0.35, Math.PI * 0.35);
    const corneaGrad = ctx.createRadialGradient(corneaOffset - 20 * scale, -20 * scale, 0, corneaOffset, 0, corneaR);
    corneaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Specular highlight
    corneaGrad.addColorStop(0.3, 'rgba(224, 242, 254, 0.3)');
    corneaGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
    ctx.fillStyle = selectedPart === 'cornea' ? 'rgba(6, 214, 160, 0.3)' : corneaGrad;
    ctx.fill();
    ctx.strokeStyle = selectedPart === 'cornea' ? 'var(--accent-primary)' : 'rgba(125, 211, 252, 0.8)';
    ctx.lineWidth = selectedPart === 'cornea' ? 3 * scale : 2 * scale;
    ctx.stroke();

    // Cornea Specular Highlight (Reflection)
    ctx.beginPath();
    ctx.ellipse(corneaOffset - 40 * scale, -25 * scale, 8 * scale, 20 * scale, Math.PI * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.filter = 'blur(2px)';
    ctx.fill();
    ctx.filter = 'none'; // reset

    ctx.restore();
  }, [selectedPart, stage, rotation, zoom]);

  function drawVessels(ctx, scale, color, width, diseaseStage, innerR, startX, startY) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw vessels crawling along the retina wall
    const drawBranch = (angleStart, angleEnd, cp1, cp2) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const endX = Math.cos(angleEnd) * innerR;
      const endY = Math.sin(angleEnd) * innerR;
      // Control points pulling towards the retina edge
      const cx1 = Math.cos(cp1) * innerR * 0.7;
      const cy1 = Math.sin(cp1) * innerR * 0.7;
      const cx2 = Math.cos(cp2) * innerR * 0.9;
      const cy2 = Math.sin(cp2) * innerR * 0.9;
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, endX, endY);
      ctx.stroke();
    };

    drawBranch(0, Math.PI * 0.3, Math.PI * 0.1, Math.PI * 0.2);
    drawBranch(0, Math.PI * 0.5, Math.PI * 0.2, Math.PI * 0.4);
    drawBranch(0, -Math.PI * 0.25, -Math.PI * 0.1, -Math.PI * 0.2);
    drawBranch(0, -Math.PI * 0.5, -Math.PI * 0.2, -Math.PI * 0.4);
  }

  function drawDiseaseOverlay(ctx, scale, diseaseStage, innerR) {
    const intensity = { mild: 0.15, moderate: 0.3, severe: 0.5, proliferative: 0.8 }[diseaseStage] || 0;
    
    // Draw microaneurysms and hemorrhages clinging to retina
    const dotCount = { mild: 4, moderate: 12, severe: 25, proliferative: 35 }[diseaseStage] || 0;
    
    // Seeded random for consistent drawing
    let seed = 12345;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < dotCount; i++) {
      // Scatter mostly along the back retina arc
      const angle = (rand() * Math.PI) - (Math.PI / 2); // -90 to +90 deg
      // Distance from center, hugging the inner radius
      const r = innerR - (rand() * 15 * scale);
      
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const dotR = (1.5 + rand() * 4) * scale;
      
      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 38, 38, ${0.6 + intensity * 0.4})`;
      ctx.fill();
    }

    // Neovascularization (new fragile vessels) growing into vitreous
    if (diseaseStage === 'proliferative') {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 1.5 * scale;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const angle = (rand() * Math.PI * 0.8) - (Math.PI * 0.4);
        const startR = innerR - 2 * scale;
        const startX = Math.cos(angle) * startR;
        const startY = Math.sin(angle) * startR;
        
        ctx.moveTo(startX, startY);
        // Grow inwards
        const endX = startX - (30 + rand() * 40) * scale;
        const endY = startY + (rand() - 0.5) * 40 * scale;
        
        // Wavy path
        ctx.bezierCurveTo(
          startX - 10 * scale, startY + 10 * scale,
          endX + 10 * scale, endY - 10 * scale,
          endX, endY
        );
        ctx.stroke();
      }
    }
  }

  // Canvas setup and redraw
  useEffect(() => {
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
      drawEye(ctx, w, h);
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [drawEye]);

  // Mouse/touch interaction
  const handlePointerDown = (e) => { isDragging.current = true; lastX.current = e.clientX || e.touches?.[0]?.clientX; };
  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    setRotation(r => r + (x - lastX.current) * 0.5);
    lastX.current = x;
  };
  const handlePointerUp = () => { isDragging.current = false; };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    if (x < -0.25) setSelectedPart('cornea');
    else if (x < -0.1) setSelectedPart('lens');
    else if (x > 0.3) setSelectedPart('optic_nerve');
    else if (x > 0.2 && Math.abs(y) < 0.05) setSelectedPart('macula');
    else if (x > 0.15) setSelectedPart('retina');
    else if (Math.abs(y) > 0.1) setSelectedPart('blood_vessels');
    else setSelectedPart('vitreous');
  };

  return (
    <div className="explorer-page full-bleed">
      {/* ── Background Canvas ────────────────────────── */}
      <div 
        className="explorer-canvas-container"
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onClick={handleCanvasClick}
      >
        <canvas ref={canvasRef} className="explorer-canvas" />
      </div>

      {/* ── Glass Controls Panel ──────────────────────── */}
      <div className="explorer-panel animate-slide-right">
        <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/result')}>
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        
        <h1 className="text-h2 mb-2">{t('eye_explorer.title')}</h1>
        <p className="text-caption mb-6">{t('eye_explorer.subtitle')}</p>

        {/* Stage selector */}
        <div className="mb-6">
          <label className="text-overline d-block mb-2">{t('eye_explorer.stage_normal')}</label>
          <div className="explorer-tabs">
            {STAGES.map((s) => (
              <button 
                key={s} 
                className={`explorer-tab ${stage === s ? 'explorer-tab-active' : ''}`} 
                onClick={() => setStage(s)}
              >
                {t(`eye_explorer.stage_${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="explorer-info card mb-6">
          <h3 className="text-h4 mb-2">
            {selectedPart ? t(`eye_explorer.${selectedPart}`) : t('eye_explorer.explore_anatomy')}
          </h3>
          {selectedPart ? (
            <div className="animate-fade-in">
              <p className="text-body mb-4">{t(`eye_explorer.${selectedPart}_desc`)}</p>
              <button className="btn btn-ghost btn-sm w-100" onClick={() => setSelectedPart(null)}>
                Clear Selection
              </button>
            </div>
          ) : (
            <div className="anatomy-list">
              {PARTS.map((part) => (
                <button
                  key={part}
                  className="anatomy-item"
                  onClick={() => setSelectedPart(part)}
                >
                  {t(`eye_explorer.${part}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Controls */}
        <div className="explorer-controls mb-4">
          <button className="btn btn-ghost btn-icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
            <ZoomOut size={20} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => { setRotation(0); setZoom(1); }}>
            <RotateCcw size={20} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => setZoom(z => Math.min(2, z + 0.2))}>
            <ZoomIn size={20} />
          </button>
        </div>

        <div className="disclaimer mt-auto">
          <Shield size={14} className="disclaimer-icon" />
          <span>{t('eye_explorer.edu_disclaimer')}</span>
        </div>
      </div>
    </div>
  );
}
