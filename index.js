// import express from "express";
// import bodyParser from "body-parser";
// import axios from "axios";

// const app = express();
// app.use(bodyParser.json());

// // Replace these with your actual values
// const ACCESS_TOKEN =
//   "EAAStLMwI91kBPjvuDVtakRQgZABdsHUu6Q44eG1gxooeFS7soWewBHvvFZBCztjEecEULbFiJxV86USnMzLURL6taOXFWRr3yhkG1u8chWUYgDAWCygF3CKZB8oJE9nk4ULUZBGK4DZAflkqrZCjCFZAB1PdCsgrrEVDaXqNWAfM4DkWWcLJ9l13ZANZCEwXvXAuAVib8SZAWEdWj8reZAkSvDCIKug2QEk8qKZAQJ4ZAUhMHxI2SN6nSyz8Mn1UWvdHVMRUZD";
// const PHONE_NUMBER_ID = "743448555526980";

// // ✅ Webhook verification endpoint
// app.get("/webhook", (req, res) => {
//   const VERIFY_TOKEN = "clinicbotverify"; // use this in Meta console too
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];

//   if (mode && token === VERIFY_TOKEN) {
//     res.status(200).send(challenge);
//   } else {
//     res.sendStatus(403);
//   }
// });

// // ✅ Handle incoming messages
// app.post("/webhook", async (req, res) => {
//   try {
//     const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
//     if (message && message.text) {
//       const from = message.from;
//       const text = message.text.body.toLowerCase();

//       // FAQ keywords
//       const replies = {
//         price: "Our consultation fee is $50.",
//         appointment: "You can visit Mon–Sat, 9 AM to 5 PM.",
//         timings: "Clinic hours are 9 AM – 5 PM, Monday to Saturday.",
//         address: "We’re at 1234 Hill Country Dr, Texas.",
//         doctor: "Dr. John Doe is our lead specialist.",
//         contact: "You can call us at +1 555 123 4567.",
//         service: "We offer weight loss, obesity, and nutrition counseling.",
//         diet: "Our nutritionists create custom diet plans.",
//         booking:
//           "Book your appointment here: https://hillcountryclinic.com/book",
//       };

//       let replyText =
//         "Thank you for reaching out! Our team will contact you shortly.";
//       for (const key in replies) {
//         if (text.includes(key)) {
//           replyText = replies[key];
//           break;
//         }
//       }

//       // Send auto-reply
//       await axios.post(
//         `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
//         {
//           messaging_product: "whatsapp",
//           to: from,
//           text: { body: replyText },
//         },
//         {
//           headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
//         },
//       );
//     }

//     res.sendStatus(200);
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// });

// app.listen(3000, () => console.log("✅ Clinic WhatsApp AutoReply Bot running"));

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Replace with your actual values
const ACCESS_TOKEN =
  "EAAStLMwI91kBPnh2MZB3WpYNdNfV8VTZCpNQ7RTZAYTF1I7STlG9mH2ZBSSyrBZC6JSsjsuQOmZCYT5geSZAHZAFThZAj4AZCCZAEVRBXamnGqzVVZAerFNveYVqYxhjvUILhvenE8CJjPFl4W41Yy3I6O9EYhBaFTPkU3uEqXSZBBC2zVZCMQO5DrYls0kIGqFO6p1jEujwZDZD";

const PHONE_NUMBER_ID = "808372809029790";

// ✅ Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "clinicbotverify";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle incoming messages
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || !message.text) return res.sendStatus(200);

    const from = message.from;
    const text = message.text.body.trim();

    // Define replies for options 1–7
    const replies = {
      1: "🏥 *Clinic Information*\nHill Country Internal Medicine & Weight Loss Center is dedicated to helping patients manage weight, diabetes, and overall health.",
      2: "👨‍⚕️ *Meet Our Doctors*\nDr. John Doe & Dr. Sarah Smith specialize in internal medicine and weight management.",
      3: "📅 *Book Appointment*\nYou can book your appointment online here: https://hillcountryclinic.com/appointment",
      4: "💳 *Supported Insurance*\nWe accept Blue Cross, United Healthcare, Medicare, and many others.",
      5: "📍 *Location*\nWe are located at 1234 Hill Country Dr, New Braunfels, TX.",
      6: "📲 *Social Media Updates*\nFollow us on Facebook & Instagram for health tips and updates.",
      7: "📞 *Contact Us*\nYou can call us at +1 (555) 123-4567 or reply here for support.",
    };

    // Main menu message
    const mainMenu = `Hello! Welcome to Hill Country Internal Medicine & Weight Loss — New Braunfels, TX.
How can we help you today?
Please type an option below:
1️⃣ Clinic Information
2️⃣ Meet Our Doctors
3️⃣ Appointment
4️⃣ Supported Insurance
5️⃣ Location
6️⃣ Social Media Updates
7️⃣ Contact Us`;

    // Determine reply
    let replyText = replies[text] || mainMenu;

    // Send WhatsApp reply
    await axios.post(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: replyText },
      },
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      },
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () =>
  console.log("✅ Clinic WhatsApp AutoReply Bot running on port 3000"),
);