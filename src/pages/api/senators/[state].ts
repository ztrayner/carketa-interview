import { NextApiRequest, NextApiResponse } from "next";

async function findSenatorsByState(req: NextApiRequest, res: NextApiResponse) {
  const { state } = req.query;
  const url = `http://whoismyrepresentative.com/getall_sens_bystate.php?state=${state}&output=json`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    // Set the Cache-Control header to enable client-side and proxy caching for 1 hour
    res.setHeader(
      "Cache-Control",
      `max-age=3600, s-maxage=3600, stale-while-revalidate`
    );
    res.setHeader("Vary", "Accept-Encoding, Cookie, state");
    res.setHeader("Cache-Key", state || "default");
    res.status(200).json({
      success: true,
      results: json.results,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error:
        error.message || "Invalid request. Please check your state variable.",
    });
  }
}

export default findSenatorsByState;
