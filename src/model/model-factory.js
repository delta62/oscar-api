exports.modelFactory = function modelFactory(db, schema, name) {
  return db.model(name, schema);
};
