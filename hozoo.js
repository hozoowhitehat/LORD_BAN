const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// WhatsApp API URL
const url = "https://www.whatsapp.com/contact/noclient";

// Headers
const headers = {
 "Host": "www.whatsapp.com",
 "Cookie": "wa_lang_pref=ar; wa_ul=f01bc326-4a06-4e08-82d9-00b74ae8e830; wa_csrf=HVi-YVV_BloLmh-WHL8Ufz",
 "Sec-Ch-Ua-Platform": '"Linux"',
 "Accept-Language": "en-US,en;q=0.9",
 "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
 "Sec-Ch-Ua-Mobile": "?0",
 "X-Asbd-Id": "129477",
 "X-Fb-Lsd": "AVpbkNjZYpw",
 "User-Agent": "Mozilla/5.0 (Windows NT10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36",
 "Content-Type": "application/x-www-form-urlencoded",
 "Accept": "*/*",
 "Origin": "https://www.whatsapp.com",
 "Sec-Fetch-Site": "same-origin",
 "Sec-Fetch-Mode": "cors",
 "Sec-Fetch-Dest": "empty",
 "Referer": "https://www.whatsapp.com/contact/noclient?",
 "Accept-Encoding": "gzip, deflate, br"
};

// Data
const data = {
 "country_selector": "",
 "email": "", 
 "email_confirm": "", 
 "phone_number": "", 
 "platform": "",
 "your_message": "",
 "step": "articles",
 "__user": "0",
 "__a": "",
 "__req": "",
 "__hs": "20110.BP%3Awhatsapp_www_pkg.2.0.0.0.0",
 "dpr": "1",
 "__ccg": "UNKNOWN",
 "__rev": "",
 "__s": "ugvlz3%3A6skj2s%3A4yux6k",
 "__hsi": "",
 "__dyn": "7xeUmwkHg7ebwKBAg5S1Dxu13wqovzEdEc8uxa1twYwJw4BwUx60Vo1upE4W0OE3nwaq0yE1VohwnU14E9k2C0iK0D82Ixe0EUjwdq1iwmE2ewnE2Lw5XwSyES0gq0Lo6-1Fw4mwr81UU7u1rwGwbu",
 "__csr": "",
 "lsd": "AVpbkNjZYpw",
 "jazoest": ""
};

const readlineInterface = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

// Function to validate phone number
function validatePhoneNumber(phoneNumber) {
 const phoneNumberPattern = /^\+\d{1,4}\d{10,12}$/;
 return phoneNumberPattern.test(phoneNumber);
}

// Function to read file
function readFile(filename) {
 return new Promise((resolve, reject) => {
 fs.readFile(filename, 'utf8', (err, data) => {
 if (err) {
 reject(err);
 } else {
 resolve(JSON.parse(data));
 }
 });
 });
}

// Function to send request
async function sendRequest(phoneNumber, choice) {
 try {
 // Baca file message_ban_whatsapp.json atau message_unban_whatsapp.json
 let fileData;
 if (choice === 'ban') {
 fileData = await readFile('message_ban_whatsapp.json');
 } else if (choice === 'unban') {
 fileData = await readFile('message_unban_whatsapp.json');
 } else {
 console.log('Pilihan tidak valid');
 return;
 }

 // Update data
 data.phone_number = phoneNumber;
 data.your_message = fileData.message;

 // Kirim request
 const response = await axios.post(url, new URLSearchParams(data).toString(), { headers });
 console.log(`Request berhasil dikirim dengan status code ${response.status}`);
 } catch (error) {
 console.error(error);
 }
}

// Main
readlineInterface.question('Enter the phone number with country code (e.g. +20123456789): ', async (phoneNumber) => {
 if (!validatePhoneNumber(phoneNumber)) {
 console.log('Nomor telepon tidak valid');
 readlineInterface.close();
 return;
 }

 readlineInterface.question('Do you want to?? (ban/unban): ', async (choice) => {
 readlineInterface.question('Enter the number of requests to send: ', async (numRequests) => {
 const numRequestsInt = parseInt(numRequests);
 if (isNaN(numRequestsInt) || numRequestsInt <=0) {
 console.log('Mohon masukkan angka yang valid');
 readlineInterface.close();
 return;
 }

 for (let i =0; i < numRequestsInt; i++) {
 await sendRequest(phoneNumber, choice);
 }
 readlineInterface.close();
 });
 });
});
