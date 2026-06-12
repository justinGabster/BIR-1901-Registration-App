import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const QUERIES: Record<string, string> = {
  q1: `SELECT applicantID, facilityAddress FROM bir_db.facility WHERE facilityType = 'Others (Office)'`,
  q2: `SELECT businessName, businessRegNum, businessLine FROM bir_db.industry WHERE regulatoryBody LIKE '%DTI%' OR regulatoryBody LIKE '%LGU%'`,
  q3: `SELECT applicantID, spouseID, spouseName, spouseEmpStatus, employersName FROM bir_db.spousal WHERE spouseEmpStatus IS NOT NULL`,
  q4: `SELECT civilStatus, COUNT(applicantID) AS Total_Applicants FROM bir_db.applicant GROUP BY civilStatus ORDER BY Total_Applicants DESC`,
  q5: `SELECT invType, AVG(numOfCopies) AS AVG_Copies, MIN(numOfCopies) AS MIN_Copies, MAX(numOfCopies) AS MAX_Copies FROM bir_db.invoices GROUP BY invType HAVING AVG(numOfCopies) > 2`,
  q6: `SELECT applicantID, spouseName, UPPER(spouseEmpStatus) AS spouseEmpStatus FROM bir_db.spousal WHERE spouseName IS NOT NULL ORDER BY spouseName`,
  q7: `SELECT ac.prefContactType, COUNT(ac.applicantID) AS totalApplicants, COUNT(DISTINCT a.civilStatus) AS civilStatusCount FROM bir_db.applicantcontact ac JOIN bir_db.applicant a ON ac.applicantID = a.applicantID GROUP BY ac.prefContactType ORDER BY totalApplicants DESC`,
  q8: `SELECT a.tpName, UPPER(r.repName) AS repName, r.relType, rc.repPrefContactType, rc.repPrefContactDetails FROM bir_db.applicant a JOIN bir_db.rep r ON a.applicantID = r.applicantID JOIN bir_db.repcontact rc ON r.repID = rc.repID ORDER BY r.repName`,
  q9: `SELECT a.tpName AS applicantName, i.idType, i.issuer, i.expiryDate, DATEDIFF(i.expiryDate, CURRENT_DATE) AS daysRemaining FROM bir_db.applicant a JOIN bir_db.idvalidation i ON a.applicantID = i.applicantID WHERE i.expiryDate BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 5 YEAR) ORDER BY i.expiryDate`,
  q10: `SELECT relType, COUNT(applicantID) AS totalApplicants, MIN(relDate) AS earliestRelDate FROM bir_db.rep GROUP BY relType HAVING COUNT(applicantID) >= 2`
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');

    if (!queryId || !QUERIES[queryId]) {
      return NextResponse.json({ error: 'Invalid or missing query ID' }, { status: 400 });
    }

    const sql = QUERIES[queryId];
    const [rows, fields] = await pool.query(sql);

    // Format fields and data identically to the hardcoded matrix
    const columns = (fields as any[]).map(f => f.name);
    const data = (rows as any[]).map(row => columns.map(col => {
      // Date formatting for clean UI
      const val = row[col];
      if (val instanceof Date) {
        return val.toISOString().split('T')[0];
      }
      return val;
    }));

    return NextResponse.json({ columns, data });
  } catch (error: any) {
    console.error('SQL Showroom Error:', error);
    return NextResponse.json({ error: 'Database execution failed: ' + error.message }, { status: 500 });
  }
}
