import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT applicantID, tpName, tin, tpType, emailAdd 
      FROM applicant 
      ORDER BY applicantID DESC
    `);
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
