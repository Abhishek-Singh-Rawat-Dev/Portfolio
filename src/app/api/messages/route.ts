import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user?.email !== 'abhishekpersona1402@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Messages GET API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
