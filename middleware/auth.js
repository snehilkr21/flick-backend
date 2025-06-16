const auth = (req, res, next) => {
  const token = "xyz";
  const authrize = token === "xyz";
  if (!authrize) {
    res.status(401).send("aunthorized");
  } else {
    next();
  }
};

module.exports = {
  auth,
};
