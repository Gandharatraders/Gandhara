import { NextResponse } from 'next/server';
import { getMessages, createMessage } from '@/lib/supabase-db';
import { sendContactEmail } from '@/lib/email';

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newMessage = {
      ...body,
      id: Date.now().toString(),
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const message = await createMessage(newMessage);
    
    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const emailResult = await sendContactEmail(body);
      if (!emailResult.success) {
        console.error('Email failed to send, but message was saved:', emailResult.error);
      }
    } else {
      console.warn('RESEND_API_KEY not set - email not sent, but message was saved');
    }
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
