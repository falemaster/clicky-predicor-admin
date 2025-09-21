import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');
    if (!apolloApiKey) {
      throw new Error('APOLLO_API_KEY non configurée');
    }

    const { companyName, domain, address } = await req.json();
    console.log('Apollo search request:', { companyName, domain, address });

    if (!companyName) {
      throw new Error('Le nom de l\'entreprise est requis pour la recherche Apollo');
    }

    // Recherche d'entreprise via Apollo.io
    const searchResponse = await fetch('https://api.apollo.io/v1/organizations/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apolloApiKey,
      },
      body: JSON.stringify({
        q_organization_name: companyName,
        q_organization_domains: domain ? [domain] : undefined,
        page: 1,
        per_page: 5,
        organization_locations: address ? [address] : undefined,
      }),
    });

    if (!searchResponse.ok) {
      console.error('Apollo API Error:', searchResponse.status, await searchResponse.text());
      throw new Error(`Erreur Apollo API: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Apollo search results:', searchData);

    const organizations = searchData.organizations || [];
    if (organizations.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Aucune entreprise trouvée sur Apollo.io'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prendre la première entreprise trouvée (meilleure correspondance)
    const organization = organizations[0];
    
    // Rechercher les contacts de cette entreprise
    let contacts = [];
    try {
      const contactsResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apolloApiKey,
        },
        body: JSON.stringify({
          q_organization_ids: [organization.id],
          page: 1,
          per_page: 10,
          person_seniorities: ['manager', 'director', 'vp', 'c_suite', 'owner'],
        }),
      });

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        contacts = contactsData.people || [];
        console.log('Apollo contacts found:', contacts.length);
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération des contacts Apollo:', error);
    }

    // Formater les données pour correspondre à notre structure
    const enrichedData = {
      source: 'Apollo.io',
      companyInfo: {
        name: organization.name,
        website: organization.website_url,
        industry: organization.industry,
        description: organization.short_description,
        employeeCount: organization.estimated_num_employees,
        foundedYear: organization.founded_year,
        linkedinUrl: organization.linkedin_url,
        address: organization.primary_address ? {
          street: organization.primary_address.address_1,
          city: organization.primary_address.city,
          state: organization.primary_address.state,
          country: organization.primary_address.country,
          postalCode: organization.primary_address.postal_code,
        } : null,
      },
      contacts: contacts.slice(0, 5).map(person => ({
        name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
        title: person.title,
        email: person.email,
        phone: person.phone_numbers && person.phone_numbers.length > 0 
          ? person.phone_numbers[0].sanitized_number 
          : null,
        linkedinUrl: person.linkedin_url,
        department: person.departments && person.departments.length > 0 
          ? person.departments[0] 
          : null,
        seniority: person.seniority,
      })).filter(contact => contact.name),
      socialMedia: {
        linkedin: organization.linkedin_url,
        twitter: organization.twitter_url,
        facebook: organization.facebook_url,
      },
      technologies: organization.technologies || [],
      keywordTags: organization.keywords || [],
    };

    console.log('Apollo enriched data prepared:', {
      companyName: enrichedData.companyInfo.name,
      contactsCount: enrichedData.contacts.length,
      hasWebsite: !!enrichedData.companyInfo.website
    });

    return new Response(JSON.stringify({
      success: true,
      data: enrichedData,
      rawData: organization // Pour debug si nécessaire
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans apollo-search:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});