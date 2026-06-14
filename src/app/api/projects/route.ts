import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { Project } from '@/models/Project';

// GET: List all projects
export async function GET() {
  try {
    await dbConnect();
    let projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    
    // Seed default projects if DB is empty
    if (projects.length === 0) {
      const defaultProjects = [
        {
          title: "Mini SQL Compiler",
          description: "A Compiler Design academic project implementing lexical, syntax, and semantic analysis phases. Built in C++ to parse, validate, and execute simple SQL-like relational database queries.",
          category: "cpp",
          tags: ["C++", "Compilers", "Lex & Yacc"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/mini-sql-compiler",
          icon: "fas fa-terminal",
          order: 1
        },
        {
          title: "Student Tracking System",
          description: "A collaborative tracking and analytics system developed within StudentTrackingOrg. Designed to monitor student performance metric trends, attendance patterns, and core study schedules.",
          category: "python",
          tags: ["Python", "Data Analysis", "MySQL"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/student-tracking-system",
          icon: "fas fa-chart-line",
          order: 2
        },
        {
          title: "E-Commerce Website",
          description: "An interactive full storefront template featuring dynamically rendered products, search bar query filtering, interactive cart additions, and responsive grid layouts.",
          category: "web",
          tags: ["JavaScript", "HTML5", "Vanilla CSS"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/E-Commerce-Website",
          icon: "fas fa-shopping-cart",
          order: 3
        },
        {
          title: "Multi-threaded Web Crawler",
          description: "A script to scan and extract metadata elements from websites concurrently. Includes speed limit throttling to respect target site bandwidth constraints and exports outputs to CSV formats.",
          category: "python",
          tags: ["Python", "BeautifulSoup", "Scrapy"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/Web_Crawler",
          icon: "fas fa-spider",
          order: 4
        },
        {
          title: "Titanic Survival Project",
          description: "An end-to-end Machine Learning project using classifier algorithms to forecast individual passenger survival chances based on demographics, ticket class, and details.",
          category: "python",
          tags: ["HTML", "Scikit-Learn", "Pandas"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/Titanic_Survival_Project",
          icon: "fas fa-ship",
          order: 5
        },
        {
          title: "Resume Portfolio Builder",
          description: "A full-stack resume application using React architectures and dynamic templating. Built on modern database architectures featuring visual editing control panels.",
          category: "web",
          tags: ["Next.js 15", "TypeScript", "PostgreSQL"],
          codeLink: "https://github.com/Abhishek-Singh-Rawat-Dev/MyResume",
          icon: "far fa-file-alt",
          order: 6
        }
      ];
      projects = await Project.insertMany(defaultProjects);
    }
    
    return NextResponse.json({ success: true, data: projects });
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

    await dbConnect();
    const data = await req.json();

    if (!data.title || !data.description || !data.category || !data.codeLink) {
      return NextResponse.json(
        { error: 'Title, description, category, and codeLink are required fields' },
        { status: 400 }
      );
    }

    const newProject = await Project.create(data);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    console.error('Projects POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
