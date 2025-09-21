import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OUTSCRAPPER_API_KEY = Deno.env.get('OUTSCRAPPER_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, address, city } = await req.json();
    
    if (!companyName) {
      throw new Error('Company name is required');
    }

    if (!OUTSCRAPPER_API_KEY) {
      throw new Error('Outscrapper API key not configured');
    }

    console.log('Searching with Outscrapper:', { companyName, address, city });

    // Build search query
    const searchQuery = `${companyName} ${address || ''} ${city || ''}`.trim();
    
    // Call Outscrapper API for Google Maps data
    const response = await fetch('https://api.outscraper.com/maps/search-v2', {
      method: 'GET',
      headers: {
        'X-API-KEY': OUTSCRAPPER_API_KEY,
        'Content-Type': 'application/json',
      },
      // Add query parameters
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Outscrapper API error:', response.status, errorText);
      throw new Error(`Outscrapper API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Outscrapper response:', data);

    // Extract relevant contact information
    const enrichedData = extractBusinessInfo(data, companyName);
    
    return new Response(JSON.stringify({
      success: true,
      data: enrichedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in outscrapper-search function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractBusinessInfo(data: any, companyName: string) {
  const enrichedData: any = {};
  
  try {
    if (data && data.data && data.data.length > 0) {
      // Find the best match based on company name
      const bestMatch = data.data[0].find((business: any) => 
        business.name && business.name.toLowerCase().includes(companyName.toLowerCase())
      ) || data.data[0][0]; // Fallback to first result
      
      if (bestMatch) {
        // Extract contact information
        if (bestMatch.phone) {
          enrichedData.telephone = bestMatch.phone;
        }
        
        if (bestMatch.site) {
          enrichedData.siteWeb = bestMatch.site;
        }
        
        if (bestMatch.email) {
          enrichedData.email = bestMatch.email;
        }
        
        if (bestMatch.full_address) {
          enrichedData.adresse = bestMatch.full_address;
        }
        
        if (bestMatch.rating) {
          enrichedData.note = bestMatch.rating;
          enrichedData.nombreAvis = bestMatch.reviews_count || 0;
        }
        
        if (bestMatch.hours) {
          enrichedData.horaires = bestMatch.hours;
        }
        
        if (bestMatch.description) {
          enrichedData.description = bestMatch.description;
        }
        
        // Extract social media and additional info
        if (bestMatch.social_media) {
          enrichedData.reseauxSociaux = bestMatch.social_media;
        }
        
        enrichedData.source = 'Outscrapper';
        enrichedData.confidence = calculateConfidence(bestMatch, companyName);
      }
    }
  } catch (error) {
    console.error('Error extracting business info:', error);
  }
  
  return enrichedData;
}

function calculateConfidence(business: any, searchName: string): number {
  let confidence = 0;
  
  // Name similarity
  if (business.name && business.name.toLowerCase().includes(searchName.toLowerCase())) {
    confidence += 40;
  }
  
  // Has phone number
  if (business.phone) confidence += 20;
  
  // Has website
  if (business.site) confidence += 15;
  
  // Has email
  if (business.email) confidence += 15;
  
  // Has reviews (indicates legitimate business)
  if (business.reviews_count && business.reviews_count > 0) confidence += 10;
  
  return Math.min(confidence, 100);
}