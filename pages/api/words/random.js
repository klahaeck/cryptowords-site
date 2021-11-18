import words from '../../../words.json';

const getRandomWord = async (req, res) => {
  const word = words[Math.floor(Math.random() * words.length)];
  return res.status(200).json({name:word});
};

export default getRandomWord;