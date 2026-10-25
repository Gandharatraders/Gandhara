import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sendContactEmail } from '@/lib/email';

const DATA_FILE = path.join(process.cwd(), 'data', 'messages.json');

// Helper function to read messages
async function getMessages() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write messages
async function saveMessages(messages: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2));
}

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = await getMessages();
    
    const newMessage = {
      ...body,
      id: Date.now().toString(),
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    await saveMessages(messages);
    
    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const emailResult = await sendContactEmail(body);
      if (!emailResult.success) {
        console.error('Email failed to send, but message was saved:', emailResult.error);
      }
    } else {
      console.warn('RESEND_API_KEY not set - email not sent, but message was saved');
    }
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
