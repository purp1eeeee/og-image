import { readFileSync } from "fs"
import { marked } from "marked"
import { sanitizeHtml } from "./sanitizer"
import { ParsedRequest } from "./types"
const twemoji = require("twemoji")
const twOptions = { folder: "svg", ext: ".svg" }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64")
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
)
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
)

function getCss(theme: string, fontSize: string) {
  let background = "white"
  let foreground = "black"

  if (theme === "dark") {
    background = "black"
    foreground = "white"
  }
  return `
    @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap');

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        font-family: 'Noto Sans JP', sans-serif;
        background: ${background};
        height: 100vh;
        padding: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: bold;
        color: ${foreground};
        line-height: 1.8;
        text-align: center;
        padding-top: 280px;
    }
    .meta {
        font-size: 60px;
        text-align: right;
        font-weight: bold;
        padding-bottom: 82px;
    }
    
    .logo {
    }
    `
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <p class="meta">
            <span class="logo">${emojify(`🟣`)}</span>
                ${emojify(`murasak1.com`)}
            </p>
    </body>
</html>`
}
