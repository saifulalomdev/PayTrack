/**
 * Checks if the provided URL belongs to a production/remote environment or localhost.
 * @param {string} urlString - The URL to check.
 * @returns {boolean} False if the host is localhost, true otherwise.
 */
export function isProductionOrRemote(urlString: string) {
    // Return true or handle gracefully if no URL is provided
    if (!urlString) {
        return true;
    }

    try {
        // Parse the URL string using the native URL API
        const { hostname } = new URL(urlString);

        // Check if the hostname matches local development environments
        const isLocalhost =
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.endsWith('.local');

        // Return false if it IS localhost, true if it is NOT.
        return !isLocalhost;
    } catch (error) {
        // If the URL is invalid (e.g., relative path like '/dashboard'), 
        // you can fall back to checking it as a raw string or return a default value.
        const isLocalhost =
            urlString.includes('localhost') ||
            urlString.includes('127.0.0.1') ||
            urlString.includes('.local');

        return !isLocalhost;
    }
}