import slugify from 'slugify';

const mirriamWebsterApi = (word) => {
  const url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.MIRRIAM_WEBSTER_API_KEY}`;
  return fetch(url)
    .then(res => res.json());
};

const wordsApi = (word) => {
  const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`;
  return fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        'x-rapidapi-key': process.env.WORDS_API_KEY
      }
    })
    .then(res => res.json());
}

const createWord = async (word) => {
  const wordLower = word.toLowerCase();
  const slug = slugify(wordLower);

  const doc = {
    // word: wordLower,
    slug,
    name: wordLower,
    external_url: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.DOMAIN}/word/${slug}`,
    createdAt: new Date(),
    rawData: {}
  };

  try {
    const wordMirriamWebsterApi = await mirriamWebsterApi(slug);
    const wordWordsApi = await wordsApi(slug);
    
    if (wordWordsApi.definitions?.length > 0 || wordMirriamWebsterApi[0]?.meta) {

      if (wordWordsApi.definitions?.length > 0) {
        doc.rawData.wordsApi = wordWordsApi;
      }

      if (wordMirriamWebsterApi[0]?.meta) {
        doc.rawData.mirriamWebster = wordMirriamWebsterApi[0];
      }

      doc.description = doc.rawData.mirriamWebster?.shortdef?.length > 0 ? doc.rawData.mirriamWebster.shortdef.join(', ')
                      : doc.rawData.wordWordsApi?.definitions?.length > 0 ? doc.rawData.wordWordsApi.definitions.join(', ')
                      : '';

      return doc;
    } else {
      throw 'no data from api';
    }
  } catch(error) {
    // console.error(error);
    return error;
  }
};

export default createWord;