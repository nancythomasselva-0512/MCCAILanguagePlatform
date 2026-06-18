import os
from fpdf import FPDF
import datetime

def generate_invoice_pdf(invoice, tenant_name, plan_name, settings) -> str:
    """
    Generates a beautiful PDF invoice and returns the local file path.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=12)
    
    # Title
    pdf.set_font("helvetica", "B", 18)
    pdf.cell(0, 10, txt=f"{settings.company_name}", border=0, align="L")
    pdf.ln(10)
    pdf.set_font("helvetica", "", 10)
    if settings.company_address:
        pdf.cell(0, 5, txt=f"{settings.company_address}", border=0, align="L")
        pdf.ln(5)
    if settings.company_email:
        pdf.cell(0, 5, txt=f"Email: {settings.company_email}", border=0, align="L")
        pdf.ln(5)
    
    pdf.ln(5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(10)
    
    # Invoice details
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, txt=f"INVOICE: {invoice.invoice_number}", border=0)
    pdf.ln(10)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, txt=f"Date: {invoice.created_at.strftime('%Y-%m-%d %H:%M:%S')}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Due Date: {invoice.due_date.strftime('%Y-%m-%d')}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Status: {invoice.status.upper()}", border=0)
    pdf.ln(6)
    if invoice.paid_at:
        pdf.cell(0, 6, txt=f"Paid At: {invoice.paid_at.strftime('%Y-%m-%d %H:%M:%S')}", border=0)
        pdf.ln(6)
    
    pdf.ln(5)
    
    # Customer Details
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, txt="Billed To:", border=0)
    pdf.ln(8)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, txt=f"Tenant Workspace: {tenant_name}", border=0)
    pdf.ln(12)
    
    # Table Header
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(100, 8, txt="Description", border=1)
    pdf.cell(40, 8, txt="Rate", border=1, align="R")
    pdf.cell(45, 8, txt="Total", border=1, align="R")
    pdf.ln(8)
    
    # Table Row
    pdf.set_font("helvetica", "", 10)
    pdf.cell(100, 8, txt=f"Subscription Plan - {plan_name}", border=1)
    pdf.cell(40, 8, txt=f"{invoice.currency} {invoice.amount:.2f}", border=1, align="R")
    pdf.cell(45, 8, txt=f"{invoice.currency} {invoice.amount:.2f}", border=1, align="R")
    pdf.ln(8)
    
    # Calculations
    pdf.cell(100, 8, txt="", border=0)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(40, 8, txt="Subtotal", border=1, align="R")
    pdf.set_font("helvetica", "", 10)
    pdf.cell(45, 8, txt=f"{invoice.currency} {invoice.amount:.2f}", border=1, align="R")
    pdf.ln(8)
    
    pdf.cell(100, 8, txt="", border=0)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(40, 8, txt=f"GST ({settings.gst_percentage}%)", border=1, align="R")
    pdf.set_font("helvetica", "", 10)
    pdf.cell(45, 8, txt=f"{invoice.currency} {invoice.tax_amount:.2f}", border=1, align="R")
    pdf.ln(8)
    
    pdf.cell(100, 8, txt="", border=0)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(40, 8, txt="Total", border=1, align="R")
    pdf.cell(45, 8, txt=f"{invoice.currency} {invoice.total_amount:.2f}", border=1, align="R")
    pdf.ln(15)
    
    # Footer
    pdf.set_font("helvetica", "I", 9)
    if settings.invoice_footer:
        pdf.cell(0, 10, txt=f"{settings.invoice_footer}", border=0, align="C")
        
    # Output file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = os.path.join(base_dir, "invoices_pdf")
    os.makedirs(out_dir, exist_ok=True)
    filename = os.path.join(out_dir, f"{invoice.invoice_number}.pdf")
    pdf.output(filename)
    return filename

def generate_receipt_pdf(payment, tenant_name, plan_name, settings) -> str:
    """
    Generates a beautiful PDF receipt and returns the local file path.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=12)
    
    # Title
    pdf.set_font("helvetica", "B", 18)
    pdf.cell(0, 10, txt=f"{settings.company_name}", border=0, align="L")
    pdf.ln(10)
    pdf.set_font("helvetica", "", 10)
    if settings.company_address:
        pdf.cell(0, 5, txt=f"{settings.company_address}", border=0, align="L")
        pdf.ln(5)
    if settings.company_email:
        pdf.cell(0, 5, txt=f"Email: {settings.company_email}", border=0, align="L")
        pdf.ln(5)
    
    pdf.ln(5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(10)
    
    # Receipt details
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, txt="PAYMENT RECEIPT", border=0)
    pdf.ln(10)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, txt=f"Transaction ID: {payment.transaction_id}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Invoice Number: {payment.invoice.invoice_number if payment.invoice else 'N/A'}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Payment Date: {payment.created_at.strftime('%Y-%m-%d %H:%M:%S')}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Gateway/Method: {payment.payment_method.upper()}", border=0)
    pdf.ln(6)
    pdf.cell(0, 6, txt=f"Status: {payment.status.upper()}", border=0)
    pdf.ln(10)
    
    # Customer Details
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, txt="Paid By:", border=0)
    pdf.ln(8)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, txt=f"Tenant Workspace: {tenant_name}", border=0)
    pdf.ln(12)
    
    # Table Header
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(100, 8, txt="Item Description", border=1)
    pdf.cell(40, 8, txt="Payment Method", border=1, align="C")
    pdf.cell(45, 8, txt="Amount Paid", border=1, align="R")
    pdf.ln(8)
    
    # Table Row
    pdf.set_font("helvetica", "", 10)
    pdf.cell(100, 8, txt=f"Subscription Payment - {plan_name}", border=1)
    pdf.cell(40, 8, txt=f"{payment.payment_method.upper()}", border=1, align="C")
    pdf.cell(45, 8, txt=f"{payment.currency} {payment.amount:.2f}", border=1, align="R")
    pdf.ln(8)
    
    # Calculations / Totals
    pdf.cell(100, 8, txt="", border=0)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(40, 8, txt="Total Paid", border=1, align="R")
    pdf.cell(45, 8, txt=f"{payment.currency} {payment.amount:.2f}", border=1, align="R")
    pdf.ln(15)
    
    # Footer
    pdf.set_font("helvetica", "I", 9)
    if settings.invoice_footer:
        pdf.cell(0, 10, txt=f"{settings.invoice_footer}", border=0, align="C")
        
    # Output file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = os.path.join(base_dir, "receipts_pdf")
    os.makedirs(out_dir, exist_ok=True)
    filename = os.path.join(out_dir, f"receipt_{payment.id}.pdf")
    pdf.output(filename)
    return filename

