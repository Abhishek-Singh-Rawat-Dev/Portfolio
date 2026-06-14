import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields' },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({ name, email, message });
    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
