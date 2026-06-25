import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../features/book/bookService';
import Button from './Button';

const SLIDE_DURATION = 420;
const AUTO_INTERVAL = 6000;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DRAG_THRESHOLD = 80;  // px needed to commit a slide
const SNAP_DURATION = 280;  // ms for snap-back animation

const slideCSS = `
  .hero-viewport { position: relative; overflow: hidden; height: 360px; padding: 0 !important; }
  .hero-slide {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; padding: 3rem 2rem; gap: 2rem;
    background: #f4f4f8;
  }
  @keyframes heroOutLeft  { from { transform: translateX(0); }     to { transform: translateX(-105%); } }
  @keyframes heroOutRight { from { transform: translateX(0); }     to { transform: translateX(105%); }  }
  @keyframes heroInRight  { from { transform: translateX(105%); }  to { transform: translateX(0); }     }
  @keyframes heroInLeft   { from { transform: translateX(-105%); } to { transform: translateX(0); }     }
`;

function SlideContent({ book, rank, onView }) {
  const displayPrice =
    book.price > 1000
      ? `$${(book.price / 1000).toFixed(2)}`
      : `$${Number(book.price).toFixed(2)}`;

  return (
    <>
      <div className="lg-hero-text">
        <div className="lg-hero-eyebrow">
          #{rank + 1} Best Seller &nbsp;·&nbsp; {book.category}
        </div>
        <h1
          className="lg-hero-title"
          style={{ fontSize: book.title.length > 20 ? '30px' : '46px' }}
        >
          {book.title}
        </h1>
        <p className="lg-hero-desc">{book.description}</p>
        <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', fontSize: 13, color: '#888' }}>
          <span>⭐ {book.rating}</span>
          <span>{book.sold?.toLocaleString()} sold</span>
          <span style={{ color: '#3333bb', fontWeight: 600 }}>{displayPrice}</span>
        </div>
        <div className="lg-hero-btns">
          <Button variant="primary" onClick={onView}>View Book</Button>
        </div>
      </div>
      <div className="lg-hero-book-wrap">
        <div className="lg-hero-book-img" style={{ background: book.bg || '#1a2a3a' }}>
          <img
            src={book.image}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 4 }}
          />
        </div>
      </div>
    </>
  );
}

export default function Hero() {
  const [topBooks, setTopBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [forward, setForward] = useState(true);
  const navigate = useNavigate();

  // Drag state
  const [dragDelta, setDragDelta] = useState(0);
  // 'idle' | 'dragging' | 'snapping'
  const [dragPhase, setDragPhase] = useState('idle');
  const [peekIndex, setPeekIndex] = useState(null);

  const animatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;
  const dragActiveRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);  // mirror of dragDelta for use in callbacks

  useEffect(() => {
    bookService
      .getBooks({ _sort: 'sold', _order: 'desc', _limit: 10 })
      .then((res) => setTopBooks(res.data))
      .catch(() => {});
  }, []);

  const triggerTransition = (toIndex, isForward) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setForward(isForward);
    setPrevIndex(currentIndexRef.current);
    setCurrentIndex(toIndex);
    setAnimating(true);
    setTimeout(() => {
      setPrevIndex(null);
      setAnimating(false);
      animatingRef.current = false;
    }, SLIDE_DURATION + 60);
  };

  useEffect(() => {
    if (topBooks.length === 0) return;
    const interval = setInterval(() => {
      if (dragPhase !== 'idle') return;
      const next = (currentIndexRef.current + 1) % topBooks.length;
      triggerTransition(next, true);
    }, AUTO_INTERVAL);
    return () => clearInterval(interval);
  }, [topBooks, dragPhase]);

  const goTo = (index) => {
    if (index === currentIndex || animatingRef.current || dragPhase !== 'idle') return;
    triggerTransition(index, index > currentIndex);
  };

  // ── Drag handlers ────────────────────────────────────────────────────────────

  const handlePointerDown = (e) => {
    if (animatingRef.current) return;
    dragActiveRef.current = true;
    dragStartXRef.current = e.clientX;
    dragDeltaRef.current = 0;
    setDragDelta(0);
    setDragPhase('dragging');
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragActiveRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    dragDeltaRef.current = delta;
    setDragDelta(delta);

    const total = topBooks.length;
    if (total === 0) return;
    if (delta < 0) {
      setPeekIndex((currentIndexRef.current + 1) % total);
    } else if (delta > 0) {
      setPeekIndex((currentIndexRef.current - 1 + total) % total);
    } else {
      setPeekIndex(null);
    }
  };

  const handlePointerUp = (e) => {
    if (!dragActiveRef.current) return;
    dragActiveRef.current = false;
    const delta = dragDeltaRef.current;

    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      // Commit the slide
      const total = topBooks.length;
      const toIndex =
        delta < 0
          ? (currentIndexRef.current + 1) % total
          : (currentIndexRef.current - 1 + total) % total;
      setDragDelta(0);
      setDragPhase('idle');
      setPeekIndex(null);
      triggerTransition(toIndex, delta < 0);
    } else {
      // Snap back: first set transition, then update delta to 0 in next frame
      setDragPhase('snapping');
      requestAnimationFrame(() => {
        setDragDelta(0);
        setTimeout(() => {
          setDragPhase('idle');
          setPeekIndex(null);
        }, SNAP_DURATION + 40);
      });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const book = topBooks[currentIndex];
  if (!book) return <section className="lg-hero hero-viewport" />;

  const isDragging = dragPhase === 'dragging';
  const isSnapping = dragPhase === 'snapping';
  const snapTransition = `transform ${SNAP_DURATION}ms ease-out`;

  // Current slide transform
  let currentTransform = 'translateX(0)';
  let currentTransition = 'none';
  if (isDragging || isSnapping) {
    currentTransform = `translateX(${dragDelta}px)`;
    if (isSnapping) currentTransition = snapTransition;
  }

  // Peek slide transform (adjacent book that peeks in during drag)
  let peekTransform = null;
  let peekTransition = 'none';
  if ((isDragging || isSnapping) && peekIndex !== null) {
    const sign = dragDelta <= 0 ? 1 : -1; // peek comes from the opposite direction
    peekTransform = `translateX(calc(${sign * 100}% + ${dragDelta}px))`;
    if (isSnapping) {
      peekTransform = `translateX(${sign * 105}%)`;
      peekTransition = snapTransition;
    }
  }

  const dragCursor = isDragging ? 'grabbing' : 'grab';

  return (
    <section
      className="lg-hero hero-viewport"
      style={{ cursor: dragCursor, userSelect: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <style>{slideCSS}</style>

      {/* Outgoing slide — keyframe-animated (auto-advance / dot click) */}
      {prevIndex !== null && topBooks[prevIndex] && dragPhase === 'idle' && (
        <div
          className="hero-slide"
          style={{
            animation: `${forward ? 'heroOutLeft' : 'heroOutRight'} ${SLIDE_DURATION}ms ${EASING} forwards`,
          }}
        >
          <SlideContent
            book={topBooks[prevIndex]}
            rank={prevIndex}
            onView={() => navigate(`/book/${topBooks[prevIndex].id}`)}
          />
        </div>
      )}

      {/* Peek slide — visible only during drag / snap */}
      {peekTransform !== null && peekIndex !== null && topBooks[peekIndex] && (
        <div
          className="hero-slide"
          style={{ transform: peekTransform, transition: peekTransition }}
        >
          <SlideContent
            book={topBooks[peekIndex]}
            rank={peekIndex}
            onView={() => {}}
          />
        </div>
      )}

      {/* Current slide */}
      <div
        key={currentIndex}
        className="hero-slide"
        style={{
          transform: currentTransform,
          transition: currentTransition,
          ...(dragPhase === 'idle' && animating
            ? {
                animation: `${forward ? 'heroInRight' : 'heroInLeft'} ${SLIDE_DURATION}ms ${EASING} forwards`,
              }
            : {}),
        }}
      >
        <SlideContent
          book={book}
          rank={currentIndex}
          onView={() => navigate(`/book/${book.id}`)}
        />
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {topBooks.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === currentIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === currentIndex ? '#3333bb' : '#ccc',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </section>
  );
}
