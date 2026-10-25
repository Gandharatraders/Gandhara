'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Check, Clock, AlertCircle, FileText, Download } from 'lucide-react';

export default function TrackCaseForm() {
  const searchParams = useSearchParams();
  const [caseNumber, setCaseNumber] = useState(searchParams.get('case') || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (caseNumber) {
      handleTrack(new Event('submit') as any);
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber.trim()) {
      setError('Please enter a case number');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/laboratory');
      const cases = await response.json();
      const foundCase = cases.find((c: any) => c.caseNumber === caseNumber.trim());

      if (foundCase) {
        setResult(foundCase);
      } else {
        setError('Case not found. Please check your reference number and try again.');
      }
    } catch (err) {
      setError('Failed to fetch case information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (caseId: string, type: string, assessment: any) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-5 h-5 text-[#C7CBD0]" />;
      case 'awaiting-info':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'under-review':
        return <Search className="w-5 h-5 text-blue-500" />;
      case 'expert-review':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-[#A6A6A6]" />;
    }
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'awaiting-info':
        return 'Awaiting Information';
      case 'under-review':
        return 'Under Review';
      case 'expert-review':
        return 'Expert Review';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleTrack} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            Case Reference Number
          </label>
          <input
            type="text"
            placeholder="Enter your case number (e.g., CXC-MVCQ880V-FXE1)"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="w-full px-4 py-3 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E50920] text-white rounded-lg font-medium hover:bg-[#c4081a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Track Case'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-[#151515] rounded-xl p-6 border border-[#292929] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
            <div>
              <p className="text-sm text-[#A6A6A6] mb-1">Case Reference Number</p>
              <p className="text-xl font-mono text-[#C7CBD0]">{result.caseNumber}</p>
            </div>
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(result.status)}`}>
              {getStatusIcon(result.status)}
              <span className="text-sm font-medium">{getStatusLabel(result.status)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#A6A6A6] mb-1">Type</p>
              <p className="text-[#F5F5F5] font-medium capitalize">{result.type || 'watch'}</p>
            </div>
            <div>
              <p className="text-sm text-[#A6A6A6] mb-1">Brand</p>
              <p className="text-[#F5F5F5] font-medium">{result.watchDetails?.brand}</p>
            </div>
            <div>
              <p className="text-sm text-[#A6A6A6] mb-1">Model</p>
              <p className="text-[#F5F5F5] font-medium">{result.watchDetails?.model}</p>
            </div>
            {result.watchDetails?.referenceNumber && (
              <div>
                <p className="text-sm text-[#A6A6A6] mb-1">Reference Number</p>
                <p className="text-[#F5F5F5] font-medium">{result.watchDetails.referenceNumber}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-[#A6A6A6] mb-1">Submitted On</p>
              <p className="text-[#F5F5F5] font-medium">
                {new Date(result.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {result.assessment && (
            <div className="pt-4 border-t border-[#292929]">
              <p className="text-sm text-[#A6A6A6] mb-2">Assessment Result</p>
              <div className="bg-[#101010] rounded-lg p-4">
                <p className="text-[#F5F5F5]">{result.assessment.findings}</p>
              </div>
            </div>
          )}

          {result.status === 'completed' && result.assessment && (
            <div className="pt-4 border-t border-[#292929]">
              <button
                onClick={() => handleDownloadCertificate(result.id, result.type || 'watch', result.assessment)}
                className="w-full py-3 bg-[#E50920] text-white rounded-lg font-medium hover:bg-[#c4081a] transition-colors"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download Certificate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
