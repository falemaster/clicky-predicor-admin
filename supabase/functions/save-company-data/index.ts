import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siren, companyData, scores, encartVisibility, editorInfo } = await req.json();

    if (!siren) {
      throw new Error('SIREN is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Saving company data for SIREN:', siren);

    // Préparer les données enrichies pour la sauvegarde
    const enrichedData = {
      ...companyData,
      encartVisibility,
      lastEdited: new Date().toISOString(),
      editorInfo
    };

    // Upsert company data
    const { data: companyRecord, error: upsertError } = await supabase
      .from('admin_companies')
      .upsert({
        siren,
        company_name: companyData?.sirene?.denomination || companyData?.companyInfo?.name || 'Nom non défini',
        siret: companyData?.sirene?.siret || companyData?.companyInfo?.siret,
        naf_code: companyData?.sirene?.naf || companyData?.companyInfo?.naf,
        activity: companyData?.sirene?.activite || companyData?.companyInfo?.activity,
        postal_code: companyData?.sirene?.codePostal,
        city: companyData?.sirene?.ville,
        address: companyData?.sirene?.adresse || companyData?.companyInfo?.address,
        enriched_data: enrichedData,
        encart_visibility: encartVisibility,
        is_manually_edited: true,
        edited_by: editorInfo?.userId,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'siren'
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting company data:', upsertError);
      throw upsertError;
    }

    console.log('Company data saved successfully:', companyRecord?.id);

    // Log admin edit using the database function
    const { error: logError } = await supabase.rpc('log_admin_edit', {
      p_siren: siren,
      p_field_changed: 'complete_data_update',
      p_old_value: null,
      p_new_value: { 
        companyData: !!companyData, 
        scores: !!scores, 
        encartVisibility: !!encartVisibility,
        timestamp: new Date().toISOString()
      },
      p_change_type: 'bulk_update',
      p_editor_id: editorInfo?.userId,
      p_session_id: editorInfo?.sessionId,
      p_ip_address: editorInfo?.ipAddress,
      p_user_agent: editorInfo?.userAgent
    });

    if (logError) {
      console.error('Error logging admin edit:', logError);
      // Don't throw here, as the main save operation succeeded
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Company data saved successfully',
        companyId: companyRecord?.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in save-company-data function:', error);
    
    return new Response(
      JSON.stringify({
        error: (error as Error)?.message || 'An unexpected error occurred',
        success: false
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});