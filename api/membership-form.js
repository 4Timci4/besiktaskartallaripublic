// E-posta API'sini kullanarak üyelik formu isteklerini yönlendir
const emailHandler = require('./email');

module.exports = async (req, res) => {
  // url'i değiştirerek email handler'a üyelik formu olduğunu belirt
  req.url = '/send-membership-form';
  return emailHandler(req, res);
}; 