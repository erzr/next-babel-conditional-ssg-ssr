# Babel Plugin to Enable Conditional SSG / SSR in Next.js
This plugin allows you to have `getStaticProps`, `getStaticPaths` and `getServerSideProps` all on the same page and have them conditionally enabled depending on the build mode. Avoiding the dreaded `SERVER_PROPS_SSG_CONFLICT` error message of **You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps**

This babel plugin should be considered experimental and has largely been based on internal Next.js Babel plugins, as noted in the comments.

The use case that I had for this plugin was pretty simple, we were already deploying an application using SSG to Netlify and we also wanted to deploy this same application to Vercel but take advantage of some optional SSR functionality that our application offers. This babel plugin allows this to be possible without having to conditionally copy a specific page template for that particular build.

## Usage
First, start by add this project as a developer dependency using NPM or yarn.
```
npm install -D next-babel-conditional-ssg-ssr
```
After that, one way to integrate this is to create a `babel.config.js` in the root of your Next.js project. Here's what that would look like:
```
const nextModeBabelPlugin = require('next-babel-conditional-ssg-ssr');

const presets = ['next/babel'];
const plugins = [nextModeBabelPlugin('ssr')]; // or ssg, pull from `process.env.BUILD_MODE`?

module.exports = { presets, plugins };
```
This example is configured for `ssr` mode, but as noted `ssg` is also a valid value. Consider pulling this from an environment variable such as `process.env.BUILD_MODE` or something, it's your world.

That's it! Enjoy.

Follow me on [Twiter](https://twitter.com/erzr).