'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Search, Eye, FileText, Check, X, Download, DownloadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminLaboratoryPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [assessment, setAssessment] = useState({
    isAuthentic: true,
    findings: '',
    expertNotes: '',
  });

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchCases();
    }
  }, [router]);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/laboratory');
      const data = await response.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/laboratory/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, assessment }),
      });

      if (response.ok) {
        await fetchCases();
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleGenerateCertificate = async (caseId: string, type: string) => {
    try {
      const response = await fetch(`/api/laboratory/${caseId}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, assessment }),
      });

      if (response.ok) {
        const html = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
          // Automatically trigger print dialog after a short delay
          setTimeout(() => {
            newWindow.print();
          }, 500);
        } else {
          alert('Please allow popups to view the certificate');
        }
      } else {
        alert('Failed to generate certificate');
      }
    } catch (error) {
      alert('Failed to generate certificate');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredCases = cases.filter((c) =>
    (c.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.watchDetails?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.watchDetails?.model?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || c.status === statusFilter) &&
    (typeFilter === 'all' || c.type === typeFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-[#C7CBD0]/10 text-[#C7CBD0]';
      case 'awaiting-info':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'under-review':
        return 'bg-blue-500/10 text-blue-500';
      case 'expert-review':
        return 'bg-purple-500/10 text-purple-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-[#292929] text-[#A6A6A6]';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
              Laboratory <span className="font-semibold text-[#C7CBD0]">Cases</span>
            </h1>
            <p className="text-[#A6A6A6]">
              Manage authentication cases for watches and gemstones, review submissions, and generate certificates.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-[#101010] rounded-xl p-4 border border-[#292929] mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A6A6]" />
              <Input
                type="text"
                placeholder="Search by case number, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="watch">Watches</option>
              <option value="gemstone">Gemstones</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="awaiting-info">Awaiting Info</option>
              <option value="under-review">Under Review</option>
              <option value="expert-review">Expert Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-[#101010] rounded-xl border border-[#292929] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#292929] bg-[#151515]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Case Number
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Watch Details
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Submitted
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">Loading cases...</p>
                    </td>
                  </tr>
                ) : filteredCases.length > 0 ? (
                  filteredCases.map((case_) => (
                    <tr key={case_.id} className="border-b border-[#292929] hover:bg-[#151515]">
                      <td className="py-4 px-4">
                        <p className="text-[#C7CBD0] font-mono text-sm">{case_.caseNumber}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-[#F5F5F5] font-medium">{case_.watchDetails?.brand}</p>
                          <p className="text-sm text-[#A6A6A6]">{case_.watchDetails?.model}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#A6A6A6]">
                        {new Date(case_.createdAt).toLocaleDateString('en-PK')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCase(case_)}
                            className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] hover:bg-[#292929] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {case_.status === 'completed' && (
                            <button
                              onClick={() => handleGenerateCertificate(case_.id, case_.type || 'watch')}
                              className="p-2 text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929] rounded-lg transition-colors"
                              title="Generate Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">No cases found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#101010] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#292929]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-[#F5F5F5]">
                    Case <span className="font-semibold text-[#C7CBD0]">Details</span>
                  </h2>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-1">Case Number</p>
                      <p className="text-[#C7CBD0] font-mono">{selectedCase.caseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-1">Type</p>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E50920]/10 text-[#E50920]">
                        {selectedCase.type || 'watch'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedCase.status)}`}>
                        {selectedCase.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-2">Watch Details</p>
                    <div className="bg-[#151515] rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#A6A6A6]">Brand</p>
                          <p className="text-[#F5F5F5]">{selectedCase.watchDetails?.brand}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#A6A6A6]">Model</p>
                          <p className="text-[#F5F5F5]">{selectedCase.watchDetails?.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#A6A6A6]">Reference</p>
                          <p className="text-[#F5F5F5]">{selectedCase.watchDetails?.referenceNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#A6A6A6]">Serial</p>
                          <p className="text-[#F5F5F5]">{selectedCase.watchDetails?.serialNumber || 'N/A'}</p>
                        </div>
                      </div>
                      {selectedCase.watchDetails?.observations && (
                        <div>
                          <p className="text-xs text-[#A6A6A6]">Observations</p>
                          <p className="text-[#F5F5F5] text-sm">{selectedCase.watchDetails.observations}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-2">Uploads ({selectedCase.uploads?.length || 0})</p>
                    <div className="bg-[#151515] rounded-lg p-4">
                      {selectedCase.uploads?.map((upload: any) => (
                        <div key={upload.id} className="flex items-center justify-between py-2 border-b border-[#292929] last:border-0">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#C7CBD0]" />
                            <p className="text-[#F5F5F5] text-sm">{upload.fileName}</p>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              const filePath = upload.filePath.startsWith('http') ? upload.filePath : upload.filePath;
                              link.href = filePath;
                              link.download = upload.fileName;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                            title="Download"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCase.paymentScreenshot && (
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-2">Payment Receipt</p>
                      <div className="bg-[#151515] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#C7CBD0]" />
                            <p className="text-[#F5F5F5] text-sm">{selectedCase.paymentScreenshot.fileName}</p>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedCase.paymentScreenshot.filePath.startsWith('http') ? selectedCase.paymentScreenshot.filePath : selectedCase.paymentScreenshot.filePath;
                              link.download = selectedCase.paymentScreenshot.fileName;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                            title="Download"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCase.proofOfPurchase && (
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-2">Proof of Purchase (Certificate/Slip)</p>
                      <div className="bg-[#151515] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#C7CBD0]" />
                            <p className="text-[#F5F5F5] text-sm">{selectedCase.proofOfPurchase.fileName}</p>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedCase.proofOfPurchase.filePath.startsWith('http') ? selectedCase.proofOfPurchase.filePath : selectedCase.proofOfPurchase.filePath;
                              link.download = selectedCase.proofOfPurchase.fileName;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                            title="Download"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['submitted', 'awaiting-info', 'under-review', 'expert-review', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedCase.id, status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCase.status === status
                              ? 'bg-[#E50920] text-white'
                              : 'bg-[#151515] text-[#A6A6A6] hover:bg-[#292929] hover:text-[#F5F5F5]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-2">Assessment</p>
                    <div className="bg-[#151515] rounded-lg p-4 space-y-4">
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="authenticity"
                            checked={assessment.isAuthentic}
                            onChange={() => setAssessment({ ...assessment, isAuthentic: true })}
                            className="w-4 h-4 accent-[#E50920]"
                          />
                          <span className="text-[#F5F5F5]">Authentic / Original</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer mt-2">
                          <input
                            type="radio"
                            name="authenticity"
                            checked={!assessment.isAuthentic}
                            onChange={() => setAssessment({ ...assessment, isAuthentic: false })}
                            className="w-4 h-4 accent-[#E50920]"
                          />
                          <span className="text-[#F5F5F5]">Not Authentic / Counterfeit</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs text-[#A6A6A6] mb-1">Findings</label>
                        <textarea
                          value={assessment.findings}
                          onChange={(e) => setAssessment({ ...assessment, findings: e.target.value })}
                          placeholder="Enter assessment findings..."
                          className="w-full px-3 py-2 bg-[#101010] border border-[#292929] rounded-lg text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A6A6A6] mb-1">Expert Notes</label>
                        <textarea
                          value={assessment.expertNotes}
                          onChange={(e) => setAssessment({ ...assessment, expertNotes: e.target.value })}
                          placeholder="Additional expert notes..."
                          className="w-full px-3 py-2 bg-[#101010] border border-[#292929] rounded-lg text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-2">Generate Certificate</p>
                    <button
                      onClick={() => handleGenerateCertificate(selectedCase.id, selectedCase.type || 'watch')}
                      className="w-full py-3 bg-[#E50920] text-white rounded-lg font-medium hover:bg-[#c4081a] transition-colors"
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
