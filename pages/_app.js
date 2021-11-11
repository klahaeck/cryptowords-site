import { wrapper } from '../store/store';
import { ChainId, DAppProvider, MULTICALL_ADDRESSES } from '@usedapp/core';
import '../styles/globals.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const config = {
  // readOnlyChainId: ChainId.Rinkeby,
  // readOnlyUrls: {
  //   [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/cefce407f9134e11b96271b86f44e144',
  //   [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/cefce407f9134e11b96271b86f44e144',
  //   31337: 'http://localhost:8545',
  // },
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
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default wrapper.withRedux(MyApp);
