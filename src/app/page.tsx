import dbConnect from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { Profile } from '@/models/Profile';
import PortfolioClient from '@/components/PortfolioClient';

export const revalidate = 0; // Disable static cache to reflect admin updates instantly

export default async function Home() {
  await dbConnect();

  // 1. Fetch Profile (Seed if empty)
  let dbProfile = await Profile.findOne({});
  if (!dbProfile) {
    const defaultProfile = {
      title: "Software Engineer",
      bio: "I am a second-year B.Tech student from India, diving into everything tech-related—from crafting sleek web apps to wrestling with data structures. Fueled by curiosity and a zest for learning, I love turning bright ideas into reality, one project at a time!",
      subBio: "Currently on a journey to master C++ development, algorithms, AI, and machine learning architectures.",
      projectsCount: "15+",
      solvedCount: "500+",
      educationYear: "2nd",
      leetcodeUsername: "user1420abhi",
      leetcodeSolved: "350+",
      leetcodeRating: "Top 15%",
      leetcodeMaxDifficulty: "Medium",
      leetcodeStreak: "Active",
      gfgUsername: "scientinz48",
      gfgSolved: "250+",
      gfgScore: "900+",
      gfgSkills: "DSA",
      gfgRank: "College Rank #24",
      githubUsername: "Abhishek-Singh-Rawat-Dev",
      githubRepos: "13",
      githubCommits: "300+",
      githubForks: "4",
      githubContributions: "Active"
    };
    dbProfile = await Profile.create(defaultProfile);
  }

  // 2. Fetch Projects (Seed if empty)
  let dbProjects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  if (dbProjects.length === 0) {
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
    dbProjects = await Project.insertMany(defaultProjects);
  }

  // 3. Serialize data for passing to Client Component
  const profile = JSON.parse(JSON.stringify(dbProfile));
  const projects = JSON.parse(JSON.stringify(dbProjects));

  return <PortfolioClient initialProfile={profile} initialProjects={projects} />;
}
