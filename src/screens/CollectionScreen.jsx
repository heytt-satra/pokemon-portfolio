import { useState, useEffect, useRef, useCallback } from 'react';
import { ENCOUNTER_POOL } from '../data/encounterData';
import { generateEntitySprite } from '../engine/spriteGenerator';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import '../screens/screens.css';

export default function CollectionScreen({ setScreen }) {
  const store = useGameStore();
  const [selIdx, setSelIdx] = useState(0);
  const detailCanvasRef = useRef(null);

  const catchable = ENCOUNTER_POOL.filter(e => e.catchable);
  const caughtCount = catchable.filter(e => store.caughtEntities.includes(e.id)).length;
  const totalCount = catchable.length;
  const allCaught = caughtCount === totalCount;

  const selected = ENCOUNTER_POOL[selIdx];
  const isCaught = selected && store.caughtEntities.includes(selected.id);
  const isSeen = selected && store.encounteredEntities.includes(selected.id);

  // Draw detail sprite
  useEffect(() => {
    if (!detailCanvasRef.current || !selected) return;
    const c = detailCanvasRef.current;
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (isCaught || isSeen) {
      const sprite = generateEntitySprite(selected.type);
      ctx.drawImage(sprite, 0, 0, 32, 32, 0, 0, 64, 64);
      if (!isCaught) {
        // Silhouette: draw black over it
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = '#181818';
        ctx.fillRect(0, 0, 64, 64);
        ctx.globalCompositeOperation = 'source-over';
      }
    } else {
      ctx.fillStyle = '#181818';
      ctx.fillRect(8, 8, 48, 48);
      ctx.fillStyle = '#333';
      ctx.font = '28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', 32, 42);
    }
  }, [selected, isCaught, isSeen]);

  useInput((action) => {
    if (action === 'UP') setSelIdx(i => Math.max(0, i - 1));
    if (action === 'DOWN') setSelIdx(i => Math.min(ENCOUNTER_POOL.length - 1, i + 1));
    if (action === 'B') {
      setScreen('overworld');
    }
  }, []);

  const typeColors = {
    FIRE: '#F85830', WATER: '#6890F0', ELECTRIC: '#F8D030',
    PSYCHIC: '#F85888', GRASS: '#78C850', STEEL: '#B8B8D0', NORMAL: '#A8A878',
  };

  return (
    <div className="screen-fullscreen projects-bg">
      <div className="screen-panel-wide" style={{ maxWidth: 700 }}>
        {/* Header */}
        <div className="panel-header">
          <h2 className="panel-title">MY COLLECTION</h2>
          <div className="panel-subtitle" style={{ color: allCaught ? '#F8D030' : '#888' }}>
            CAUGHT: {caughtCount} / {totalCount}
            {allCaught && ' ★ COMPLETE!'}
          </div>
        </div>

        {allCaught && (
          <div className="collection-complete-msg">
            COLLECTION COMPLETE. HEYTT is impressed. Not many people get this far.
          </div>
        )}

        <div className="collection-layout">
          {/* List */}
          <div className="collection-list">
            {ENCOUNTER_POOL.map((e, i) => {
              const caught = store.caughtEntities.includes(e.id);
              const seen = store.encounteredEntities.includes(e.id);
              return (
                <div key={e.id}
                  className={`collection-item ${i === selIdx ? 'selected' : ''}`}
                  onClick={() => setSelIdx(i)}>
                  <span className="ci-cursor">{i === selIdx ? '▶' : ' '}</span>
                  <span className="ci-ball">{caught ? '●' : seen ? '○' : '·'}</span>
                  <span className="ci-name" style={{ color: caught ? '#F8F8F8' : seen ? '#888' : '#444' }}>
                    {caught || seen ? e.name : '???'}
                  </span>
                  {caught && (
                    <span className="ci-type" style={{ background: typeColors[e.type] || '#888' }}>
                      {e.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail */}
          <div className="collection-detail">
            <canvas ref={detailCanvasRef} className="cd-sprite" style={{ imageRendering: 'pixelated' }} />
            <div className="cd-name">
              {isCaught ? selected.name : isSeen ? selected.name : '???'}
            </div>
            {isCaught && (
              <>
                <div className="cd-category">{selected.category}</div>
                <div className="cd-rarity" style={{
                  color: selected.rarity === 'RARE' ? '#F8D030' :
                    selected.rarity === 'UNCOMMON' ? '#78C850' : '#888'
                }}>
                  {selected.rarity}
                </div>
                <div className="cd-desc">{selected.description}</div>
              </>
            )}
            {isSeen && !isCaught && (
              <div className="cd-desc" style={{ color: '#666' }}>
                Encountered but not caught. Find it again in the tall grass!
              </div>
            )}
            {!isSeen && !isCaught && (
              <div className="cd-desc" style={{ color: '#444' }}>
                Not yet encountered. Keep exploring!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="screen-back-fs">X / ESC — Back</div>
    </div>
  );
}
