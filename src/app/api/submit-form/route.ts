import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Example of inserting applicant data into the applicant table
    const query = `
      INSERT INTO applicant 
      (tin, philsysCardNum, tpType, tpName, gender, civilStatus, birthDate, emailAdd, localResAdd) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.tin,
      data.philsysCardNum,
      data.tpType,
      data.tpName,
      data.gender,
      data.civilStatus,
      data.birthDate,
      data.emailAdd,
      data.localResAdd
    ];

    const [result] = await pool.execute(query, values);

    // Note: You would also insert into industry, facility, etc. here
    // using transactions to ensure data consistency.

    return NextResponse.json({ success: true, message: 'Form submitted successfully', result });
  } catch (error: any) {
    console.error('Database insertion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form', error: error.message },
      { status: 500 }
    );
  }
}
