exports.findById = (id) => {
    return new Promise((resolve, reject) =>
      resolve(JSON.parse(JSON.stringify(products)).find(product =>
        product._id == id)
      )
    );
  }