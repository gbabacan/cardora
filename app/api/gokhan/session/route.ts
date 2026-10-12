import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin } from '@/lib/serverAuth';

// Tells the admin page whether the caller is an admin. Non-admins get a
// plain 404 so the endpoint does not reveal that an admin area exists
export async function GET(request: NextRequest) {
  const admin = await getRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ email: admin.email });
}
