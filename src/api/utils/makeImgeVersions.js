
const _imageSizes = [
  { width: 640, height: 350 },
  { width: 768, height: 432 },
  { width: 320, height: 180 },
];

module.exports = function(basePath, fileName, imageSizes) {
  if (!imageSizes)
    imageSizes = _imageSizes;
  const _basePath = basePath.replace(/^\/|\/$/g, ''); // Rimuovi i trailing e leading slash
  const _fileName = fileName.replace(/^\/|\/$/g, '');

  const versions = [];
  imageSizes.forEach(({ width, height }) => {
    versions.push({
      url: `${_basePath}/${width}x${height}/${_fileName}`,
      width,
      height
    });
  });
  return versions;
};

