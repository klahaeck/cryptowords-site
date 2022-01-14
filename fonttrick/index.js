module.exports = function fonttrick() {
  const fs = require('fs')
  const path = require('path')
  const InterRegular = require.resolve('./fonts/inter/Inter-Regular.ttf')
  const InterMedium = require.resolve('./fonts/inter/Inter-Medium.ttf')
  const { COPYFILE_EXCL } = fs.constants;
  const { COPYFILE_FICLONE } = fs.constants;

  //const pathToRoboto = path.join(process.cwd(), 'node_modules/fonttrick/Roboto-Regular.ttf')

  try {
    if (fs.existsSync('/tmp/Inter-Regular.ttf')) {
      console.log("InterRegular lives in tmp!!!!")
    } else {
      fs.copyFileSync(InterRegular, '/tmp/Inter-Regular.ttf', COPYFILE_FICLONE | COPYFILE_EXCL)
    }
    if (fs.existsSync('/tmp/Inter-Medium.ttf')) {
      console.log("InterMedium lives in tmp!!!!")
    } else {
      fs.copyFileSync(InterMedium, '/tmp/Inter-Medium.ttf', COPYFILE_FICLONE | COPYFILE_EXCL)
    }
  } catch (err) {
    console.error(err)
  }

  return {
    InterRegular: '/tmp/Inter-Regular.ttf',
    InterMedium: '/tmp/Inter-Medium.ttf'
  };
};