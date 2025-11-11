import { Exa } from "exa-js";

export const exa = new Exa(process.env.EXA_API_KEY);

export type SearchResults = {
  query: string;
  results: {
    title: string | null;
    url: string;
    description: string;
    image: string | undefined;
  }[];
};

export async function search(query: string): Promise<SearchResults> {
  try {
    const response = await exa.search(query, { contents: { summary: true } });

    return {
      query,
      results: response.results.map((result) => ({
        title: result.title,
        url: result.url,
        description: result.summary,
        image: result.image,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      query,
      results: [],
    };
  }
}

export async function readSite(url: string) {
  try {
    const response = await exa.getContents(url, { text: true });
    const result = response.results[0];

    if (!result) {
      return {
        url,
        text: "",
      };
    }
    return {
      url,
      text: result.text,
    };
  } catch (error) {
    console.error(error);
    return {
      url,
      text: "",
    };
  }
}
