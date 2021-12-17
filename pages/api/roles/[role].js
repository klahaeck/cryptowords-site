import { connectToDatabase } from '../../../lib/mongodb';

const discounted = async (req, res) => {
  const { role } = req.query;
  const { db } = await connectToDatabase();
  const collection = db.collection('roles');

  if (req.method === 'POST') {
    const { chainId, address } = req.body;
    try {
      await collection.insertOne({ role, chainId, address });
      return res.status(201).json({ role, chainId, address });
    } catch(error) {
      return res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    const { chainId, address } = req.body;
    try {
      await collection.deleteMany({ role, chainId, address });
      return res.status(204).send();
    } catch(error) {
      return res.status(500).send(error);
    }
  } else {
    const { chainId } = req.query;
    const users = await collection.find({ role, chainId }).toArray();
    return res.status(200).json(users);
  }
};

export default discounted;