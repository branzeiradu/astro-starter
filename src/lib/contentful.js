const SPACE = import.meta.env.CONTENTFUL_SPACE_ID
const DELIVERY_TOKEN = import.meta.env.CONTENTFUL_ACCESS_TOKEN
const PREVIEW_TOKEN = import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
const API_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;

async function apiCall(query, variables, preview = false) {
  try {
    const fetchUrl = API_URL;
    const token = preview
      ? PREVIEW_TOKEN
      : DELIVERY_TOKEN;

    console.log("is preview: " + preview);
    console.log("token: " + token);
    console.log("fetchUrl " + fetchUrl);

    const jsonPayload = JSON.stringify({ query, variables }, null, 2);
    //console.log("jsonPayload " + jsonPayload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
    }

    const response = await fetch(fetchUrl, options)
    if (!response || !response.ok) {  // ← Add the !response check
      console.error("HTTP Error:", response);
      const errorText = await response.text();
      console.error("HTTP Error Body:", errorText);

      return null;
    }
    return response;

  } catch (err) {
    console.error("API Error:", err.message);
    return { status: "err" };
  }
}

async function getAllBooks(preview = false) {

  const query = `
    {
      bookReferencePageCollection {
        items {
          sys {
            id
          }
          title
          cover {
            url
          }
        }
      }
    }
  `;
  const response = await apiCall(query, {}, preview);
  const json = await response.json()
  //console.log(JSON.stringify(json, null, 2));
  return await json.data.bookReferencePageCollection.items;
}

async function getSingleBook(id, preview = false) {
  const query = `
    query ($id: String!, $preview: Boolean!) {
      bookReferencePage(
        id: $id,
        preview: $preview
      ) {
        title
        cover {
          url
        }
        description {
          json
        }
        author {
          sys {
            id
          }
          name
        }
      }
    }
  `;

  const variables = {
    id: id,
    preview: preview
  };

  const response = await apiCall(query, variables, preview);
  const json = await response.json();
  //console.log("BOOK RESPONSE");
  //console.log(JSON.stringify(json, null, 2));
  return json.data?.bookReferencePage;
}

async function getAuthor(id, preview = false) {
  const query = `
    query ($id: String!, $preview: Boolean!) {
      bookAuthor(id: $id, preview: $preview) {
        name
        avatar {
          url
          description
        }
        bio {
          json
        }
        linkedFrom {
          bookReferencePageCollection {
            items {
              title
            }
          }
        }
      }
    }
  `;

  const variables = {
    id: id,
    preview: preview
  };

  const response = await apiCall(query, variables, preview);
  const json = await response.json();

  //console.log("AUTHOR RESPONSE");
  //console.log(JSON.stringify(json, null, 2));

  return json.data.bookAuthor;
}

async function getAllAuthors(preview = false) {
  const query = `
    {
      bookAuthorCollection {
        items {
          sys {
            id
          }
        }
      }
    }
  `;

  const response = await apiCall(query, {}, preview);
  const json = await response.json();
  //console.log(JSON.stringify(json, null, 2));

  return json.data.bookAuthorCollection.items;
}

async function getLandingPage(preview = false) {
  try {
    const query = `
   query GetLandingPage($preview: Boolean!) {
    landingPageCollection(limit: 1, skip: 0, preview: $preview) {
          __typename
          total
          skip
          items {
              heroTitle
              heroSubTitle
              subTitlePosition
              titlePosition
              heroCover {
                  sys { id }
                  ... on Asset {
                          title
                          url
                          contentType
                      }
              }
              metricDolarsSaved
              metricIssuesResolved
              metricPartnersServed    
              ourClientsCollection (limit: 20) {
                  items {
                  __typename
                  sys { id }
                  clientName
                  clientExternalLink
                  clientLogo {
                      title
                      url
                      contentType
                      }
                  }
              }
              featuredProjectsCollection (limit: 20) {
                  __typename
                  items {
                      __typename
                      sys {
                          id
                      }
                    ... on ProjectsNewsBlogPost {
                      postTitle
                      dateDisplayed
                      postIntroduction
                    } 
                  }
              }
          }
      }
}
  `;

    // Explicitly match the variable naming defined in the query signature above
    const variables = {
      preview: preview
    };

    const response = await apiCall(query, variables, preview);
    if (!response || !response.ok) {
      console.error("getLandingPage err:", response);
      return null;
    }

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      return null;
    }

    //console.log("Contentful landing page response\n: " + JSON.stringify(json, null, 2));

    return json.data.landingPageCollection?.items[0] ?? {};
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const client = { getAllBooks, getSingleBook, getAuthor, getAllAuthors, getLandingPage }