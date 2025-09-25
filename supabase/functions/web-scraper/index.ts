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
    const { websiteUrl } = await req.json();
    
    if (!websiteUrl) {
      throw new Error('Website URL is required');
    }

    console.log('Scraping website:', websiteUrl);

    // Fetch website content
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract contact information using regex patterns
    const contactData = extractContactInfo(html);
    
    console.log('Extracted contact data:', contactData);

    return new Response(JSON.stringify({
      success: true,
      data: contactData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in web-scraper function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractContactInfo(html: string) {
  const contactInfo: any = {};

  // Extract email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emails = html.match(emailRegex) || [];
  const validEmails = emails.filter(email => 
    !email.includes('example.') && 
    !email.includes('placeholder') &&
    !email.includes('test@') &&
    !email.includes('noreply') &&
    !email.includes('no-reply')
  );
  
  if (validEmails.length > 0) {
    contactInfo.email = validEmails[0];
  }

  // Extract phone numbers (French format)
  const phoneRegex = /(?:(?:\+33|0033|0)[1-9])(?:[0-9]{8})|(?:(?:\+33|0033|0)[1-9])(?:[\s.-]?[0-9]{2}){4}/g;
  const phones = html.match(phoneRegex) || [];
  if (phones.length > 0 && phones[0]) {
    contactInfo.telephone = phones[0].replace(/[\s.-]/g, '');
  }

  // Extract addresses (basic pattern for French addresses)
  const addressRegex = /\d+[\s,]*[a-zA-Zàâäéèêëïîôöùûüÿç\s,'-]+(?:rue|avenue|boulevard|place|impasse|allée|chemin|route)[a-zA-Zàâäéèêëïîôöùûüÿç\s,'-]*\d{5}[\s,]*[a-zA-Zàâäéèêëïîôöùûüÿç\s'-]+/gi;
  const addresses = html.match(addressRegex) || [];
  if (addresses.length > 0) {
    contactInfo.adresse = addresses[0];
  }

  // Extract social media links
  const socialRegex = /(https?:\/\/)?(www\.)?(linkedin\.com|facebook\.com|twitter\.com|instagram\.com)\/[a-zA-Z0-9._-]+/g;
  const socialLinks = html.match(socialRegex) || [];
  if (socialLinks.length > 0) {
    contactInfo.reseauxSociaux = socialLinks;
  }

  return contactInfo;
}