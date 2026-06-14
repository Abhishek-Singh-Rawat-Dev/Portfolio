import mongoose, { Schema, model, models } from 'mongoose';

export interface IProject {
  title: string;
  description: string;
  category: 'cpp' | 'web' | 'python';
  tags: string[];
  codeLink: string;
  icon: string;
  order?: number;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['cpp', 'web', 'python'], required: true },
  tags: [{ type: String }],
  codeLink: { type: String, required: true },
  icon: { type: String, default: 'fas fa-code' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = models.Project || model<IProject>('Project', ProjectSchema);
