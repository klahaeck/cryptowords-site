import contracts from '../../../data/contracts';

const resContracts = (req, res) => {
  // const { slug } = req.query;
  const contract = contracts['cryptowords'];
  if (contract) {
    res.status(200).json(contract);
  } else {
    res.status(404).send('Contract could not be found');
  }
};

export default resContracts;