import { User } from '../types';

const USERS_DB_KEY = 'hsk_users_db_v2';
const CURRENT_USER_KEY = 'hsk_current_user_v2';
export const BASE_REGISTERED_STUDENTS = 2758;
export const STATS_STUDENTS_COUNT_KEY = 'hsk_registered_students_counter_v2';

export function getRegisteredStudentsCount(): number {
  if (typeof window === 'undefined') return BASE_REGISTERED_STUDENTS;
  try {
    const raw = localStorage.getItem(STATS_STUDENTS_COUNT_KEY);
    if (raw) {
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= BASE_REGISTERED_STUDENTS) {
        return num;
      }
    }
    // Calculate based on base 2758 + registered users in DB
    const users = getUsersDb();
    const customCount = users.filter((u) => u.id !== 'user-demo').length;
    const initialTotal = BASE_REGISTERED_STUDENTS + customCount;
    localStorage.setItem(STATS_STUDENTS_COUNT_KEY, initialTotal.toString());
    return initialTotal;
  } catch (e) {
    console.error('Error reading students count:', e);
    return BASE_REGISTERED_STUDENTS;
  }
}

export function incrementRegisteredStudentsCount(): number {
  const current = getRegisteredStudentsCount();
  const next = current + 1;
  try {
    localStorage.setItem(STATS_STUDENTS_COUNT_KEY, next.toString());
  } catch (e) {
    console.error('Error incrementing students count:', e);
  }
  return next;
}

// Default initial user for instant access or demonstration
const DEFAULT_USER: User = {
  id: 'user-demo',
  username: 'nurmuhammad',
  name: 'Nurmuhammad',
  email: 'nurmuhammadxoldorov61@gmail.com',
  password: '123',
  avatar: '🎓',
  xp: 120,
  lessonsCompleted: 3,
  completedLessonIds: [1, 2, 3],
  bookmarkedWords: ['你好', '谢谢', '朋友', '中文', '咖啡'],
  streakDays: 5,
  createdAt: new Date().toISOString(),
};

export function getUsersDb(): User[] {
  if (typeof window === 'undefined') return [DEFAULT_USER];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      // Seed default user
      localStorage.setItem(USERS_DB_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    return parsed;
  } catch (e) {
    console.error('Error reading users db:', e);
    return [DEFAULT_USER];
  }
}

export function saveUsersDb(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users db:', e);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      return user;
    }
    return null;
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
}

export function loginDemoUser(): User {
  const users = getUsersDb();
  let demo = users.find((u) => u.username === 'nurmuhammad' || u.id === 'user-demo');
  if (!demo) {
    demo = DEFAULT_USER;
    users.push(demo);
    saveUsersDb(users);
  }
  setCurrentUser(demo);
  return demo;
}

export function updateUserProfile(updates: Partial<User>): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updated: User = {
    ...currentUser,
    ...updates,
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  return updated;
}

export function updateHsk2LessonProgress(
  lessonId: number,
  earnedXp: number = 15
): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const completed = new Set(currentUser.completedHsk2LessonIds || []);
  const isNew = !completed.has(lessonId);
  completed.add(lessonId);

  const updated: User = {
    ...currentUser,
    completedHsk2LessonIds: Array.from(completed),
    xp: (currentUser.xp || 0) + (isNew ? earnedXp : Math.max(3, Math.round(earnedXp / 2))),
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  try {
    localStorage.setItem(`hsk2_lesson_${lessonId}`, '100');
    localStorage.setItem(`hsk2_lesson_complete_${lessonId}`, '1');
  } catch (e) {
    console.error('Storage sync error:', e);
  }

  return updated;
}

export function updateHsk3LessonProgress(
  lessonId: number,
  earnedXp: number = 20
): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const completed = new Set(currentUser.completedHsk3LessonIds || []);
  const isNew = !completed.has(lessonId);
  completed.add(lessonId);

  const updated: User = {
    ...currentUser,
    completedHsk3LessonIds: Array.from(completed),
    xp: (currentUser.xp || 0) + (isNew ? earnedXp : Math.max(5, Math.round(earnedXp / 2))),
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  try {
    localStorage.setItem(`hsk3_lesson_${lessonId}`, '100');
    localStorage.setItem(`hsk3_lesson_complete_${lessonId}`, '1');
  } catch (e) {
    console.error('Storage sync error:', e);
  }

  return updated;
}

export function saveMockExamResult(result: import('../types').MockExamResult): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const existing = currentUser.mockExamResults || [];
  const updatedResults = [result, ...existing];
  const earnedXp = result.passed ? 50 : 20;

  const updated: User = {
    ...currentUser,
    mockExamResults: updatedResults,
    xp: (currentUser.xp || 0) + earnedXp,
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  return updated;
}

export function recordDialoguePractice(earnedXp: number = 25): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updated: User = {
    ...currentUser,
    dialoguePracticesCount: (currentUser.dialoguePracticesCount || 0) + 1,
    xp: (currentUser.xp || 0) + earnedXp,
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  return updated;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('hskUser');
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // keep legacy key updated for backwards compatibility with any lesson script
      localStorage.setItem(
        'hskUser',
        JSON.stringify({
          name: user.name,
          username: user.username,
          email: user.email,
          xp: user.xp,
          lessonsCompleted: user.lessonsCompleted,
        })
      );
    }
  } catch (e) {
    console.error('Error setting current user:', e);
  }
}

export function registerUser(newUser: {
  username: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}): { success: boolean; message: string; user?: User } {
  const cleanUsername = newUser.username.trim().toLowerCase();
  const cleanEmail = newUser.email.trim().toLowerCase();

  if (!cleanUsername) {
    return { success: false, message: "Foydalanuvchi nomi (username) kiritilishi shart." };
  }
  if (!newUser.name.trim()) {
    return { success: false, message: "Ismingizni kiriting." };
  }

  const users = getUsersDb();

  const existing = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUsername ||
      (cleanEmail && u.email.toLowerCase() === cleanEmail)
  );

  if (existing) {
    return {
      success: false,
      message: 'Ushbu foydalanuvchi nomi yoki email allaqachon ro\'yxatdan o\'tgan. Iltimos, Kirish (Sign In) bo\'limidan kiring.',
    };
  }

  const createdUser: User = {
    id: 'user-' + Date.now(),
    username: cleanUsername,
    name: newUser.name.trim(),
    email: cleanEmail || `${cleanUsername}@hsk.uz`,
    password: newUser.password || '123456',
    avatar: newUser.avatar || '🐼',
    xp: 0,
    lessonsCompleted: 0,
    completedLessonIds: [],
    bookmarkedWords: ['你好', '谢谢'],
    streakDays: 1,
    createdAt: new Date().toISOString(),
  };

  users.push(createdUser);
  saveUsersDb(users);
  setCurrentUser(createdUser);

  // Automatically increment the registered students statistics counter (+1, +2, +3...)
  incrementRegisteredStudentsCount();

  return {
    success: true,
    message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Xush kelibsiz.',
    user: createdUser,
  };
}

export function loginUser(
  identifier: string,
  password?: string
): { success: boolean; message: string; user?: User } {
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId) {
    return { success: false, message: 'Iltimos, username yoki emailingizni kiriting.' };
  }

  const users = getUsersDb();
  let found = users.find(
    (u) =>
      u.username.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId
  );

  // If user entered demo or special case
  if (!found && (cleanId === 'demo' || cleanId === 'nurmuhammad')) {
    found = DEFAULT_USER;
  }

  // If user doesn't exist yet, we can either offer auto-registration or clear guidance:
  if (!found) {
    return {
      success: false,
      message: "Bunday foydalanuvchi topilmadi. Avval ro'yxatdan o'ting yoki 'Demo sifatida kirish' tugmasini bosing.",
    };
  }

  // Check password if configured and provided
  if (found.password && password && found.password !== password) {
    return { success: false, message: "Parol noto'g'ri kiritildi. Qaytadan urinib ko'ring." };
  }

  // Update streak if needed
  found.streakDays = Math.max(found.streakDays || 1, 1);
  setCurrentUser(found);

  return {
    success: true,
    message: `Xush kelibsiz, ${found.name}!`,
    user: found,
  };
}

export function updateUserProgress(
  lessonId: number,
  earnedXp: number = 10
): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const completed = new Set(currentUser.completedLessonIds || []);
  const isNew = !completed.has(lessonId);
  completed.add(lessonId);

  const updated: User = {
    ...currentUser,
    completedLessonIds: Array.from(completed),
    lessonsCompleted: completed.size,
    xp: (currentUser.xp || 0) + (isNew ? earnedXp : Math.max(2, Math.round(earnedXp / 2))),
  };

  setCurrentUser(updated);

  // also update in users db
  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  // also keep legacy lesson storage in sync
  try {
    localStorage.setItem(`hsk_lesson_${lessonId}`, '100');
    localStorage.setItem(`hsk_lesson_complete_${lessonId}`, '1');
    localStorage.setItem('hsk_last', String(lessonId));
  } catch (e) {
    console.error('Storage sync error:', e);
  }

  return updated;
}

export function toggleWordBookmark(wordCn: string): { bookmarked: boolean; user: User | null } {
  const currentUser = getCurrentUser();
  if (!currentUser) return { bookmarked: false, user: null };

  const bookmarks = new Set(currentUser.bookmarkedWords || []);
  let bookmarked = false;
  if (bookmarks.has(wordCn)) {
    bookmarks.delete(wordCn);
    bookmarked = false;
  } else {
    bookmarks.add(wordCn);
    bookmarked = true;
  }

  const updated: User = {
    ...currentUser,
    bookmarkedWords: Array.from(bookmarks),
  };

  setCurrentUser(updated);

  const users = getUsersDb();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsersDb(users);
  }

  return { bookmarked, user: updated };
}
