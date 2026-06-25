const SPACE = import.meta.env.CONTENTFUL_SPACE_ID
const TOKEN = import.meta.env.CONTENTFUL_ACCESS_TOKEN

async function apiCall(query, variables) {
  const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
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

async function getSingleBook(id) {
  const query = `
    query ($id: String!) {
        bookReferencePage(id: $id) {
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
    id: id
  };
  const response = await apiCall(query, variables);
  const json = await response.json();
  return await json.data.bookReferencePage
}

async function getAuthor(id) {
  const query = `
    query ($id: String!) {
      bookAuthor(id:$id) {
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
    id: id
  };
  const response = await apiCall(query, variables);
  const json = await response.json();
  return await json.data.bookAuthor
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

  return json.data.bookAuthorCollection.items;
}

export const client = { getAllBooks, getSingleBook, getAuthor, getAllAuthors }