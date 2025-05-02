const sharp = require('sharp');
const path  = require('path');

module.exports = async function resize(inputPath, outputDir) {
  const sizes    = [320, 640, 1024];
  const qualities = { low: 40, med: 70, high: 90 };
  const ext      = path.extname(inputPath);
  const name     = path.basename(inputPath, ext);
  const variants = {};

  await Promise.all(sizes.map(async width => {
    for (const [label, q] of Object.entries(qualities)) {
      const filename   = `${name}-${width}w-${label}.jpg`;
      const outputPath = path.join(outputDir, filename);
      await sharp(inputPath)
        .resize({ width })
        .jpeg({ quality: q })
        .toFile(outputPath);
      variants[`${width}w-${label}`] = outputPath;
    }
  }));

  return variants;
};
