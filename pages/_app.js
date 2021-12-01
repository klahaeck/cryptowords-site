import { wrapper } from '../store/store';
import { ChainId, DAppProvider, MULTICALL_ADDRESSES } from '@usedapp/core';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/globals.scss';

const tagManagerArgs = {
  gtmId: 'GTM-53GZ6NG',
}

const config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.NEXT_PUBLIC_INFURA_URL_RINKEBY,
    [ChainId.Mainnet]: process.env.NEXT_PUBLIC_INFURA_URL_MAINNET,
    // 31337: 'http://localhost:8545',
  },
  // multicallAddresses: {
  //   31337: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 
  //   ...MULTICALL_ADDRESSES,
  // },
  // supportedChains: [
  //   ChainId.Mainnet,
  //   ChainId.Goerli,
  //   ChainId.Kovan,
  //   ChainId.Rinkeby,
  //   ChainId.Ropsten,
  //   ChainId.xDai,
  //   ChainId.BSC,
  //   ChainId.Localhost,
  //   ChainId.Hardhat,
  // ],
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.browser) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default wrapper.withRedux(MyApp);
