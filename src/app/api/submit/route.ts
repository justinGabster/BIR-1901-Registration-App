import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Connect to the database pool
    const connection = await pool.getConnection();
    
    try {
      // Start Transaction
      await connection.beginTransaction();
      
      // 1. Generate the next applicantID (e.g. A001 -> A002)
      const [idRows]: any = await connection.query(
        "SELECT applicantID FROM applicant ORDER BY applicantID DESC LIMIT 1"
      );
      
      let nextApplicantID = 'A001';
      if (idRows.length > 0) {
        const lastID = idRows[0].applicantID; // e.g., 'A009'
        const numericPart = parseInt(lastID.substring(1), 10);
        const nextNumeric = numericPart + 1;
        nextApplicantID = 'A' + nextNumeric.toString().padStart(3, '0');
      }

      // 2. Insert into applicant table
      await connection.query(
        `INSERT INTO applicant 
         (applicantID, philsysCardNum, tin, tpType, tpName, gender, civilStatus, birthDate, birthPlace, motherMaidenName, fatherName, citizenship, otherCitizenship, localResAdd, businessAdd, foreignAdd, tinApplicationPurpose, isUsing8percentFlatTax, expectedAnnualGs, emailAdd, singleBusinessNum) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextApplicantID,
          data.philsysCardNum || null,
          data.tin || null,
          data.tpType || null,
          data.tpName || null,
          data.gender || null,
          data.civilStatus || null,
          data.birthDate || null,
          data.birthPlace || null,
          data.motherMaidenName || null,
          data.fatherName || null,
          data.citizenship || null,
          data.otherCitizenship || null,
          data.localResAdd || null,
          data.businessAdd || null,
          data.foreignAdd || null,
          data.tinApplicationPurpose || null,
          data.isUsing8percentFlatTax || null,
          data.expectedAnnualGs || null,
          data.emailAdd || null,
          data.singleBusinessNum || null
        ]
      );

      // 3. Insert into applicantcontact table
      if (data.landlineDetails) {
        await connection.query(
          `INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`,
          [nextApplicantID, 'Landline Number', data.landlineDetails]
        );
      }
      if (data.faxDetails) {
        await connection.query(
          `INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`,
          [nextApplicantID, 'Fax Number', data.faxDetails]
        );
      }
      if (data.mobileDetails) {
        await connection.query(
          `INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`,
          [nextApplicantID, 'Mobile Number', data.mobileDetails]
        );
      }

      // 4. Insert into idvalidation table
      await connection.query(
        `INSERT INTO idvalidation 
         (applicantID, idType, idNumber, effectivityDate, expiryDate, issuer, placeOfIssue) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nextApplicantID,
          data.idType || null,
          data.idNumber || null,
          data.effectivityDate || null,
          data.expiryDate || null,
          data.issuer || null,
          data.placeOfIssue || null
        ]
      );

      // 5. Insert into spousal (Always execute as requested by user)
      const [maxSpouse]: any = await connection.query('SELECT MAX(spouseID) as maxId FROM spousal');
      let nextSpouseID = 'S001';
      if (maxSpouse[0] && maxSpouse[0].maxId) {
        const currentNum = parseInt(maxSpouse[0].maxId.substring(1));
        nextSpouseID = `S${String(currentNum + 1).padStart(3, '0')}`;
      }

      await connection.query(
        `INSERT INTO spousal 
         (applicantID, spouseID, spouseEmpStatus, spouseName, spouseTin, employersName, employersTin) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nextApplicantID,
          nextSpouseID,
          data.civilStatus === 'Married' ? (data.spouseEmpStatus || null) : null,
          data.civilStatus === 'Married' ? (data.spouseName || null) : null,
          data.civilStatus === 'Married' ? (data.spouseTin || null) : null,
          data.civilStatus === 'Married' && data.spouseEmpStatus !== 'Unemployed' ? (data.employersName || null) : null,
          data.civilStatus === 'Married' && data.spouseEmpStatus !== 'Unemployed' ? (data.employersTin || null) : null
        ]
      );

      // 6. Insert into industry (Iterating over businesses array)
      if (data.businesses && Array.isArray(data.businesses)) {
        for (const business of data.businesses) {
          await connection.query(
            `INSERT INTO industry 
             (applicantID, industryLevel, regulatoryBody, businessName, businessRegNum, businessRegDate, businessLine) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              nextApplicantID,
              business.industryLevel || null,
              business.regulatoryBody || null,
              business.businessName || null,
              business.businessRegNum || null,
              business.businessRegDate || null,
              business.businessLine || null
            ]
          );
        }
      }

      // 7. Insert into facility
      const [maxFacRows]: any = await connection.query('SELECT MAX(facilityID) as maxId FROM facility');
      const nextFacilityID = (maxFacRows[0].maxId || 0) + 1;

      await connection.query(
        `INSERT INTO facility 
         (facilityID, applicantID, facilityType, facilityAddress) 
         VALUES (?, ?, ?, ?)`,
        [
          nextFacilityID,
          nextApplicantID,
          data.facilityType || null,
          data.facilityAddress || null
        ]
      );

      // 8. Insert into rep (Always execute as requested)
      const [maxRepRows]: any = await connection.query('SELECT MAX(repID) as maxId FROM rep');
      const nextRepID = (maxRepRows[0].maxId || 0) + 1;

      await connection.query(
        `INSERT INTO rep 
         (repID, applicantID, relType, repName, relDate, repAddType, repAdd, repEmailAdd) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextRepID,
          nextApplicantID,
          data.hasRepresentative === 'Yes' ? (data.relType || null) : null,
          data.hasRepresentative === 'Yes' ? (data.repName || null) : null,
          data.hasRepresentative === 'Yes' ? (data.relDate || null) : null,
          data.hasRepresentative === 'Yes' ? (data.repAddType || null) : null,
          data.hasRepresentative === 'Yes' ? (data.repAdd || null) : null,
          data.hasRepresentative === 'Yes' ? (data.repEmailAdd || null) : null
        ]
      );

      // Insert into repcontact (only if applicable)
      if (data.hasRepresentative === 'Yes') {
        if (data.repLandlineDetails) {
          await connection.query(
            `INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`,
            [nextApplicantID, nextRepID, 'Landline Number', data.repLandlineDetails]
          );
        }
        if (data.repFaxDetails) {
          await connection.query(
            `INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`,
            [nextApplicantID, nextRepID, 'Fax Number', data.repFaxDetails]
          );
        }
        if (data.repMobileDetails) {
          await connection.query(
            `INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`,
            [nextApplicantID, nextRepID, 'Mobile Number', data.repMobileDetails]
          );
        }
      }

      // 9. Insert into invoices (Always execute as requested)
      await connection.query(
        `INSERT INTO invoices 
         (applicantID, invDescription, invType, numOfBoxes, numOfSetsPerBoxes, serialStart, serialEnd, numOfCopies) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextApplicantID,
          data.hasInvoices === 'Yes' ? (data.invDescription || 'Invoices') : 'Invoices',
          data.hasInvoices === 'Yes' ? (data.invType || null) : null,
          data.hasInvoices === 'Yes' ? (data.numOfBoxes || null) : null,
          data.hasInvoices === 'Yes' && data.numOfSetsPerBoxes ? parseInt(data.numOfSetsPerBoxes) : null,
          data.hasInvoices === 'Yes' ? (data.serialStart || null) : null,
          data.hasInvoices === 'Yes' ? (data.serialEnd || null) : null,
          data.hasInvoices === 'Yes' && data.numOfCopies ? parseInt(data.numOfCopies) : null
        ]
      );

      // Commit Transaction
      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true, applicantID: nextApplicantID }, { status: 200 });
      
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      connection.release();
      console.error("Database Transaction Error:", transactionError);
      return NextResponse.json({ error: "Database transaction failed", details: String(transactionError) }, { status: 500 });
    }
    
  } catch (error) {
    console.error("API Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}
