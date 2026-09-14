import { redirect, RedirectType } from 'next/navigation';

export default async function PageNotFound() {
  redirect(`/login`);
}
