import { redirect, RedirectType } from 'next/navigation';
import { GetSessionUserData } from '@/lib/auth';

export default async function Home() {
  const userdata = await GetSessionUserData();
  if (!userdata) {
    redirect(`/login`);
  } else {
    redirect(`/account`);
  }
}
