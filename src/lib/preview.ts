import { client } from "./contentful";
import BookPage from "../components/BookPage.astro";
import AuthorPage from "../components/AuthorPage.astro";

const previewResolvers = {
    bookPageReference: {
        fetch: client.getSingleBook,
        component: BookPage,
        props: (data) => ({
            book: data,
        }),
    },
    bookAuthor: {
        fetch: client.getAuthor,
        component: AuthorPage,
        props: (data) => ({
            author: data,
        }),
    },
};

export async function getPreviewContent(
    type: string | null,
    id: string | null
) {
    const resolver = previewResolvers[type as keyof typeof previewResolvers];

    if (!resolver) {
        throw new Error(`No preview resolver for ${type}`);
    }

    const data = await resolver.fetch(id, true);

    return {
        props: resolver.props(data),
        component: resolver.component,
        type: type
    };
}