'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Edit, Eye, Plus, Loader2, ArrowLeft } from 'lucide-react';

interface Application {
  applicantID: string;
  tpName: string;
  tin: string;
  tpType: string;
  emailAdd: string;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete application ${id}? This action cannot be undone and will delete data from all 9 tables.`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApplications(apps => apps.filter(a => a.applicantID !== id));
      } else {
        alert('Error deleting application: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('An error occurred while deleting.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Admin Dashboard</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage all BIR Form 1901 submissions across your system.</p>
          </div>
          <button 
            onClick={() => router.push('/form-1901')}
            className="flex items-center gap-2 bg-[var(--color-bir-yellow)] text-[#1e3a8a] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-400 hover:shadow-lg transition-all"
          >
            <Plus size={18} /> New Registration
          </button>
        </div>

        {/* Data Table Container */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-light)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Taxpayer Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">TIN</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Taxpayer Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
                        <p>Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                      No applications found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.applicantID} className="hover:bg-[var(--color-surface-light)]/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--color-accent-primary)] whitespace-nowrap">
                        {app.applicantID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">{app.tpName || 'N/A'}</div>
                        <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{app.emailAdd || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">
                        {app.tin || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-surface-light)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                          {app.tpType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => router.push(`/form-1901?view=${app.applicantID}`)}
                            title="View Details"
                            className="text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => router.push(`/form-1901?edit=${app.applicantID}`)}
                            title="Edit Record"
                            className="text-[var(--color-text-secondary)] hover:text-green-400 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(app.applicantID)}
                            title="Delete Record"
                            disabled={deleting === app.applicantID}
                            className={`transition-colors ${deleting === app.applicantID ? 'text-red-500/50 cursor-not-allowed' : 'text-[var(--color-text-secondary)] hover:text-red-500'}`}
                          >
                            {deleting === app.applicantID ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
