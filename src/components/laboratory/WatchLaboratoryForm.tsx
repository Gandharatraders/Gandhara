'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { generateCaseNumber } from '@/lib/utils';

interface FormData {
  // Step 1: Watch Details
  brand: string;
  model: string;
  referenceNumber: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseLocation: string;
  country: string;
  city: string;
  hasProofOfPurchase: boolean;
  observations: string;

  // Step 2: Uploads
  files: File[];

  // Step 4: Payment Screenshot
  paymentScreenshot: File | null;

  // Proof of Purchase
  proofOfPurchaseFile: File | null;
}

export default function WatchLaboratoryForm() {
  const [step, setStep] = useState(1);
  const [itemType, setItemType] = useState<'watch' | 'gemstone'>('watch');
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    referenceNumber: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseLocation: '',
    country: 'Pakistan',
    city: '',
    hasProofOfPurchase: false,
    observations: '',
    files: [],
    paymentScreenshot: null,
    proofOfPurchaseFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Count current images and videos
    const currentImages = formData.files.filter(f => f.type.startsWith('image/'));
    const currentVideos = formData.files.filter(f => f.type.startsWith('video/'));

    const newImages = files.filter(f => f.type.startsWith('image/'));
    const newVideos = files.filter(f => f.type.startsWith('video/'));

    // Validate limits
    if (currentImages.length + newImages.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.');
      return;
    }

    if (currentVideos.length + newVideos.length > 1) {
      alert('Maximum 1 video allowed. Please remove the existing video first.');
      return;
    }

    // Validate requirements (at least 1 image and 1 video)
    const totalImages = currentImages.length + newImages.length;
    const totalVideos = currentVideos.length + newVideos.length;

    if (totalImages === 0) {
      alert('At least 1 image is required for submission.');
      return;
    }

    if (totalVideos === 0) {
      alert('At least 1 video is required for submission.');
      return;
    }

    // Validate video duration (max 1 minute)
    const videoFile = newVideos[0];
    if (videoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          alert('Video must be maximum 1 minute long.');
          return;
        }
        setFormData({ ...formData, files: [...formData.files, ...files] });
      };
      return;
    }

    setFormData({ ...formData, files: [...formData.files, ...files] });
  };

  const handlePaymentScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image of your payment receipt.');
        return;
      }
      setFormData({ ...formData, paymentScreenshot: file });
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPaymentCompleted(true);
    setPaymentProcessing(false);
    setStep(4);
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload files first
      const uploadPromises = formData.files.map(async (file, index) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'laboratory');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const result = await response.json();
        return {
          id: `upload-${index}`,
          type: index === 0 ? 'dial' : 'side-profile',
          fileName: file.name,
          filePath: result.path,
          uploadedAt: new Date().toISOString(),
        };
      });

      // Upload payment screenshot
      let paymentScreenshotData = null;
      if (formData.paymentScreenshot) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.paymentScreenshot);
        formDataUpload.append('type', 'laboratory');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const result = await response.json();
        paymentScreenshotData = {
          fileName: formData.paymentScreenshot.name,
          filePath: result.path,
          uploadedAt: new Date().toISOString(),
        };
      }

      // Upload proof of purchase file
      let proofOfPurchaseData = null;
      if (formData.proofOfPurchaseFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.proofOfPurchaseFile);
        formDataUpload.append('type', 'laboratory');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const result = await response.json();
        proofOfPurchaseData = {
          fileName: formData.proofOfPurchaseFile.name,
          filePath: result.path,
          uploadedAt: new Date().toISOString(),
        };
      }

      const uploads = await Promise.all(uploadPromises);

      // Submit case
      const response = await fetch('/api/laboratory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: itemType,
          watchDetails: {
            brand: formData.brand,
            model: formData.model,
            referenceNumber: formData.referenceNumber,
            serialNumber: formData.serialNumber,
            purchaseDate: formData.purchaseDate,
            purchaseLocation: formData.purchaseLocation,
            country: formData.country,
            city: formData.city,
            hasProofOfPurchase: formData.hasProofOfPurchase,
            observations: formData.observations,
          },
          uploads,
          paymentScreenshot: paymentScreenshotData,
          proofOfPurchase: proofOfPurchaseData,
        }),
      });

      const data = await response.json();
      setCaseNumber(data.caseNumber);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
          Submission Successful
        </h2>
        <p className="text-[#A6A6A6] mb-6">
          Your authentication case has been submitted successfully.
        </p>
        <div className="bg-[#151515] rounded-lg p-6 mb-6">
          <p className="text-sm text-[#A6A6A6] mb-2">Case Reference Number</p>
          <p className="text-2xl font-mono text-[#C7CBD0]">{caseNumber}</p>
        </div>
        <p className="text-sm text-[#A6A6A6] mb-6">
          You can use this reference number to track your case status.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Submit Another Case</Button>
          <Button variant="outline" onClick={() => {
            window.location.href = `/track-case?case=${caseNumber}`;
          }}>
            Track This Case
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {/* Item Type Selection */}
      <div className="bg-[#101010] rounded-xl p-6 border border-[#292929] mb-8">
        <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Select Item Type</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setItemType('watch')}
            className={`flex-1 py-4 rounded-lg border-2 transition-colors ${
              itemType === 'watch'
                ? 'border-[#E50920] bg-[#E50920]/10 text-[#E50920]'
                : 'border-[#292929] text-[#A6A6A6] hover:border-[#C7CBD0] hover:text-[#F5F5F5]'
            }`}
          >
            <div className="text-2xl mb-2">⌚</div>
            <div className="font-semibold">Watch</div>
          </button>
          <button
            type="button"
            onClick={() => setItemType('gemstone')}
            className={`flex-1 py-4 rounded-lg border-2 transition-colors ${
              itemType === 'gemstone'
                ? 'border-[#E50920] bg-[#E50920]/10 text-[#E50920]'
                : 'border-[#292929] text-[#A6A6A6] hover:border-[#C7CBD0] hover:text-[#F5F5F5]'
            }`}
          >
            <div className="text-2xl mb-2">💎</div>
            <div className="font-semibold">Gemstone</div>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s
                  ? 'bg-[#E50920] text-white'
                  : 'bg-[#151515] text-[#A6A6A6]'
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 5 && (
              <div
                className={`w-24 h-1 mx-2 ${
                  step > s ? 'bg-[#E50920]' : 'bg-[#292929]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Item Details */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 1: <span className="font-semibold text-[#C7CBD0]">{itemType === 'watch' ? 'Watch Details' : 'Gemstone Details'}</span>
          </h2>
          <p className="text-[#A6A6A6]">
            Please provide the details of the {itemType === 'watch' ? 'watch' : 'gemstone'} you would like to have authenticated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Input
              label="Model"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <Input
              label="Reference Number (Optional)"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            />
            <Input
              label="Serial Number (Optional)"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
            <Input
              label="Purchase Date (Optional)"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
            <Input
              label="Purchase Location (Optional)"
              value={formData.purchaseLocation}
              onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
            />
            <Input
              label="Country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="proof"
              checked={formData.hasProofOfPurchase}
              onChange={(e) => setFormData({ ...formData, hasProofOfPurchase: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="proof" className="text-sm text-[#A6A6A6]">
              I have proof of purchase
            </label>
          </div>

          {formData.hasProofOfPurchase && (
            <div className="bg-[#151515] rounded-xl p-6 border-2 border-dashed border-[#292929]">
              <label className="text-sm font-medium text-[#F5F5F5] mb-2 block">
                Upload Certificate & Purchasing Slip
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, proofOfPurchaseFile: file });
                  }
                }}
                className="w-full text-sm text-[#A6A6A6] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E50920] file:text-white hover:file:bg-[#c4081a]"
              />
              {formData.proofOfPurchaseFile && (
                <div className="mt-3 flex items-center justify-between bg-[#101010] rounded-lg p-3">
                  <span className="text-sm text-[#F5F5F5]">{formData.proofOfPurchaseFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, proofOfPurchaseFile: null })}
                    className="text-[#E50920] hover:text-[#c4081a]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-[#A6A6A6] mb-2 block">
              Additional Observations (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Any additional details about the watch..."
            />
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            className="w-full"
            disabled={!formData.brand || !formData.model || !formData.city}
          >
            Continue to Uploads
          </Button>
        </div>
      )}

      {/* Step 2: Uploads */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 2: <span className="font-semibold text-[#C7CBD0]">Photo & Video Uploads</span>
          </h2>
          <p className="text-[#A6A6A6]">
            Upload clear photographs and a video of your {itemType === 'watch' ? 'watch' : 'gemstone'}. <span className="text-[#E50920] font-semibold">Required: At least 1 image and 1 video (max 1 minute).</span> Maximum 5 images and 1 video allowed.
          </p>

          <div className="bg-[#151515] rounded-xl p-6 border-2 border-dashed border-[#292929]">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-[#C7CBD0] mb-4" />
              <p className="text-[#F5F5F5] mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-[#A6A6A6]">
                Images (JPG, PNG) max 5, Video (MP4, WebM) max 1 minute
              </p>
            </label>
          </div>

          {formData.files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#F5F5F5]">
                Uploaded Files ({formData.files.length})
              </p>
              {formData.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#151515] rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#101010] rounded flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <svg className="w-5 h-5 text-[#C7CBD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#C7CBD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#F5F5F5]">{file.name}</p>
                      <p className="text-xs text-[#A6A6A6]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1"
              disabled={formData.files.length === 0}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 3: <span className="font-semibold text-[#C7CBD0]">Payment</span>
          </h2>
          <p className="text-[#A6A6A6]">
            A payment of 1,000 PKR is required to proceed with the authentication assessment.
          </p>

          <div className="bg-[#151515] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#A6A6A6] text-sm">Authentication Fee</p>
                <p className="text-3xl font-semibold text-[#C7CBD0]">PKR 1,000</p>
              </div>
              <div className="w-16 h-16 bg-[#E50920]/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#E50920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-[#101010] rounded-lg p-4 mb-4 border border-[#292929]">
              <p className="text-xs text-[#E50920] font-semibold mb-3 uppercase tracking-wider">Bank Account Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">Account Title:</span>
                  <span className="text-[#F5F5F5] font-medium">SALMAN KHAN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">Account Number:</span>
                  <span className="text-[#F5F5F5] font-medium">03171010527808</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">IBAN:</span>
                  <span className="text-[#F5F5F5] font-medium text-xs">PK67ALFH0317001010527808</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">Branch Name:</span>
                  <span className="text-[#F5F5F5] font-medium">Dalazak Road Branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">Branch Code:</span>
                  <span className="text-[#F5F5F5] font-medium">0317</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A6A6]">Bank Name:</span>
                  <span className="text-[#F5F5F5] font-medium">Bank Alfalah</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#A6A6A6]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Professional authenticity assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Expert analysis by watch specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Detailed case report with reference number</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Case tracking support</span>
              </div>
            </div>
          </div>

          <div className="bg-[#101010] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E50920] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#A6A6A6]">
              After making the payment, you will need to upload a screenshot of your payment receipt 
              in the next step to complete your submission.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handlePayment}
              className="flex-1"
              disabled={paymentProcessing || paymentCompleted}
            >
              {paymentProcessing ? 'Processing...' : paymentCompleted ? 'Paid' : 'Pay PKR 1,000'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Screenshot */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 4: <span className="font-semibold text-[#C7CBD0]">Upload Payment Receipt</span>
          </h2>
          <p className="text-[#A6A6A6]">
            Please upload a screenshot of your payment receipt to complete your submission.
          </p>

          <div className="bg-[#151515] rounded-xl p-6 border-2 border-dashed border-[#292929]">
            <input
              type="file"
              id="payment-screenshot"
              accept="image/*"
              onChange={handlePaymentScreenshotUpload}
              className="hidden"
            />
            <label
              htmlFor="payment-screenshot"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-[#C7CBD0] mb-4" />
              <p className="text-[#F5F5F5] mb-2">Click to upload payment screenshot</p>
              <p className="text-sm text-[#A6A6A6]">
                Image (JPG, PNG) of your payment receipt
              </p>
            </label>
          </div>

          {formData.paymentScreenshot && (
            <div className="bg-[#151515] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#101010] rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#C7CBD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#F5F5F5]">{formData.paymentScreenshot.name}</p>
                    <p className="text-xs text-[#A6A6A6]">
                      {(formData.paymentScreenshot.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentScreenshot: null })}
                  className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(3)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(5)}
              className="flex-1"
              disabled={!formData.paymentScreenshot}
            >
              Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 5: <span className="font-semibold text-[#C7CBD0]">Review & Submit</span>
          </h2>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#F5F5F5]">Watch Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#A6A6A6]">Brand</p>
                <p className="text-[#F5F5F5]">{formData.brand}</p>
              </div>
              <div>
                <p className="text-[#A6A6A6]">Model</p>
                <p className="text-[#F5F5F5]">{formData.model}</p>
              </div>
              {formData.referenceNumber && (
                <div>
                  <p className="text-[#A6A6A6]">Reference Number</p>
                  <p className="text-[#F5F5F5]">{formData.referenceNumber}</p>
                </div>
              )}
              {formData.serialNumber && (
                <div>
                  <p className="text-[#A6A6A6]">Serial Number</p>
                  <p className="text-[#F5F5F5]">{formData.serialNumber}</p>
                </div>
              )}
              <div>
                <p className="text-[#A6A6A6]">Location</p>
                <p className="text-[#F5F5F5]">{formData.city}, {formData.country}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#F5F5F5]">Payment Status</h3>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <p className="text-sm text-[#F5F5F5]">PKR 1,000 paid</p>
            </div>
          </div>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#F5F5F5]">Uploaded Files</h3>
            <p className="text-sm text-[#A6A6A6]">
              {formData.files.length} file(s) uploaded
            </p>
          </div>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#F5F5F5]">Payment Receipt</h3>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <p className="text-sm text-[#F5F5F5]">{formData.paymentScreenshot?.name}</p>
            </div>
          </div>

          <div className="bg-[#101010] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E50920] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#A6A6A6]">
              This authentication assessment is based on the provided photographs and information. 
              A visually convincing counterfeit may pass image-based checks. This is not a definitive 
              certificate of authenticity. For certain authentication, physical inspection by an expert is recommended.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(4)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Case'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
