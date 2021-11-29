export const meta = {
  title: 'CryptoWords',
  socialTitle: 'CryptoWords',
  keywords: 'crypto words dictionary',
  description: 'Own the English language, one word at a time.',
  imageUrl: 'https://cryptowords.s3.amazonaws.com/production/social-share.jpg',
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
  }
];