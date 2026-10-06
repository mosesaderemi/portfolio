'use strict';

/**
 * Netlify Serverless Function: POST /.netlify/functions/contact
 * Reached automatically through /api/contact via netlify.toml redirect.
 */

const RECIPIENT = process.env.CONTACT_TO || process.env.CONTACT_RECIPIENT || 'mosestimileyinaderemi@gmail.com';

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
  return [
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
}

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'POST' },
      body: JSON.stringify({ ok: false, error: 'Method not allowed.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'Invalid JSON payload.' })
    };
  }

  const data = validate(body);
  if (data.spam) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }
  if (data.errors && data.errors.length) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, errors: data.errors })
    };
  }

  const emailText = buildContent(data);
  const subject = 'Portfolio Inquiry: ' + data.lookingFor + ' — ' + data.name;

  // 1. Resend API
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
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
      }
    } catch (err) {
      console.error('Netlify Resend delivery error:', err);
    }
  }

  // 2. Nodemailer / SMTP
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

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error('Netlify SMTP error:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'Could not deliver the message. Please email ' + RECIPIENT + ' directly.'
        })
      };
    }
  }

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      ok: false,
      error: 'Mail delivery service is not configured yet. Please email ' + RECIPIENT + ' directly.'
    })
  };
};
