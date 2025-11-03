import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';

/**
 * API wrapper for assessment endpoints
 * Provides clean interface to Supabase Edge Functions
 */

/**
 * Start a new assessment
 * POST /api/start
 */
export async function startAssessment({ email, first_name, last_name, consent }) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/start-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, first_name, last_name, consent }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start assessment');
    }

    const data = await response.json();

    // Store session token in Supabase client
    if (data.sessionToken) {
      await supabase.auth.setSession({
        access_token: data.sessionToken,
        refresh_token: data.sessionToken,
      });
    }

    // Store resume token in localStorage as backup
    if (data.resumeToken) {
      localStorage.setItem('assessment_resume_token', data.resumeToken);
    }

    return data;
  } catch (error) {
    console.error('Start assessment error:', error);
    throw error;
  }
}

/**
 * Save a single response
 * POST /api/save
 */
export async function saveResponse({ assessmentId, section, questionKey, value, meta }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/save-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
      },
      body: JSON.stringify({ assessmentId, section, questionKey, value, meta }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save response');
    }

    return await response.json();
  } catch (error) {
    console.error('Save response error:', error);
    throw error;
  }
}

/**
 * Resolve session from resume token
 * GET /api/session/resolve?token=...
 */
export async function resolveSession(token) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/session-resolve?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resolve session');
    }

    const data = await response.json();

    // Set session with returned JWT
    if (data.jwt) {
      await supabase.auth.setSession({
        access_token: data.jwt,
        refresh_token: data.jwt,
      });
    }

    return data;
  } catch (error) {
    console.error('Resolve session error:', error);
    throw error;
  }
}

/**
 * Complete assessment and compute scores
 * POST /api/complete
 */
export async function completeAssessment({ assessmentId }) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/complete-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assessmentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete assessment');
    }

    return await response.json();
  } catch (error) {
    console.error('Complete assessment error:', error);
    throw error;
  }
}

/**
 * Restart assessment (create new session)
 * POST /api/restart
 */
export async function restartAssessment({ sessionId }) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/restart-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restart assessment');
    }

    const data = await response.json();

    // Set new session
    if (data.sessionToken) {
      await supabase.auth.setSession({
        access_token: data.sessionToken,
        refresh_token: data.sessionToken,
      });
    }

    // Update resume token
    if (data.resumeToken) {
      localStorage.setItem('assessment_resume_token', data.resumeToken);
    }

    return data;
  } catch (error) {
    console.error('Restart assessment error:', error);
    throw error;
  }
}
