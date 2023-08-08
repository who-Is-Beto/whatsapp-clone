import FireBaseConfig from '@/envs/firebase.env';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(FireBaseConfig);
export const firebeaseAuth = getAuth(app);
