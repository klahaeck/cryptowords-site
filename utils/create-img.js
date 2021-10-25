// import fs from 'fs';
import { createCanvas } from 'canvas';
import { uploadFile } from './s3-upload';
import crypto from 'crypto';

function wrapText(context, text, x, y, maxWidth, maxHeight, fontSize, fill) {
  const words = text.split(' ');
  let numLines = 1;
  let currentLine = '';

  const lineHeight = fontSize * 1.1;

  for (let n = 0; n < words.length; n++) {
    let testLine = currentLine === '' ? `${words[n]} ` : `${currentLine} ${words[n]} `;
    // let testLine = `${line} ${words[n]} `;
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

const createImg = (_id, word, description) => {
  const width = 1200
  const height = 1200

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  // context.font = 'bold 70pt Helvetica';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = '#000000';

  const text = word;

  let fontsize = 300;
  const maxWidth = canvas.width - (canvas.width * .1);

  // lower the font size until the text fits the canvas
  do {
    fontsize--;
    context.font = `bold ${fontsize}px Helvetica`;
  } while (context.measureText(text).width > maxWidth);
  
  context.fillText(text, 600, 120);


  let definitionFontSize = 70;
  context.textAlign = 'left';

  do {
    definitionFontSize--;
    context.font = `${definitionFontSize}px Helvetica`;
  } while (wrapText(context, description, (canvas.width - maxWidth) / 2, 500, maxWidth, 640, definitionFontSize, false));

  wrapText(context, description, (canvas.width - maxWidth) / 2, 500, maxWidth, 640, definitionFontSize, true);

  // context.fillStyle = '#fff'
  // context.font = 'bold 30pt Menlo'
  // context.fillText('flaviocopes.com', 600, 530)

  const buffer = canvas.toBuffer('image/png');

  // const pth = path.join('/tmp', `${_id}.png`);
  // const fileWriteStream = fs.createWriteStream(pth);
  // fs.writeFileSync(`./public/images/${_id}.png`, buffer);

  const uploadPromise = new Promise((resolve, reject) => {
    const randomString = crypto.randomBytes(4).toString('hex');
    uploadFile(buffer, `${process.env.NODE_ENV}/${_id}-${randomString}.png`, function(err, data) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  return uploadPromise;
}

export default createImg;