const crypto = require('crypto');
const { supabase, supabaseAdmin } = require('../config/supabase');

// Universal standard demo OTP code for frictionless testing/evaluation
const UNIVERSAL_DEMO_CODE = '123456';

// In-memory verification store: normalizedPhone -> { code, expiresAt, attempts, createdAt }
const otpStore = new Map();

// Rate-limiting store: normalizedPhone -> [timestamps]
const rateLimits = new Map();

/**
 * Determine if mobile verification is running in demo mode
 * Default is 'demo' unless SMS_VERIFICATION_MODE is explicitly set to 'realtime'
 */
const isDemoMode = () => {
  const mode = (process.env.SMS_VERIFICATION_MODE || 'demo').toLowerCase().trim();
  if (mode === 'realtime') {
    // Check if valid Twilio keys exist
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const hasValidTwilio = Boolean(accountSid && authToken && fromNumber && !accountSid.includes('your_twilio'));
    return !hasValidTwilio; // If Twilio is not configured, fallback to demo mode
  }
  return true;
};

/**
 * Clean & normalize phone number
 */
const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').trim();
};

/**
 * SMS Dispatcher
 * In 'realtime' mode: Delivers SMS via Twilio if configured in .env
 * In 'demo' mode: Outputs high-visibility demo verification information
 */
const dispatchSMS = async (toPhone, code, message) => {
  const runningInDemo = isDemoMode();

  if (runningInDemo) {
    console.log('\n======================================================');
    console.log('📱 [WORKZO MOBILE VERIFICATION - DEMO MODE]');
    console.log(`To          : ${toPhone}`);
    console.log(`Demo OTP    : ${code} (or universal demo code: ${UNIVERSAL_DEMO_CODE})`);
    console.log(`Mode        : Demo / Mock Verification Mode`);
    console.log(`Timestamp   : ${new Date().toISOString()}`);
    console.log('💡 Note     : To enable live real-time SMS to mobile phones,');
    console.log('             set SMS_VERIFICATION_MODE=realtime and add Twilio keys in backend/.env');
    console.log('======================================================\n');
    return { success: true, provider: 'demo_gateway', mode: 'demo' };
  }

  // Real-time SMS via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams({
      To: toPhone,
      From: fromNumber,
      Body: message
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('❌ [Twilio SMS Gateway Error]:', data.message || data);
      return { success: false, provider: 'twilio', error: data.message, mode: 'realtime' };
    }

    console.log(`✅ [Twilio SMS Gateway] Message delivered to ${toPhone} (SID: ${data.sid})`);
    return { success: true, provider: 'twilio', sid: data.sid, mode: 'realtime' };
  } catch (err) {
    console.error('❌ [Twilio SMS Gateway Network Error]:', err.message);
    return { success: false, provider: 'twilio', error: err.message, mode: 'realtime' };
  }
};

/**
 * @desc    Send 6-digit SMS verification code to mobile number
 * @route   POST /api/verification/send-code
 * @access  Public / Authenticated
 */
const sendVerificationCode = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Mobile phone number is required.'
      });
    }

    const normalized = normalizePhone(phone);
    if (!normalized || normalized.replace(/\D/g, '').length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile number with country code.'
      });
    }

    const runningInDemo = isDemoMode();

    // Rate Limiting: Max 8 requests per 5 minutes per phone (generous in demo mode)
    const now = Date.now();
    const windowMs = 5 * 60 * 1000;
    const history = rateLimits.get(normalized) || [];
    const recent = history.filter(ts => now - ts < windowMs);

    if (recent.length >= (runningInDemo ? 15 : 4)) {
      const waitMins = Math.ceil((recent[0] + windowMs - now) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many verification requests. Please wait ${waitMins} minute(s) before trying again.`
      });
    }

    recent.push(now);
    rateLimits.set(normalized, recent);

    // In demo mode: provide code 123456 or a random 6-digit code
    const code = runningInDemo ? UNIVERSAL_DEMO_CODE : crypto.randomInt(100000, 999999).toString();
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes expiry

    // Store in active verification store
    otpStore.set(normalized, {
      code,
      expiresAt,
      attempts: 0,
      createdAt: now
    });

    const smsMessage = `Your WORKZO mobile verification code is ${code}. It is valid for 15 minutes.`;
    const dispatchResult = await dispatchSMS(normalized, code, smsMessage);

    // If candidate is authenticated, track in database verifications table
    if (req.user?.id) {
      try {
        await supabaseAdmin
          .from('verifications')
          .upsert({
            user_id: req.user.id,
            type: 'phone',
            status: 'Pending',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,type' });
      } catch (dbErr) {
        console.warn('Could not record pending verification in database:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      mode: runningInDemo ? 'demo' : 'realtime',
      message: runningInDemo 
        ? `[Demo Mode] Verification code generated: ${code}`
        : `Verification code dispatched to ${normalized} via SMS gateway.`,
      phone: normalized,
      expiresIn: 900,
      provider: dispatchResult.provider,
      // Pass demo code so frontend can display it and offer 1-click auto-fill
      demoCode: runningInDemo ? code : undefined,
      debugCode: runningInDemo ? code : undefined
    });
  } catch (error) {
    console.error('Error in sendVerificationCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.',
      error: error.message
    });
  }
};

/**
 * @desc    Verify submitted 6-digit OTP code
 * @route   POST /api/verification/verify-code
 * @access  Public / Authenticated
 */
const verifyCode = async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and 6-digit verification code are required.'
      });
    }

    const normalized = normalizePhone(phone);
    const trimmedCode = String(code).trim();

    if (trimmedCode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Verification code must be exactly 6 digits.'
      });
    }

    const runningInDemo = isDemoMode();
    const record = otpStore.get(normalized);

    // DEMO MODE VERIFICATION LOGIC:
    // In demo mode, accept:
    // 1. The universal demo code ('123456')
    // 2. Or the generated code from otpStore
    // 3. Even if record expired or wasn't pre-dispatched, '123456' is always accepted
    if (runningInDemo) {
      const isMatch = trimmedCode === UNIVERSAL_DEMO_CODE || (record && record.code === trimmedCode);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          mode: 'demo',
          message: `Invalid demo code. For Demo Mode, please use ${UNIVERSAL_DEMO_CODE}.`
        });
      }

      // Cleanup used code
      otpStore.delete(normalized);

      // If authenticated, update user profile and verifications table
      if (req.user?.id) {
        try {
          await supabaseAdmin
            .from('profiles')
            .update({
              phone: normalized,
              updated_at: new Date().toISOString()
            })
            .eq('id', req.user.id);

          try {
            await supabaseAdmin
              .from('job_seekers')
              .update({
                phone: normalized,
                is_phone_verified: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', req.user.id);
          } catch (_) {}

          await supabaseAdmin
            .from('verifications')
            .upsert({
              user_id: req.user.id,
              type: 'phone',
              status: 'Verified',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,type' });
        } catch (dbErr) {
          console.warn('Could not update profile verification in database:', dbErr.message);
        }
      }

      console.log(`✅ [Phone Verification - Demo] Successfully verified ${normalized} with code ${trimmedCode}`);

      return res.status(200).json({
        success: true,
        mode: 'demo',
        message: 'Mobile number verified successfully (Demo Mode)!',
        phone: normalized,
        verified: true,
        verifiedAt: new Date().toISOString()
      });
    }

    // REAL-TIME MODE STRICT VERIFICATION LOGIC:
    if (!record) {
      return res.status(400).json({
        success: false,
        mode: 'realtime',
        message: 'No active verification code found for this phone number. Please request a new code.'
      });
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalized);
      return res.status(400).json({
        success: false,
        mode: 'realtime',
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    // Security check: limit to max 5 failed attempts per OTP
    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(normalized);
      return res.status(400).json({
        success: false,
        mode: 'realtime',
        message: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new code.'
      });
    }

    // Verify matching code
    if (record.code !== trimmedCode) {
      const remainingAttempts = 5 - record.attempts;
      return res.status(400).json({
        success: false,
        mode: 'realtime',
        message: `Invalid verification code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Please request a new code.'}`
      });
    }

    // Success: remove used OTP to prevent replay attacks
    otpStore.delete(normalized);

    // If authenticated, update user profile and verifications table
    if (req.user?.id) {
      try {
        await supabaseAdmin
          .from('profiles')
          .update({
            phone: normalized,
            updated_at: new Date().toISOString()
          })
          .eq('id', req.user.id);

        try {
          await supabaseAdmin
            .from('job_seekers')
            .update({
              phone: normalized,
              is_phone_verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', req.user.id);
        } catch (_) {}

        await supabaseAdmin
          .from('verifications')
          .upsert({
            user_id: req.user.id,
            type: 'phone',
            status: 'Verified',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,type' });
      } catch (dbErr) {
        console.warn('Could not update profile verification in database:', dbErr.message);
      }
    }

    console.log(`✅ [Phone Verification - Realtime] Successfully verified ${normalized} at ${new Date().toISOString()}`);

    return res.status(200).json({
      success: true,
      mode: 'realtime',
      message: 'Mobile number verified successfully!',
      phone: normalized,
      verified: true,
      verifiedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in verifyCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.',
      error: error.message
    });
  }
};

/**
 * @desc    Get verification status for candidate
 * @route   GET /api/verification/status
 * @access  Authenticated
 */
const getVerificationStatus = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(200).json({
        success: true,
        phoneVerified: false,
        emailVerified: false,
        mode: isDemoMode() ? 'demo' : 'realtime'
      });
    }

    const { data: verifications } = await supabaseAdmin
      .from('verifications')
      .select('*')
      .eq('user_id', req.user.id);

    const phoneVerification = verifications?.find(v => v.type === 'phone' && v.status === 'Verified');

    return res.status(200).json({
      success: true,
      phoneVerified: Boolean(phoneVerification),
      emailVerified: true,
      mode: isDemoMode() ? 'demo' : 'realtime',
      phoneVerifiedAt: phoneVerification?.updated_at || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve verification status',
      error: error.message
    });
  }
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  getVerificationStatus
};
