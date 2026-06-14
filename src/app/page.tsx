import '@/lib/env';
import { sql } from '@vercel/postgres';
import { initDatabase } from '@/lib/postgres';
import PortfolioClient from '@/components/PortfolioClient';

export const revalidate = 0; // Disable static cache to reflect admin updates instantly

function toCamelCaseProfile(dbRow: any) {
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

function toCamelCaseProject(dbRow: any) {
  if (!dbRow) return null;
  return {
    _id: dbRow.id,
    title: dbRow.title,
    description: dbRow.description,
    category: dbRow.category,
    tags: dbRow.tags || [],
    codeLink: dbRow.code_link,
    icon: dbRow.icon,
    order: dbRow.sort_order,
  };
}

export default async function Home() {
  // 1. Initialize and Seed database if empty
  await initDatabase();

  // 2. Fetch Profile from Postgres
  const profileResult = await sql`SELECT * FROM profile LIMIT 1;`;
  const profile = toCamelCaseProfile(profileResult.rows[0]);

  // 3. Fetch Projects from Postgres
  const projectsResult = await sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC;`;
  const projects = projectsResult.rows.map(toCamelCaseProject);

  return <PortfolioClient initialProfile={profile!} initialProjects={projects as any} />;
}
