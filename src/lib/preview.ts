import { client } from "./contentful";
import BookPage from "../components/BookPage.astro";
import AuthorPage from "../components/AuthorPage.astro";
import ClientsCarousel from "../components/ClientsCarousel.astro";
import FeaturedProjects from "../components/FeaturedProjects.astro";
import LandingPage from "./../pages/landing-page.astro";

const previewResolvers = {
    bookReferencePage: {
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
    landingPage: {
        fetch: (id, preview) => {
            //console.log("[Preview] Fetch landing page uses preview: " + preview)
            //return client.getLandingPage(preview);
            //const data = {}
            return null;
        },
        component: LandingPage,
        props: (data) => {
            //console.log("Landing page resolver: " + JSON.stringify(data), null, 2);
            return {
                preview: true
            }
        },
    }
};

export async function getPreviewContent(
    type: string | null,
    id: string | null
) {
    //console.log("getPreviewContent resolver registry " + JSON.stringify(previewResolvers))
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