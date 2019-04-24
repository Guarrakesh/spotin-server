exports.ImageVersion = `
  type ImageVersion {
    url: String!
    width: Int
    height: Int
    
  }
  
  type Image {
    versions: [ImageVersion]
    ext: String
    fileName: String
    mime: String
    order: String
  }
`;