import { useState } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import type { PaymentData, Payment } from '../utils/types';

type PaymentInsert = Database['public']['Tables']['payments']['Insert'];

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (paymentData: PaymentData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.log('Supabase not available, simulating payment creation:', paymentData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store payment in localStorage for demo
        const existingPayments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
        const newPayment = {
          id: Date.now().toString(),
          ...paymentData,
          status: 'completed', // Auto-complete for demo
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        existingPayments.push(newPayment);
        localStorage.setItem('demo_payments', JSON.stringify(existingPayments));
        
        console.log('Demo payment stored locally:', newPayment);
        return true;
      }

      // Real Supabase payment logic
      console.log('Creating payment with Supabase...');

      const paymentInsert: PaymentInsert = {
        booking_id: paymentData.bookingId,
        amount: paymentData.amount,
        payment_type: paymentData.paymentType,
        payment_method: paymentData.paymentMethod,
        payment_reference: paymentData.paymentReference || null,
        status: paymentData.paymentMethod === 'cash' ? 'pending' : 'completed',
        paid_at: paymentData.paymentMethod === 'cash' ? null : new Date().toISOString()
      };

      console.log('Inserting payment:', paymentInsert);

      const { error: insertError } = await supabase
        .from('payments')
        .insert(paymentInsert);

      if (insertError) {
        console.error('Payment insert error:', insertError);
        throw new Error(`Failed to create payment: ${insertError.message}`);
      }

      console.log('Payment created successfully in Supabase');
      return true;
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsByBooking = async (bookingId: string): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.log('Getting demo payments from localStorage...');
        const demoPayments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
        return demoPayments.filter((payment: any) => payment.bookingId === bookingId);
      }

      // Real Supabase query
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Payments fetch error:', error);
        throw new Error(`Failed to fetch payments: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'completed' | 'failed' | 'refunded'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.log('Updating demo payment status...');
        const demoPayments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
        const updatedPayments = demoPayments.map((payment: any) => 
          payment.id === paymentId 
            ? { ...payment, status, paid_at: status === 'completed' ? new Date().toISOString() : payment.paid_at }
            : payment
        );
        localStorage.setItem('demo_payments', JSON.stringify(updatedPayments));
        return true;
      }

      // Real Supabase update
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) {
        console.error('Payment update error:', error);
        throw new Error(`Failed to update payment: ${error.message}`);
      }

      return true;
    } catch (err) {
      console.error('Error updating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update payment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    getPaymentsByBooking,
    updatePaymentStatus,
    loading,
    error
  };
};