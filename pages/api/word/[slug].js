import { connectToDatabase } from '../../../utils/mongodb';
import CreateWord from '../../../utils/create-word';

const serveSlug = async (req, res) => {
  const { slug, type } = req.query;
  const { db } = await connectToDatabase();
  const collection = db.collection('words');
  const query = { slug };

  if (req.method === 'PUT') {
    const updateDoc = {
      $set: { ...req.body }
    };
    const result = await collection.updateOne(query, updateDoc, { returnOriginal: false });
    if (result.matchedCount === 0) {
      res.status(404).send('Word could not be found');
    } else if (result.modifiedCount === 1) {
      res.status(200).json('ok');
    }
  } else {
    let word = await collection.findOne(query);
    
    if (!word) {
      const newWord = await CreateWord(slug);

      if (typeof newWord === 'object') {
        const  newDoc = await collection.insertOne(newWord);
        word = await collection.findOne(newDoc.insertedId);
      } else {
        return res.status(404).json('Word not found');
      }
    }

    // FOR TESTING WITHOUT DB
    // const word = await CreateWord(slug);
    // console.log(word);

    if (type === 'full') {
      res.status(200).json(word);
    } else {
      const { slug, name, description, image, external_url } = word;
      res.status(200).json({ slug, name, description, image, external_url });
    }
  }
};

export default serveSlug;