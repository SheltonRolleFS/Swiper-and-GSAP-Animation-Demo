// const space = process.env.CONTENTFUL_SPACE_ID;
// const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
// const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const space = "d3vgk397lgr8";
const environmentId = "master";
const accessToken = "V4nTm7UJkohBNTOa4fY2TLVYMV0NzpgQJPaSYj8WiVU";

let client: any;

if (accessToken) {
    client = require("contentful").createClient({
        space,
        accessToken,
        ...(environmentId && { environment: environmentId }),
    });
}

export async function fetchEntry(entryId: string) {
    if (accessToken) {
        const entry = await client.getEntry(entryId);
        if (entry) return entry;
        console.error(`Error getting entry with ID ${entryId}`);
    }
    console.error("Access token is undefined");
}
