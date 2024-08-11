<?xml version="1.0" encoding="utf-8"?>
<!-- https://lepture.com/en/2019/rss-style-with-xsl -->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <title>
          <xsl:value-of select="/rss/channel/title" /> Feed </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="/fallback.css" />
      </head>

      <body class="cat-latte dark:cat-macchiato bg-cat-base text-cat-text">
        <main class="mx-auto min-h-screen max-w-2xl pt-20">
          <header>
            <a
              class="bg-cat-text float-start me-4 block size-[7.5rem] [mask-image:url(/monocon.svg)]">
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link" />
              </xsl:attribute>
            </a>
            <div class="overflow-hidden">
              <h1 class="pt-3 text-4xl font-semibold">
                <xsl:value-of select="/rss/channel/title" />
              </h1>
              <p class="text-cat-subtext0 mb-2 mt-1 text-lg font-extralight">
                <xsl:value-of select="/rss/channel/description" />
              </p>
              <a class="text-sm font-semibold">
                <xsl:attribute name="href">
                  <xsl:value-of select="/rss/channel/link" />
                </xsl:attribute> 返回主页
  &#x2192; </a>
            </div>
          </header>
          <xsl:if test="/rss/channel/atom:link[@rel='alternate']">
            <div class="links inner">
              <xsl:for-each select="/rss/channel/atom:link[@rel='alternate']">
                <a target="_blank">
                  <xsl:attribute name="class">
                    <xsl:value-of select="@icon" />
                  </xsl:attribute>
                  <xsl:attribute name="href">
                    <xsl:value-of select="@href" />
                  </xsl:attribute>
                  <xsl:value-of select="@title" />
                </a>
              </xsl:for-each>
            </div>
          </xsl:if>
          <xsl:for-each select="/rss/channel/item">
            <article class="border-cat-surface0 mt-8 border-t-[1px] px-8">
              <div class="text-cat-subtext0 mt-4 text-sm font-normal">
                <span>
                  <xsl:value-of select="pubDate" />
                </span>
              </div>
              <h2 class="text-2xl font-semibold">
                <a target="_blank">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link" />
                  </xsl:attribute>
                  <xsl:value-of select="title" />
                </a>
              </h2>
            </article>
          </xsl:for-each>
        </main>
      </body>

    </html>
  </xsl:template>
</xsl:stylesheet>