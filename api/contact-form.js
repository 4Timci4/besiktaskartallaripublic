// E-posta API'sini kullanarak iletişim formu isteklerini yönlendir
const emailHandler = require('./email');

module.exports = async (req, res) => {
  // url'i değiştirerek email handler'a iletişim formu olduğunu belirt
  req.url = '/send-contact-form';
  return emailHandler(req, res);
}; 