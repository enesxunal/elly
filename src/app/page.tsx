'use client';

import { useEffect, useRef, useState } from 'react';

const scenes = [
  { id: 'start', nav: 'Startseite' },
  { id: 'about', nav: 'Über uns' },
  { id: 'classes', nav: 'Führerscheinklassen' },
  { id: 'process', nav: 'Ausbildung' },
  { id: 'vehicles', nav: 'Fahrzeuge' },
  { id: 'reviews', nav: 'Bewertungen' },
  { id: 'theory', nav: 'Erste Hilfe' },
  { id: 'location', nav: 'Kontakt' },
  { id: 'finish', nav: 'Kontakt' },
];

const MAX_POSITION = scenes.length - 1;
export default function Home() {
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartPosition = useRef(0);
  const animationRef = useRef<number | null>(null);

  const stopAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const setContinuousPosition = (next: number) => {
    const clamped = Math.max(0, Math.min(MAX_POSITION, next));
    positionRef.current = clamped;
    setPosition(clamped);
  };

  const jump = (next: number) => {
    stopAnimation();
    const start = positionRef.current;
    const target = Math.max(0, Math.min(MAX_POSITION, next));
    const distance = Math.abs(target - start);
    if (distance < 0.001) return;

    const duration = 560 + Math.min(620, distance * 150);
    const startedAt = performance.now();
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      setContinuousPosition(start + (target - start) * ease(t));
      if (t < 1) animationRef.current = requestAnimationFrame(animate);
      else animationRef.current = null;
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopAnimation();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 0.5) return;
      setContinuousPosition(positionRef.current + delta / 920);
    };

    const onKey = (event: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) jump(Math.min(MAX_POSITION, Math.round(positionRef.current) + 1));
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) jump(Math.max(0, Math.round(positionRef.current) - 1));
    };

    const onTouchStart = (event: TouchEvent) => {
      stopAnimation();
      touchStartX.current = event.touches[0]?.clientX ?? null;
      touchStartPosition.current = positionRef.current;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartX.current === null) return;
      const currentX = event.touches[0]?.clientX ?? touchStartX.current;
      const drag = touchStartX.current - currentX;
      setContinuousPosition(touchStartPosition.current + drag / Math.max(300, window.innerWidth * 0.78));
    };

    const onTouchEnd = () => { touchStartX.current = null; };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      stopAnimation();
    };
  }, []);

  const index = Math.round(position);
  const roadOffset = position * 760;
  const wheelRotation = position * 1440;
  const isFinal = index === scenes.length - 1;

  return (
    <main className={`experience ${isFinal ? 'is-final' : ''}`}>
      <header className="nav-shell">
        <button className="logo-button" onClick={() => jump(0)} aria-label="Startseite">
          <img src="/assets/elly-logo.png" alt="Fahrschule Elly" />
        </button>
        <nav>
          <button className={index === 0 ? 'active' : ''} onClick={() => jump(0)}>Startseite</button>
          <button className={index === 1 ? 'active' : ''} onClick={() => jump(1)}>Über uns</button>
          <button className={index === 2 ? 'active' : ''} onClick={() => jump(2)}>Führerscheinklassen</button>
          <button className={index === 3 || index === 4 ? 'active' : ''} onClick={() => jump(3)}>Ausbildung</button>
          <button className={index === 6 ? 'active' : ''} onClick={() => jump(6)}>Erste Hilfe</button>
          <button className={index >= 7 ? 'active' : ''} onClick={() => jump(7)}>Kontakt</button>
        </nav>
        <a className="nav-cta" href="tel:020373839888">Jetzt anmelden</a>
      </header>

      <div className="viewport">
        <div className="scene-track" style={{ transform: `translate3d(-${position * 100}vw,0,0)` }}>
          <section className="scene hero-scene">
            <div className="hero-layout">
              <div className="hero-copy">
                <span className="eyebrow">Fahrschule Elly · Duisburg-Meiderich</span>
                <h1>Dein Führerschein. Dein Weg.</h1>
                <p>Persönliche Ausbildung, moderne Fahrzeuge und ein Team, das dich sicher bis zur Prüfung begleitet.</p>
                <div className="hero-actions">
                  <a className="primary" href="tel:020373839888">Jetzt anmelden</a>
                  <button className="ghost-action" onClick={() => jump(3)}>So läuft’s ab →</button>
                </div>
                <div className="hero-proof">
                  <span><b>4,8 ★</b> 200+ Bewertungen</span>
                  <span><b>Di & Do</b> Theorie</span>
                  <span><b>Sa</b> Erste Hilfe</span>
                </div>
              </div>
              <div className="hero-side">
                <div className="road-sign blue">DUISBURG<br/><b>MEIDERICH</b></div>
                <div className="hero-contact-card">
                  <span>Fahrschule Elly</span>
                  <b>Bahnhofstr. 2</b>
                  <small>47138 Duisburg</small>
                </div>
              </div>
            </div>
          </section>

          <section className="scene about-scene">
            <div className="split-layout">
              <div className="photo-stack about-photo">
                <figure className="photo-main"><img src="/assets/fahrschule.jpeg" alt="Fahrschule Elly in Duisburg" /></figure>
                <div className="info-ticket"><span>Gut erreichbar</span><b>Bahn 903 · Brückelstraße</b></div>
              </div>
              <div className="content-panel right-panel">
                <span className="eyebrow">Über uns</span>
                <h2>Persönlich, modern und mitten in Meiderich.</h2>
                <p>Die Fahrschule Elly steht für praxisnahe Ausbildung, moderne Fahrzeuge und individuelle Betreuung. Geschäftsführerin Yeliz Kandemir und das Team begleiten dich auf deinem Weg zur Mobilität.</p>
                <div className="fact-list">
                  <div><b>Yeliz Kandemir</b><span>Geschäftsführerin</span></div>
                  <div><b>Mo–Fr</b><span>12:00–18:30 Uhr</span></div>
                  <div><b>0203-73839888</b><span>Direkter Kontakt</span></div>
                </div>
              </div>
            </div>
          </section>

          <section className="scene classes-scene">
            <div className="classes-layout">
              <div className="section-heading compact">
                <span className="eyebrow">Führerscheinklassen</span>
                <h2>Welcher Führerschein passt zu dir?</h2>
                <p>Bei Elly bekommst du Auto-, Anhänger- und Motorradausbildung aus einer Hand.</p>
              </div>
              <div className="class-grid premium-cards">
                <article>
                  <span>B</span><b>Auto</b><small>B · B197 · BF17</small>
                  <em>Theorieunterricht, Übungsfahrten und Sonderfahrten.</em>
                </article>
                <article className="photo-class">
                  <img src="/assets/anhaenger.jpg" alt="Anhänger Ausbildung" /><span>BE</span><b>Anhänger</b><small>BE · B96</small>
                  <em>Für Anhänger, Transport und mehr Flexibilität.</em>
                </article>
                <article className="photo-class">
                  <img src="/assets/motorrad.jpeg" alt="Motorradausbildung" /><span>A</span><b>Motorrad</b><small>A · A2 · A1 · AM</small>
                  <em>Praxisnah und sicher auf zwei Rädern.</em>
                </article>
              </div>
            </div>
          </section>

          <section className="scene process-scene">
            <div className="process-layout">
              <div className="section-heading process-heading">
                <span className="eyebrow">Ausbildung</span>
                <h2>Vom ersten Gespräch bis zur Prüfung.</h2>
                <p>Du weißt jederzeit, wo du stehst und was als Nächstes kommt.</p>
              </div>
              <div className="process-roadmap">
                <article><span>01</span><b>Beratung & Anmeldung</b><p>Telefonisch, online oder direkt vor Ort.</p></article>
                <article><span>02</span><b>Theorie</b><p>Dienstags und donnerstags.</p></article>
                <article><span>03</span><b>Praxis</b><p>Fahrstunden, Sonderfahrten und gezieltes Training.</p></article>
                <article><span>04</span><b>Prüfung</b><p>Vorbereitung, Feedback und Prüfungstraining.</p></article>
                <article className="goal"><span>05</span><b>Führerschein</b><p>Ziel erreicht.</p></article>
              </div>
            </div>
          </section>

          <section className="scene vehicles-scene">
            <div className="vehicles-layout">
              <div className="vehicle-showcase">
                <div className="vehicle-stage-card">
                  <img src="/assets/car-1.png" alt="Fahrschulfahrzeug" />
                  <div><span>MODERNE FAHRZEUGE</span><b>Komfortabel & lernfreundlich</b></div>
                </div>
                <div className="vehicle-mini-card"><img src="/assets/motorrad.jpeg" alt="Motorrad Ausbildung" /><span>Motorrad</span></div>
                <div className="vehicle-mini-card"><img src="/assets/anhaenger.jpg" alt="Anhänger Ausbildung" /><span>Anhänger</span></div>
              </div>
              <div className="content-panel vehicle-copy">
                <span className="eyebrow">Fahrzeuge</span>
                <h2>Modern ausgestattet. Sicher lernen.</h2>
                <p>Unsere Fahrzeuge sind modern, komfortabel und lernfreundlich ausgestattet. So kannst du dich auf das konzentrieren, was zählt: sicher fahren lernen.</p>
                <div className="feature-pills"><span>Klasse B</span><span>BE / B96</span><span>A / A2 / A1 / AM</span></div>
              </div>
            </div>
          </section>

          <section className="scene reviews-scene">
            <div className="reviews-layout">
              <div className="reviews-score">
                <span className="eyebrow">Stimmen unserer Fahrschüler</span>
                <strong>4,8</strong>
                <div className="stars">★★★★★</div>
                <b>200+ Bewertungen</b>
                <p>Stimmen von Fahrschülern, die ihre Ausbildung bei Elly gemacht haben.</p>
              </div>
              <div className="review-cards">
                <article>
                  <span>“</span>
                  <p>Professionelle Betreuung, faire Preise und moderne Autos. Besonders die Nachtfahrten haben mir viel gebracht.</p>
                  <b>Lukas R.</b><small>Meiderich</small>
                </article>
                <article>
                  <span>“</span>
                  <p>Ich war anfangs nervös, aber mein Fahrlehrer war super geduldig. Theorie und Praxis waren klar verständlich.</p>
                  <b>Sofia M.</b><small>Duisburg-Neudorf</small>
                </article>
              </div>
            </div>
          </section>

          <section className="scene theory-scene">
            <div className="theory-layout">
              <div className="theory-visual">
                <figure><img src="/assets/erste-hilfe.jpg" alt="Erste Hilfe Kurs" /></figure>
                <div className="traffic-light"><i /><i /><i className="green" /></div>
              </div>
              <div className="content-panel theory-copy">
                <span className="eyebrow">Theorie & Erste Hilfe</span>
                <h2>Alles, was du für den Start brauchst.</h2>
                <div className="schedule-grid">
                  <div><span>THEORIE</span><b>Di & Do</b><small>Dienstag & Donnerstag.</small></div>
                  <div className="red-card"><span>ERSTE HILFE</span><b>Jeden Samstag</b><small>Direkt in der Fahrschule.</small></div>
                </div>
                <p className="subcopy">Für Klasse B: 12 Grundstoff-Einheiten + 2 Zusatzstoffe. Der Erste-Hilfe-Kurs findet jeden Samstag direkt in der Fahrschule statt.</p>
              </div>
            </div>
          </section>

          <section className="scene location-scene">
            <div className="location-layout">
              <div className="map-panel">
                <div className="map-grid" />
                <div className="map-pin">E</div>
                <div className="map-label"><b>Fahrschule Elly</b><span>Bahnhofstr. 2 · 47138 Duisburg</span></div>
              </div>
              <div className="content-panel location-copy">
                <span className="eyebrow">Standort & Kontakt</span>
                <h2>Mitten in Duisburg-Meiderich.</h2>
                <p>Gut erreichbar mit der Bahn 903, Haltestelle Brückelstraße.</p>
                <div className="contact-list">
                  <a href="tel:020373839888"><b>0203-73839888</b><span>Anrufen</span></a>
                  <a href="mailto:fahrschuleelly@gmail.com"><b>fahrschuleelly@gmail.com</b><span>E-Mail</span></a>
                  <div><b>Mo–Fr · 12:00–18:30</b><span>Öffnungszeiten</span></div>
                </div>
                <a className="secondary-button" href="https://www.google.com/maps/search/?api=1&query=Bahnhofstr.+2,+47138+Duisburg" target="_blank" rel="noreferrer">Route planen →</a>
              </div>
            </div>
          </section>

          <section className="scene final-scene">
            <div className="final-layout">
              <span className="eyebrow light">Ziel erreicht</span>
              <h2>Bereit für deinen Führerschein?</h2>
              <p>Starte jetzt deine Ausbildung bei Fahrschule Elly in Duisburg-Meiderich.</p>
              <div className="final-actions">
                <a className="primary light-button" href="tel:020373839888">Jetzt anmelden</a>
                <a href="https://wa.me/4920373839888" target="_blank" rel="noreferrer">WhatsApp</a>
                <a href="tel:020373839888">Anrufen</a>
                <a href="https://www.google.com/maps/search/?api=1&query=Bahnhofstr.+2,+47138+Duisburg" target="_blank" rel="noreferrer">Route planen</a>
              </div>
              <div className="final-meta"><span>Bahnhofstr. 2 · 47138 Duisburg</span><span>Mo–Fr · 12:00–18:30 Uhr</span></div>
            </div>
          </section>
        </div>
      </div>

      <div className="road-layer" aria-hidden="true">
        <div className="road-curb" style={{ transform: `translateX(${-roadOffset * 0.52}px)` }} />
        <div className="road-seams" style={{ transform: `translateX(${-roadOffset * 0.92}px)` }} />
        <div className="road-patches" style={{ transform: `translateX(${-roadOffset * 0.7}px)` }} />
      </div>

      <div className="car-stage" aria-hidden="true">
        <img className="car-image" src="/assets/car-1.png" alt="" />
        <img className="door-logo" src="/assets/elly-logo.png" alt="" />
        <img className="car-wheel wheel-rear" src="/assets/teker.png" alt="" style={{ transform: `rotate(${-wheelRotation}deg)` }} />
        <img className="car-wheel wheel-front" src="/assets/teker.png" alt="" style={{ transform: `rotate(${-(wheelRotation + 63)}deg)` }} />
      </div>

      <aside className="side-progress">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div className="progress-line"><i style={{ width: `${((position + 1) / scenes.length) * 100}%` }} /></div>
        <span>{String(scenes.length).padStart(2, '0')}</span>
      </aside>

      <div className="scroll-hint">
        <span>Scroll to drive</span>
        <i>→</i>
      </div>
    </main>
  );
}
