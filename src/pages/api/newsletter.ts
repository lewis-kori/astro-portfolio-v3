import type { APIRoute } from 'astro';
import { BEEHIIV_PUBLICATION_ID, BEEHIIV_API_KEY } from 'astro:env/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email } = data;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Please provide an email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Subscribe to Beehiiv
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'website',
          utm_medium: 'organic',
        }),
      },
    );

    if (!beehiivResponse.ok) {
      const errorData = await beehiivResponse.json();
      console.error('Beehiiv API Error:', errorData);
      return new Response(
        JSON.stringify({
          error: 'Failed to subscribe. Please try again later.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
