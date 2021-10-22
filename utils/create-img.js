// import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { uploadFile } from './s3-upload';

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    let testLine = line === '' ? `${words[n]} ` : `${line} ${words[n]} `;
    // let testLine = `${line} ${words[n]} `;
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = `${words[n]} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
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

  
  context.font = '70px Helvetica';
  context.textAlign = 'left';
  wrapText(context, description, (canvas.width - maxWidth) / 2, 500, maxWidth, 64);

  // context.fillStyle = '#fff'
  // context.font = 'bold 30pt Menlo'
  // context.fillText('flaviocopes.com', 600, 530)

  const buffer = canvas.toBuffer('image/png');

  // const pth = path.join('/tmp', `${_id}.png`);
  // const fileWriteStream = fs.createWriteStream(pth);
  // fs.writeFileSync(`./public/images/${_id}.png`, buffer);

  const uploadPromise = new Promise((resolve, reject) => {
    uploadFile(buffer, `${process.env.NODE_ENV}/${_id}.png`, function(err, data) {
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