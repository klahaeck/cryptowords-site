import MetaTags from '../components/MetaTags';
import { meta } from '../data';
import Notices from '../components/Notices';
import Alerts from '../components/Alerts';
import Menubar from '../components/Menubar';
import Toasts from '../components/Toasts';
import ChainChecker from '../components/ChainChecker';
import SiteModal from '../components/SiteModal';
import BgParticles from '../components/BgParticles';
import Footer from '../components/Footer';

const Main = ({ className, children }) => {
  

  return (
    <div className={className}>
      <MetaTags meta={meta} />
      <BgParticles />
      <Notices />
      <Menubar />
      <Toasts />
      <ChainChecker />
      <Alerts position="global" />

      { children }
      <Footer />
      <SiteModal />
    </div>
  );
};

export default Main;