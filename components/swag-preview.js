import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Perspective from 'perspective-transform';

const COORDS = [93, 204, 303, 216, 31, 354, 250, 405];

const [WIDTH, HEIGHT] = [384, 384];
const ALBUM_SIZE = 512;

const SwagPreview = ({ onClick, album = null, selectedIndex = null, generated = false }) => {
  const ref = useRef();
  const [count, setCount] = useState(0);
  const width = (ref.current && ref.current.width) || 0;

  useEffect(() => {
    if (!width) {
      setTimeout(() => {
        setCount(count + 1);
      }, 10);
    }
  }, [count]);

  // scale the COORDS down if the image is smaller than normal, else don't
  const scale = width ? width / WIDTH : 1.0;

  let coeffs = Perspective(
    [0, 0, ALBUM_SIZE, 0, 0, ALBUM_SIZE, ALBUM_SIZE, ALBUM_SIZE],
    COORDS.map((x) => x * scale)
  ).coeffs;
  let matrix = [
    coeffs[0],
    coeffs[3],
    0,
    coeffs[6],
    coeffs[1],
    coeffs[4],
    0,
    coeffs[7],
    0,
    0,
    1,
    0,
    coeffs[2],
    coeffs[5],
    0,
    coeffs[8],
  ];

  return (
    <div className="relative inline-block overflow-hidden">
      <img
        src="/images/chandler.png"
        style={{ filter: generated ? 'none' : 'grayscale(1)' }}
        className="relative z-10 block pointer-events-none select-none max-w-full"
        ref={ref}
      />
      <div className="absolute inset-0 z-20">
        {width && (
          <img
            key="1"
            draggable="false"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onClick('1');
            }}
            className="max-w-none border-blue-700 absolute top-0 left-0 box-border"
            style={{
              transform: `matrix3d(${matrix})`,
              transformOrigin: '0px 0px 0px',
              width: `${ALBUM_SIZE}px`,
              height: `${ALBUM_SIZE}px`,
            }}
            src={album}
          />
        )}
      </div>
      <div className="absolute inset-0 z-30 pointer-events-none select-none">
        <img
          className="pointer-events-none max-w-full"
          src="/images/chandler_front.png"
          style={{ filter: generated ? 'none' : 'grayscale(1)' }}
        />
        {width && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="font-bold text-6xl"
              style={{
                color: 'rgba(255,255,255,0.3)',
                transform: `rotate(45deg) scale(${scale})`,
                display: !generated ? '' : 'none',
              }}>
              PREVIEW
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwagPreview;
