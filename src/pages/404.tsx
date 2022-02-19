import * as React from "react";
import { PageProps } from "gatsby";

const NotFoundPage = ({path}: PageProps) => {
    return (
        <main>
            <title>Not Found</title>
            <h1>Page not found</h1>
            <h2>{path}</h2>
        </main>
    );
}

export default NotFoundPage;