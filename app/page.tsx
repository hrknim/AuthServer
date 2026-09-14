import { redirect, RedirectType } from 'next/navigation';
import { GetSessionUser } from '@/lib/auth';

export default async function Home() {
  const userdata = await GetSessionUser();
  if (!userdata) {
    redirect(`/login`);
  } else {
    redirect(`/account`);
  }
}
