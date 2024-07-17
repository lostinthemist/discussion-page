This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the project and all of its dependencies.
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Secondly, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

Run the following command.
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Additional information about the discussion application.
The following features have been added:
* Responsive design for desktop, tablet, and mobile devices
* Reading and displaying discussions and comments through JSON (axios)
* "React Swiper" Image gallery with swipe functionality and image modal - https://swiperjs.com/react
* Bookmark functionality using Context API: Bookmarking discussions and updating the total number of bookmarks in the header
* Add new comments with basic validation for title and content
* Upvoting discussions and comments with a toggle functionality
* Collapsing/expanding comments section: Collapse icon also added to the bottom of comments
* Utilized Next.js features such as Server-Side Rendering, Layout component, Next Image, Next Head. 
* Typescript types for discussion and comments in types/index.d.ts
* utils folder includes some reusable functions such as formatting date and fetching icon image