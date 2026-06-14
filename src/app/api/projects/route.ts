import '@/lib/env';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sql } from '@vercel/postgres';
import { initDatabase } from '@/lib/postgres';

// GET: List all projects
export async function GET() {
  try {
    await initDatabase();
    const result = await sql`
      SELECT * FROM projects 
      ORDER BY sort_order ASC, created_at DESC;
    `;
    
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Projects GET API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new project (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.email !== 'abhishekpersona1402@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, category, tags, codeLink, icon, order } = data;

    if (!title || !description || !category || !codeLink) {
      return NextResponse.json(
        { error: 'Title, description, category, and codeLink are required fields' },
        { status: 400 }
      );
    }

    await initDatabase();
    const pgTags = tags && Array.isArray(tags)
      ? `{${tags.map(t => `"${t}"`).join(',')}}`
      : '{}';

    const result = await sql`
      INSERT INTO projects (title, description, category, tags, code_link, icon, sort_order)
      VALUES (${title}, ${description}, ${category}, ${pgTags}, ${codeLink}, ${icon || 'fas fa-code'}, ${order || 0})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Projects POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
