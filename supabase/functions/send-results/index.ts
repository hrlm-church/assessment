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

    const { contactId, assessmentId } = await req.json();

    // Fetch contact and assessment
    const { data: contact } = await supabaseClient
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    const { data: assessment } = await supabaseClient
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (!contact || !assessment) {
      return new Response(
        JSON.stringify({ error: 'Data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build email body
    const tierMessages = {
      affirmed:
        'Strong indicators of pastoral calling. Share these results with your elders and begin a formal pathway.',
      growing:
        'Many strengths with a few areas to develop. Work a 90-day plan with your leaders.',
      developing:
        'Build foundations, then re-assess with your pastor in 3–6 months.',
    };

    const categoryLabels = {
      godliness: 'Godliness',
      home_life: 'Home Life',
      preaching: 'Preaching',
      shepherding: 'Shepherding',
      evangelism: 'Evangelistic Focus',
      leadership: 'Leadership',
      gcc_alignment: 'GCC Alignment',
    };

    let categoryBullets = '';
    for (const [key, score] of Object.entries(
      assessment.scores_by_category || {}
    )) {
      const label = categoryLabels[key] || key;
      categoryBullets += `- **${label}:** ${score}\n`;
    }

    const emailBody = `
Hi ${contact.first_name || 'there'},

Thank you for completing the Am I Called? assessment. Your honest reflection is an important step in discerning pastoral calling.

**Your Overall Score: ${assessment.overall_score} / 5.0 — ${
      tierMessages[assessment.tier]
    }**

Here's a snapshot of your results by category:

${categoryBullets}

**Next Steps:**
1. Pray and reflect on these results with the Lord.
2. Share this with your pastor or elders.
3. Serve faithfully where you are and test your gifts in community.
4. Explore Gospel-Centered Churches at https://gcc.org.

A calling isn't a score—it's a story God confirms through His people.

Grace and peace,
The GCC Team
    `.trim();

    // Send via Resend (or SendGrid)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Am I Called? <noreply@yourapp.com>',
        to: [contact.email],
        subject: 'Your Am I Called? Results',
        text: emailBody,
      }),
    });

    if (!response.ok) {
      throw new Error('Email send failed');
    }

    // Log event
    await supabaseClient.from('email_events').insert({
      contact_id: contactId,
      type: 'results_sent',
      metadata: { assessment_id: assessmentId },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
