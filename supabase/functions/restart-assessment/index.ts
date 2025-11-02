import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create } from 'https://deno.land/x/djwt@v2.8/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get old session
    const { data: oldSession } = await supabaseClient
      .from('sessions')
      .select('contact_id')
      .eq('id', sessionId)
      .single();

    if (!oldSession) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark old session abandoned
    await supabaseClient
      .from('sessions')
      .update({ status: 'abandoned' })
      .eq('id', sessionId);

    // Create new session
    const { data: newSession, error: sessionError } = await supabaseClient
      .from('sessions')
      .insert({ contact_id: oldSession.contact_id, status: 'active' })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Create new assessment
    const { data: newAssessment, error: assessmentError } = await supabaseClient
      .from('assessments')
      .insert({
        contact_id: oldSession.contact_id,
        session_id: newSession.id,
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // Generate new session JWT
    const secret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key';
    const sessionToken = await create(
      { alg: 'HS256', typ: 'JWT' },
      {
        session_id: newSession.id,
        contact_id: oldSession.contact_id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      secret
    );

    return new Response(
      JSON.stringify({
        sessionId: newSession.id,
        assessmentId: newAssessment.id,
        sessionToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
