import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, AlertTriangle, Loader2, CheckCircle2,
  TrendingUp, Info, Download, QrCode, X
} from 'lucide-react';

interface ThreeDInteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

const ThreeDInteractiveCard: React.FC<ThreeDInteractiveCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(37,99,235,0.15)',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const rY = ((x - xc) / xc) * 10;
    const rX = -((y - yc) / yc) * 10;

    // Direct DOM manipulation to avoid React re-renders on mousemove
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.025, 1.025, 1.025)`;
    
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(25px)';
    }

    const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLDivElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle 220px at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(0px)';
    }
    const glow = cardRef.current?.querySelector('.card-3d-glow') as HTMLDivElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`bg-white dark:bg-[#0a1120]/85 border border-[#DDE5F0] dark:border-white/5 rounded-[28px] shadow-lg dark:shadow-2xl transition-all duration-300 relative overflow-hidden group select-none ${className}`}
    >
      <div className="card-3d-glow absolute inset-0 pointer-events-none transition-all duration-300" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2563eb]/10 dark:via-white/10 to-transparent" />
      <div
        ref={contentRef}
        style={{
          transform: 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        className="transition-transform duration-300 h-full w-full"
      >
        {children}
      </div>
    </div>
  );
};


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

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4 items-stretch">
          {/* Free Trial Card */}
          {plans.filter(p => p.price === 0).map(p => {
            const isCurrent = activePlan?.name.toLowerCase() === p.name.toLowerCase();
            return (
              <ThreeDInteractiveCard
                key={p.id}
                glowColor="rgba(59, 130, 246, 0.15)"
                className="p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl relative w-full"
              >
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 tracking-wider">
                      Most Popular
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">14 Days Trial</span>
                  </div>
                  <h3 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2">{p.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6">
                    Perfect for experiencing the complete Fluentia platform workstation locally on your device.
                  </p>
                  <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-4" />
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Audio Processing</p>
                        <p className="text-[10px] text-slate-500">{p.transcription_limit} minutes of translation & transcription</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Translation Services</p>
                        <p className="text-[10px] text-slate-500">{(p.translation_limit || 0).toLocaleString()} characters processed</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Text-to-Speech (TTS)</p>
                        <p className="text-[10px] text-slate-500">{(p.tts_limit || 0).toLocaleString()} synthesis characters</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Cloud Storage Allocation</p>
                        <p className="text-[10px] text-slate-500">{p.storage_limit} MB secure isolated storage</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="w-full mt-8">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-default text-center block"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout(p, billingCycle)}
                      className="w-full py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-lg text-center block"
                    >
                      Start 14-Day Free Trial
                    </button>
                  )}
                </div>
              </ThreeDInteractiveCard>
            );
          })}

          {/* Upgrade Plans Card */}
          <ThreeDInteractiveCard
            glowColor="rgba(168, 85, 247, 0.15)"
            className="p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl w-full"
          >
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Paid Tiers
                </span>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Post-Trial Options</span>
              </div>
              <h3 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2">Upgrade Plans</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6">
                After your 14-day trial concludes, select one of our premium enterprise tiers:
              </p>
              <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-4" />
              <div className="space-y-4">
                {plans.filter(p => p.price > 0).map(p => {
                  const isCurrent = activePlan?.name.toLowerCase() === p.name.toLowerCase();
                  const monthlyPrice = p.price;
                  const yearlyPerMonth = +(p.price * 0.7).toFixed(0);
                  const displayPrice = billingCycle === 'yearly' ? yearlyPerMonth : monthlyPrice;
                  const currSymbol = getCurrencySymbol(data?.currency || 'INR');
                  
                  return (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{p.name} Plan</h4>
                        <p className="text-[10px] text-slate-500">{p.transcription_limit} mins audio / {(p.translation_limit/1000).toFixed(0)}k translation / {(p.tts_limit/1000).toFixed(0)}k TTS</p>
                      </div>
                      {isCurrent ? (
                        <button disabled className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-lg text-sm font-black cursor-default">
                          Active
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartCheckout(p, billingCycle)}
                          className="px-4 py-2 bg-teal-100 dark:bg-teal-500/20 hover:bg-teal-200 dark:hover:bg-teal-500/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm font-black transition-colors cursor-pointer"
                        >
                          {currSymbol}{displayPrice}/mo
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full mt-8">
              <button
                  onClick={() => document.getElementById('billing-history')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 px-6 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white text-xs font-bold cursor-pointer transition-colors text-center block"
              >
                Explore Billing Details
              </button>
            </div>
          </ThreeDInteractiveCard>
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
