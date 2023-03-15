import { NextApiRequest, NextApiResponse } from "next";

async function findSenatorsByState(req: NextApiRequest, res: NextApiResponse) {
  const { state } = req.query;
  const url = `http://whoismyrepresentative.com/getall_sens_bystate.php?state=${state}&output=json`;

  try {
    const response = await fetch(url);
    const json = await response.json();
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
