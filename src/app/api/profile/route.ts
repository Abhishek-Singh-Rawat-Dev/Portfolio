import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { Profile } from '@/models/Profile';

// GET: Fetch profile details
export async function GET() {
  try {
    await dbConnect();
    let profile = await Profile.findOne({});
    
    // Seed default profile if DB is empty
    if (!profile) {
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
      profile = await Profile.create(defaultProfile);
    }
    
    return NextResponse.json({ success: true, data: profile });
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

    await dbConnect();
    const data = await req.json();

    let profile = await Profile.findOne({});
    if (!profile) {
      profile = await Profile.create(data);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, data, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Profile PUT API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
