import getWord from '../../../lib/get-word';

const serveSlug = async (req, res) => {
  const { slug, type } = req.query;

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
    let word = await getWord(slug);
    
    if (typeof word !== 'object') {
      return res.status(404).json();
    }

    if (type === 'full') {
      return res.status(200).json(word);
    } else {
      const { slug, name, description, image, external_url } = word;
      return res.status(200).json({ slug, name, description, image, external_url });
    }
  }
};

export default serveSlug;