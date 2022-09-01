import { LoaderFunction } from "@remix-run/cloudflare";
import { js2xml } from "xml-js";
import { SITEURL } from "../utils/constant.js";

const OSD = {
  OpenSearchDescription: {
    _attributes: {
      xmlns: "http://a9.com/-/spec/opensearch/1.1/"
    },

    ShortName: {
      _text: "Hashland"
    },
    Description: {
      _text: "搜索本站文章内容"
    },
    InputEncoding: {
      _text: "UTF-8"
    },
    Image: {
      _attributes: {
        width: "16",
        height: "16",
        type: "image/x-icon",
      },
      _text: `${SITEURL}/favicon.ico`,
    },
    Url: [
      {
        _attributes: {
          type: "text/html",
          method: "get",
          template: "https://github.com/search?q={searchTerms}+repo%3AMaster-Hash%2Fpost+language%3AMarkdown&amp;type=Code+path%3Apost",
        }
      },
      {
        _attributes: {
          type: "application/opensearchdescription+xml",
          rel: "self",
          template: `${SITEURL}/favicon.ico`,
        }
      },
    ],
  },
};

export const loader: LoaderFunction = () => {
  return new Response(js2xml(OSD, { compact: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/opensearchdescription+xml",
      // "Content-Type": "application/xml", // for debug
    },
  });
};