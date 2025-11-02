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

    const { email, first_name, last_name, consent } = await req.json();

    if (!email || !consent) {
      return new Response(
        JSON.stringify({ error: 'Email and consent required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert contact
    const { data: contact, error: contactError } = await supabaseClient
      .from('contacts')
      .upsert(
        { email, first_name, last_name, consent },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (contactError) throw contactError;

    // Create session
    const { data: session, error: sessionError } = await supabaseClient
      .from('sessions')
      .insert({ contact_id: contact.id, status: 'active' })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Create assessment
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from('assessments')
      .insert({
        contact_id: contact.id,
        session_id: session.id,
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // Generate session JWT
    const secret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key';
    const sessionToken = await create(
      { alg: 'HS256', typ: 'JWT' },
      {
        session_id: session.id,
        contact_id: contact.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
      secret
    );

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        assessmentId: assessment.id,
        contactId: contact.id,
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
