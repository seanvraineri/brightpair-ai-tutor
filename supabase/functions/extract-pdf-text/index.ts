// Follow Deno Deploy runtime compatibility
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function extractTextFromPDF(url: string): Promise<string> {
  try {
    // In a production environment, you would integrate with a PDF parsing service
    // or library. For this example, we'll simulate text extraction.
    
    // Attempt to fetch the PDF
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    // For a real implementation, you would extract text using a PDF library
    // Here we'll just return some placeholder text for demonstration
    return `Extracted text from PDF at ${url}. 
    
In a production environment, this would contain the actual content from the PDF document.
For development purposes, we're returning this placeholder text.

This simulates a multi-paragraph PDF with educational content:

Introduction to the Topic
------------------------
This section would cover the main concepts of the subject matter.

Key Points
---------
• First important concept extracted from the PDF
• Second important point from the document
• Third major idea from the text

Examples
--------
Example 1: Detailed walkthrough of a problem
Example 2: Another sample problem with solution
`;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    const extractedText = await extractTextFromPDF(url);
    
    return new Response(
      JSON.stringify({ success: true, text: extractedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}); 