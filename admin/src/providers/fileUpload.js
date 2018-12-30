
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
  }))
  reader.onerror = reject;
});


const addUploadFeature = requestHandler => (type, resource, params) => {
  if (type === "UPDATE" || type === "CREATE") {
    // only freshly dropped pictures are instance of File

    if (hasFileUpload(params)) {

      // C'e' un upload, quindi converto il body in un FormData;
      // let formData = new FormData();
      let formData = new FormData();
      // ora devo prendere il campo (o i campi) dei file, che possono essere singoli o array (multi-file upload)
      return Promise.all(Object.keys(params.data).map( async key => {

        const param = params.data[key];
        if (isMultiUpload(param)) {
          // only freshly dropped pictures are instance of File
          // const formerPictures = param.filter(p => !(p.rawFile instanceof File));
          const newPictures = param.filter(p => (p.rawFile instanceof File));
      //    debugger; // eslint-disable-line
          await Promise.all(newPictures.map(async (picture) => {
            //    debugger; // eslint-disable-line
                const picture64 = await convertToFileObject(picture);
                console.log(picture);
                formData.append(`${key}`, picture64);
              })
          );



        } else if (param.rawFile && param.rawFile instanceof File)  {

          // Single file upload
          const picture64 = await convertToFileObject(param);
          formData.append(key, picture64);

        } else {
          if (typeof params.data[key] === "object") {
            formData.append(key, JSON.stringify(params.data[key]));
          } else {
            formData.append(key, params.data[key]);

          }


        }

      }))

          .then(() => {
            return requestHandler(type, resource, {
              ...params,
              data: formData,
            })
          });




      /*  if (key !== 'picture') {
          if (typeof params.data[key] === "object") {
            formData.append(key, JSON.stringify(params.data[key]));
          } else {
            formData.append(key, params.data[key]);

          }
        }
      });

      return convertToFileObject(params.data.picture)
        .then(fileObject => {

          formData.append('picture', fileObject);

          return requestHandler(type, resource, {
          ...params,
          data: formData
          })
      });*/
    }


  }
  return requestHandler(type, resource, params);

};

/**
 *
 * @param params
 * @returns {boolean} Restituisce True se nei params c'è un file caricato
 */
const hasFileUpload = params => {

  for (const key of Object.keys(params.data)) {

    const param = params.data[key];
    if (isMultiUpload(param) || (param.rawFile && param.rawFile instanceof File)) return true;
    continue;
  }


  return false;
};
const isMultiUpload = param => {
  if (param.filter) {
    // L'oggetto è un array
    return param.filter(field => field && field.rawFile && field.rawFile instanceof File).length > 0;

  }

  return false;
};

export default addUploadFeature;
