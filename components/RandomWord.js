// import useSWR from 'swr';
// import fetcher from '../lib/fetcher';
import CardSearch from './CardSearch';

const RandomWord = ({ className }) => {
  // const { data, error } = useSWR('/api/words/random', fetcher);

  // if (error) return <CardSearch search="crypto" />
  // if (!data) return <CardSearch search="loading" />

  // return data ? <CardSearch search={data} /> : <h1>Help</h1>;
  return <CardSearch search={{ name: 'crypto' }} className={className} />;
};

export default RandomWord;