import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sql, initDatabase } from '@/lib/postgres';

function toCamelCaseMessage(dbRow: any) {
  return {
    _id: dbRow.id, // Maps Postgres serial ID to _id for React keys consistency
    name: dbRow.name,
    email: dbRow.email,
    message: dbRow.message,
    createdAt: dbRow.created_at
  };
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user?.email !== 'abhishekpersona1402@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();
    const result = await sql`
      SELECT * FROM contacts 
      ORDER BY created_at DESC;
    `;
    
    const formattedMessages = result.rows.map(toCamelCaseMessage);
    return NextResponse.json({ success: true, data: formattedMessages });
  } catch (error: any) {
    console.error('Messages GET API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
