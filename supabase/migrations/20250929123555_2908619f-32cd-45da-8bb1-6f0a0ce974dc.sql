-- Ajouter la colonne encart_visibility à la table admin_companies
ALTER TABLE public.admin_companies 
ADD COLUMN encart_visibility JSONB DEFAULT '{
  "overview": {
    "company_info": true,
    "scores": true,
    "surveillance": true,
    "data_quality": true
  },
  "study": {
    "compliance": true,
    "fiscal": true,
    "financial": true,
    "economic": true,
    "governance": true
  },
  "predictive": {
    "risk_analysis": true,
    "explanatory_factors": true,
    "alerts": true
  }
}'::jsonb;