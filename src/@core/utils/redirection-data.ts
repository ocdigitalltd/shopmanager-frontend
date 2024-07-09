import bkUrl from "src/configs/bkUrl";

export const loadMappingsFromDatabase = async () => {
  let redirectionCache: { [x: string]: string; } = {};
  try {
  const response = await fetch(`${bkUrl}/misprinted/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=your_jwt_token_here",
    },
  });

    if (response.ok) {
      const result = await response.json();
      const allData = (result as any)?.data
      console.log({ allData })
      redirectionCache = allData
    } 
    
    return redirectionCache
  } catch (error) {
    console.error("Error in loadMappingsFromDatabase:", error);
  }
}
