import { connectToDatabase } from './mongodb';
import createWord from './create-word';
import createImg from './create-img';

const getWord = async (slug) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('words');
  const query = { slug: slug.trim().toLowerCase() };
  
  let word = await collection.findOne(query);

  if (!word) {
    const newWord = await createWord(slug);

    if (typeof newWord === 'object') {
      const newWordImage = await createImg(newWord.slug, newWord.name, newWord.description);
      newWord.image = newWordImage.Location;
      const  newDoc = await collection.insertOne(newWord);
      word = await collection.findOne(newDoc.insertedId);
    } else {
      word = newWord;
    }
  } else if (!word.image) {
    const image = await createImg(word.slug, word.name, word.description);
    word.image = image.Location;
    await collection.updateOne({slug: word.slug}, { $set: { image: word.image }}, { returnOriginal: false });
  }

  delete word._id;

  return word;
};

export default getWord;