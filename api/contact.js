'use strict';

/**
 * Vercel Serverless Function: POST /api/contact
 * Delivers contact form submissions to mosestimileyinaderemi@gmail.com
 * Supports both Resend API (HTTP, zero external overhead) and Nodemailer (Gmail SMTP).
 */

const RECIPIENT = process.env.CONTACT_TO || process.env.CONTACT_RECIPIENT || 'mosestimileyinaderemi@gmail.com';

const ALLOWED_TYPES = new Set([
  'Free 20-minute call',
  'Software review / audit',
  'Full-stack development',
  'Backend / API engineering',
  'AI automation & LLM agents',
  'Something else'
]);

function readBody(req, limit = 100000) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > limit) {
        req.destroy();
        resolve(null);
      }
    });
    req.on('end', () => {
      if (data === null) { resolve(null); return; }
      try { resolve(JSON.parse(data || '{}')); }
      catch (err) { resolve({}); }
    });
    req.on('error', () => resolve(null));
  });
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validate(body) {
  const name = clean(body.name);
  const email = clean(body.email);
  const company = clean(body.company);
  const lookingFor = clean(body.lookingFor || body.looking_for);
  const help = clean(body.help);
  const message = clean(body.message);
  const honeypot = clean(body.bot_field || body.gotcha);
  const errors = [];

  // Honeypot spam trap
  if (honeypot) {
    return { spam: true };
  }

  if (!name) errors.push('Name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email address is required.');
  if (!lookingFor) errors.push('Please select what you are looking for.');
  if (message.length < 5) errors.push('A short message is required (at least 5 characters).');

  return { name, email, company, lookingFor, help, message, errors };
}

function buildContent(data) {
  const text = [
    'New Portfolio Inquiry from ' + data.name,
    '========================================',
    '',
    'Name: ' + data.name,
    'Email: ' + data.email,
    'Company / Organization: ' + (data.company || 'Not specified'),
    'Inquiry Type: ' + data.lookingFor,
    'Specific Focus: ' + (data.help || 'None specified'),
    '',
    'Message:',
    data.message,
    '',
    '========================================',
    'Sent from Aderemi Moses Timileyin Portfolio Website'
  ].join('\n');

  return text;
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  const body = await readBody(req);
  if (!body) {
    res.status(400).json({ ok: false, error: 'Request body is too large or unreadable.' });
    return;
  }

  const data = validate(body);
  if (data.spam) {
    // Silently succeed for bots
    res.status(200).json({ ok: true });
    return;
  }
  if (data.errors && data.errors.length) {
    res.status(400).json({ ok: false, errors: data.errors });
    return;
  }

  const emailText = buildContent(data);
  const subject = 'Portfolio Inquiry: ' + data.lookingFor + ' — ' + data.name;

  // 1. Resend API support (zero dependencies, fast HTTPS)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'onboarding@resend.dev',
          to: RECIPIENT,
          reply_to: data.email,
          subject: subject,
          text: emailText
        })
      });
      if (response.ok) {
        res.status(200).json({ ok: true });
        return;
      }
    } catch (err) {
      console.error('Resend delivery failed:', err);
    }
  }

  // 2. Nodemailer / SMTP support
  const smtpPass = process.env.SMTP_PASS;
  if (smtpPass) {
    try {
      const nodemailer = require('nodemailer');
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = Number(process.env.SMTP_PORT || 587);
      const smtpUser = process.env.SMTP_USER || RECIPIENT;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: '"Moses Aderemi Portfolio" <' + smtpUser + '>',
        to: RECIPIENT,
        replyTo: data.email,
        subject: subject,
        text: emailText
      });

      res.status(200).json({ ok: true });
      return;
    } catch (err) {
      console.error('SMTP delivery failed:', err);
      res.status(500).json({
        ok: false,
        error: 'Could not deliver the message. Please email ' + RECIPIENT + ' directly.'
      });
      return;
    }
  }

  // If neither provider is configured in environment variables
  res.status(500).json({
    ok: false,
    error: 'Mail delivery service is not configured yet. Please email ' + RECIPIENT + ' directly.'
  });
};
