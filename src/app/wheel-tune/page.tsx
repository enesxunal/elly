'use client';

import { useMemo, useState } from 'react';

export default function WheelTunePage() {
  const [rearLeft, setRearLeft] = useState(13.15);
  const [frontRight, setFrontRight] = useState(10.15);
  const [top, setTop] = useState(53.55);
  const [size, setSize] = useState(16);
  const [frontOffset, setFrontOffset] = useState(63);
  const [rotation, setRotation] = useState(0);
  const [carYOffset, setCarYOffset] = useState(75);

  const mainBottom = 18 - carYOffset;

  const css = useMemo(() => `
.car-stage { bottom:${mainBottom.toFixed(0)}px; }
.car-wheel { top:${top.toFixed(2)}%; width:${size.toFixed(2)}%; }
.wheel-rear { left:${rearLeft.toFixed(2)}%; }
.wheel-front { right:${frontRight.toFixed(2)}%; }
// rear rotate: ${rotation.toFixed(0)}deg
// front rotate: ${(rotation + frontOffset).toFixed(0)}deg
`.trim(), [rearLeft, frontRight, top, size, frontOffset, rotation, mainBottom]);

  return (
    <main className="tune-page">
      <section className="tune-stage">
        <div className="tune-road-layer" aria-hidden="true">
          <div className="tune-road-curb" />
          <div className="tune-road-seams" />
          <div className="tune-road-patches" />
        </div>
        <div
          className="tune-car"
          style={{ bottom: `${mainBottom}px` }}
        >
          <img className="tune-car-body" src="/assets/car-1.png" alt="Elly car" />
          <img className="tune-door-logo" src="/assets/elly-logo.png" alt="" />
          <img
            className="tune-wheel tune-wheel-rear"
            src="/assets/teker.png"
            alt=""
            style={{ left: `${rearLeft}%`, top: `${top}%`, width: `${size}%`, transform: `rotate(${rotation}deg)` }}
          />
          <img
            className="tune-wheel tune-wheel-front"
            src="/assets/teker.png"
            alt=""
            style={{ right: `${frontRight}%`, top: `${top}%`, width: `${size}%`, transform: `rotate(${rotation + frontOffset}deg)` }}
          />
        </div>
      </section>

      <aside className="tune-panel">
        <div>
          <p className="tune-kicker">ELLY · CAR TUNER</p>
          <h1>Aracı burada ayarla</h1>
          <p className="tune-help">Aracın genel yüksekliğini ve teker konumlarını burada canlı ayarlayabilirsin.</p>
        </div>

        <label>
          <span>Araç aşağı / yukarı <b>{carYOffset.toFixed(0)} px</b></span>
          <input type="range" min="-20" max="80" step="1" value={carYOffset} onChange={(e) => setCarYOffset(Number(e.target.value))} />
        </label>

        <label>
          <span>Arka teker yatay <b>{rearLeft.toFixed(2)}%</b></span>
          <input type="range" min="10" max="24" step="0.05" value={rearLeft} onChange={(e) => setRearLeft(Number(e.target.value))} />
        </label>

        <label>
          <span>Ön teker yatay <b>{frontRight.toFixed(2)}%</b></span>
          <input type="range" min="8" max="22" step="0.05" value={frontRight} onChange={(e) => setFrontRight(Number(e.target.value))} />
        </label>

        <label>
          <span>Teker dikey konum <b>{top.toFixed(2)}%</b></span>
          <input type="range" min="48" max="65" step="0.05" value={top} onChange={(e) => setTop(Number(e.target.value))} />
        </label>

        <label>
          <span>Teker boyutu <b>{size.toFixed(2)}%</b></span>
          <input type="range" min="9" max="18" step="0.05" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>

        <label>
          <span>Ön teker başlangıç farkı <b>{frontOffset.toFixed(0)}°</b></span>
          <input type="range" min="0" max="180" step="1" value={frontOffset} onChange={(e) => setFrontOffset(Number(e.target.value))} />
        </label>

        <label>
          <span>Dönüş testi <b>{rotation.toFixed(0)}°</b></span>
          <input type="range" min="-720" max="720" step="5" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
        </label>

        <div className="tune-code">
          <div className="tune-code-head">
            <span>Seçtiğin değerler</span>
            <button onClick={() => navigator.clipboard?.writeText(css)}>Kopyala</button>
          </div>
          <pre>{css}</pre>
        </div>

        <div className="tune-actions">
          <a href="/">Ana sayfaya dön</a>
          <button onClick={() => {
            setCarYOffset(75);
            setRearLeft(13.15);
            setFrontRight(10.15);
            setTop(53.55);
            setSize(16);
            setFrontOffset(63);
            setRotation(0);
          }}>Sıfırla</button>
        </div>
      </aside>
    </main>
  );
}
