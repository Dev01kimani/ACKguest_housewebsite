import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Building, CheckCircle, AlertCircle, Calculator } from 'lucide-react';
import type { PaymentData } from '../utils/types';

interface PaymentFormProps {
  bookingId: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  paymentType: 'deposit' | 'balance' | 'full';
  onPaymentSubmit: (paymentData: PaymentData) => Promise<boolean>;
  onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  totalAmount,
  depositAmount,
  balanceAmount,
  paymentType,
  onPaymentSubmit,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'cash' | 'cheque' | 'bank_transfer'>('mpesa');
  const [paymentReference, setPaymentReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'mpesa' as const,
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay via M-Pesa mobile money',
      requiresReference: true,
      referenceLabel: 'M-Pesa Transaction Code'
    },
    {
      id: 'cash' as const,
      name: 'Cash',
      icon: Banknote,
      description: 'Pay in cash at the property',
      requiresReference: false,
      referenceLabel: 'Receipt Number (Optional)'
    },
    {
      id: 'cheque' as const,
      name: 'Cheque',
      icon: CreditCard,
      description: 'Pay by bank cheque',
      requiresReference: true,
      referenceLabel: 'Cheque Number'
    },
    {
      id: 'bank_transfer' as const,
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank transfer',
      requiresReference: true,
      referenceLabel: 'Transfer Reference'
    }
  ];

  const getPaymentAmount = () => {
    switch (paymentType) {
      case 'deposit':
        return depositAmount;
      case 'balance':
        return balanceAmount;
      case 'full':
        return totalAmount;
      default:
        return depositAmount;
    }
  };

  const getPaymentTitle = () => {
    switch (paymentType) {
      case 'deposit':
        return 'Pay Deposit (50% Required)';
      case 'balance':
        return 'Pay Remaining Balance';
      case 'full':
        return 'Pay Full Amount';
      default:
        return 'Make Payment';
    }
  };

  const selectedMethodInfo = paymentMethods.find(method => method.id === selectedMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate reference if required
    if (selectedMethodInfo?.requiresReference && !paymentReference.trim()) {
      setError(`${selectedMethodInfo.referenceLabel} is required for ${selectedMethodInfo.name} payments`);
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentData: PaymentData = {
        bookingId,
        amount: getPaymentAmount(),
        paymentType,
        paymentMethod: selectedMethod,
        paymentReference: paymentReference.trim() || undefined
      };

      const success = await onPaymentSubmit(paymentData);
      
      if (!success) {
        setError('Payment submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      setError('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{getPaymentTitle()}</h3>
        <p className="text-gray-600">
          {paymentType === 'deposit' && 'A 50% deposit is required to confirm your booking.'}
          {paymentType === 'balance' && 'Complete your payment by paying the remaining balance.'}
          {paymentType === 'full' && 'Pay the full amount for your booking.'}
        </p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Calculator className="h-5 w-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900">Payment Summary</h4>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Booking Amount:</span>
            <span className="font-medium">KSh {totalAmount.toLocaleString()}</span>
          </div>
          
          {paymentType !== 'full' && (
            <>
              <div className="flex justify-between">
                <span>Required Deposit (50%):</span>
                <span className="font-medium">KSh {depositAmount.toLocaleString()}</span>
              </div>
              
              {paymentType === 'balance' && (
                <div className="flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className="font-medium">KSh {balanceAmount.toLocaleString()}</span>
                </div>
              )}
            </>
          )}
          
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg font-bold text-amber-600">
            <span>Amount to Pay:</span>
            <span>KSh {getPaymentAmount().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Payment Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <method.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Reference */}
        {selectedMethodInfo?.requiresReference && (
          <div className="mb-6">
            <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700 mb-1">
              {selectedMethodInfo.referenceLabel} *
            </label>
            <input
              type="text"
              id="paymentReference"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder={`Enter ${selectedMethodInfo.referenceLabel.toLowerCase()}`}
              required={selectedMethodInfo.requiresReference}
            />
          </div>
        )}

        {!selectedMethodInfo?.requiresReference && (
          <div className="mb-6">
            <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700 mb-1">
              {selectedMethodInfo?.referenceLabel}
            </label>
            <input
              type="text"
              id="paymentReference"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder={`Enter ${selectedMethodInfo?.referenceLabel?.toLowerCase() || 'reference'}`}
            />
          </div>
        )}

        {/* M-Pesa Instructions */}
        {selectedMethod === 'mpesa' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-900 mb-2">M-Pesa Payment Instructions</h4>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Go to M-Pesa menu on your phone</li>
              <li>2. Select "Lipa na M-Pesa" → "Pay Bill"</li>
              <li>3. Enter Business Number: <strong>174379</strong></li>
              <li>4. Enter Account Number: <strong>{bookingId.substring(0, 8)}</strong></li>
              <li>5. Enter Amount: <strong>KSh {getPaymentAmount().toLocaleString()}</strong></li>
              <li>6. Enter your M-Pesa PIN and confirm</li>
              <li>7. Copy the transaction code and enter it below</li>
            </ol>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• A 50% deposit is required to confirm your booking</li>
            <li>• The remaining balance can be paid before or during check-in</li>
            <li>• All payments are subject to verification</li>
            <li>• You will receive a confirmation email once payment is verified</li>
            {selectedMethod === 'cash' && (
              <li>• For cash payments, please pay at the reception upon arrival</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Submit Payment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;