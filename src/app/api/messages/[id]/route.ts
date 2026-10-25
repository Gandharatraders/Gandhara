import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const messages = await getMessages();
    
    const messageIndex = messages.findIndex((m: any) => m.id === id);
    
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await saveMessages(messages);
    
    return NextResponse.json(messages[messageIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await getMessages();
    const filteredMessages = messages.filter((m: any) => m.id !== id);
    
    await saveMessages(filteredMessages);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
