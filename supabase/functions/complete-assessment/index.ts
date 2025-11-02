import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const { assessmentId } = await req.json();

    if (!assessmentId) {
      return new Response(
        JSON.stringify({ error: 'Assessment ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call scoring function
    const { data: scores, error: scoreError } = await supabaseClient.rpc(
      'compute_assessment_scores',
      { p_assessment_id: assessmentId }
    );

    if (scoreError) throw scoreError;

    const result = scores[0];

    // Update assessment
    const { error: updateError } = await supabaseClient
      .from('assessments')
      .update({
        overall_score: result.overall_score,
        tier: result.tier,
        scores_by_category: result.scores_by_category,
        completed_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) throw updateError;

    // Update session to completed
    const { data: assessment } = await supabaseClient
      .from('assessments')
      .select('session_id')
      .eq('id', assessmentId)
      .single();

    await supabaseClient
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', assessment.session_id);

    return new Response(
      JSON.stringify({
        overall_score: result.overall_score,
        tier: result.tier,
        scores_by_category: result.scores_by_category,
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
