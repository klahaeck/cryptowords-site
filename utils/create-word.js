import createImg from './create-img';
import slugify from 'slugify';

const getFromDictionaryApi = (word) => {
  const url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.MIRRIAM_WEBSTER_API_KEY}`;
  
  return fetch(url)
    .then(res => res.json());
    // .then(json => console.log(json));
};

const createWord = async (word) => {
  const wordLower = word.toLowerCase();
  const slug = slugify(wordLower);

  try {
    const wordFromApi = await getFromDictionaryApi(slug);
    if (wordFromApi[0]?.meta) {
      const { meta, date, shortdef } = wordFromApi[0];
      const apiData = { meta, date, shortdef };
      const description = apiData.shortdef.join(', ');

      const uploadedImage = await createImg(slug, wordLower, description);

      const doc = {
        word: wordLower,
        slug,
        name: wordLower,
        description,
        image: uploadedImage.Location,
        external_url: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/word/${slug}`,
        mirriamData: apiData,
        createdAt: new Date()
      };

      return doc;
    } else {
      throw 'no data fron api';
    }
  } catch(error) {
    console.error(error);
    return error;
  }
};

export default createWord;