import { ObjectId } from 'mongodb'

export interface Exam {
  _id: ObjectId;
  examName: string;
  examDate: Date;
  examDetails: string;
  source: string;
  lastUpdatedBy: string;
  lastUpdatedAt: Date;
  updateCount: number;
  createdAt: Date;
  editHistory: EditHistoryEntry[];
}

export interface EditHistoryEntry {
  userId: string;
  updatedAt: Date;
  changes: {
    examDate: Date;
    examDetails: string;
    source: string;
  };
}

export interface Subscription {
  _id: ObjectId;
  examId: string;
  fcmToken?: string;
  email?: string;
  phoneNumber?: string;
}

export type PushOperator<T> = {
  [K in keyof T]?: T[K] extends any[] ? T[K][number] | { $each: T[K] } : never;
};