import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const applicantID = (await params).id;
  try {
    const [applicant]: any = await pool.query('SELECT * FROM applicant WHERE applicantID = ?', [applicantID]);
    if (!applicant || applicant.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const [applicantContact]: any = await pool.query('SELECT * FROM applicantcontact WHERE applicantID = ?', [applicantID]);
    const [idValidation]: any = await pool.query('SELECT * FROM idvalidation WHERE applicantID = ?', [applicantID]);
    const [spousal]: any = await pool.query('SELECT * FROM spousal WHERE applicantID = ?', [applicantID]);
    const [facility]: any = await pool.query('SELECT * FROM facility WHERE applicantID = ?', [applicantID]);
    const [industry]: any = await pool.query('SELECT * FROM industry WHERE applicantID = ?', [applicantID]);
    const [rep]: any = await pool.query('SELECT * FROM rep WHERE applicantID = ?', [applicantID]);
    const [repContact]: any = await pool.query('SELECT * FROM repcontact WHERE applicantID = ?', [applicantID]);
    const [invoices]: any = await pool.query('SELECT * FROM invoices WHERE applicantID = ?', [applicantID]);

    // Map database shape back to frontend INITIAL_FORM_DATA shape
    const data = applicant[0];
    const contacts = applicantContact.map((c: any) => ({ type: c.prefContactType, details: c.prefContactDetails }));
    
    // Formatting dates
    const formatDate = (dateString: string) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

    const formData = {
      // Step 1
      tin: data.tin || '',
      philsysCardNum: data.philsysCardNum || '',
      tpType: data.tpType || '',
      tpName: data.tpName || '',
      gender: data.gender || '',
      civilStatus: data.civilStatus || '',
      birthDate: formatDate(data.birthDate),
      birthPlace: data.birthPlace || '',
      motherMaidenName: data.motherMaidenName || '',
      fatherName: data.fatherName || '',
      citizenship: data.citizenship === 'Filipino' || data.citizenship === 'Foreign' ? data.citizenship : 'Other',
      otherCitizenship: data.citizenship !== 'Filipino' && data.citizenship !== 'Foreign' ? data.citizenship : '',
      localResAdd: data.localResAdd || '',
      businessAdd: data.businessAdd || '',
      foreignAdd: data.foreignAdd || '',
      emailAdd: data.emailAdd || '',

      // Step 2
      tinApplicationPurpose: data.tinApplicationPurpose || '',
      isUsing8percentFlatTax: data.isUsing8percentFlatTax || '',
      expectedAnnualGs: data.expectedAnnualGs || '',
      prefContactType: contacts.map((c: any) => c.type),
      landlineDetails: contacts.find((c: any) => c.type === 'Landline Number')?.details || '',
      faxDetails: contacts.find((c: any) => c.type === 'Fax Number')?.details || '',
      mobileDetails: contacts.find((c: any) => c.type === 'Mobile Number')?.details || '',
      idType: idValidation[0]?.idType || '',
      idNumber: idValidation[0]?.idNumber || '',
      effectivityDate: formatDate(idValidation[0]?.effectivityDate),
      expiryDate: formatDate(idValidation[0]?.expiryDate),
      issuer: idValidation[0]?.issuer || '',
      placeOfIssue: idValidation[0]?.placeOfIssue || '',

      // Step 3
      spouseName: spousal[0]?.spouseName || '',
      spouseTin: spousal[0]?.spouseTin || '',
      spouseEmpStatus: spousal[0]?.spouseEmpStatus || 'Employed Locally',
      employersName: spousal[0]?.employersName || '',
      employersTin: spousal[0]?.employersTin || '',

      // Step 4
      businesses: industry.length > 0 ? industry.map((ind: any, index: number) => ({
        id: ind.industryID,
        businessName: ind.businessName,
        businessRegNum: ind.businessRegNum,
        businessRegDate: formatDate(ind.businessRegDate),
        businessLine: ind.businessLine,
        industryLevel: ind.industryLevel,
        regulatoryBody: ind.regulatoryBody
      })) : [{ id: 1, businessName: '', businessRegNum: '', businessRegDate: '', businessLine: '', industryLevel: 'Primary', regulatoryBody: 'DTI' }],
      facilityType: (() => {
        const type = facility[0]?.facilityType || '';
        const predefined = ['PP-Place of Production/Plant', 'SP-Storage Place', 'WH-Warehouse', 'SR-Showroom', 'GG-Garage', 'BT-Bus Terminal', 'RP-Real Property for Lease with No Sales Activity'];
        if (!type) return '';
        return predefined.includes(type) ? type : 'Others (specify)';
      })(),
      otherFacilityType: (() => {
        const type = facility[0]?.facilityType || '';
        const predefined = ['PP-Place of Production/Plant', 'SP-Storage Place', 'WH-Warehouse', 'SR-Showroom', 'GG-Garage', 'BT-Bus Terminal', 'RP-Real Property for Lease with No Sales Activity'];
        return (!predefined.includes(type) && type !== '') ? type : '';
      })(),
      facilityAddress: facility[0]?.facilityAddress || '',

      // Step 5
      hasRepresentative: rep.length > 0 ? 'Yes' : 'No',
      relType: rep[0]?.relType || 'Individual',
      repName: rep[0]?.repName || '',
      relDate: formatDate(rep[0]?.relDate),
      repAddType: rep[0]?.repAddType || 'Residence',
      repAdd: rep[0]?.repAdd || '',
      repEmailAdd: rep[0]?.repEmailAdd || '',
      repPrefContactType: repContact.map((c: any) => c.repPrefContactType),
      repLandlineDetails: repContact.find((c: any) => c.repPrefContactType === 'Landline Number')?.repPrefContactDetails || '',
      repFaxDetails: repContact.find((c: any) => c.repPrefContactType === 'Fax Number')?.repPrefContactDetails || '',
      repMobileDetails: repContact.find((c: any) => c.repPrefContactType === 'Mobile Number')?.repPrefContactDetails || '',

      // Step 6
      hasInvoices: invoices.length > 0 ? 'Yes' : 'No',
      invoices: invoices.length > 0 ? invoices.map((inv: any, index: number) => ({
        id: index + 1,
        invDescription: inv.invDescription || '',
        invType: inv.invType || '',
        invManner: (inv.numOfBoxesLoose > 0 && inv.numOfBoxesBound > 0) ? 'Both' : (inv.numOfBoxesLoose > 0 ? 'Loose Leaf' : (inv.numOfBoxesBound > 0 ? 'Bound' : '')),
        numOfBoxesLoose: inv.numOfBoxesLoose || '',
        numOfBoxesBound: inv.numOfBoxesBound || '',
        numOfSetsPerBoxes: inv.numOfSetsPerBoxes || '',
        serialStart: inv.serialStart || '',
        serialEnd: inv.serialEnd || '',
        numOfCopies: inv.numOfCopies || ''
      })) : [{ id: 1, invDescription: '', invType: '', numOfBoxesLoose: '', numOfBoxesBound: '', numOfSetsPerBoxes: '', numOfCopies: '', serialStart: '', serialEnd: '' }]
    };

    return NextResponse.json({ success: true, data: formData });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const applicantID = (await params).id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete in reverse order of dependencies
    await connection.query('DELETE FROM invoices WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM repcontact WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM rep WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM facility WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM industry WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM spousal WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM idvalidation WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM applicantcontact WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM applicant WHERE applicantID = ?', [applicantID]);

    await connection.commit();
    connection.release();

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error('Error deleting application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const applicantID = (await params).id;
  const data = await request.json();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Delete existing records
    await connection.query('DELETE FROM invoices WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM repcontact WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM rep WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM facility WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM industry WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM spousal WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM idvalidation WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM applicantcontact WHERE applicantID = ?', [applicantID]);
    await connection.query('DELETE FROM applicant WHERE applicantID = ?', [applicantID]);

    // 2. Re-insert into applicant table
    await connection.query(
      `INSERT INTO applicant 
       (applicantID, philsysCardNum, tin, tpType, tpName, gender, civilStatus, birthDate, birthPlace, motherMaidenName, fatherName, citizenship, otherCitizenship, localResAdd, businessAdd, foreignAdd, tinApplicationPurpose, isUsing8percentFlatTax, expectedAnnualGs, emailAdd, singleBusinessNum) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicantID,
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
      await connection.query(`INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`, [applicantID, 'Landline Number', data.landlineDetails]);
    }
    if (data.faxDetails) {
      await connection.query(`INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`, [applicantID, 'Fax Number', data.faxDetails]);
    }
    if (data.mobileDetails) {
      await connection.query(`INSERT INTO applicantcontact (applicantID, prefContactType, prefContactDetails) VALUES (?, ?, ?)`, [applicantID, 'Mobile Number', data.mobileDetails]);
    }

    // 4. Insert into idvalidation table
    await connection.query(
      `INSERT INTO idvalidation (applicantID, idType, idNumber, effectivityDate, expiryDate, issuer, placeOfIssue) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [applicantID, data.idType || null, data.idNumber || null, data.effectivityDate || null, data.expiryDate || null, data.issuer || null, data.placeOfIssue || null]
    );

    // 5. Insert into spousal (Always execute as requested by user)
    const [maxSpouse]: any = await connection.query('SELECT MAX(spouseID) as maxId FROM spousal');
    let nextSpouseID = 'S001';
    if (maxSpouse[0] && maxSpouse[0].maxId) {
      const currentNum = parseInt(maxSpouse[0].maxId.substring(1));
      nextSpouseID = `S${String(currentNum + 1).padStart(3, '0')}`;
    }

    await connection.query(
      `INSERT INTO spousal (applicantID, spouseID, spouseEmpStatus, spouseName, spouseTin, employersName, employersTin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        applicantID, nextSpouseID,
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
          `INSERT INTO industry (applicantID, industryLevel, regulatoryBody, businessName, businessRegNum, businessRegDate, businessLine) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [applicantID, business.industryLevel || null, business.regulatoryBody || null, business.businessName || null, business.businessRegNum || null, business.businessRegDate || null, business.businessLine || null]
        );
      }
    }

    // 7. Insert into facility
    const [maxFacRows]: any = await connection.query('SELECT MAX(facilityID) as maxId FROM facility');
    const nextFacilityID = (maxFacRows[0].maxId || 0) + 1;
    await connection.query(`INSERT INTO facility (facilityID, applicantID, facilityType, facilityAddress) VALUES (?, ?, ?, ?)`, [nextFacilityID, applicantID, data.facilityType === 'Others (specify)' ? (data.otherFacilityType || null) : (data.facilityType || null), data.facilityAddress || null]);

    // 8. Insert into rep
    const [maxRepRows]: any = await connection.query('SELECT MAX(repID) as maxId FROM rep');
    const nextRepID = (maxRepRows[0].maxId || 0) + 1;
    await connection.query(
      `INSERT INTO rep (repID, applicantID, relType, repName, relDate, repAddType, repAdd, repEmailAdd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextRepID, applicantID,
        data.hasRepresentative === 'Yes' ? (data.relType || null) : null,
        data.hasRepresentative === 'Yes' ? (data.repName || null) : null,
        data.hasRepresentative === 'Yes' ? (data.relDate || null) : null,
        data.hasRepresentative === 'Yes' ? (data.repAddType || null) : null,
        data.hasRepresentative === 'Yes' ? (data.repAdd || null) : null,
        data.hasRepresentative === 'Yes' ? (data.repEmailAdd || null) : null
      ]
    );

    if (data.hasRepresentative === 'Yes') {
      if (data.repLandlineDetails) await connection.query(`INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`, [applicantID, nextRepID, 'Landline Number', data.repLandlineDetails]);
      if (data.repFaxDetails) await connection.query(`INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`, [applicantID, nextRepID, 'Fax Number', data.repFaxDetails]);
      if (data.repMobileDetails) await connection.query(`INSERT INTO repcontact (applicantID, repID, repPrefContactType, repPrefContactDetails) VALUES (?, ?, ?, ?)`, [applicantID, nextRepID, 'Mobile Number', data.repMobileDetails]);
    }

    // 9. Insert into invoices
    if (data.hasInvoices === 'Yes' && data.invoices && Array.isArray(data.invoices)) {
      for (const inv of data.invoices) {
        await connection.query(
          `INSERT INTO invoices (applicantID, invDescription, invType, numOfBoxesLoose, numOfBoxesBound, numOfSetsPerBoxes, serialStart, serialEnd, numOfCopies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            applicantID,
            inv.invDescription || null,
            inv.invType || null,
            inv.numOfBoxesLoose ? parseInt(inv.numOfBoxesLoose) : 0,
            inv.numOfBoxesBound ? parseInt(inv.numOfBoxesBound) : 0,
            inv.numOfSetsPerBoxes ? parseInt(inv.numOfSetsPerBoxes) : null,
            inv.serialStart || null,
            inv.serialEnd || null,
            inv.numOfCopies ? parseInt(inv.numOfCopies) : null
          ]
        );
      }
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({ success: true, message: 'Application updated successfully', applicantID });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error('Error updating application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
