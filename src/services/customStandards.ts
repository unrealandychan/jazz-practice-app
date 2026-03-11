import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import type { Difficulty, IJazzStandard, JazzFeel } from '@/data/standards';
import { db } from '@/lib/firebase';

/** The subset a user fills in when creating a custom standard */
export interface ICustomStandardInput {
  title: string;
  composer: string;
  year: number;
  key: string;
  feel: JazzFeel[];
  tempoRange: [number, number];
  difficulty: Difficulty;
  progression: string;
  tags: string[];
}

function userStandardsRef(uid: string) {
  return collection(db, 'users', uid, 'customStandards');
}

/** Fetch all custom standards for a user, ordered by creation date. */
export async function getCustomStandards(uid: string): Promise<IJazzStandard[]> {
  const q = query(userStandardsRef(uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      composer: data.composer,
      year: data.year,
      key: data.key,
      feel: data.feel,
      tempoRange: data.tempoRange,
      difficulty: data.difficulty,
      progression: data.progression,
      tags: data.tags ?? [],
      source: 'custom',
    } satisfies IJazzStandard;
  });
}

/** Add a new custom standard for a user. Returns the new Firestore doc ID. */
export async function addCustomStandard(uid: string, input: ICustomStandardInput): Promise<string> {
  const ref = await addDoc(userStandardsRef(uid), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Delete a custom standard. */
export async function deleteCustomStandard(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'customStandards', id));
}
