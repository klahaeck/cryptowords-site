import { wrapper } from '../store/store';
import { ChainId, DAppProvider } from '@usedapp/core';
import '../styles/globals.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const config = {
  // readOnlyChainId: ChainId.Rinkeby,
  // readOnlyUrls: {
  //   [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/cefce407f9134e11b96271b86f44e144',
  //   [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/cefce407f9134e11b96271b86f44e144'
  // }
};

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default wrapper.withRedux(MyApp);
