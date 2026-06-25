const SPACE = import.meta.env.CONTENTFUL_SPACE_ID
const DELIVERY_TOKEN = import.meta.env.CONTENTFUL_ACCESS_TOKEN
const PREVIEW_TOKEN = import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN

async function apiCall(query, variables, preview = false) {
  const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
  const token = preview
    ? PREVIEW_TOKEN
    : DELIVERY_TOKEN;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  }
  return await fetch(fetchUrl, options)
}

async function getAllBooks() {

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
  const response = await apiCall(query);
  const json = await response.json()
  console.log(JSON.stringify(json, null, 2));
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
  console.log("BOOK RESPONSE");
  console.log(JSON.stringify(json, null, 2));
  return json.data?.bookReferencePage;
}

async function getAuthor(id, preview = false) {
  const query = `
    query ($id: String!, $preview: Boolean!) {
      bookAuthor(
        id: $id,
        preview: $preview
      ) {
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

  console.log("AUTHOR RESPONSE");
  console.log(JSON.stringify(json, null, 2));

  return json.data.bookAuthor;
}

async function getAllAuthors() {
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

  const response = await apiCall(query);
  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));

  return json.data.bookAuthorCollection.items;
}

export const client = { getAllBooks, getSingleBook, getAuthor, getAllAuthors }