'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Database, Code, Play, X, Info, ShieldAlert, Loader2 } from 'lucide-react';

const queries = [
  {
    id: 'q1',
    category: 'Simple Queries',
    title: 'Facility Filter',
    description: 'Finds applicantID and address where facilityType = "Others (Office)".',
    sql: `SELECT applicantID, facilityAddress\nFROM bir_db.facility\nWHERE facilityType = 'Others (Office)';`,
    breakdown: [
      'Uses a basic WHERE clause to filter records.',
      'Projects only two specific columns from the facility table.',
      'Simple and highly performant for direct lookups.'
    ]
  },
  {
    id: 'q2',
    category: 'Simple Queries',
    title: 'Regulatory Audit',
    description: 'Filters enterprise structures verified under DTI or LGU regulatory bodies.',
    sql: `SELECT businessName, businessRegNum, businessLine\nFROM bir_db.industry\nWHERE regulatoryBody LIKE '%DTI%'\n   OR regulatoryBody LIKE '%LGU%';`,
    breakdown: [
      'Utilizes the LIKE operator for pattern matching.',
      'Combines two predicates using the logical OR operator.',
      'Filters out businesses not matching the specific substrings.'
    ]
  },
  {
    id: 'q3',
    category: 'Simple Queries',
    title: 'Spousal Linkage',
    description: 'Isolate and map tracking IDs for applicants with active spousal employment.',
    sql: `SELECT applicantID, spouseID, spouseName, spouseEmpStatus, employersName\nFROM bir_db.spousal\nWHERE spouseEmpStatus IS NOT NULL;`,
    breakdown: [
      'Uses the IS NOT NULL operator to ensure data existence.',
      'Filters records to only include spouses with an employment status.',
      'Projects multiple attributes representing the spousal relationship.'
    ]
  },
  {
    id: 'q4',
    category: 'Moderate Queries',
    title: 'Civil Density',
    description: 'Group and rank total applicant density sorted by civil status counts.',
    sql: `SELECT civilStatus, COUNT(applicantID) AS Total_Applicants\nFROM bir_db.applicant\nGROUP BY civilStatus\nORDER BY Total_Applicants DESC;`,
    breakdown: [
      'Implements an aggregate function (COUNT) to calculate density.',
      'Uses the GROUP BY clause to aggregate data by civil status.',
      'Orders the result set using ORDER BY DESC to create a ranking.'
    ]
  },
  {
    id: 'q5',
    category: 'Moderate Queries',
    title: 'Invoice Analytics',
    description: 'Evaluate mathematical metrics across distinct VAT/Non-VAT thresholds.',
    sql: `SELECT invType, AVG(numOfCopies) AS AVG_Copies, MIN(numOfCopies) AS MIN_Copies, MAX(numOfCopies) AS MAX_Copies\nFROM bir_db.invoices\nGROUP BY invType\nHAVING AVG(numOfCopies) > 2;`,
    breakdown: [
      'Applies multiple mathematical aggregate functions (AVG, MIN, MAX).',
      'Groups records by the invoice type.',
      'Uses the HAVING clause to filter aggregate results after grouping.'
    ]
  },
  {
    id: 'q6',
    category: 'Moderate Queries',
    title: 'Case Normalization',
    description: 'Standardize spousal records alphabetically using systemic string manipulation.',
    sql: `SELECT applicantID, spouseName, UPPER(spouseEmpStatus)\nFROM bir_db.spousal\nWHERE spouseName IS NOT NULL\nORDER BY spouseName;`,
    breakdown: [
      'Applies a string manipulation function (UPPER) to normalize text.',
      'Ensures data validity by filtering out NULL spouse names.',
      'Sorts the final projection alphabetically.'
    ]
  },
  {
    id: 'q7',
    category: 'Difficult Queries',
    title: 'Channel Popularity',
    description: 'Relational join evaluating contact preferences across demographic statuses.',
    sql: `SELECT ac.prefContactType, COUNT(ac.applicantID) AS totalApplicants, COUNT(DISTINCT a.civilStatus)\nFROM bir_db.applicantcontact ac\nJOIN bir_db.applicant a ON ac.applicantID = a.applicantID\nGROUP BY ac.prefContactType\nORDER BY totalApplicants DESC;`,
    breakdown: [
      'Executes an explicit INNER JOIN between applicant and contact tables.',
      'Uses COUNT DISTINCT to find unique demographic overlaps.',
      'Groups and ranks the relational output by popularity.'
    ]
  },
  {
    id: 'q8',
    category: 'Difficult Queries',
    title: 'Representative Matrix',
    description: '3-way explicit table join compiling applicant-to-handler relationships.',
    sql: `SELECT a.tpName, UPPER(r.repName), r.relType, rc.repPrefContactType, rc.repPrefContactDetails\nFROM bir_db.applicant a\nJOIN bir_db.rep r ON a.applicantID = r.applicantID\nJOIN bir_db.repcontact rc ON r.repID = rc.repID\nORDER BY r.repName;`,
    breakdown: [
      'Performs a complex 3-way explicit JOIN across multiple entities.',
      'Normalizes the output by applying the UPPER function to names.',
      'Compiles a holistic view of the applicant-representative ecosystem.'
    ]
  },
  {
    id: 'q9',
    category: 'Difficult Queries',
    title: 'ID Document Expiry',
    description: 'Compute real-time day logic to isolate identifiers expiring within 5 years.',
    sql: `SELECT a.tpName AS applicantName,i.idType, i.issuer, i.expiryDate, DATEDIFF(i.expiryDate, CURRENT_DATE) AS daysRemaining\nFROM bir_db.applicant a\nJOIN bir_db.idvalidation i ON a.applicantID = i.applicantID\nWHERE i.expiryDate BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 5 YEAR)\nORDER BY i.expiryDate;`,
    breakdown: [
      'Utilizes date arithmetic functions (DATEDIFF, DATE_ADD, CURRENT_DATE).',
      'Filters a date range dynamically using the BETWEEN operator.',
      'Joins validation data with applicant demographics.'
    ]
  },
  {
    id: 'q10',
    category: 'Difficult Queries',
    title: 'Volume Analysis',
    description: 'Aggregate handler volumes evaluating groups managing multi-applicant sets.',
    sql: `SELECT relType, COUNT(applicantID) AS totalApplicants, MIN(relDate) AS earliestRelDate\nFROM bir_db.rep\nGROUP BY relType\nHAVING COUNT(applicantID) >= 2;`,
    breakdown: [
      'Calculates operational volume using aggregate functions.',
      'Finds the historical starting point using MIN on date fields.',
      'Applies a post-aggregation threshold filter using HAVING.'
    ]
  }
];

export default function SqlShowroom() {
  const [selectedQuery, setSelectedQuery] = useState<typeof queries[0] | null>(null);
  const [execData, setExecData] = useState<{ columns: string[], data: any[][] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Simple Queries', 'Moderate Queries', 'Difficult Queries'];

  useEffect(() => {
    if (selectedQuery) {
      setLoading(true);
      setError(null);
      setExecData(null);
      
      fetch(`/api/sql-showroom?id=${selectedQuery.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setExecData(data);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'Failed to execute query');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[var(--color-surface-light)] rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-accent-primary)]/10 rounded-lg">
              <Terminal className="w-6 h-6 text-[var(--color-accent-primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SQL Query Showroom</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">Live Read-Only Database Evaluation Console (bir_db)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12 pb-24">

        {/* Categories & Tiles */}
        {categories.map((category) => (
          <section key={category} className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 border-b border-[var(--color-border)] pb-2">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent-primary)]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{category}</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {queries.filter(q => q.category === category).map((query) => (
                <button
                  key={query.id}
                  onClick={() => setSelectedQuery(query)}
                  className="text-center sm:text-left p-3 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent-primary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/5 transition-all group flex flex-col items-center sm:items-start h-full justify-start"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 mb-1 sm:mb-3">
                    <Code className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--color-accent-primary)]" />
                    <h3 className="font-bold text-[var(--color-text-primary)] text-xs sm:text-base group-hover:text-[var(--color-accent-primary)] transition-colors leading-tight">{query.title}</h3>
                  </div>
                  <p className="text-[10px] sm:text-sm text-[var(--color-text-secondary)] flex-grow leading-tight mt-1 sm:mt-0">{query.description}</p>
                  
                  <div className="hidden sm:flex mt-4 items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3 fill-current" /> Execute Live Script
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Modal Overlay */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedQuery(null)} />
          
          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-light)]">
              <div className="flex items-center gap-2 sm:gap-3">
                <Terminal className="w-5 h-5 text-[var(--color-accent-primary)]" />
                <h2 className="font-bold text-lg">{selectedQuery.title} Execution</h2>
              </div>
              <button onClick={() => setSelectedQuery(null)} className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-border)] rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
              
              {/* 1. SQL Source Block */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[10px] sm:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                  <Code size={14} className="sm:w-4 sm:h-4" /> SQL Source Block
                </h3>
                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg sm:rounded-xl p-2.5 sm:p-4 overflow-x-auto">
                  <pre className="text-[10px] sm:text-sm text-[#C9D1D9] font-mono leading-relaxed">
                    <code>{selectedQuery.sql}</code>
                  </pre>
                </div>
              </div>

              {/* 2. Execution Log (Output Matrix) */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[10px] sm:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                  <Database size={14} className="sm:w-4 sm:h-4" /> Live Execution Matrix
                </h3>
                
                {loading && (
                  <div className="border border-[var(--color-border)] rounded-xl h-40 flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-light)]/20">
                    <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Executing query against bir_db...</span>
                  </div>
                )}

                {error && (
                  <div className="border border-red-500/20 bg-red-500/10 rounded-xl p-6 text-center">
                    <p className="text-red-500 font-semibold mb-2">Query Execution Exception</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
                  </div>
                )}

                {!loading && !error && execData && (
                  <div className="border border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden overflow-x-auto">
                    {execData.data.length === 0 ? (
                      <div className="p-4 sm:p-8 text-center text-xs sm:text-sm text-[var(--color-text-secondary)]">
                        No matching records found in the live database.
                      </div>
                    ) : (
                      <table className="w-full text-[10px] sm:text-sm text-left">
                        <thead className="bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                          <tr>
                            {execData.columns.map((col, i) => (
                              <th key={i} className="px-2 py-1.5 sm:px-4 sm:py-3 font-semibold whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          {execData.data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[var(--color-surface-light)]/50 transition-colors">
                              {row.map((cell, cellIndex) => (
                                <td 
                                  key={cellIndex} 
                                  className={`px-2 py-1.5 sm:px-4 sm:py-3 whitespace-nowrap ${typeof cell === 'number' || (typeof cell === 'string' && cell.match(/^\\d/)) ? 'text-right font-mono text-[var(--color-accent-primary)]' : ''}`}
                                >
                                  {cell !== null ? String(cell) : <span className="text-[var(--color-text-secondary)] italic">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Technical Breakdown */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[10px] sm:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                  <Info size={14} className="sm:w-4 sm:h-4" /> Technical Breakdown
                </h3>
                <div className="bg-[var(--color-surface-light)]/50 border border-[var(--color-border)] rounded-lg sm:rounded-xl p-3 sm:p-5">
                  <ul className="space-y-1 sm:space-y-2 text-[10px] sm:text-sm text-[var(--color-text-primary)]">
                    {selectedQuery.breakdown.map((point, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-[var(--color-accent-primary)] mt-0.5 sm:mt-1">•</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
