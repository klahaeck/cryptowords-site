// import Head from 'next/head';
import MetaTags from '../components/MetaTags';
import data from '../data';

const Main = ({ children }) => {
  return (
    <>
      <MetaTags meta={data.meta} />
      { children }
    </>
  );
};

export default Main;