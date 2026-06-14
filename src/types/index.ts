export interface IProject {
  _id: string;
  title: string;
  description: string;
  category: 'cpp' | 'web' | 'python';
  tags: string[];
  codeLink: string;
  icon: string;
  order?: number;
}

export interface IProfile {
  id: number;
  title: string;
  bio: string;
  subBio?: string;
  projectsCount: string;
  solvedCount: string;
  educationYear: string;
  leetcodeUsername: string;
  leetcodeSolved: string;
  leetcodeRating: string;
  leetcodeMaxDifficulty: string;
  leetcodeStreak: string;
  gfgUsername: string;
  gfgSolved: string;
  gfgScore: string;
  gfgSkills: string;
  gfgRank: string;
  githubUsername: string;
  githubRepos: string;
  githubCommits: string;
  githubForks: string;
  githubContributions: string;
}

export interface IContact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
