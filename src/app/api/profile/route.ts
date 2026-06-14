import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sql } from '@vercel/postgres';
import { initDatabase } from '@/lib/postgres';

function toCamelCase(dbRow: any) {
  if (!dbRow) return null;
  return {
    id: dbRow.id,
    title: dbRow.title,
    bio: dbRow.bio,
    subBio: dbRow.sub_bio,
    projectsCount: dbRow.projects_count,
    solvedCount: dbRow.solved_count,
    educationYear: dbRow.education_year,
    leetcodeUsername: dbRow.leetcode_username,
    leetcodeSolved: dbRow.leetcode_solved,
    leetcodeRating: dbRow.leetcode_rating,
    leetcodeMaxDifficulty: dbRow.leetcode_max_difficulty,
    leetcodeStreak: dbRow.leetcode_streak,
    gfgUsername: dbRow.gfg_username,
    gfgSolved: dbRow.gfg_solved,
    gfgScore: dbRow.gfg_score,
    gfgSkills: dbRow.gfg_skills,
    gfgRank: dbRow.gfg_rank,
    githubUsername: dbRow.github_username,
    githubRepos: dbRow.github_repos,
    githubCommits: dbRow.github_commits,
    githubForks: dbRow.github_forks,
    githubContributions: dbRow.github_contributions,
  };
}

// GET: Fetch profile details
export async function GET() {
  try {
    await initDatabase();
    const result = await sql`SELECT * FROM profile LIMIT 1;`;
    
    return NextResponse.json({ success: true, data: toCamelCase(result.rows[0]) });
  } catch (error: any) {
    console.error('Profile GET API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update profile details (Admin only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.email !== 'abhishekpersona1402@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      title, bio, subBio,
      projectsCount, solvedCount, educationYear,
      leetcodeUsername, leetcodeSolved, leetcodeRating, leetcodeMaxDifficulty, leetcodeStreak,
      gfgUsername, gfgSolved, gfgScore, gfgSkills, gfgRank,
      githubUsername, githubRepos, githubCommits, githubForks, githubContributions
    } = data;

    await initDatabase();
    
    const result = await sql`
      UPDATE profile
      SET 
        title = ${title}, 
        bio = ${bio}, 
        sub_bio = ${subBio},
        projects_count = ${projectsCount}, 
        solved_count = ${solvedCount}, 
        education_year = ${educationYear},
        leetcode_username = ${leetcodeUsername}, 
        leetcode_solved = ${leetcodeSolved}, 
        leetcode_rating = ${leetcodeRating}, 
        leetcode_max_difficulty = ${leetcodeMaxDifficulty}, 
        leetcode_streak = ${leetcodeStreak},
        gfg_username = ${gfgUsername}, 
        gfg_solved = ${gfgSolved}, 
        gfg_score = ${gfgScore}, 
        gfg_skills = ${gfgSkills}, 
        gfg_rank = ${gfgRank},
        github_username = ${githubUsername}, 
        github_repos = ${githubRepos}, 
        github_commits = ${githubCommits}, 
        github_forks = ${githubForks}, 
        github_contributions = ${githubContributions}
      WHERE id = (SELECT id FROM profile LIMIT 1)
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: toCamelCase(result.rows[0]) });
  } catch (error: any) {
    console.error('Profile PUT API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
