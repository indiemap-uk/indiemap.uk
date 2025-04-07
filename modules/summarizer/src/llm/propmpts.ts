export const siteSummaryInstructions = `
    You will help the user process the markdown representation of one ore more webpages of a single company.

    You need to extract from this markdown: 
    - the title of the business, 
    - a short description which is a brief summary of the business,
    - a long description which is a very detailed description of what the business does,
    - all relevant social media links and only social media such as facebook, instagram, tiktok, twitter, bluesky (if any, as a list) 
    - the products the business sells (if any, as a list)
    - whether the products are made in the uk

    Return a JSON document. Make sure the JSON is valid, the keys shoule be in double quotes.

    Do not return markdown! only plain JSON, no backticks or the word "json",

    Do not add any text before or after.

    The schema for the JSON is:
    - businessTitle: String,
    - links: Array(String) || [],
    - longDescription: String,
    - madeInUk: "all" | "some" | "none" | "unknown"
    - meta: String,
    - products: Array(String) || [],
    - shortDescription: String,

    An example of expected output:
    {
        title: "...",
        shortDescription: "...",
        longDescription: "...",
        links: [
            "https://...",
        ],
        products: [
            "...",
        ],
        madeInUk: "..."
        meta: "..."
    }

    If you skip a field you need to explain why in the "meta" property of the JSON! Otherwise leave it empty.
    
    The user will provide you with a markdown representation of the website.
`
