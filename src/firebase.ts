import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  orderBy,
  getDocFromServer
} from "firebase/firestore";

// Config provided by user to connect to their custom Firebase backend
const firebaseConfig = {
  apiKey: "AIzaSyAfpk5jZk6HPTMfK-FMfGFspw3lJ1yUTr8",
  authDomain: "new-prototype-pld6j.firebaseapp.com",
  databaseURL: "https://new-prototype-pld6j-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "new-prototype-pld6j",
  storageBucket: "new-prototype-pld6j.firebasestorage.app",
  messagingSenderId: "620752998568",
  appId: "1:620752998568:web:a3663045ec0cf3bdf3b29d"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Firebase Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  orderBy,
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
};
export type { User };

// Define Operation type matching skill specification
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global robust error handler targeting premium support in cloud platforms
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test validating state as required by SKILL.md
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration or networks.");
    }
  }
}
testConnection();
