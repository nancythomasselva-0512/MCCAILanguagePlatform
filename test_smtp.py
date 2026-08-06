import smtplib
from email.mime.text import MIMEText

msg = MIMEText("Test email from MCC AI")
msg['Subject'] = 'Test Email'
msg['From'] = 'aachinancy@gmail.com'
msg['To'] = 'aachinancy@gmail.com'

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('aachinancy@gmail.com', 'tejm mdru mcyz bnas')
    server.sendmail('aachinancy@gmail.com', 'aachinancy@gmail.com', msg.as_string())
    server.quit()
    print("SMTP connection and auth successful.")
except Exception as e:
    print(f"SMTP failed: {e}")
