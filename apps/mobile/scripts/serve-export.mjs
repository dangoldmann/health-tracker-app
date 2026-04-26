/* global process */

import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(currentDir, "../dist");
const port = Number.parseInt(process.env.PORT ?? "8090", 10);

const contentTypeMap = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  try {
    const requestPath = new URL(request.url ?? "/", `http://${request.headers.host}`)
      .pathname;
    const resolvedPath = resolveDistPath(requestPath);
    const targetPath = (await isFile(resolvedPath))
      ? resolvedPath
      : path.join(distDir, "index.html");

    response.writeHead(200, {
      "Content-Type": getContentType(targetPath),
      "Cache-Control": "no-cache",
    });

    createReadStream(targetPath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(
      error instanceof Error
        ? error.message
        : "Unexpected preview server error.",
    );
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});

function getContentType(filePath) {
  return (
    contentTypeMap[path.extname(filePath).toLowerCase()] ??
    "application/octet-stream"
  );
}

async function isFile(filePath) {
  try {
    const fileStats = await stat(filePath);

    return fileStats.isFile();
  } catch {
    return false;
  }
}

function resolveDistPath(requestPath) {
  const normalizedPath =
    requestPath === "/" ? "/index.html" : decodeURIComponent(requestPath);
  const absolutePath = path.resolve(distDir, `.${normalizedPath}`);

  if (!absolutePath.startsWith(distDir)) {
    throw new Error("Invalid path.");
  }

  return absolutePath;
}

await access(path.join(distDir, "index.html"));
