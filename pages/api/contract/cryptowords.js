const data = {
  name: 'CryptoWords',
  description: 'Own the english language, one word at a time.',
  image: `https://cryptowords.s3.amazonaws.com/production/social-share.png`,
  external_link: 'https://cryptowords.art',
  seller_fee_basis_points: 300, // Indicates a 1% seller fee.
  fee_recipient: '0xb85E73065efcE4228163430118eeC94a7D269bd9' // Where seller fees will be paid to.
};

const resContracts = (req, res) => {
  res.status(200).json(data);
};

export default resContracts;