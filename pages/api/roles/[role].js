import { connectToDatabase } from '../../../lib/mongodb';

const discounted = async (req, res) => {
  const { role } = req.query;
  const { db } = await connectToDatabase();
  const collection = db.collection('roles');

  if (req.method === 'POST') {
    const { address } = req.body;
    try {
      await collection.insertOne({ role, address });
      return res.status(201).json({ role, address });
    } catch(error) {
      return res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    const { address } = req.body;
    try {
      await collection.deleteOne({ role, address });
      return res.status(204).send();
    } catch(error) {
      return res.status(500).send(error);
    }
  } else {
    const users = await collection.find({ role }).toArray();
    return res.status(200).json(users);
  }
};

export default discounted;