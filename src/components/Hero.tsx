import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Character = {
  no: string;
  service: string;
  ghost: string;
  role: string;
  description: string;
  bust: string;
  /** バスト画像の 幅÷高さ。枠の横幅を決めるのに使う */
  bustRatio: number;
  figure: string;
  figureRatio: number;
  bg: string;
  panel: string;
};

const CHARACTERS: Character[] = [
  {
    no: '01',
    service: 'Webサイト制作',
    ghost: 'ウェブ',
    role: 'サイト制作担当・うさぎのミオ',
    description:
      'コーポレートサイトもLPも。伝えたいことがきちんと伝わる1枚を、構成から一緒につくります。',
    bust: 'characters/mio_happy.png',
    bustRatio: 0.5234,
    figure: 'characters/mio.png',
    figureRatio: 0.7433,
    bg: '#F08FA8',
    panel: '#F4A6BA',
  },
  {
    no: '02',
    service: 'ダッシュボード制作',
    ghost: 'データ',
    role: 'ダッシュボード担当・フクロウ',
    description:
      '見たい数字が、毎日ひとりでに集まる。売上・タスク・顧客を1画面にまとめ、判断を速くします。',
    bust: 'characters/owl_happy.png',
    bustRatio: 0.9547,
    figure: 'characters/owl.png',
    figureRatio: 0.8317,
    bg: '#6FC4E4',
    panel: '#8FD3EC',
  },
  {
    no: '03',
    service: 'SNS運用・発信',
    ghost: '発信',
    role: 'SNS担当・レオパードゲッコー',
    description: '届けたい人に、言葉を届ける。発信の型づくりから日々の運用まで、そばで伴走します。',
    bust: 'characters/gecko_happy.png',
    bustRatio: 0.7734,
    figure: 'characters/leopard_gecko.png',
    figureRatio: 1.3629,
    bg: '#F0954E',
    panel: '#F4AC75',
  },
  {
    no: '04',
    service: '動画・コンテンツ制作',
    ghost: '動画',
    role: 'コンテンツ制作担当・ネコ',
    description: '見て、すっと伝わるかたちに。動画も画像も、専門家が世界観ごとかたちにします。',
    bust: 'characters/neko_happy.png',
    bustRatio: 0.8625,
    figure: 'characters/neko.png',
    figureRatio: 0.7157,
    bg: '#7B9A64',
    panel: '#96B082',
  },
  {
    no: '05',
    service: '業務の自動化',
    ghost: '自動化',
    role: '業務自動化担当・ハムスター',
    description:
      '毎日の手作業を、仕組みで無くす。集計や転記のくり返しを、そのまま自動へ置き換えます。',
    bust: 'characters/hamster_happy.png',
    bustRatio: 0.8187,
    figure: 'characters/hamster.png',
    figureRatio: 0.6422,
    bg: '#7FCBA0',
    panel: '#9CD8B6',
  },
  {
    no: '06',
    service: 'AI活用の相談・診断',
    ghost: 'AI活用',
    role: 'AI相談担当・カワウソのリク',
    description:
      '「何から始めればいい？」に、一緒に答える。今の仕事を洗い出し、AIの“任せどころ”を見つけます。',
    bust: 'characters/riku_happy.png',
    bustRatio: 0.8438,
    figure: 'characters/riku.png',
    figureRatio: 0.6,
    bg: '#6B4A2F',
    panel: '#8A6549',
  },
];

const COUNT = CHARACTERS.length;
const EASE = 'cubic-bezier(0.4,0,0.2,1)';
const DURATION = 650;
const JP_FONT = "'Noto Sans JP', sans-serif";

const GRAIN_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

/** 中央からの距離で決まる並び順。0=中央、1=右、2=右奥、3=背面、4=左奥、5=左 */
type Slot = 'center' | 'right' | 'farRight' | 'back' | 'farLeft' | 'left';

const SLOTS: Slot[] = ['center', 'right', 'farRight', 'back', 'farLeft', 'left'];

/** 配信先がサブパスでも画像を引けるように、公開ベースURLを前置きする */
const asset = (path: string) => import.meta.env.BASE_URL + path;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const isAnimating = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    CHARACTERS.forEach((item) => {
      [item.bust, item.figure].forEach((src) => {
        const img = new Image();
        img.src = asset(src);
      });
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % COUNT : (prev + COUNT - 1) % COUNT
    );
    timer.current = window.setTimeout(() => {
      isAnimating.current = false;
    }, DURATION);
  }, []);

  const active = CHARACTERS[activeIndex];
  const slotOf = (index: number): Slot => SLOTS[(index - activeIndex + COUNT) % COUNT];

  const styleFor = (slot: Slot): CSSProperties => {
    switch (slot) {
      case 'center':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '62%' : '70%',
          bottom: isMobile ? '6%' : 0,
        };
      case 'left':
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.9,
          zIndex: 10,
          left: slot === 'left' ? (isMobile ? '18%' : '30%') : isMobile ? '82%' : '70%',
          height: isMobile ? '13%' : '26%',
          bottom: isMobile ? '34%' : '10%',
        };
      case 'farLeft':
      case 'farRight':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(3px)',
          opacity: 0.7,
          zIndex: 8,
          left: slot === 'farLeft' ? (isMobile ? '6%' : '13%') : isMobile ? '94%' : '87%',
          height: isMobile ? '9%' : '18%',
          bottom: isMobile ? '35%' : '12%',
        };
      case 'back':
      default:
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 0.85,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '10%' : '20%',
          bottom: isMobile ? '35%' : '11%',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: JP_FONT,
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 1. ざらつきのオーバーレイ */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            backgroundImage: GRAIN_URI,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.4,
          }}
        />

        {/* 2. 背面の巨大な文字 */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: isMobile ? '20%' : '13%' }}
        >
          {CHARACTERS.map((item, index) => (
            <span
              key={item.no}
              style={{
                position: index === 0 ? 'relative' : 'absolute',
                fontFamily: JP_FONT,
                fontSize: 'clamp(64px, 19vw, 260px)',
                fontWeight: 900,
                color: '#ffffff',
                opacity: index === activeIndex ? 1 : 0,
                transition: `opacity ${DURATION}ms ${EASE}`,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {item.ghost}
            </span>
          ))}
        </div>

        {/* 3. 左上のブランド表記 */}
        <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-bold"
          style={{ zIndex: 60, color: '#ffffff', opacity: 0.9, letterSpacing: '0.18em' }}
        >
          株式会社D-win
        </div>

        {/* 4. キャラクターのカルーセル */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {CHARACTERS.map((item, index) => {
            const slot = slotOf(index);
            const isCenter = slot === 'center';
            return (
              <div
                key={item.no}
                style={{
                  position: 'absolute',
                  transformOrigin: 'bottom center',
                  aspectRatio: `${isCenter ? item.bustRatio : item.figureRatio}`,
                  transition: [
                    `transform ${DURATION}ms ${EASE}`,
                    `filter ${DURATION}ms ${EASE}`,
                    `opacity ${DURATION}ms ${EASE}`,
                    `left ${DURATION}ms ${EASE}`,
                    `height ${DURATION}ms ${EASE}`,
                    `bottom ${DURATION}ms ${EASE}`,
                  ].join(', '),
                  willChange: 'transform, filter, opacity',
                  ...styleFor(slot),
                }}
              >
                <img
                  src={asset(isCenter ? item.bust : item.figure)}
                  alt={isCenter ? item.role : ''}
                  draggable={false}
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'block',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. 文字を読みやすくするための下部の影 */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            zIndex: 40,
            height: '48%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0))',
          }}
        />

        {/* 6. 左下のテキストと操作ボタン */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 340 }}
        >
          <p
            className="text-xs font-bold mb-1"
            style={{ color: '#ffffff', opacity: 0.7, letterSpacing: '0.16em' }}
          >
            {active.no} ／ {String(COUNT).padStart(2, '0')}
          </p>
          <p
            className="font-bold mb-1 text-lg sm:text-[26px]"
            style={{ color: '#ffffff', opacity: 0.98, letterSpacing: '0.02em', lineHeight: 1.3 }}
          >
            {active.service}
          </p>
          <p
            className="text-[11px] sm:text-xs font-medium mb-2 sm:mb-3"
            style={{ color: '#ffffff', opacity: 0.8, letterSpacing: '0.04em' }}
          >
            {active.role}
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: '#ffffff', opacity: 0.85, lineHeight: 1.7 }}
          >
            {active.description}
          </p>
          <div className="flex items-center gap-3">
            <NavButton label="前のサービスへ" onClick={() => navigate('prev')}>
              <ArrowLeft size={26} strokeWidth={2.25} />
            </NavButton>
            <NavButton label="次のサービスへ" onClick={() => navigate('next')}>
              <ArrowRight size={26} strokeWidth={2.25} />
            </NavButton>
          </div>
        </div>

        {/* 7. 右下のリンク */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
          <DiscoverLink />
        </div>
      </div>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
      style={{
        backgroundColor: hover ? 'rgba(255,255,255,0.12)' : 'transparent',
        border: '2px solid #ffffff',
        color: '#ffffff',
        transform: hover ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 150ms, background-color 150ms',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function DiscoverLink() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-2"
      style={{
        fontFamily: JP_FONT,
        fontSize: 'clamp(18px, 3.4vw, 44px)',
        fontWeight: 900,
        color: '#ffffff',
        opacity: hover ? 1 : 0.95,
        transition: 'opacity 200ms',
        letterSpacing: '-0.01em',
        lineHeight: 1,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      詳しく見る
      <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
    </a>
  );
}
