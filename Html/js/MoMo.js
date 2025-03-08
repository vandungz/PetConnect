// MoMo.js
const axios = require("axios");
const crypto = require("crypto");

async function createMoMoPayment({ amount = "50000", orderInfo = "pay with MoMo" }) {
  try {
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640x08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const redirectUrl = "https://momo.vn/return"; // Giả lập
  const ipnUrl = "https://callback.url/notify"; // Giả lập
  const requestType = "captureWallet";
  const extraData = ""; // Nếu không có dữ liệu phụ

  // Tạo raw signature theo định dạng yêu cầu của MoMo
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  // Tạo chữ ký HMAC SHA256
  const signature = crypto.createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

  // Đối tượng gửi đến MoMo
  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount: String(amount),
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'en'
  };

  // Gọi API MoMo
  const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
    headers: { 'Content-Type': 'application/json' }
  });
  return { payUrl: response.data.payUrl, orderId };
  } catch (error) {
    
 }
}

console.log("MoMo response data:", response.data);

module.exports = { createMoMoPayment };
