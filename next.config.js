const withImages = require('next-images')

module.exports = {
  ...withImages(),
    future: {
      webpack5: true,
    },
    images: {
      loader: 'imgix',
      path: 'https://overbooked.imgix.net/',
    },
  }