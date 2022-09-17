/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = {
    nextConfig,

    exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        return {
            "/": { page: "/" },
        }
    },
    images: {
        unoptimized: true,
    },
}
