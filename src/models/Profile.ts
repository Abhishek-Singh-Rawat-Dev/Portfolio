import mongoose, { Schema, model, models } from 'mongoose';

export interface IProfile {
  title: string;
  bio: string;
  subBio?: string;
  
  // Hero Stats
  projectsCount: string;
  solvedCount: string;
  educationYear: string;
  
  // LeetCode Stats
  leetcodeUsername: string;
  leetcodeSolved: string;
  leetcodeRating: string;
  leetcodeMaxDifficulty: string;
  leetcodeStreak: string;
  
  // GFG Stats
  gfgUsername: string;
  gfgSolved: string;
  gfgScore: string;
  gfgSkills: string;
  gfgRank: string;
  
  // GitHub Stats
  githubUsername: string;
  githubRepos: string;
  githubCommits: string;
  githubForks: string;
  githubContributions: string;
}

const ProfileSchema = new Schema<IProfile>({
  title: { type: String, required: true },
  bio: { type: String, required: true },
  subBio: { type: String },
  
  projectsCount: { type: String, default: '15+' },
  solvedCount: { type: String, default: '500+' },
  educationYear: { type: String, default: '2nd' },
  
  leetcodeUsername: { type: String, default: 'user1420abhi' },
  leetcodeSolved: { type: String, default: '350+' },
  leetcodeRating: { type: String, default: 'Top 15%' },
  leetcodeMaxDifficulty: { type: String, default: 'Medium' },
  leetcodeStreak: { type: String, default: 'Active' },
  
  gfgUsername: { type: String, default: 'scientinz48' },
  gfgSolved: { type: String, default: '250+' },
  gfgScore: { type: String, default: '900+' },
  gfgSkills: { type: String, default: 'DSA' },
  gfgRank: { type: String, default: 'College Rank #24' },
  
  githubUsername: { type: String, default: 'Abhishek-Singh-Rawat-Dev' },
  githubRepos: { type: String, default: '13' },
  githubCommits: { type: String, default: '300+' },
  githubForks: { type: String, default: '4' },
  githubContributions: { type: String, default: 'Active' },
}, { timestamps: true });

export const Profile = models.Profile || model<IProfile>('Profile', ProfileSchema);
