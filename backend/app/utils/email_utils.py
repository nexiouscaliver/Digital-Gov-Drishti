import logging
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import get_config

class EmailError(Exception):
    """Custom exception for email errors"""
    pass

def send_email(to_email, subject, body_html, body_text=None):
    """
    Send an email
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        body_html (str): HTML body of the email
        body_text (str, optional): Plain text body of the email
        
    Returns:
        bool: True if successful, False otherwise
        
    Raises:
        EmailError: If there's an error sending the email
    """
    config = get_config()
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = config.MAIL_DEFAULT_SENDER
        msg['To'] = to_email
        
        # Add plain text body if provided
        if body_text:
            msg.attach(MIMEText(body_text, 'plain'))
            
        # Add HTML body
        msg.attach(MIMEText(body_html, 'html'))
        
        # Create SMTP connection
        server = smtplib.SMTP(config.MAIL_SERVER, config.MAIL_PORT)
        
        if config.MAIL_USE_TLS:
            server.starttls()
            
        # Login if credentials are provided
        if config.MAIL_USERNAME and config.MAIL_PASSWORD:
            server.login(config.MAIL_USERNAME, config.MAIL_PASSWORD)
            
        # Send email
        server.sendmail(config.MAIL_DEFAULT_SENDER, to_email, msg.as_string())
        server.quit()
        
        logging.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        error_msg = f"Failed to send email to {to_email}: {str(e)}"
        logging.error(error_msg)
        raise EmailError(error_msg)

def send_otp_email(to_email, otp, name):
    """
    Send an OTP verification email
    
    Args:
        to_email (str): Recipient email address
        otp (str): The OTP to send
        name (str): The recipient's name
        
    Returns:
        bool: True if successful, False otherwise
    """
    subject = "Your OTP Verification Code"
    
    # HTML body
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; border: 1px solid #ddd; }}
            .otp {{ font-size: 24px; text-align: center; letter-spacing: 5px; 
                   margin: 20px 0; padding: 10px; background-color: #f5f5f5; }}
            .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #777; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>OTP Verification</h2>
            </div>
            <div class="content">
                <p>Hello {name},</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <div class="otp">{otp}</div>
                <p>This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
                <p>If you did not request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text body
    text_body = f"""
    Hello {name},
    
    Your One-Time Password (OTP) for account verification is: {otp}
    
    This OTP is valid for 10 minutes. Please do not share this OTP with anyone.
    
    If you did not request this verification, please ignore this email.
    
    This is an automated message, please do not reply to this email.
    """
    
    return send_email(to_email, subject, html_body, text_body)
