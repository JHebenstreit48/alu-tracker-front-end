import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import '@/scss/shared/qrCode.scss';

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, 'https://asphalt-legends-tracker.netlify.app', {
        width: 180,
        color: {
          dark: '#0e0e0e',
          light: '#ffffff',
        },
      });
    }
  }, []);

  function downloadQR() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'asphalt-legends-tracker-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="qrPage">
      <div className="qrCard">
        <div className="qrCard__wordmark">
          Asphalt <span className="qrCard__accent">Legends</span> Tracker
        </div>
        <p className="qrCard__tagline">Unofficial Fan Tracker · Not affiliated with Gameloft</p>

        <div className="qrCard__wrap">
          <div className="qrCard__frame">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <button className="qrCard__download" onClick={downloadQR}>
          ↓ Download QR Code
        </button>

        <div className="qrCard__divider" />

        <div className="qrCard__info">
          <p className="qrCard__name">Asphalt Legends Tracker</p>
          <p className="qrCard__role">Unofficial Fan Tracker</p>
          <p className="qrCard__url">asphalt-legends-tracker.netlify.app</p>
        </div>

        <p className="qrCard__hint">Scan to explore</p>
      </div>

      <Link to="/" className="qrCard__back">← Back to site</Link>
    </div>
  );
}