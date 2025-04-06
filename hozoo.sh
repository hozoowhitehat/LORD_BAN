#!/bin/bash

# WhatsApp API URL
url="https://www.whatsapp.com/contact/noclient"

# Headers
headers=(
  "Host: www.whatsapp.com"
  "Cookie: wa_lang_pref=ar; wa_ul=f01bc326-4a06-4e08-82d9-00b74ae8e830; wa_csrf=HVi-YVV_BloLmh-WHL8Ufz"
  "Sec-Ch-Ua-Platform: \"Linux\""
  "Accept-Language: en-US,en;q=0.9"
  "Sec-Ch-Ua: \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\""
  "Sec-Ch-Ua-Mobile: ?0"
  "X-Asbd-Id: 129477"
  "X-Fb-Lsd: AVpbkNjZYpw"
  "User-Agent: Mozilla/5.0 (Windows NT10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36"
  "Content-Type: application/x-www-form-urlencoded"
  "Accept: */*"
  "Origin: https://www.whatsapp.com"
  "Sec-Fetch-Site: same-origin"
  "Sec-Fetch-Mode: cors"
  "Sec-Fetch-Dest: empty"
  "Referer: https://www.whatsapp.com/contact/noclient?"
  "Accept-Encoding: gzip, deflate, br"
)

# Data
data=(
  "country_selector="
  "email="
  "email_confirm="
  "phone_number="
  "platform="
  "your_message="
  "step=articles"
  "__user=0"
  "__a="
  "__req="
  "__hs=20110.BP%3Awhatsapp_www_pkg.2.0.0.0.0"
  "dpr=1"
  "__ccg=UNKNOWN"
  "__rev="
  "__s=ugvlz3%3A6skj2s%3A4yux6k"
  "__hsi="
  "__dyn=7xeUmwkHg7ebwKBAg5S1Dxu13wqovzEdEc8uxa1twYwJw4BwUx60Vo1upE4W0OE3nwaq0yE1VohwnU14E9k2C0iK0D82Ixe0EUjwdq1iwmE2ewnE2Lw5XwSyES0gq0Lo6-1Fw4mwr81UU7u1rwGwbu"
  "__csr="
  "lsd=AVpbkNjZYpw"
  "jazoest="
)

# Function to validate phone number
validate_phone_number() {
  local phone_number=$1
  if [[ $phone_number =~ ^+\d{1,4}\d{10,12}$ ]]; then
    return 0
  else
    return 1
  fi
}

# Function to read file
read_file() {
  local filename=$1
  if [ -f "$filename" ]; then
    cat "$filename" | jq -r '.message'
  else
    echo "File $filename not found"
    exit 1
  fi
}

# Function to send request
send_request() {
  local phone_number=$1
  local choice=$2
  local file_data

  if [ "$choice" = "ban" ]; then
    file_data=$(read_file 'message_ban_whatsapp.json')
  elif [ "$choice" = "unban" ]; then
    file_data=$(read_file 'message_unban_whatsapp.json')
  else
    echo "Pilihan tidak valid"
    return
  fi

  # Update data
  data["phone_number"]=$phone_number
  data["your_message"]=$file_data

  # Send request
  response=$(curl -X POST \
    $url \
    -H "${headers[@]}" \
    -d "${data[@]}")

  echo "Request berhasil dikirim dengan status code $?"
}

# Main
read -p "Enter the phone number with country code (e.g. +20123456789): " phone_number
if ! validate_phone_number "$phone_number"; then
  echo "Nomor telepon tidak valid"
  exit 1
fi

read -p "Do you want to?? (ban/unban): " choice
read -p "Enter the number of requests to send: " num_requests

for ((i=0; i<$num_requests; i++)); do
  send_request "$phone_number" "$choice"
done
