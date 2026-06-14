import mongoose, { Schema, model, models } from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export const Contact = models.Contact || model<IContact>('Contact', ContactSchema);
