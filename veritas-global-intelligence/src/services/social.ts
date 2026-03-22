import { SocialResponse } from "../types";

export const fetchRelatedTweets = async (query: string): Promise<SocialResponse> => {
  try {
    console.log(`Fetching related tweets for query: ${query}`);
    const response = await fetch(`/api/social?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Twitter API not configured on server.");
        return { error: "Twitter API not configured" };
      }
      throw new Error(`Twitter API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`Social data received. Tweets: ${data.data?.length || 0}`);
    return data;
  } catch (error) {
    console.error("Social Fetch Error:", error);
    return { error: "Failed to fetch social data" };
  }
};
