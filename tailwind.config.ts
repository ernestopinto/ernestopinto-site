module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",

        // 👇 add your linked tracer package (pick the one that matches your setup)
        "./node_modules/@pintomiguelernesto/tracer/**/*.{vue,js,ts,jsx,tsx}",
        // or, if the linked package outputs to dist:
        "./node_modules/@pintomiguelernesto/tracer/dist/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: { extend: {} },
    plugins: [],
};
