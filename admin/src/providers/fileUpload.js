
// in addUploadFeature.js
/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
 const convertToFileObject = file => new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsArrayBuffer(file.rawFile);

     reader.onload = () => resolve(new File([reader.result], file.title, {
       type: file.rawFile.type
     }));
     reader.onerror = reject;
 });

// Per ora gestisce l'upload di una singola immagine
const addUploadFeature = requestHandler => (type, resource, params) => {
  if (type === "UPDATE" || type === "CREATE") {
    // only freshly dropped pictures are instance of File
    params.data && console.log(Object.keys(params.data));
    if (params.data.picture) {
      // C'e' un upload, quindi converto il body in un FormData;
      let formData = new FormData();

      Object.keys(params.data).forEach(key => {
        if (key !== 'picture');
          formData.append(key, params.data[key]);
      });

      return convertToFileObject(params.data.picture)
        .then(fileObject => {

          formData.append('picture', fileObject);

          return requestHandler(type, resource, {
          ...params,
          data: formData
          })
      });
    }
  }

  return requestHandler(type, resource, params);
}

export default addUploadFeature;
