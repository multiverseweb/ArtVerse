// Netlify serverless function to securely fetch form submissions
// and return them to the frontend without exposing the API token.

exports.handler = async function (event, context) {
  const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_ID = process.env.ARTVERSE_SITE_ID;

  if (!NETLIFY_API_TOKEN || !SITE_ID) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfigured: missing API token or Site ID." }),
    };
  }

  try {
    // First, get the form ID for "ArtVerse Reviews"
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });

    if (!formsRes.ok) {
      throw new Error(`Failed to fetch forms: ${formsRes.status}`);
    }

    const forms = await formsRes.json();
    const reviewForm = forms.find((f) => f.name === "ArtVerse Reviews");

    if (!reviewForm) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      };
    }

    // Fetch submissions for this form (most recent 100)
    const subsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${reviewForm.id}/submissions?per_page=100`,
      {
        headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
      }
    );

    if (!subsRes.ok) {
      throw new Error(`Failed to fetch submissions: ${subsRes.status}`);
    }

    const submissions = await subsRes.json();

    // Return only the fields we need (Name, Comment) — never expose emails
    const reviews = submissions.map((sub) => ({
      name: sub.data.Name || "Anonymous",
      message: sub.data.Message || "",
      date: sub.created_at,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // cache for 60s to reduce API calls
      },
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch comments." }),
    };
  }
};
