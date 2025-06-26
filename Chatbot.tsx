// FILE: src/components/Chatbot.tsx

'use client'

// ✅ PDF.js Worker Import (safe for Webpack)
// @ts-expect-error: No types available
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url'

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Paperclip } from 'lucide-react'

interface Message {
  sender: 'user' | 'ai'
  text: string
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pdfText, setPdfText] = useState('')

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      GlobalWorkerOptions.workerSrc = workerSrc
      const typedArray = new Uint8Array(reader.result as ArrayBuffer)
      const pdf = await getDocument({ data: typedArray }).promise

      let extractedText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item: any) => item.str).join(' ')
        extractedText += pageText + '\n'
      }

      setPdfText(extractedText)
      alert('✅ PDF loaded successfully!')
    }

    reader.readAsArrayBuffer(file)
  }

  const simulateGeminiResponse = (input: string) => {
    return input.split('').reverse().join('')
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const aiResponse: Message = {
        sender: 'ai',
        text: simulateGeminiResponse(input)
      }
      setMessages(prev => [...prev, aiResponse])
    }, 500)

    setInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center mb-2">My Chatbot</h1>

        <Card className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 space-y-2">
          {messages.map((msg, idx) => (
            <CardContent
              key={idx}
              className={`text-sm p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
              }`}
            >
              <span className="font-semibold">
                {msg.sender === 'user' ? 'You' : 'AI'}:
              </span>{' '}
              {msg.text}
            </CardContent>
          ))}
        </Card>

        <div className="flex gap-2 items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
            <Paperclip className="w-5 h-5 text-gray-600 hover:text-black" />
          </label>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
