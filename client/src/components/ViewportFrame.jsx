import { useLayoutEffect, useRef, useState } from 'react';

export default function ViewportFrame({ children }) {
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const [frame, setFrame] = useState({ scale: 1, width: 0, height: 0 });

  useLayoutEffect(() => {
    const viewportNode = viewportRef.current;
    const measureNode = measureRef.current;

    if (!viewportNode || !measureNode) {
      return undefined;
    }

    function updateFrame() {
      const viewportWidth = viewportNode.clientWidth;
      const viewportHeight = viewportNode.clientHeight;
      const contentWidth = measureNode.scrollWidth;
      const contentHeight = measureNode.scrollHeight;

      if (!viewportWidth || !viewportHeight || !contentWidth || !contentHeight) {
        return;
      }

      const scale = Math.min(viewportWidth / contentWidth, viewportHeight / contentHeight, 1);

      setFrame({
        scale,
        width: contentWidth,
        height: contentHeight
      });
    }

    updateFrame();

    const resizeObserver = new ResizeObserver(updateFrame);
    resizeObserver.observe(viewportNode);
    resizeObserver.observe(measureNode);

    window.addEventListener('resize', updateFrame);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateFrame);
    };
  }, [children]);

  return (
    <div className="viewport-frame">
      <div className="viewport-frame__viewport" ref={viewportRef}>
        <div
          className="viewport-frame__content"
          style={{
            width: frame.width || 'auto',
            height: frame.height || 'auto',
            transform: `scale(${frame.scale})`
          }}
        >
          <div className="viewport-frame__measure" ref={measureRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

