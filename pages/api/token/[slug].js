import { connectToDatabase } from '../../../lib/mongodb';
import createWord from '../../../lib/create-word';
import createImg from '../../../lib/create-img';

const serveSlug = async (req, res) => {
  const { slug, type } = req.query;
  const { db } = await connectToDatabase();
  const collection = db.collection('words');
  const query = { slug: slug.trim() };

  if (req.method === 'PUT') {
    // const updateDoc = {
    //   $set: { ...req.body }
    // };
    // const result = await collection.updateOne(query, updateDoc, { returnOriginal: false });
    // if (result.matchedCount === 0) {
    //   res.status(404).send('Word could not be found');
    // } else if (result.modifiedCount === 1) {
    //   res.status(200).json('ok');
    // }
  } else if (req.method === 'DELETE') {
    // try {
    //   await collection.deleteOne(query);
    //   return res.status(204).send();
    // } catch(error) {
    //   return res.status(500).send(error);
    // }
  } else {
    let word = await collection.findOne(query);
    
    if (!word) {
      const newWord = await createWord(slug);

      if (typeof newWord === 'object') {
        const newWordImage = await createImg(newWord.slug, newWord.name, newWord.description);
        newWord.image = newWordImage.Location;
        const  newDoc = await collection.insertOne(newWord);
        word = await collection.findOne(newDoc.insertedId);
      } else {
        return res.status(404).json('Word not found');
      }
    } else if (!word.image) {
      const image = await createImg(word.slug, word.name, word.description);
      word.image = image.Location;
      await collection.updateOne({slug: word.slug}, { $set: { image: word.image }}, { returnOriginal: false });
    }

    // FOR TESTING WITHOUT DB
    // const word = await createWord(slug);
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