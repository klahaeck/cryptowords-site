const data = {
  name: 'CryptoWords',
  description: 'Own the english language, one word at a time.',
  image: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/images/112521815-funny-computer-nerd-with-his-laptop-e-learning-concept.jpg`,
  external_link: 'https://cryptowords.art',
  // seller_fee_basis_points: 100, // Indicates a 1% seller fee.
  // fee_recipient: '0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721' // Where seller fees will be paid to.
};

const resContracts = (req, res) => {
  res.status(200).json(data);
};

export default resContracts;