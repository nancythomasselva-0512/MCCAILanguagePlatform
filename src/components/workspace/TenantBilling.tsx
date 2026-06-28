import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, AlertTriangle, Loader2, CheckCircle2,
  TrendingUp, Info, Download, QrCode, X
} from 'lucide-react';

const getCurrencySymbol = (currencyCode: string) => {
  return currencyCode === 'INR' ? '₹' : currencyCode === 'USD' ? '$' : currencyCode;
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
      // Load plans first so they always render
      try {
        const plansList = await apiRequest("/billing/plans");
        setPlans(plansList.sort((a: any, b: any) => a.price - b.price));
      } catch (err) {
        console.error("Failed to load plans:", err);
      }

      const res = await apiRequest("/billing/tenant/overview");
      setData(res);
      
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
        <Loader2 className="animate-spin text-teal-500" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4 animate-fadeIn">
        <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Context Missing</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
          You are currently logged in as a Super Admin or viewing this page without an active Workspace context. Please log in with a Tenant account or select a workspace to manage billing and subscriptions.
        </p>
      </div>
    );
  }

  const activePlan = data?.current_plan;
  const usage = data?.usage;
  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6 w-full mx-auto p-4 md:p-8 animate-fadeIn">


      {/* Plans Pricing Selection Section */}
      <div className="space-y-8 bg-teal-900/5 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-teal-900/5 border border-white/60">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-teal-400/20 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 text-center space-y-1">
          <h3 className="text-4xl md:text-5xl font-black text-teal-950 tracking-widest uppercase drop-shadow-sm">Our Prices</h3>
          <p className="text-[10px] text-teal-700 font-bold tracking-[0.2em] uppercase">Select a target tier to upgrade or downgrade your active workspace instantly.</p>
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                : 'bg-white/70 text-slate-500 border border-teal-200/60 hover:border-teal-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                : 'bg-white/70 text-slate-500 border border-teal-200/60 hover:border-teal-300'
            }`}
          >
            Yearly
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
              billingCycle === 'yearly' ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}>
              Save 30%
            </span>
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto pt-4 w-full">
          {plans.map((p, idx) => {
            const isCurrent = activePlan?.name.toLowerCase() === p.name.toLowerCase();
            const isFree = p.price === 0;
            // Compute displayed price: yearly = base * 12 * 0.7 (30% off), show per-month
            const monthlyPrice = p.price;
            const yearlyPerMonth = +(p.price * 0.7).toFixed(0);
            const displayPrice = billingCycle === 'yearly' ? yearlyPerMonth : monthlyPrice;
            const currSymbol = getCurrencySymbol(data?.currency || 'INR');
            
            return (
              <div 
                key={p.id}
                className={`p-6 xl:p-8 rounded-[2.5rem] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group backdrop-blur-2xl w-full scale-100 hover:scale-105 hover:z-20 ${
                  isCurrent 
                    ? 'shadow-[0_10px_40px_rgba(20,184,166,0.25)] bg-white/95 border-2 border-teal-400/60' 
                    : 'shadow-[0_5px_20px_rgba(20,184,166,0.1)] bg-white/80 border border-teal-200/50 hover:border-teal-400/50 hover:bg-white/90'
                }`}
              >
                {/* Glossy top reflection */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent rounded-t-[2.5rem] pointer-events-none opacity-60" />

                {/* Free Trial Badge on free plan */}
                {isFree && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2.5 py-1 bg-emerald-400 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-md">
                      Free 7 Days
                    </span>
                  </div>
                )}

                <div className="relative z-10 text-center space-y-6">
                  <div>
                    <h4 className="text-2xl font-extrabold text-teal-950 capitalize tracking-wider">{p.name}</h4>
                    {isCurrent && (
                       <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 text-[9px] font-black uppercase tracking-[0.15em] rounded-full border border-teal-200 shadow-sm">
                         Current Plan
                       </span>
                    )}
                    {isFree && !isCurrent && (
                      <p className="mt-1 text-[10px] text-emerald-600 font-bold">Try free for 7 days, no card needed</p>
                    )}
                  </div>

                  <ul className="space-y-4 text-[11px] font-medium text-slate-600 text-left w-max mx-auto py-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-teal-500 drop-shadow-sm" />
                      <span><strong className="text-teal-950">{p.transcription_limit} mins</strong> Audio Transcriptions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-teal-500 drop-shadow-sm" />
                      <span><strong className="text-teal-950">{(p.translation_limit || 0).toLocaleString()}</strong> Translation Chars</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-teal-500 drop-shadow-sm" />
                      <span><strong className="text-teal-950">{(p.tts_limit || 0).toLocaleString()}</strong> TTS Voice Chars</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-teal-500 drop-shadow-sm" />
                      <span><strong className="text-teal-950">{p.storage_limit} MB</strong> Cloud Storage</span>
                    </li>
                  </ul>
                  
                  <div className="pt-2">
                    <div className="text-[2rem] leading-none font-black text-teal-950 drop-shadow-sm flex items-end justify-center gap-1.5">
                      {isFree ? (
                        <span>{currSymbol}0</span>
                      ) : (
                        <>
                          <span>{currSymbol}{displayPrice}</span>
                          {billingCycle === 'yearly' && (
                            <span className="text-xs text-slate-400 line-through pb-1">{currSymbol}{monthlyPrice}</span>
                          )}
                        </>
                      )}
                      <span className="text-sm font-bold text-slate-400 tracking-widest uppercase pb-1">/ mo</span>
                    </div>
                    {billingCycle === 'yearly' && !isFree && (
                      <p className="text-[9px] text-emerald-600 font-bold mt-1 tracking-wider">
                        Billed as {currSymbol}{+(p.price * 12 * 0.7).toFixed(0)} / year
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 relative z-10 flex justify-center">
                  {isCurrent ? (
                    <button 
                      disabled
                      className="px-10 py-3 rounded-full bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-[0.2em] border border-slate-200 shadow-inner cursor-default"
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout(p, billingCycle)}
                      className="px-10 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_5px_15px_rgba(20,184,166,0.4)] hover:shadow-[0_8px_25px_rgba(20,184,166,0.5)] transition-all transform hover:-translate-y-0.5"
                    >
                      {isFree ? 'Start Free Trial' : 'Get Started ↗'}
                    </button>
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
                ? 'text-slate-900 dark:text-white border-b-2 border-teal-500' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveHistoryTab('payments')}
            className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
              activeHistoryTab === 'payments' 
                ? 'text-slate-900 dark:text-white border-b-2 border-teal-500' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Payments History
          </button>
          <button
            onClick={() => setActiveHistoryTab('subscriptions')}
            className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
              activeHistoryTab === 'subscriptions' 
                ? 'text-slate-900 dark:text-white border-b-2 border-teal-500' 
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
                            href={`http://127.0.0.1:8000${inv.pdf_path}`}
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
                          href={`http://127.0.0.1:8000${pay.receipt_url}`}
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
                        sh.action === 'Upgrade' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20' : 
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
                  <CreditCard className="text-teal-500" size={18} />
                  Checkout - Workspace Upgrade
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Completing payment securely via automated gateway integration.</p>
              </div>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
                disabled={processingPayment}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error display if session creation failed entirely */}
            {!processingPayment && !checkoutSession && errorMsg && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-red-50/10 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-650 dark:text-red-500 text-sm font-semibold flex items-start gap-2 leading-relaxed">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {processingPayment && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="animate-spin text-teal-500" size={40} />
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
                    href={`http://127.0.0.1:8000/api/billing/payments/${completedSessionData.paymentId}/receipt`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-teal-50 dark:bg-teal-600/10 hover:bg-teal-100 dark:hover:bg-teal-600/20 text-teal-650 dark:text-teal-400 border border-teal-200 dark:border-teal-500/10 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download size={14} /> Download Receipt
                  </a>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer mt-4"
                >
                  Done
                </button>
              </div>
            )}

            {!processingPayment && paymentResult === 'success' && !completedSessionData && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fadeIn">
                <Loader2 className="animate-spin text-teal-500" size={32} />
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
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-600/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 capitalize">
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
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
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
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/15 text-slate-900 dark:text-white' 
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
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/15 text-slate-900 dark:text-white' 
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
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/15 text-slate-900 dark:text-white' 
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
