'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, AlertCircle } from 'lucide-react';
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
}

export default function WatchLaboratoryForm() {
  const [step, setStep] = useState(1);
  const [itemType, setItemType] = useState<'watch' | 'gemstone'>('watch');
  const WHATSAPP_NUMBER = '03159452946';
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit case without file uploads
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
          uploads: [],
          paymentScreenshot: null,
          proofOfPurchase: null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error Response:', error);
        throw new Error(`Failed to submit case: ${error.error || error.details || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      console.log('Case number from response:', data.caseNumber);
      setCaseNumber(data.caseNumber);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit case. Please try again.');
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
          Please send your photos and video to WhatsApp: <span className="text-[#C7CBD0] font-semibold">{WHATSAPP_NUMBER}</span>
        </p>
        <div className="bg-[#151515] rounded-lg p-6 mb-6 border border-[#292929]">
          <p className="text-sm text-[#A6A6A6] mb-4">Don't forget to include your case reference number in the WhatsApp message</p>
          <a
            href={`https://wa.me/92${WHATSAPP_NUMBER.substring(1)}?text=Hi, I have submitted laboratory case ${caseNumber}. Here are my photos and video for authentication.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">
              Send Files via WhatsApp
            </Button>
          </a>
        </div>
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
        {[1, 2, 3].map((s) => (
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
            {s < 3 && (
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
            Continue to Payment
          </Button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 2: <span className="font-semibold text-[#C7CBD0]">Payment</span>
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
              After making the payment, click "I Have Paid" to proceed to the next step where you'll receive instructions to send your photos and video via WhatsApp.
            </p>
          </div>

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
              onClick={() => {
                setPaymentCompleted(true);
                setStep(3);
              }}
              className="flex-1"
              disabled={paymentCompleted}
            >
              {paymentCompleted ? 'Paid' : 'I Have Paid'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: WhatsApp Instructions */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-[#F5F5F5]">
            Step 2: <span className="font-semibold text-[#C7CBD0]">Send Photos & Video via WhatsApp</span>
          </h2>

          <div className="bg-[#151515] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#F5F5F5]">Send Files via WhatsApp</p>
                <p className="text-[#A6A6A6]">After submitting the form, send your photos and video to our WhatsApp</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#A6A6A6]">
              <div className="flex items-start gap-3">
                <span className="text-[#E50920] font-bold">1.</span>
                <p>Take 2-3 clear photos of your {itemType === 'watch' ? 'watch' : 'gemstone'} from different angles</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#E50920] font-bold">2.</span>
                <p>Record a short video (max 1 minute) showing the {itemType === 'watch' ? 'watch' : 'gemstone'} in detail</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#E50920] font-bold">3.</span>
                <p>Send the photos and video to WhatsApp: <span className="text-[#C7CBD0] font-semibold">{WHATSAPP_NUMBER}</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#E50920] font-bold">4.</span>
                <p>Include your case reference number in the WhatsApp message</p>
              </div>
            </div>

            <a
              href={`https://wa.me/92${WHATSAPP_NUMBER.substring(1)}?text=Hi, I have submitted a laboratory case for ${itemType === 'watch' ? 'watch' : 'gemstone'} authentication. My details: Brand: ${formData.brand}, Model: ${formData.model}, Reference: ${formData.referenceNumber || 'N/A'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full"
            >
              <Button type="button" className="w-full bg-green-600 hover:bg-green-700">
                Open WhatsApp
              </Button>
            </a>
          </div>

          <div className="bg-[#101010] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E50920] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#A6A6A6]">
              Make sure to send the photos and video within 24 hours of submitting the form. Our team will review your submission and inform you about the authentication results.
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
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Case'}
            </Button>
          </div>
        </div>
      )}


    </form>
  );
}
