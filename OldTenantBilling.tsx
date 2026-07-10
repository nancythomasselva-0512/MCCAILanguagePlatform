import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, AlertTriangle, Loader2, CheckCircle2,
  TrendingUp, Info, Download, QrCode
} from 'lucide-react';

const getCurrencySymbol = (currencyCode: string) => {
  return currencyCode === 'INR' ? 'Γé╣' : currencyCode === 'USD' ? '$' : currencyCode;
};

export const TenantBilling: React.FC = () => {
  const { fetchBillingOverview } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  
  // Checkout Session Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeGateway, setActiveGateway] = useState<'stripe' | 'razorpay' | 'upi'>('stripe');
  const [checkoutSession, setCheckoutSession] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<'confirm' | 'payment'>('confirm');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [completedSessionData, setCompletedSessionData] = useState<any>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'invoices' | 'payments' | 'subscriptions'>('invoices');
  const [errorMsg, setErrorMsg] = useState('');

  // Stripe card details input mock
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  // Razorpay mock net banking selection
  const [razorpayBank, setRazorpayBank] = useState('SBI');

  // UPI mock address
  const [upiAddress, setUpiAddress] = useState('user@okaxis');

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/billing/tenant/overview");
      setData(res);
      
      const plansList = await apiRequest("/billing/plans");
      setPlans(plansList);
      
      // Sync limits to global sidebar widget
      fetchBillingOverview();
    } catch (err) {
      console.error("Failed to load tenant billing overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handleStartCheckout = async (plan: any, forceCycle?: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    const cycle = forceCycle || billingCycle;
    setBillingCycle(cycle);
    setCheckoutModalOpen(true);
    setPaymentResult(null);
    setCompletedSessionData(null);
    setCheckoutStep('confirm');
    setErrorMsg('');
    setProcessingPayment(true);
    
    try {
      const session = await apiRequest("/billing/payments/create-session", {
        method: "POST",
        body: JSON.stringify({
          plan_id: plan.id,
          billing_cycle: cycle
        })
      });
      setCheckoutSession(session);
      setActiveGateway(session.default_gateway || 'stripe');
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate checkout session.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCompleteCheckout = async (simulateSuccess: boolean) => {
    if (!checkoutSession) return;
    setProcessingPayment(true);
    setErrorMsg('');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const requestBody = {
      payment_id: checkoutSession.payment_id,
      gateway: activeGateway,
      status: simulateSuccess ? "success" : "failed",
      transaction_id: simulateSuccess ? `TXN-${Date.now()}` : null,
      gateway_response: simulateSuccess 
        ? JSON.stringify({ gateway: activeGateway, status: "captured", time: new Date().toISOString() })
        : JSON.stringify({ gateway: activeGateway, status: "failed", error: "Simulated decline" }),
      error_message: simulateSuccess ? null : "Declined by card issuer (Simulation)."
    };
    
    try {
      const result = await apiRequest("/billing/payments/complete-session", {
        method: "POST",
        body: JSON.stringify(requestBody)
      });
      
      if (simulateSuccess) {
        const txnId = requestBody.transaction_id || `TXN-${Date.now()}`;
        setPaymentResult('success');
        setCompletedSessionData({
          invoiceNumber: result.invoice_number || checkoutSession.invoice_number,
          transactionId: txnId,
          planName: selectedPlan.name,
          amount: checkoutSession.amount,
          currency: checkoutSession.currency,
          invoiceId: checkoutSession.invoice_id,
          paymentId: checkoutSession.payment_id
        });
        loadBillingData();
      } else {
        setPaymentResult('failed');
        setErrorMsg("Your payment transaction was declined. Please try another card or gateway.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process checkout completion.");
      setPaymentResult('failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your workspace subscription? Your service will be downgraded to the Free tier at the end of your billing period.")) return;
    
    try {
      await apiRequest("/billing/subscriptions/cancel", { method: "POST" });
      alert("Subscription cancelled successfully.");
      loadBillingData();
    } catch (err: any) {
      alert(err.message || "Failed to cancel subscription.");
    }
  };

  const handleRenewSubscription = async () => {
    try {
      await apiRequest("/billing/subscriptions/renew", { method: "POST" });
      alert("Subscription renewed successfully!");
      loadBillingData();
    } catch (err: any) {
      alert(err.message || "Failed to renew subscription.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const activePlan = data?.current_plan;
  const usage = data?.usage;
  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-blue-500" size={20} />
            Billing & Workspace Subscription
          </h1>
          <p className="text-xs text-slate-650 dark:text-slate-400 font-semibold mt-1">
            Manage subscription plans, check remaining usage limits, and download invoice copies.
          </p>
        </div>
      </div>

      {/* Active Subscription Summary */}
      {activePlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 app-card rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Plan Tier</span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    {activePlan.name}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      activePlan.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {activePlan.status.toUpperCase()}
                    </span>
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recurring Price</span>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{getCurrencySymbol(data?.currency || 'INR')}{activePlan.price} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ mo</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500">Billing Cycle</span>
                  <strong className="text-slate-900 dark:text-white capitalize mt-0.5 block">{activePlan.billing_cycle}</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500">Expiry Date</span>
                  <strong className="text-slate-900 dark:text-white mt-0.5 block">{activePlan.expiry_date || "Lifetime"}</strong>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500">Support Level</span>
                  <strong className="text-slate-900 dark:text-white mt-0.5 block">
                    {activePlan.name === 'Enterprise' ? '24/7 Dedicated Support' : activePlan.name === 'Professional' ? 'Priority Support' : 'Standard Email Support'}
                  </strong>
                </div>
              </div>
            </div>

            {activePlan.name !== 'Free' && (
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-white/5 justify-end">
                <button
                  onClick={handleCancelSubscription}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Plan
                </button>
                <button
                  onClick={handleRenewSubscription}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Renew Plan
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="app-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-blue-500 dark:text-blue-400" />
                Remaining Plan Limits
              </h3>
              
              {usage && (
                <div className="space-y-4">
                  {/* Audio transcription minutes */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Transcription Limit</span>
                      <strong className="text-slate-950 dark:text-white">{usage.audio_minutes_used.toFixed(1)} / {usage.audio_minutes_limit} mins</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (usage.audio_minutes_used / usage.audio_minutes_limit) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Language translation characters */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Translation Limit</span>
                      <strong className="text-slate-950 dark:text-white">{(usage.translation_chars_used).toLocaleString()} / {(usage.translation_chars_limit).toLocaleString()} Chars</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (usage.translation_chars_used / usage.translation_chars_limit) * 100)}%` }} />
                    </div>
                  </div>

                  {/* TTS Synthesis characters */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">TTS Audio Limit</span>
                      <strong className="text-slate-950 dark:text-white">{(usage.tts_chars_used).toLocaleString()} / {(usage.tts_chars_limit).toLocaleString()} Chars</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (usage.tts_chars_used / usage.tts_chars_limit) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-600 dark:text-slate-500 leading-relaxed font-semibold flex items-start gap-1">
              <Info size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Limits reset automatically on {new Date(usage?.billing_period_end).toLocaleDateString()}.</span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Pricing Selection Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compare Subscriptions & Plans</h3>
          <p className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-0.5">Select a target tier to upgrade or downgrade your active workspace instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isCurrent = activePlan?.name.toLowerCase() === p.name.toLowerCase();
            return (
              <div 
                key={p.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden group ${
                  isCurrent 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10 shadow-lg shadow-blue-100 dark:shadow-blue-950/20' 
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 hover:border-slate-355 dark:hover:border-white/10 shadow-sm dark:shadow-none'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                    Active
                  </div>
                )}

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">{p.name}</h4>
                  <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                    {getCurrencySymbol(data?.currency || 'INR')}{p.price}
                    <span className="text-[10px] font-bold text-slate-500 ml-1">/ month</span>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 pt-4">
                    <li className="flex justify-between items-center">
                      <span>Audio Transcriptions:</span>
                      <strong className="text-slate-900 dark:text-white">{p.transcription_limit} mins</strong>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Translation characters:</span>
                      <strong className="text-slate-900 dark:text-white">{(p.translation_limit || 0).toLocaleString()}</strong>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>TTS Voice Synthesis:</span>
                      <strong className="text-slate-900 dark:text-white">{(p.tts_limit || 0).toLocaleString()}</strong>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Cloud Storage:</span>
                      <strong className="text-slate-900 dark:text-white">{p.storage_limit} MB</strong>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
                  {isCurrent ? (
                    <button 
                      disabled
                      className="w-full py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-white/5 text-center cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartCheckout(p, 'monthly')}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center cursor-pointer transition-all"
                      >
                        Subscribe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom History Layout with Split Tabs */}
      <div className="app-card rounded-2xl p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/5 pb-2 gap-4">
          <button
            onClick={() => setActiveHistoryTab('invoices')}
            className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
              activeHistoryTab === 'invoices' 
                ? 'text-slate-900 dark:text-white border-b-2 border-blue-500' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveHistoryTab('payments')}
            className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
              activeHistoryTab === 'payments' 
                ? 'text-slate-900 dark:text-white border-b-2 border-blue-500' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Payments History
          </button>
          <button
            onClick={() => setActiveHistoryTab('subscriptions')}
            className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
              activeHistoryTab === 'subscriptions' 
                ? 'text-slate-900 dark:text-white border-b-2 border-blue-500' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Subscription History
          </button>
        </div>

        {/* Tab Contents */}
        {activeHistoryTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5">Invoice #</th>
                  <th className="py-2.5">Billing Plan</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Due Date</th>
                  <th className="py-2.5">Payment Date</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{inv.invoice_number}</td>
                    <td className="py-3 text-slate-650 dark:text-slate-350">{inv.plan_name}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{getCurrencySymbol(inv.currency || data?.currency || 'INR')}{inv.total_amount.toFixed(2)}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 font-mono">{new Date(inv.due_date).toLocaleDateString()}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 font-mono">
                      {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                        inv.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {inv.status === 'pending' ? (
                        <button
                          onClick={() => {
                            const plan = plans.find(p => p.name === inv.plan_name);
                            if (plan) {
                              handleStartCheckout(plan);
                            } else {
                              alert("Invoice details corrupt. Please select target tier above.");
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Pay Now
                        </button>
                      ) : (
                        inv.pdf_path && (
                          <a
                            href={`${inv.pdf_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-white/5 cursor-pointer inline-flex items-center gap-1 transition-all"
                          >
                            <Download size={11} /> Download PDF
                          </a>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeHistoryTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5">Transaction ID</th>
                  <th className="py-2.5">Invoice #</th>
                  <th className="py-2.5">Gateway</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {(data?.payments || []).map((pay: any) => (
                  <tr key={pay.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{pay.transaction_id || `TXN-${pay.id.slice(0, 8)}`}</td>
                    <td className="py-3 font-mono text-slate-650 dark:text-slate-350">{pay.invoice_number}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 capitalize">{pay.payment_method}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{getCurrencySymbol(pay.currency || 'INR')}{pay.amount.toFixed(2)}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 font-mono">{new Date(pay.created_at).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        pay.status === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                        pay.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {pay.status === 'success' && pay.receipt_url && (
                        <a
                          href={`${pay.receipt_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-white/5 cursor-pointer inline-flex items-center gap-1 transition-all"
                        >
                          <Download size={11} /> Receipt PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {(data?.payments || []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeHistoryTab === 'subscriptions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5">Plan Name</th>
                  <th className="py-2.5">Action</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Start Date</th>
                  <th className="py-2.5">End Date</th>
                  <th className="py-2.5">Logged Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.subscription_history || []).map((sh: any) => (
                  <tr key={sh.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <td className="py-3 font-bold text-slate-900 dark:text-white capitalize">{sh.plan_name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        sh.action === 'Upgrade' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' : 
                        sh.action === 'Renew' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {sh.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{getCurrencySymbol(data?.currency || 'INR')}{sh.price.toFixed(2)}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 font-mono">{sh.start_date}</td>
                    <td className="py-3 text-slate-550 dark:text-slate-400 font-mono">{sh.end_date}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-450 font-mono">{new Date(sh.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(data?.subscription_history || []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      No subscription actions logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-6 flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-blue-500" size={18} />
                  Checkout - Workspace Upgrade
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Completing payment securely via automated gateway integration.</p>
              </div>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
                disabled={processingPayment}
              >
                Γ£ò
              </button>
            </div>

            {processingPayment && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Verifying secure checkout session with payment nodes...</p>
              </div>
            )}

            {!processingPayment && paymentResult === 'success' && completedSessionData && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fadeIn">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Payment Successful!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center max-w-sm">
                  Your workspace has been upgraded to the <strong>{completedSessionData.planName}</strong> plan.
                </p>
                
                {/* Transaction details box */}
                <div className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Invoice Number:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{completedSessionData.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{completedSessionData.transactionId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Activated Plan:</span>
                    <strong className="text-slate-900 dark:text-white capitalize">{completedSessionData.planName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {completedSessionData.currency} {completedSessionData.amount.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      PAID
                    </span>
                  </div>
                </div>

                {/* PDF Downloads */}
                <div className="w-full pt-2">
                  <a
                    href={`/api/billing/payments/${completedSessionData.paymentId}/receipt`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-100 dark:hover:bg-blue-600/20 text-blue-650 dark:text-blue-400 border border-blue-200 dark:border-blue-500/10 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download size={14} /> Download Receipt
                  </a>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer mt-4"
                >
                  Done
                </button>
              </div>
            )}

            {!processingPayment && paymentResult === 'success' && !completedSessionData && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fadeIn">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Updating billing state...</p>
              </div>
            )}

            {!processingPayment && paymentResult !== 'success' && checkoutSession && checkoutStep === 'confirm' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Subscription Plan</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize">{selectedPlan.name} Plan</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 capitalize">
                      {billingCycle} billing
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-650 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Monthly Subscription Price:</span>
                      <strong className="text-slate-900 dark:text-white">{getCurrencySymbol(checkoutSession.currency || 'INR')}{checkoutSession.base_amount.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Amount (18%):</span>
                      <strong className="text-slate-900 dark:text-white">{getCurrencySymbol(checkoutSession.currency || 'INR')}{checkoutSession.tax_amount.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-slate-200 dark:border-white/5 text-sm">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Total Amount Due:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-black">{getCurrencySymbol(checkoutSession.currency || 'INR')}{checkoutSession.amount.toFixed(2)} {checkoutSession.currency}</strong>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-4 flex justify-between gap-3">
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {!processingPayment && paymentResult !== 'success' && checkoutSession && checkoutStep === 'payment' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gateways Tab Selector */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Gateway method</span>
                    
                    {checkoutSession.gateways.stripe.enabled && (
                      <button
                        onClick={() => setActiveGateway('stripe')}
                        className={`w-full flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          activeGateway === 'stripe' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/15 text-slate-900 dark:text-white' 
                            : 'border-slate-200 dark:border-white/5 bg-slate-55 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="text-sm">≡ƒÆ│</span> Stripe Test
                      </button>
                    )}

                    {checkoutSession.gateways.razorpay.enabled && (
                      <button
                        onClick={() => setActiveGateway('razorpay')}
                        className={`w-full flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          activeGateway === 'razorpay' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/15 text-slate-900 dark:text-white' 
                            : 'border-slate-200 dark:border-white/5 bg-slate-55 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="text-sm">≡ƒÆ│</span> Razorpay Test
                      </button>
                    )}

                    {checkoutSession.gateways.upi.enabled && (
                      <button
                        onClick={() => setActiveGateway('upi')}
                        className={`w-full flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          activeGateway === 'upi' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/15 text-slate-900 dark:text-white' 
                            : 'border-slate-200 dark:border-white/5 bg-slate-55 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="text-sm">≡ƒô▒</span> UPI Test
                      </button>
                    )}
                  </div>

                  {/* Gateway Specific Input forms */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-55 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Plan Billing Details</span>
                      <div className="flex justify-between items-center mt-2 text-xs font-semibold">
                        <span className="text-slate-550 dark:text-slate-400">{selectedPlan.name} Plan ({billingCycle})</span>
                        <strong className="text-slate-900 dark:text-white">{getCurrencySymbol(checkoutSession.currency || 'INR')}{checkoutSession.amount.toFixed(2)} {checkoutSession.currency}</strong>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-50/10 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-650 dark:text-red-500 text-xs font-semibold flex items-start gap-1.5 leading-relaxed">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Stripe fields */}
                    {activeGateway === 'stripe' && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Expiration</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CVC</label>
                            <input
                              type="password"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Razorpay fields */}
                    {activeGateway === 'razorpay' && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Bank</label>
                          <select
                            value={razorpayBank}
                            onChange={(e) => setRazorpayBank(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                            style={{ background: 'var(--bg-subtle)' }}
                          >
                            <option value="SBI">State Bank of India (SBI)</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis NetBanking</option>
                          </select>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">Razorpay will redirect to secure net banking site to verify credentials after validation.</p>
                      </div>
                    )}

                    {/* UPI fields */}
                    {activeGateway === 'upi' && (
                      <div className="space-y-3 text-center flex flex-col items-center justify-center animate-fadeIn">
                        <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
                          <QrCode size={110} className="text-slate-900" />
                        </div>
                        <div className="space-y-1 w-full text-left mt-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Scan & Pay QR or Enter UPI Address</label>
                          <input
                            type="text"
                            value={upiAddress}
                            onChange={(e) => setUpiAddress(e.target.value)}
                            placeholder="username@upi"
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-4 flex justify-between gap-3">
                  <button
                    onClick={() => setCheckoutStep('confirm')}
                    className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleCompleteCheckout(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
