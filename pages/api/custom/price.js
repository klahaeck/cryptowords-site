import { toInteger } from 'lodash';
import { connectToDatabase } from '../../../lib/mongodb';

const discounted = async (req, res) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('customPrices');

  if (req.method === 'POST') {
    const { chainId, word, price } = req.body;
    try {
      await collection.insertOne({ chainId, word, price });
      return res.status(201).json({ chainId, word, price });
    } catch(error) {
      return res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    const { chainId, word } = req.body;
    try {
      await collection.deleteMany({ chainId, word });
      return res.status(204).send();
    } catch(error) {
      return res.status(500).send(error);
    }
  } else {
    const { chainId } = req.query;
    const prices = await collection.find({ chainId: parseInt(chainId) }).toArray();
    return res.status(200).json(prices);
  }
};

export default discounted;