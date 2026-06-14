import { sql } from '@vercel/postgres';

export async function initDatabase() {
  try {
    // 1. Create Contacts Table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create Projects Table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        tags TEXT[] NOT NULL,
        code_link TEXT NOT NULL,
        icon VARCHAR(100) DEFAULT 'fas fa-code',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create Profile Table
    await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        sub_bio TEXT,
        projects_count VARCHAR(50) DEFAULT '15+',
        solved_count VARCHAR(50) DEFAULT '500+',
        education_year VARCHAR(50) DEFAULT '2nd',
        leetcode_username VARCHAR(100) DEFAULT 'user1420abhi',
        leetcode_solved VARCHAR(50) DEFAULT '350+',
        leetcode_rating VARCHAR(50) DEFAULT 'Top 15%',
        leetcode_max_difficulty VARCHAR(50) DEFAULT 'Medium',
        leetcode_streak VARCHAR(50) DEFAULT 'Active',
        gfg_username VARCHAR(100) DEFAULT 'scientinz48',
        gfg_solved VARCHAR(50) DEFAULT '250+',
        gfg_score VARCHAR(50) DEFAULT '900+',
        gfg_skills VARCHAR(50) DEFAULT 'DSA',
        gfg_rank VARCHAR(100) DEFAULT 'College Rank #24',
        github_username VARCHAR(100) DEFAULT 'Abhishek-Singh-Rawat-Dev',
        github_repos VARCHAR(50) DEFAULT '13',
        github_commits VARCHAR(50) DEFAULT '300+',
        github_forks VARCHAR(50) DEFAULT '4',
        github_contributions VARCHAR(50) DEFAULT 'Active'
      );
    `;

    // Seed default Profile if empty
    const profileCheck = await sql`SELECT COUNT(*) FROM profile;`;
    if (parseInt(profileCheck.rows[0].count) === 0) {
      await sql`
        INSERT INTO profile (
          title, bio, sub_bio, projects_count, solved_count, education_year,
          leetcode_username, leetcode_solved, leetcode_rating, leetcode_max_difficulty, leetcode_streak,
          gfg_username, gfg_solved, gfg_score, gfg_skills, gfg_rank,
          github_username, github_repos, github_commits, github_forks, github_contributions
        ) VALUES (
          'Software Engineer',
          'I am a second-year B.Tech student from India, diving into everything tech-related—from crafting sleek web apps to wrestling with data structures. Fueled by curiosity and a zest for learning, I love turning bright ideas into reality, one project at a time!',
          'Currently on a journey to master C++ development, algorithms, AI, and machine learning architectures.',
          '15+', '500+', '2nd',
          'user1420abhi', '350+', 'Top 15%', 'Medium', 'Active',
          'scientinz48', '250+', '900+', 'DSA', 'College Rank #24',
          'Abhishek-Singh-Rawat-Dev', '13', '300+', '4', 'Active'
        );
      `;
    }

    // Seed default Projects if empty
    const projectsCheck = await sql`SELECT COUNT(*) FROM projects;`;
    if (parseInt(projectsCheck.rows[0].count) === 0) {
      const defaultProjects = [
        {
          title: "Mini SQL Compiler",
          description: "A Compiler Design academic project implementing lexical, syntax, and semantic analysis phases. Built in C++ to parse, validate, and execute simple SQL-like relational database queries.",
          category: "cpp",
          tags: ['C++', 'Compilers', 'Lex & Yacc'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/mini-sql-compiler",
          icon: "fas fa-terminal",
          sort_order: 1
        },
        {
          title: "Student Tracking System",
          description: "A collaborative tracking and analytics system developed within StudentTrackingOrg. Designed to monitor student performance metric trends, attendance patterns, and core study schedules.",
          category: "python",
          tags: ['Python', 'Data Analysis', 'MySQL'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/student-tracking-system",
          icon: "fas fa-chart-line",
          sort_order: 2
        },
        {
          title: "E-Commerce Website",
          description: "An interactive full storefront template featuring dynamically rendered products, search bar query filtering, interactive cart additions, and responsive grid layouts.",
          category: "web",
          tags: ['JavaScript', 'HTML5', 'Vanilla CSS'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/E-Commerce-Website",
          icon: "fas fa-shopping-cart",
          sort_order: 3
        },
        {
          title: "Multi-threaded Web Crawler",
          description: "A script to scan and extract metadata elements from websites concurrently. Includes speed limit throttling to respect target site bandwidth constraints and exports outputs to CSV formats.",
          category: "python",
          tags: ['Python', 'BeautifulSoup', 'Scrapy'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/Web_Crawler",
          icon: "fas fa-spider",
          sort_order: 4
        },
        {
          title: "Titanic Survival Project",
          description: "An end-to-end Machine Learning project using classifier algorithms to forecast individual passenger survival chances based on demographics, ticket class, and details.",
          category: "python",
          tags: ['HTML', 'Scikit-Learn', 'Pandas'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/Titanic_Survival_Project",
          icon: "fas fa-ship",
          sort_order: 5
        },
        {
          title: "Resume Portfolio Builder",
          description: "A full-stack resume application using React architectures and dynamic templating. Built on modern database architectures featuring visual editing control panels.",
          category: "web",
          tags: ['Next.js 15', 'TypeScript', 'PostgreSQL'],
          code_link: "https://github.com/Abhishek-Singh-Rawat-Dev/MyResume",
          icon: "far fa-file-alt",
          sort_order: 6
        }
      ];

      for (const p of defaultProjects) {
        const pgTags = `{${p.tags.map(t => `"${t}"`).join(',')}}`;
        await sql`
          INSERT INTO projects (title, description, category, tags, code_link, icon, sort_order)
          VALUES (${p.title}, ${p.description}, ${p.category}, ${pgTags}, ${p.code_link}, ${p.icon}, ${p.sort_order});
        `;
      }
    }

    console.log('Database successfully initialized and seeded!');
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}
