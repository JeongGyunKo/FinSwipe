import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, User } from 'lucide-react';

const ITEMS = [
  { icon: User,  label: 'MY',   path: '/my',   angle: -130, color: '#7C3AED' },
  { icon: Home,  label: 'HOME', path: '/',     angle: -90,  color: '#0064FF' },
  { icon: Heart, label: '관심', path: '/like', angle: -50,  color: '#EF4444' },
];

const R   = 80;
const DEG = Math.PI / 180;

export function DialMenu() {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressing  = useRef(false);
  const startPos  = useRef({ x: 0, y: 0 });

  const [showGuide, setShowGuide] = useState(() => {
    return !localStorage.getItem('dialMenuGuideShown');
  });

  const dismissGuide = () => {
    localStorage.setItem('dialMenuGuideShown', 'true');
    setShowGuide(false);
  };

  useEffect(() => {
    const HOLD_MS    = 450;
    const MOVE_LIMIT = 10;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, [role="button"]')) return;
      pressing.current  = true;
      startPos.current  = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => {
        if (!pressing.current) return;
        if (navigator.vibrate) navigator.vibrate([15, 8, 25]);
        setMenuPos({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }, HOLD_MS);
    };

    const onMove = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > MOVE_LIMIT || dy > MOVE_LIMIT) {
        pressing.current = false;
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };

    const onUp = () => {
      pressing.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
    document.addEventListener('pointercancel', onUp);

    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      document.removeEventListener('pointercancel', onUp);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const go = (path: string) => {
    if (navigator.vibrate) navigator.vibrate(12);
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* 스크림 */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(8,10,20,0.52)', backdropFilter: 'blur(8px)' }}
          />
        )}
      </AnimatePresence>

      {/* 다이얼 메뉴 */}
      <AnimatePresence>
        {open && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: menuPos.x, top: menuPos.y, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className="absolute"
              style={{
                width: 56, height: 56,
                left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            />
            {ITEMS.map((item, i) => {
              const rad = item.angle * DEG;
              const tx  = R * Math.cos(rad);
              const ty  = R * Math.sin(rad) - 40;
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  animate={{ opacity: 1, x: tx, y: ty, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 30, delay: i * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => go(item.path)}
                  className="absolute flex flex-col items-center gap-1.5 pointer-events-auto"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    className="w-13 h-13 rounded-full flex items-center justify-center"
                    style={{
                      background: isActive ? item.color : 'rgba(255,255,255,0.95)',
                      boxShadow: isActive ? `0 6px 24px ${item.color}70` : '0 4px 20px rgba(0,0,0,0.18)',
                    }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? '#fff' : item.color} />
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 + 0.1 }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: isActive ? item.color : 'rgba(255,255,255,0.9)',
                      color: isActive ? '#fff' : '#1f2937',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* 온보딩 가이드 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissGuide}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(8,10,20,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-white text-lg font-medium mb-2">화면을 꾹 눌러보세요</p>
            <p className="text-white/50 text-sm mb-16">어디서든 메뉴를 열 수 있어요</p>

            {/* 미리보기 */}
            <div className="relative w-48 h-48">
              {/* 파동 링 */}
              {[0, 0.6, 1.2].map((delay, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-white/40"
                  style={{ width: 56, height: 56, top: '50%', left: '50%', marginTop: -28, marginLeft: -28 }}
                  animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }}
                />
              ))}

              {/* 중앙 링 */}
              <div className="absolute rounded-full"
                style={{ width: 52, height: 52, top: '50%', left: '50%', marginTop: -26, marginLeft: -26, background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)' }}
              />

              {/* 다이얼 아이템 미리보기 */}
              {ITEMS.map((item, i) => {
                const rad = item.angle * DEG;
                const tx  = R * Math.cos(rad) - 25;
                const ty  = R * Math.sin(rad) - 60;
                const Icon = item.icon;
                const isHome = item.path === '/';
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                    animate={{ opacity: 1, x: tx, y: ty, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 440, damping: 30, delay: 0.3 + i * 0.06 }}
                    className="absolute flex flex-col items-center gap-1.5"
                    style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: isHome ? item.color : 'rgba(255,255,255,0.95)',
                        boxShadow: isHome ? `0 6px 24px ${item.color}70` : '0 4px 20px rgba(0,0,0,0.25)',
                      }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.8} color={isHome ? '#fff' : item.color} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: isHome ? item.color : 'rgba(255,255,255,0.9)',
                        color: isHome ? '#fff' : '#1f2937',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}

              {/* 손가락 */}
              <motion.div
                className="absolute"
                style={{ top: '50%', left: '50%', marginTop: -24, marginLeft: -20 }}
                animate={{ scale: [1, 0.85, 0.85, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.6, 1] }}
              >
                <span style={{ fontSize: 44 }}>👆</span>
              </motion.div>
            </div>

            <p className="text-white/30 text-xs mt-12">탭하면 닫힙니다</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}