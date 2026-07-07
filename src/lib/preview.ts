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
    ourClientsCollection: {
          fetch: (id, preview) => {
            return client.getLandingPage(preview);
        },
        component: ClientsCarousel,
        props: (data) => ({
            clients: data?.ourClientsCollection,
        }),
    },
    featuredProjectsCollection: {
        fetch: (id, preview) => {
            return client.getLandingPage(preview);
        },
        component: FeaturedProjects,
        props: (data) => {
            //console.log(JSON.stringify(data));
            return {
                projects: data?.featuredProjectsCollection
            }
        },
    },
    landingPage: {
        fetch: (id, preview) => {
            return client.getLandingPage(preview);
        },
        component: LandingPage,
        props: (data) => {
            //console.log(JSON.stringify(data));
            return {
                projects: data
            }
        },
    }
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