export const meta = {
  title: 'CryptoWords',
  socialTitle: 'CryptoWords',
  keywords: 'crypto words dictionary',
  description: 'Own the English language, one word at a time.',
  imageUrl: 'https://cryptowords.s3.amazonaws.com/production/social-share.png',
  path: '/',
  url: 'https://cryptowords.art'
};

// DELETING A WORD HERE DOES NOT DELETE IT FROM THE DATABASE!
export const staticWords = [
  {
    name: 'CryptoWords',
    slug: 'cryptowords',
    external_url: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/word/cryptowords`,
    description: 'Own the English language, one word at a time.'
  },
  {
    name: 'CryptoWord',
    slug: 'cryptoword',
    external_url: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/word/cryptoword`,
    description: 'Own the English language, one word at a time.'
  },
  {
    name: 'Matic',
    slug: 'matic',
    external_url: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/word/matic`,
    description: 'MATIC is an ERC-20 token that is used to power Polygon, the gateway to a Multi-Chain Ethereum.'
  }
];