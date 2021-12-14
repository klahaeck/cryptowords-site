import { useEffect } from 'react';
import { Widget } from '@maticnetwork/wallet-widget';
import {
  Button
} from 'react-bootstrap';

const PolygonBridge = () => {
  const widget = new Widget({
    target: '',
    appName: 'CryptoWords-prod',
    autoShowTime: 0,
    position: 'center',
    height: 630,
    width: 540,
    overlay: false,
    network: 'mainnet',
    closable: true,
  });

  useEffect(() => {
    widget.create();
  }, []);

  return (
    <Button onClick={() => widget.show()}>Bridge</Button>
  );
};

export default PolygonBridge;