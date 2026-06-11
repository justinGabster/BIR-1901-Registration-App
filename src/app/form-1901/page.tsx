"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, User, Building, MapPin, Search, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

const COUNTRIES = [
  "Philippines", "United States", "Japan", "China", "South Korea", "Australia", 
  "Canada", "United Kingdom", "Singapore", "Saudi Arabia", "United Arab Emirates", "Other"
];

const InputField = ({ label, name, type = "text", placeholder = "", required = false, formData, updateForm, pattern, min, max, maxLength, optionalLabel }: any) => (
  <div className="space-y-1">
    <label className="text-[13px] font-semibold text-[var(--color-text-primary)] flex justify-between">
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
      {optionalLabel && <span className="text-[var(--color-text-secondary)] font-normal text-[11px]">(Optional)</span>}
    </label>
    <input 
      type={type} 
      name={name} 
      value={(formData as any)[name] || ''} 
      onChange={updateForm} 
      pattern={pattern}
      min={min}
      max={type === 'date' && !max ? "9999-12-31" : max}
      maxLength={maxLength}
      className="w-full border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-light)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent outline-none transition-all placeholder:text-[var(--color-text-secondary)]" 
      placeholder={placeholder} 
      required={required} 
    />
  </div>
);

const INITIAL_FORM_DATA = {
  // Applicant Personal Details
  philsysCardNum: '', tin: '', tpType: '', tpName: '',
  gender: '', civilStatus: '', birthDate: '', birthPlace: '',
  motherMaidenName: '', fatherName: '', citizenship: '', otherCitizenship: '',
  localResAdd: '', businessAdd: '', foreignAdd: '', tinApplicationPurpose: '',
  isUsing8percentFlatTax: '', expectedAnnualGs: '', singleBusinessNum: '',
  
  // Contact & ID Validation
  emailAdd: '', prefContactType: '', landlineDetails: '', faxDetails: '', mobileDetails: '',
  idType: '', otherIdType: '', idNumber: '', effectivityDate: '', expiryDate: '',
  issuer: '', placeOfIssue: 'Philippines',

  // Spousal Info
  spouseName: '', spouseTin: '', spouseEmpStatus: '',
  employersName: '', employersTin: '',

  // Business & Facility
  businesses: [
    { id: 1, businessName: '', businessRegNum: '', businessRegDate: '', businessLine: '', industryLevel: 'Primary', regulatoryBody: '' }
  ],
  facilityType: '', facilityAddress: '',

  // Representative Details
  hasRepresentative: 'No',
  relType: 'Individual', repName: '', relDate: '', repAddType: '',
  repAdd: '', repEmailAdd: '', repPrefContactType: '', repLandlineDetails: '', repFaxDetails: '', repMobileDetails: '',

  // Invoices
  hasInvoices: 'No',
  invoices: [
    { id: 1, invDescription: '', invType: '', invManner: '', numOfBoxesLoose: '', numOfBoxesBound: '', numOfSetsPerBoxes: '', numOfCopies: '', serialStart: '', serialEnd: '' }
  ],
  
  // Facility
  facilityType: '', facilityAddress: '', otherFacilityType: ''
};

const FORM_STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Contact & ID' },
  { id: 3, label: 'Spouse' },
  { id: 4, label: 'Business' },
  { id: 5, label: 'Rep' },
  { id: 6, label: 'Invoices' },
  { id: 7, label: 'Review' }
];

const ApplicationSummaryView = ({ formData }: { formData: any }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">
      <User size={24} className="text-blue-600"/> Applicant Personal Details
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
      <div><span className="text-slate-400 block text-xs">Full Name</span><span className="font-medium">{formData.tpName || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">TIN</span><span className="font-medium">{formData.tin || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">PhilSys Card Number</span><span className="font-medium">{formData.philsysCardNum || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Taxpayer Type</span><span className="font-medium">{formData.tpType}</span></div>
      <div><span className="text-slate-400 block text-xs">Gender</span><span className="font-medium">{formData.gender}</span></div>
      <div><span className="text-slate-400 block text-xs">Civil Status</span><span className="font-medium">{formData.civilStatus}</span></div>
      <div><span className="text-slate-400 block text-xs">Date of Birth</span><span className="font-medium">{formData.birthDate || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Place of Birth</span><span className="font-medium">{formData.birthPlace || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Mother's Maiden Name</span><span className="font-medium">{formData.motherMaidenName || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Father's Name</span><span className="font-medium">{formData.fatherName || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Citizenship</span><span className="font-medium">{formData.citizenship === 'Other' ? formData.otherCitizenship : formData.citizenship}</span></div>
    </div>

    <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2 mt-8">
      <MapPin size={24} className="text-red-600"/> Classification, Contact & ID
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Purpose of TIN Application</span><span className="font-medium">{formData.tinApplicationPurpose || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">8% Income Tax Rate Option</span><span className="font-medium">{formData.isUsing8percentFlatTax}</span></div>
      <div><span className="text-slate-400 block text-xs">Classification (Gross Sales)</span><span className="font-medium">{formData.expectedAnnualGs}</span></div>
      
      <div className="md:col-span-2 pt-2 border-t"><span className="text-slate-400 block text-xs">Local Residence Address</span><span className="font-medium">{formData.localResAdd || 'N/A'}</span></div>
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Business Address</span><span className="font-medium">{formData.businessAdd || 'N/A'}</span></div>
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Foreign Address</span><span className="font-medium">{formData.foreignAdd || 'N/A'}</span></div>
      
      <div className="md:col-span-2 pt-2 border-t"><span className="text-slate-400 block text-xs">Email Address</span><span className="font-medium break-all">{formData.emailAdd || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Contact Types</span><span className="font-medium">{formData.prefContactType || 'None'}</span></div>
      <div>
        <span className="text-slate-400 block text-xs">Contact Details</span>
        <span className="font-medium block">{formData.landlineDetails ? `Landline: ${formData.landlineDetails}` : ''}</span>
        <span className="font-medium block">{formData.faxDetails ? `Fax: ${formData.faxDetails}` : ''}</span>
        <span className="font-medium block">{formData.mobileDetails ? `Mobile: ${formData.mobileDetails}` : ''}</span>
      </div>

      <div className="md:col-span-2 pt-2 border-t"><span className="text-slate-400 block text-xs text-red-600 font-semibold mb-1">ID Validation Details</span></div>
      <div><span className="text-slate-400 block text-xs">ID Type</span><span className="font-medium">{formData.idType}</span></div>
      <div><span className="text-slate-400 block text-xs">ID Number</span><span className="font-medium">{formData.idNumber || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Effectivity Date</span><span className="font-medium">{formData.effectivityDate || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Expiry Date</span><span className="font-medium">{formData.expiryDate || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Issuer</span><span className="font-medium">{formData.issuer || 'N/A'}</span></div>
      <div><span className="text-slate-400 block text-xs">Country of Issue</span><span className="font-medium">{formData.placeOfIssue}</span></div>
    </div>

    {formData.civilStatus === 'Married' && (
      <>
        <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2 mt-8">
          <User size={24} className="text-pink-600"/> Spousal Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Spouse Name</span><span className="font-medium">{formData.spouseName || 'N/A'}</span></div>
          <div><span className="text-slate-400 block text-xs">Spouse TIN</span><span className="font-medium">{formData.spouseTin || 'N/A'}</span></div>
          <div><span className="text-slate-400 block text-xs">Employment Status</span><span className="font-medium">{formData.spouseEmpStatus}</span></div>
          {formData.spouseEmpStatus !== 'Unemployed' && (formData.employersName || formData.employersTin) && (
            <>
              <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Employer's Name</span><span className="font-medium">{formData.employersName || 'N/A'}</span></div>
              <div><span className="text-slate-400 block text-xs">Employer's TIN</span><span className="font-medium">{formData.employersTin || 'N/A'}</span></div>
            </>
          )}
        </div>
      </>
    )}

    <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2 mt-8">
      <Building size={24} className="text-yellow-600"/> Business Details
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Philippine Business Number</span><span className="font-medium">{formData.singleBusinessNum || 'N/A'}</span></div>
    </div>

    <div className="space-y-4 mt-6">
      {formData.businesses.map((business: any, index: number) => (
        <div key={business.id || `biz-${index}`} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <h4 className="font-bold text-blue-400 mb-4 pb-2 border-b border-gray-200">Business Line {index + 1} <span className="text-slate-400 text-xs font-normal ml-2">({business.industryLevel})</span></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Trade/Business Name</span><span className="font-medium">{business.businessName || 'N/A'}</span></div>
            <div><span className="text-slate-400 block text-xs">Line of Business</span><span className="font-medium">{business.businessLine || 'N/A'}</span></div>
            <div><span className="text-slate-400 block text-xs">Regulatory Body</span><span className="font-medium">{business.regulatoryBody || 'N/A'}</span></div>
            <div><span className="text-slate-400 block text-xs">Registration Number</span><span className="font-medium">{business.businessRegNum || 'N/A'}</span></div>
            <div><span className="text-slate-400 block text-xs">Registration Date</span><span className="font-medium">{business.businessRegDate || 'N/A'}</span></div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-6">
      <div className="md:col-span-2 space-y-4">
        <div><span className="text-slate-400 block text-xs">Facility Type (Primary Business)</span><span className="font-medium">{formData.facilityType === 'Others (specify)' ? formData.otherFacilityType : (formData.facilityType || 'N/A')}</span></div>
        <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Facility Address</span><span className="font-medium">{formData.facilityAddress || 'N/A'}</span></div>
      </div>
    </div>

    <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2 mt-8">
      <User size={24} className="text-purple-600"/> Representative Details
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Has Representative?</span><span className="font-medium">{formData.hasRepresentative}</span></div>
      {formData.hasRepresentative === 'Yes' && (
        <>
          <div><span className="text-slate-400 block text-xs">Representative Type</span><span className="font-medium">{formData.relType}</span></div>
          <div><span className="text-slate-400 block text-xs">Relationship Date</span><span className="font-medium">{formData.relDate || 'N/A'}</span></div>
          <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Representative Name</span><span className="font-medium">{formData.repName || 'N/A'}</span></div>
          <div><span className="text-slate-400 block text-xs">Address Type</span><span className="font-medium">{formData.repAddType}</span></div>
          <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Representative Address</span><span className="font-medium">{formData.repAdd || 'N/A'}</span></div>
          <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Representative Email</span><span className="font-medium break-all">{formData.repEmailAdd || 'N/A'}</span></div>
          <div><span className="text-slate-400 block text-xs">Contact Types</span><span className="font-medium">{formData.repPrefContactType || 'None'}</span></div>
          <div>
            <span className="text-slate-400 block text-xs">Contact Details</span>
            <span className="font-medium block">{formData.repLandlineDetails ? `Landline: ${formData.repLandlineDetails}` : ''}</span>
            <span className="font-medium block">{formData.repFaxDetails ? `Fax: ${formData.repFaxDetails}` : ''}</span>
            <span className="font-medium block">{formData.repMobileDetails ? `Mobile: ${formData.repMobileDetails}` : ''}</span>
          </div>
        </>
      )}
    </div>

    <div className="flex items-center gap-2 text-xl font-bold text-slate-100 border-b border-slate-700 pb-2 mt-8">
      <FileText size={24} className="text-green-600"/> Invoices Details
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
      <div className="md:col-span-2"><span className="text-slate-400 block text-xs">Intend to use BIR Printed Invoices?</span><span className="font-medium">{formData.hasInvoices}</span></div>
      {formData.hasInvoices === 'Yes' && (
        <div className="md:col-span-2 space-y-4 mt-2">
          {formData.invoices.map((invoice: any, index: number) => (
            <div key={invoice.id || `inv-${index}`} className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)]">
              <h5 className="font-bold text-blue-400 mb-3 border-b pb-1 text-xs">Invoice {index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <div className="md:col-span-2"><span className="text-slate-400 block">Description of Invoices</span><span className="font-medium">{invoice.invDescription || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Invoice Type</span><span className="font-medium">{invoice.invType || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Manner of Invoices</span><span className="font-medium">{invoice.invManner || 'N/A'}</span></div>
                {['Loose Leaf', 'Both'].includes(invoice.invManner) && <div><span className="text-slate-400 block">No. of Loose Boxes/Booklets</span><span className="font-medium">{invoice.numOfBoxesLoose || '0'}</span></div>}
                {['Bound', 'Both'].includes(invoice.invManner) && <div><span className="text-slate-400 block">No. of Bound Boxes/Booklets</span><span className="font-medium">{invoice.numOfBoxesBound || '0'}</span></div>}
                <div><span className="text-slate-400 block">No. of Sets per Box/Booklet</span><span className="font-medium">{invoice.numOfSetsPerBoxes || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">No. of Copies per Set</span><span className="font-medium">{invoice.numOfCopies || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Serial No. Start</span><span className="font-medium">{invoice.serialStart || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Serial No. End</span><span className="font-medium">{invoice.serialEnd || 'N/A'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function Form1901() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Parse URL on load for edit/view modes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit');
    const view = params.get('view');
    
    const fetchApplication = async (id: string, isView: boolean) => {
      setIsFetchingData(true);
      try {
        const res = await fetch(`/api/applications/${id}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.data);
          if (isView) {
            setStep(8); // Jump to the Thank You page
            setShowSummary(false);
          } else {
            setStep(1); // Start editing from step 1
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingData(false);
      }
    };

    if (edit) {
      setEditId(edit);
      fetchApplication(edit, false);
    } else if (view) {
      setViewId(view);
      fetchApplication(view, true);
    }
  }, []);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateBusinessForm = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newBusinesses = [...formData.businesses];
    newBusinesses[index] = { ...newBusinesses[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, businesses: newBusinesses });
  };

  const addBusiness = () => {
    const primaryCount = formData.businesses.filter((b: any) => b.industryLevel === 'Primary').length;
    const secondaryCount = formData.businesses.filter((b: any) => b.industryLevel === 'Secondary').length;
    if (primaryCount === 1 && secondaryCount < 1) {
      setFormData({
        ...formData,
        businesses: [...formData.businesses, { id: Date.now(), businessName: '', businessRegNum: '', businessRegDate: '', businessLine: '', industryLevel: 'Secondary', regulatoryBody: '' }]
      });
    }
  };

  const removeBusiness = (index: number) => {
    if (index === 0) return; // Prevent removing primary
    const newBusinesses = [...formData.businesses];
    newBusinesses.splice(index, 1);
    setFormData({ ...formData, businesses: newBusinesses });
  };

  const updateInvoiceForm = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newInvoices = [...formData.invoices];
    newInvoices[index] = { ...newInvoices[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, invoices: newInvoices });
  };

  const addInvoice = () => {
    setFormData({
      ...formData,
      invoices: [...formData.invoices, { id: Date.now(), invDescription: '', invType: '', invManner: '', numOfBoxesLoose: '', numOfBoxesBound: '', numOfSetsPerBoxes: '', numOfCopies: '', serialStart: '', serialEnd: '' }]
    });
  };

  const removeInvoice = (index: number) => {
    if (index === 0) return; // Prevent removing primary
    const newInvoices = [...formData.invoices];
    newInvoices.splice(index, 1);
    setFormData({ ...formData, invoices: newInvoices });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev: any) => {
      let currentVals = prev[name] ? prev[name].split(', ').filter(Boolean) : [];
      if (checked) {
        currentVals.push(value);
      } else {
        currentVals = currentVals.filter((v: string) => v !== value);
      }
      return { ...prev, [name]: currentVals.join(', ') };
    });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 8));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear previous errors

    if (step === 7) {
      // Age Validation Logic
      if (formData.birthDate) {
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18 && formData.hasRepresentative === 'No') {
          setErrorMessage("Applicants under 18 years old lack full contractual capacity and must process their registration through a parent or court-appointed legal guardian via the Authorized Representative section.");
          return; // Block submission
        }
      }
      
      try {
        const url = editId ? `/api/applications/${editId}` : '/api/submit';
        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          if (editId) {
            window.location.href = '/dashboard'; // Redirect back to dashboard after editing
          } else {
            if (result.applicantID) {
              setFormData({...formData, applicantID: result.applicantID});
            }
            nextStep(); // Go to step 8 (Dashboard)
          }
        } else {
          setErrorMessage(result.details ? `${result.error}: ${result.details}` : (result.error || "Failed to submit application."));
        }
      } catch (error) {
        console.error("Submission Error:", error);
        setErrorMessage("A network error occurred while submitting the application.");
      }
      
    } else {
      nextStep();
    }
  };

  const handleLogout = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowSummary(false);
    setStep(0);
  };

  const selectStyles = "w-full border border-[var(--color-border)] px-3 py-2.5 text-sm rounded-lg bg-[var(--color-surface-light)] text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";
  const labelStyles = "text-[13px] font-semibold text-[var(--color-text-primary)]";

  // Calculate minimum expiry date (either effectivity date or today)
  const minExpiryDate = formData.effectivityDate || new Date().toISOString().split("T")[0];

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col font-sans relative overflow-hidden">
        {/* Header */}
        <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-md mx-auto px-6 py-3 sm:max-w-2xl flex items-center justify-between gap-3">
            {step < 8 && (
              <Link href="/" className="hover:text-[var(--color-text-secondary)] transition-colors">
                <ArrowLeft size={20} />
              </Link>
            )}
            <Link href="/" className="flex items-center gap-2 font-bold">
              <img src="/bir-logo.png" alt="BIR" className="w-9 h-9 object-contain" />
              <div className="flex flex-col leading-tight -space-y-0.5">
                <span className="text-xs text-[var(--color-text-secondary)]">Bureau of</span>
                <span className="text-sm text-[var(--color-accent-primary)] font-bold">Internal Revenue</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-2 ml-auto">
              {step >= 8 ? (
                <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors">
                  Logout
                </button>
              ) : (
                <div className="text-xs bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  {`Step ${step} of 7`}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-md mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-center relative z-10">
          <div className="my-auto py-12">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              <span className="text-[var(--color-accent-primary)]">Register your</span><br/>
              <span className="text-white">Business</span><br/>
              <span className="text-[var(--color-accent-primary)]">with ease.</span>
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] mb-12 leading-relaxed max-w-md">
              Experience the streamlined <span className="text-[var(--color-accent-primary)] font-semibold">BIR Form 1901</span>. Apply for registration of <span className="text-[var(--color-accent-primary)]">self-employed and mixed income</span> individuals, estates, and trusts digitally.
            </p>

            <button 
              onClick={() => setStep(1)} 
              className="w-full bg-[var(--color-accent-primary)] text-black font-bold text-base py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
            >
              Start Application <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <header className="bg-[var(--color-surface)]/80 text-[var(--color-text-primary)] backdrop-blur-lg sticky top-0 z-50 border-b border-[var(--color-border)]">
        <div className="max-w-md mx-auto px-6 py-3 sm:max-w-2xl lg:max-w-4xl flex items-center gap-3">
          {step < 8 && (
            <Link href="/" className="hover:text-[var(--color-text-secondary)] transition-colors">
              <ArrowLeft size={20} />
            </Link>
          )}
          <div className="flex items-center gap-3">
            <img src="/bir-logo.png" alt="BIR" className="w-9 h-9 object-contain" />
            <h1 className="font-semibold text-sm sm:text-base">BIR Form 1901 Registration</h1>
          </div>
          
          {step >= 8 ? (
            <div className="ml-auto flex items-center gap-2">
              <Link href="/dashboard" className="text-xs bg-[#FACC15] text-[#1e3a8a] px-3 sm:px-4 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 hover:bg-[#EAB308] shadow-sm">
                <Building size={14} />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </Link>
              <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 rounded-lg font-semibold transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-auto text-xs bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
              {`Step ${step} of 7`}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 sm:py-8 sm:max-w-2xl lg:max-w-4xl">
        <div className="bg-[var(--color-surface-light)]/50 rounded-2xl border border-[var(--color-border)] overflow-hidden backdrop-blur-sm">
          {step < 8 && (
            <div className="px-4 py-6 sm:px-6 sm:py-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]/60">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <span className="font-bold text-[var(--color-text-primary)] text-sm sm:text-lg">Step {step} of 7</span>
                <span className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-medium">{Math.round(((step - 1) / 7) * 100)}% complete</span>
              </div>
              
              <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto px-1 sm:px-4">
                {/* Background Line */}
                <div className="absolute left-1 right-1 sm:left-4 sm:right-4 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-border)] rounded"></div>
                {/* Active Line Progress */}
                <div className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-accent-primary)] rounded transition-all duration-500 sm:block hidden" style={{ width: `calc(${((step - 1) / 6) * 100}% - 2rem)` }}></div>
                <div className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-accent-primary)] rounded transition-all duration-500 sm:hidden" style={{ width: `calc(${((step - 1) / 6) * 100}% - 0.5rem)` }}></div>
                
                {FORM_STEPS.map((s) => {
                  const isActive = step === s.id;
                  const isCompleted = step > s.id;
                  
                  return (
                    <div key={s.id} className="relative flex flex-col items-center group z-10">
                      <button 
                        type="button"
                        onClick={() => { if (isCompleted) setStep(s.id); }}
                        className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                        isActive ? 'bg-[var(--color-accent-primary)] text-black ring-[3px] sm:ring-[4px] ring-[var(--color-accent-primary)]/20 border-2 border-transparent cursor-default' :
                        isCompleted ? 'bg-[var(--color-surface-light)] border-2 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] cursor-pointer hover:bg-[var(--color-accent-primary)]/10 hover:scale-110' :
                        'bg-[var(--color-surface-light)] border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed'
                      }`}>
                        {s.id}
                      </button>
                      <span className={`absolute -bottom-5 sm:-bottom-6 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${
                        isActive ? 'block text-[var(--color-accent-primary)]' : 
                        isCompleted ? 'hidden sm:block text-[var(--color-text-primary)]' : 'hidden sm:block text-[var(--color-text-secondary)]'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {step === 8 ? (
            <div className="p-0">
              {showSummary ? (
                <>
                  <div className="bg-slate-800/60 p-8 text-center border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white">Application Summary</h2>
                    <p className="text-sm text-slate-300 mt-2">Here is the complete record of your submission.</p>
                  </div>
              
              <div className="p-6 sm:p-10 space-y-8 bg-slate-800/30">
                <ApplicationSummaryView formData={formData} />
              </div>
                
              <div className="p-6 border-t border-slate-700 bg-slate-800/20 flex justify-center">
                <button onClick={() => viewId ? window.location.href = '/dashboard' : setShowSummary(false)} className="bg-[var(--color-bir-yellow)] text-[var(--color-bir-blue)] px-8 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors font-semibold flex items-center gap-2">
                  <ArrowLeft size={18} /> Back to Dashboard
                </button>
              </div>
            </>
              ) : (
                <div className="p-8 sm:p-16 text-center bg-slate-800/30 min-h-[450px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--color-bir-yellow)]">Welcome, {formData.tpName || 'Taxpayer'}!</h2>
                  <p className="text-slate-300 mt-2 max-w-md mx-auto">Your application has been successfully processed and recorded in the system.</p>
                  
                  <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <button onClick={() => setShowSummary(true)} className="bg-slate-700 border border-slate-600 p-6 rounded-lg shadow-sm hover:shadow-md hover:border-[var(--color-bir-yellow)] transition-all group flex flex-col items-center gap-4 cursor-pointer text-left w-full">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-[var(--color-bir-yellow)] group-hover:scale-110 transition-transform">
                            <FileText size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white text-lg">Application Summary</h3>
                            <p className="text-xs text-slate-400 mt-1">Review the details of your submitted form</p>
                        </div>
                    </button>

                    <button 
                      onClick={() => { window.location.href = '/form-1901?edit=' + formData.applicantID; }} 
                      className="bg-slate-700 border border-slate-600 p-6 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 transition-all group flex flex-col items-center gap-4 cursor-pointer text-left w-full"
                    >
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Edit size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white text-lg">Edit Registration</h3>
                            <p className="text-xs text-slate-400 mt-1">Update your submitted application details</p>
                        </div>
                    </button>

                    <button 
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to permanently delete your registration?")) {
                          try {
                            const res = await fetch(`/api/applications/${formData.applicantID}`, { method: 'DELETE' });
                            if (res.ok) window.location.href = '/';
                            else alert('Failed to delete application.');
                          } catch(e) {
                            alert('Error deleting application.');
                          }
                        }
                      }}
                      className="bg-slate-700 border border-slate-600 p-6 rounded-lg shadow-sm hover:shadow-md hover:border-red-400 transition-all group flex flex-col items-center gap-4 cursor-pointer text-left w-full"
                    >
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                            <Trash2 size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white text-lg">Delete Registration</h3>
                            <p className="text-xs text-slate-400 mt-1">Permanently remove your application</p>
                        </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 bg-[var(--color-background)]">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[var(--color-accent-primary)] border-b border-[var(--color-border)] pb-3">Step 1: Applicant Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Taxpayer Identification Number (TIN)" name="tin" placeholder="000-000-000-000" pattern="^\d{3}-\d{3}-\d{3}(?:-\d{3})?$" maxLength={15} formData={formData} updateForm={updateForm} optionalLabel />
                    <InputField label="PhilSys Card Number" name="philsysCardNum" placeholder="0000-0000-0000-0000-0" pattern="^\d{4}-\d{4}-\d{4}-\d{4}-\d$" maxLength={21} formData={formData} updateForm={updateForm} optionalLabel />
                    
                    <div className="md:col-span-2 space-y-1">
                      <label className={labelStyles}>Taxpayer Type <span className="text-red-500">*</span></label>
                      <select name="tpType" value={formData.tpType} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Taxpayer Type</option>
                        <option>Single Proprietorship Only (Resident Citizen)</option>
                        <option>Single Proprietor - Digital Service Provider</option>
                        <option>Resident Alien - Single Proprietorship</option>
                        <option>Resident Alien - Professional</option>
                        <option>Professional - Licensed (PRC, IBP)</option>
                        <option>Professional - In General</option>
                        <option>Professional and Single Proprietor</option>
                        <option>Mixed Income Earner - Compensation Income Earner & Single Proprietor</option>
                        <option>Mixed Income Earner - Compensation Income Earner & Professional</option>
                        <option>Mixed Income Earner - Compensation Income Earner, Single Proprietor & Professional</option>
                        <option>Non-Resident Alien Engaged in Trade/Business</option>
                        <option>Estate - Filipino Citizen</option>
                        <option>Estate - Foreign National</option>
                        <option>Trust - Filipino Citizen</option>
                        <option>Trust - Foreign National</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <InputField label="Taxpayer Name (Last, First, Middle)" name="tpName" placeholder="Dela Cruz, Juan, G." required formData={formData} updateForm={updateForm} />
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyles}>Gender <span className="text-red-500">*</span></label>
                      <select name="gender" value={formData.gender} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Gender</option>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyles}>Civil Status <span className="text-red-500">*</span></label>
                      <select name="civilStatus" value={formData.civilStatus} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Civil Status</option>
                        <option>Single</option><option>Married</option><option>Widow/er</option><option>Legally Separated</option>
                      </select>
                    </div>
                    
                    <InputField label="Date of Birth" name="birthDate" type="date" required formData={formData} updateForm={updateForm} />
                    <InputField label="Place of Birth" name="birthPlace" formData={formData} updateForm={updateForm} required />
                    <InputField label="Mother's Maiden Name (Last, First, Middle)" name="motherMaidenName" formData={formData} updateForm={updateForm} required />
                    <InputField label="Father's Name (Last, First, Middle)" name="fatherName" formData={formData} updateForm={updateForm} required />
                    
                    <div className="space-y-1">
                      <label className={labelStyles}>Citizenship <span className="text-red-500">*</span></label>
                      <select name="citizenship" value={formData.citizenship} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Citizenship</option>
                        <option>Filipino</option><option>Other</option>
                      </select>
                    </div>
                    {formData.citizenship === 'Other' && (
                      <InputField label="Specify Other Citizenship" name="otherCitizenship" formData={formData} updateForm={updateForm} required />
                    )}
                    
                    <div className="md:col-span-2"><InputField label="Local Residence Address" name="localResAdd" placeholder="Street, Brgy, City, Province, Zip" formData={formData} updateForm={updateForm} required /></div>
                    <div className="md:col-span-2"><InputField label="Business Address" name="businessAdd" placeholder="Street, Brgy, City, Province, Zip" formData={formData} updateForm={updateForm} required /></div>
                    <div className="md:col-span-2"><InputField label="Foreign Address" name="foreignAdd" placeholder="Street, City, Country" formData={formData} updateForm={updateForm} optionalLabel /></div>
                    
                    <div className="md:col-span-2"><InputField label="Email Address" name="emailAdd" type="email" placeholder="juan.delacruz@example.com" required formData={formData} updateForm={updateForm} /></div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 2: Classification, Contact & ID</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Purpose of TIN Application" name="tinApplicationPurpose" formData={formData} updateForm={updateForm} required />
                    
                    <div className="space-y-1">
                      <label className={labelStyles}>Availing 8% income tax rate option? <span className="text-red-500">*</span></label>
                      <select name="isUsing8percentFlatTax" value={formData.isUsing8percentFlatTax} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Option</option>
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 space-y-1">
                      <label className={labelStyles}>Taxpayer Classification (Gross Sales) <span className="text-red-500">*</span></label>
                      <select name="expectedAnnualGs" value={formData.expectedAnnualGs} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Classification</option>
                        <option value="Micro">Micro - Less than Three Million Pesos (P3M)</option>
                        <option value="Small">Small - Three Million to less than Twenty Million (P20M)</option>
                        <option value="Medium">Medium - Twenty Million to Less than One Billion (P1B)</option>
                        <option value="Large">Large - One Billion Pesos (P1B) and above</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2 pt-2 border-t mt-2">
                      <label className={labelStyles}>Preferred Contact Type <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-sm">
                        {['Landline Number', 'Fax Number', 'Mobile Number'].map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="prefContactType" value={type} checked={formData.prefContactType.includes(type)} onChange={handleCheckboxChange} className="accent-[#1e3a8a] w-4 h-4" />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      {formData.prefContactType.includes('Landline Number') && (
                        <InputField label="Landline Details" name="landlineDetails" placeholder="e.g. 02 8123 4567" pattern="^[\d\s\-\+()]{7,20}$" maxLength={20} formData={formData} updateForm={updateForm} required />
                      )}
                      {formData.prefContactType.includes('Fax Number') && (
                        <InputField label="Fax Details" name="faxDetails" placeholder="e.g. 02 8123 4567" pattern="^[\d\s\-\+()]{7,20}$" maxLength={20} formData={formData} updateForm={updateForm} required />
                      )}
                      {formData.prefContactType.includes('Mobile Number') && (
                        <InputField label="Mobile Details" name="mobileDetails" placeholder="e.g. 09123456789" pattern="^[\d\s\-\+()]{10,15}$" maxLength={15} formData={formData} updateForm={updateForm} required />
                      )}
                    </div>
                    
                    <div className="md:col-span-2 mt-4"><h3 className="font-semibold text-base text-red-600 border-b pb-2">Identification Details</h3></div>
                    <div className="space-y-1">
                      <label className={labelStyles}>ID Type <span className="text-red-500">*</span></label>
                      <select name="idType" value={formData.idType} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select ID Type</option>
                        <option>Passport</option><option>Driver's License</option><option>Company ID</option><option>UMID</option><option>Postal ID</option><option>Other</option>
                      </select>
                    </div>
                    {formData.idType === 'Other' && (
                      <InputField label="Specify Other ID Type" name="otherIdType" formData={formData} updateForm={updateForm} required />
                    )}
                    <InputField 
                      label="ID Number" 
                      name="idNumber" 
                      formData={formData} 
                      updateForm={updateForm} 
                      required 
                      pattern={formData.idType === 'Passport' ? "^[A-Za-z0-9]{8,12}$" : undefined}
                      maxLength={formData.idType === 'Passport' ? 12 : 30}
                      placeholder={formData.idType === 'Passport' ? "e.g. P1234567A" : ""}
                    />
                    <InputField label="Effectivity Date" name="effectivityDate" type="date" formData={formData} updateForm={updateForm} required />
                    <InputField label="Expiry Date" name="expiryDate" type="date" min={minExpiryDate} formData={formData} updateForm={updateForm} required />
                    <InputField label="Issuer" name="issuer" placeholder="e.g. DFA, LTO" formData={formData} updateForm={updateForm} required />
                    <div className="space-y-1">
                      <label className={labelStyles}>Country of Issue <span className="text-red-500">*</span></label>
                      <select name="placeOfIssue" value={formData.placeOfIssue} onChange={updateForm} className={selectStyles} required>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 3: Spousal Information</h2>
                  {formData.civilStatus === 'Single' ? (
                    <div className="p-6 bg-blue-50 border-l-4 border-[#1e3a8a] rounded-r-lg text-sm">
                      <p className="text-[#1e3a8a]">You selected "Single" as your civil status. This section is not required.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2"><InputField label="Spouse Name (Last, First, Middle)" name="spouseName" formData={formData} updateForm={updateForm} required /></div>
                      <InputField label="Spouse TIN" name="spouseTin" placeholder="e.g. 123-456-789-000" pattern="^\d{3}-\d{3}-\d{3}(?:-\d{3})?$" maxLength={15} formData={formData} updateForm={updateForm} optionalLabel />
                      
                      <div className="space-y-1">
                        <label className={`${labelStyles} flex justify-between`}>Spouse Employment Status <span className="text-red-500">*</span></label>
                        <select name="spouseEmpStatus" value={formData.spouseEmpStatus} onChange={updateForm} className={selectStyles} required>
                          <option value="" disabled>Select Employment Status</option>
                          <option>Employed Locally</option>
                          <option>Employed Abroad</option>
                          <option>Engaged in Business/Practice of Profession</option>
                          <option>Unemployed</option>
                        </select>
                      </div>

                      {formData.spouseEmpStatus !== 'Unemployed' && (
                        <>
                          <div className="md:col-span-2"><InputField label="Spouse Employer's Name" name="employersName" formData={formData} updateForm={updateForm} required /></div>
                          <div className="md:col-span-2"><InputField label="Spouse Employer's TIN" name="employersTin" placeholder="e.g. 123-456-789-000" pattern="^\d{3}-\d{3}-\d{3}(?:-\d{3})?$" maxLength={15} formData={formData} updateForm={updateForm} required /></div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 4: Business & Facility Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div className="md:col-span-2"><InputField label="Philippine Business Number" name="singleBusinessNum" placeholder="e.g. PBN-2008-0314-00456" formData={formData} updateForm={updateForm} optionalLabel /></div>
                  </div>

                  <div className="space-y-8">
                    {formData.businesses.map((business: any, index: number) => (
                      <div key={business.id || `biz-edit-${index}`} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm relative">
                        {index > 0 && (
                          <button onClick={() => removeBusiness(index)} type="button" className="absolute top-6 right-6 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">Delete</button>
                        )}
                        <h3 className="font-semibold text-[#1e3a8a] mb-6 border-b pb-2">Business Line {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <InputField label="Trade/Business Name" name="businessName" formData={business} updateForm={(e: any) => updateBusinessForm(index, e)} required />
                          </div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <label className={labelStyles}>Industry Level <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 mt-1.5 text-sm">
                              <label className={`flex items-center gap-2 ${index > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input type="radio" name="industryLevel" value="Primary" checked={business.industryLevel === 'Primary'} onChange={(e: any) => updateBusinessForm(index, e)} disabled={index > 0} className="accent-[#1e3a8a] w-4 h-4" />
                                <span>Primary Business</span>
                              </label>
                              <label className={`flex items-center gap-2 ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input type="radio" name="industryLevel" value="Secondary" checked={business.industryLevel === 'Secondary'} onChange={(e: any) => updateBusinessForm(index, e)} disabled={index === 0} className="accent-[#1e3a8a] w-4 h-4" />
                                <span>Secondary Business</span>
                              </label>
                            </div>
                          </div>

                          <InputField label="Line of Business" name="businessLine" formData={business} updateForm={(e: any) => updateBusinessForm(index, e)} required />
                          <InputField label="Regulatory Body (e.g. DTI, SEC)" name="regulatoryBody" formData={business} updateForm={(e: any) => updateBusinessForm(index, e)} required />
                          
                          <InputField label="Business Registration Number" name="businessRegNum" placeholder="DTI No. 2008-03-98765" formData={business} updateForm={(e: any) => updateBusinessForm(index, e)} required />
                          <InputField label="Registration Date" name="businessRegDate" type="date" formData={business} updateForm={(e: any) => updateBusinessForm(index, e)} optionalLabel />
                        </div>
                      </div>
                    ))}

                    {formData.businesses.length < 2 && (
                      <div className="flex justify-center mt-4">
                        <button type="button" onClick={addBusiness} className="bg-transparent border-2 border-dashed border-gray-600 text-gray-400 px-6 py-4 rounded-xl hover:border-[#FACC15] hover:text-[#FACC15] font-semibold transition-colors w-full sm:w-auto">
                          + Add Another Business Line
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 border-t pt-8">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-base text-red-600 border-b pb-2">Facility Details (Primary Business)</h3>
                      <p className="text-[11px] text-gray-500 mt-2 font-medium">Please provide the facility details associated with your Primary Business.</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelStyles}>Facility Type <span className="text-red-500">*</span></label>
                      <select name="facilityType" value={formData.facilityType} onChange={updateForm} className={selectStyles} required>
                        <option value="" disabled>Select Facility Type</option>
                        <option>PP-Place of Production/Plant</option>
                        <option>SP-Storage Place</option>
                        <option>WH-Warehouse</option>
                        <option>SR-Showroom</option>
                        <option>GG-Garage</option>
                        <option>BT-Bus Terminal</option>
                        <option>RP-Real Property for Lease with No Sales Activity</option>
                        <option>Others (specify)</option>
                      </select>
                    </div>
                    {formData.facilityType === 'Others (specify)' && (
                      <div className="md:col-span-2"><InputField label="Specify Other Facility Type" name="otherFacilityType" formData={formData} updateForm={updateForm} required /></div>
                    )}
                    <div className="md:col-span-2"><InputField label="Facility Address" name="facilityAddress" formData={formData} updateForm={updateForm} required /></div>
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 5: Authorized Representative</h2>
                  <div className="space-y-1 pb-2">
                    <label className={labelStyles}>Do you have an authorized representative?</label>
                    <div className="flex gap-4 mt-1.5 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasRepresentative" value="Yes" checked={formData.hasRepresentative === 'Yes'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasRepresentative" value="No" checked={formData.hasRepresentative === 'No'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {formData.hasRepresentative === 'Yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
                      
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelStyles}>Representative Type <span className="text-red-500">*</span></label>
                        <div className="flex gap-4 mt-1.5 text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="relType" value="Individual" checked={formData.relType === 'Individual'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                            <span>Individual</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="relType" value="Non-Individual" checked={formData.relType === 'Non-Individual'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                            <span>Non-Individual</span>
                          </label>
                        </div>
                      </div>

                      <div className="md:col-span-2"><InputField label={formData.relType === 'Individual' ? "Representative Name (Last, First, Middle)" : "Registered Name"} name="repName" formData={formData} updateForm={updateForm} required /></div>
                      <InputField label="Relationship Date" name="relDate" type="date" formData={formData} updateForm={updateForm} required />
                      <div className="space-y-1">
                        <label className={labelStyles}>Address Type <span className="text-red-500">*</span></label>
                        <select name="repAddType" value={formData.repAddType} onChange={updateForm} className={selectStyles.replace('bg-gray-50', 'bg-white')} required>
                          <option value="" disabled>Select Address Type</option>
                          <option>Residence</option><option>Place of Business</option><option>Employer Address</option>
                        </select>
                      </div>
                      <div className="md:col-span-2"><InputField label="Representative Address" name="repAdd" formData={formData} updateForm={updateForm} required /></div>
                      <div className="md:col-span-2"><InputField label="Email Address" name="repEmailAdd" type="email" formData={formData} updateForm={updateForm} required /></div>
                      
                      <div className="space-y-1 md:col-span-2 border-t pt-4">
                        <label className={labelStyles}>Preferred Contact Type <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-4 mt-1.5 text-sm">
                          {['Landline Number', 'Fax Number', 'Mobile Number'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="repPrefContactType" value={type} checked={formData.repPrefContactType.includes(type)} onChange={handleCheckboxChange} className="accent-[#1e3a8a] w-4 h-4" />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        {formData.repPrefContactType.includes('Landline Number') && (
                          <InputField label="Landline Details" name="repLandlineDetails" placeholder="e.g. 02 8123 4567" pattern="^[\d\s\-\+()]{7,20}$" maxLength={20} formData={formData} updateForm={updateForm} required />
                        )}
                        {formData.repPrefContactType.includes('Fax Number') && (
                          <InputField label="Fax Details" name="repFaxDetails" placeholder="e.g. 02 8123 4567" pattern="^[\d\s\-\+()]{7,20}$" maxLength={20} formData={formData} updateForm={updateForm} required />
                        )}
                        {formData.repPrefContactType.includes('Mobile Number') && (
                          <InputField label="Mobile Details" name="repMobileDetails" placeholder="e.g. 09123456789" pattern="^[\d\s\-\+()]{10,15}$" maxLength={15} formData={formData} updateForm={updateForm} required />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 6: Invoices</h2>
                  <div className="space-y-1 pb-2">
                    <label className={labelStyles}>Do you intend to use BIR Printed Invoices?</label>
                    <div className="flex gap-4 mt-1.5 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasInvoices" value="Yes" checked={formData.hasInvoices === 'Yes'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasInvoices" value="No" checked={formData.hasInvoices === 'No'} onChange={updateForm} className="accent-[#1e3a8a] w-4 h-4" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {formData.hasInvoices === 'Yes' && (
                    <div className="space-y-8">
                      {formData.invoices.map((invoice: any, index: number) => (
                        <div key={invoice.id || `inv-edit-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] relative">
                          {index > 0 && (
                            <button onClick={() => removeInvoice(index)} type="button" className="absolute top-6 right-6 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">Delete</button>
                          )}
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-[#1e3a8a] mb-4 border-b pb-2">Invoice {index + 1}</h3>
                          </div>
                          
                          <div className="md:col-span-2"><InputField label="Description of Invoices" name="invDescription" placeholder="e.g. Sales Invoice" formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} maxLength={30} required /></div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <label className={labelStyles}>Invoice Type <span className="text-red-500">*</span></label>
                            <select name="invType" value={invoice.invType} onChange={(e: any) => updateInvoiceForm(index, e)} className={selectStyles.replace('bg-gray-50', 'bg-white')} required>
                              <option value="" disabled>Select Invoice Type</option>
                              <option>VAT</option><option>NON-VAT</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <label className={labelStyles}>Manner of Invoices <span className="text-red-500">*</span></label>
                            <select name="invManner" value={invoice.invManner} onChange={(e: any) => updateInvoiceForm(index, e)} className={selectStyles.replace('bg-gray-50', 'bg-white')} required>
                              <option value="" disabled>Select Manner of Invoices</option>
                              <option>Loose Leaf</option><option>Bound</option><option>Both</option>
                            </select>
                          </div>
                          
                          {['Loose Leaf', 'Both'].includes(invoice.invManner) && (
                            <InputField label="No. of Loose Boxes/Booklets" name="numOfBoxesLoose" type="number" placeholder="e.g. 0" min={1} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                          )}
                          {['Bound', 'Both'].includes(invoice.invManner) && (
                            <InputField label="No. of Bound Boxes/Booklets" name="numOfBoxesBound" type="number" placeholder="e.g. 5" min={1} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                          )}
                          <InputField label="No. of Sets per Box/Booklet" name="numOfSetsPerBoxes" type="number" placeholder="e.g. 50" min={1} max={100000} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                          <InputField label="No. of Copies per Set" name="numOfCopies" type="number" placeholder="e.g. 3" min={1} max={100} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                          <InputField label="Serial No. Start" name="serialStart" type="text" placeholder="e.g. OR-2026-00001" pattern="^[A-Za-z0-9\-]+$" maxLength={20} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                          <InputField label="Serial No. End" name="serialEnd" type="text" placeholder="e.g. OR-2026-00050" pattern="^[A-Za-z0-9\-]+$" maxLength={20} formData={invoice} updateForm={(e: any) => updateInvoiceForm(index, e)} required />
                        </div>
                      ))}
                      
                      <div className="flex justify-center mt-4">
                        <button type="button" onClick={addInvoice} className="bg-transparent border-2 border-dashed border-gray-600 text-gray-400 px-6 py-4 rounded-xl hover:border-[#FACC15] hover:text-[#FACC15] font-semibold transition-colors w-full sm:w-auto">
                          + Add Another Printed Invoice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7 */}
              {step === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1e3a8a] border-b pb-3">Step 7: Final Review & Submit</h2>
                  
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden p-6 max-h-[50vh] overflow-y-auto shadow-inner">
                    <ApplicationSummaryView formData={formData} />
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-5 flex gap-3 text-xs text-blue-200">
                    <div className="mt-0.5"><CheckCircle2 size={16} className="text-blue-400" /></div>
                    <p className="leading-relaxed"><strong>Declaration:</strong> I declare, under the penalties of perjury, that this application has been made in good faith, verified by me and to the best of my knowledge and belief, is true and correct, pursuant to the provisions of the National Internal Revenue Code, as amended, and the regulations issued under the authority thereof. Further, I give my consent to the processing of my information as contemplated under the Data Privacy Act of 2012 for legitimate and lawful purposes.</p>
                  </div>
                  
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-start gap-3">
                      <div className="mt-0.5">⚠️</div>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 pt-5 border-t flex justify-between items-center">
                <button type="button" onClick={prevStep} disabled={step === 1} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ArrowLeft size={16} /> Back
                </button>
                {step < 7 && (
                  <button type="submit" className="flex items-center gap-2 bg-[#FACC15] text-[#1e3a8a] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#EAB308] hover:shadow-lg transition-all">
                    Continue <ArrowRight size={16} />
                  </button>
                )}
                {step === 7 && !viewId && (
                  <button type="submit" disabled={isFetchingData} className="flex items-center gap-2 bg-[#FACC15] text-[#1e3a8a] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#EAB308] hover:shadow-lg transition-all">
                    {editId ? 'Save Changes' : 'Submit Application'}
                  </button>
                )}
                {step === 7 && viewId && (
                  <button type="button" onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all">
                    Back to Dashboard
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
