# 🤖 AI Chatbot using Gemini API

A smart, clean chatbot built with **Next.js 15**, **TypeScript**, and the **Gemini API** (Flash model). It allows users to ask questions and even upload PDFs to get summaries or intelligent answers based on document content.

---

## 🌟 Features

* 💬 Chat interface built with **ShadCN UI** and **TailwindCSS**
* 📄 Upload PDF files and extract meaningful content
* 🧠 Contextual conversation powered by **Gemini 2.0 Flash API**
* 🔍 Summarization, translation, Q\&A from documents
* ✅ PDF.js integration via CDN (no bundler issues)
* ⚡ Seamless user experience with scroll-to-bottom and typing indicators

---

## 📁 Project Structure

```
mychatbot-project/
├── src/
│   ├── app/
│   │   └── page.tsx               # Main chatbot logic
│   ├── components/ui/            # UI components from ShadCN
│   ├── lib/utils.ts              # Utility function (cn)
│   └── types/                    # Type declarations
├── public/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

---

## 🚀 How to Run Locally

```bash
# 1. Clone the project
https://github.com/YOUR_USERNAME/myaichatbot.git

# 2. Move into project directory
cd myaichatbot

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

> ⚠️ Make sure you have a working **Gemini API Key** from Google Cloud Console
> Replace it inside `page.tsx` where the fetch call is made.

---

## 🧪 Usage

1. Type "hi" → Bot responds politely
2. Ask "Who developed you?" → Bot credits Anushka Midda
3. Upload any `.pdf` file → Bot will parse the content
4. Ask "Summarize this PDF" → Bot generates a short summary

You can also ask contextual questions after uploading!

---

## 🙏 Special Thanks

Huge gratitude to the **AI Wallah** Team 💙

> This project was built as part of a learning journey and showcases real-world application of AI APIs for BCA and CS/IT students.

---

## 📄 License

This project is open-source and MIT-licensed. Feel free to contribute or fork!

---

> Made with ❤️ by Anushka Midda
