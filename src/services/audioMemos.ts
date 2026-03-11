/**
 * Firebase Storage service for audio practice memos.
 * Path: audio-memos/{uid}/{sessionId}.webm
 *
 * Each session can have at most one memo. Memos are private to the user's UID.
 */
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { auth, storage } from '@/lib/firebase';

function memoRef(sessionId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  return ref(storage, `audio-memos/${uid}/${sessionId}.webm`);
}

/**
 * Upload a recorded blob and return the public download URL.
 * `onProgress` receives 0–100 as the upload progresses.
 */
export function uploadMemo(
  sessionId: string,
  blob: Blob,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = memoRef(sessionId);
    const task = uploadBytesResumable(storageRef, blob, {
      contentType: 'audio/webm',
    });

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

/** Delete the stored audio memo for a session (e.g. when deleting the session). */
export async function deleteMemo(sessionId: string): Promise<void> {
  try {
    await deleteObject(memoRef(sessionId));
  } catch (err: unknown) {
    // If the file doesn't exist, that's fine — ignore "not-found" errors
    if ((err as { code?: string })?.code !== 'storage/object-not-found') {
      throw err;
    }
  }
}
