// import Head from 'next/head';
import MetaTags from '../components/MetaTags';
import { meta } from '../data';

const Main = ({ children }) => {
  return (
    <>
      <MetaTags meta={meta} />
      { children }
    </>
  );
};

export default Main;