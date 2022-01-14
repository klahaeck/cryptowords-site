// import fs from 'fs';
import startCase from 'lodash/startCase';
const { registerFont, createCanvas } = require('canvas');
import { uploadFile } from './s3-upload';
import fonttrick from 'fonttrick';
// import { NFTStorage, File } from 'nft.storage';
// import crypto from 'crypto';

// const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_TOKEN });

const fontPaths = fonttrick();

function wrapText(context, text, x, y, maxWidth, maxHeight, fontSize, fill) {
  const words = text.split(' ');
  let numLines = 1;
  let currentLine = '';

  const lineHeight = fontSize * 1.1;

  for (let n = 0; n < words.length; n++) {
    let testLine = currentLine === '' ? `${words[n]} ` : `${currentLine} ${words[n]} `;
    let testWidth = context.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      if (fill) context.fillText(currentLine, x, y);
      currentLine = `${words[n]} `;
      y += lineHeight;
      numLines++;
    } else {
      currentLine = testLine;
    }
  }
  if (fill) context.fillText(currentLine, x, y);
  
  const tooBig = (numLines * lineHeight) > maxHeight;

  return tooBig;
}

const createImg = async (_id, word, description) => {
  registerFont(fontPaths.InterMedium, { family: 'InterMedium' });
  registerFont(fontPaths.InterRegular, { family: 'InterRegular' });

  const width = 1200
  const height = 1200

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  const canvasShare = createCanvas(1200, 628);
  const contextShare = canvasShare.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  contextShare.fillStyle = '#ffffff';
  contextShare.fillRect(0, 0, 1200, 628);

  // context.font = 'bold 70pt Helvetica';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillStyle = '#000000';

  const text = startCase(word.toLowerCase());

  let fontsize = 300;
  const maxWidth = canvas.width - (canvas.width * .1); // 1080

  // lower the font size until the text fits the canvas
  do {
    fontsize--;
    context.font = `${fontsize}px "InterMedium"`;
  } while (context.measureText(text).width > maxWidth);
  
  context.fillText(text, 60, 230);


  let definitionFontSize = 72;
  context.textAlign = 'left';

  do {
    definitionFontSize--;
    context.font = `${definitionFontSize}px "InterRegular"`;
  } while (wrapText(context, description, (canvas.width - maxWidth) / 2, 500, maxWidth, 640, definitionFontSize, false));

  wrapText(context, description, (canvas.width - maxWidth) / 2, 500, maxWidth, 640, definitionFontSize, true);

  // context.fillStyle = '#fff'
  // context.font = 'bold 30pt Menlo'
  // context.fillText('flaviocopes.com', 600, 530)

  // contextShare.drawImage(canvas, 286, 0, 628, 628); // CENTERED
  contextShare.drawImage(canvas, 0, 0, 628, 628); // LEFT ALIGNED

  const buffer = canvas.toBuffer('image/png');
  const bufferShare = canvasShare.toBuffer('image/png');

  // const pth = path.join('/tmp', `${_id}.png`);
  // const fileWriteStream = fs.createWriteStream(pth);
  // fs.writeFileSync(`./public/images/${_id}.png`, buffer);

  const timestamp = Date.now().valueOf();

  // const metadata = await client.store({
  //   name: _id,
  //   description: text,
  //   image: new File(
  //     [
  //       buffer
  //     ],
  //     `${process.env.NODE_ENV}-${_id}-${timestamp}.png`,
  //     { type: 'image/png' }
  //   ),
  // })
  // console.log(metadata)

  const uploadPromise = new Promise((resolve, reject) => {
    // const randomString = crypto.randomBytes(4).toString('hex');
    uploadFile(buffer, `${process.env.NODE_ENV}/${_id}-${timestamp}.png`, function(err, data) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // resolve(data);
        uploadFile(bufferShare, `${process.env.NODE_ENV}/${_id}-${timestamp}-share.png`, function(err, dataShare) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve({data, dataShare});
          }
        });
      }
    });
  });

  return uploadPromise;
}

export default createImg;