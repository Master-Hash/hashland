<?xml version="1.0" encoding="utf-8"?>
<!-- https://lepture.com/en/2019/rss-style-with-xsl -->
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>
          <xsl:value-of select="/rss/channel/title"/>
 Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::before,::after{--tw-content:''}
html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}
body{margin:0;line-height:inherit}
hr{height:0;color:inherit;border-top-width:1px}
abbr:where([title]){text-decoration:underline dotted}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
a{color:inherit;text-decoration:inherit}
b,strong{font-weight:bolder}
code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em} small{font-size:80%} sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline} sub{bottom:-0.25em} sup{top:-0.5em} table{text-indent:0;border-color:inherit;border-collapse:collapse} button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0} button,select{text-transform:none} button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none} progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit} summary{display:list-item} blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0} fieldset{margin:0;padding:0} legend{padding:0} ol,ul,menu{list-style:none;margin:0;padding:0} dialog{padding:0} textarea{resize:vertical} input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af} button,[role="button"]{cursor:pointer}:disabled{cursor:default}
img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}[hidden]{display:none}.cat-latte{--ctp-rosewater:220,138,120;--ctp-flamingo:221,120,120;--ctp-pink:234,118,203;--ctp-mauve:136,57,239;--ctp-red:210,15,57;--ctp-maroon:230,69,83;--ctp-peach:254,100,11;--ctp-yellow:223,142,29;--ctp-green:64,160,43;--ctp-teal:23,146,153;--ctp-sky:4,165,229;--ctp-sapphire:32,159,181;--ctp-blue:30,102,245;--ctp-lavender:114,135,253;--ctp-text:76,79,105;--ctp-subtext1:92,95,119;--ctp-subtext0:108,111,133;--ctp-overlay2:124,127,147;--ctp-overlay1:140,143,161;--ctp-overlay0:156,160,176;--ctp-surface2:172,176,190;--ctp-surface1:188,192,204;--ctp-surface0:204,208,218;--ctp-base:239,241,245;--ctp-mantle:230,233,239;--ctp-crust:220,224,232}*,::before,::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x:;--tw-pan-y:;--tw-pinch-zoom:;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position:;--tw-gradient-via-position:;--tw-gradient-to-position:;--tw-ordinal:;--tw-slashed-zero:;--tw-numeric-figure:;--tw-numeric-spacing:;--tw-numeric-fraction:;--tw-ring-inset:;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246/0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur:;--tw-brightness:;--tw-contrast:;--tw-grayscale:;--tw-hue-rotate:;--tw-invert:;--tw-saturate:;--tw-sepia:;--tw-drop-shadow:;--tw-backdrop-blur:;--tw-backdrop-brightness:;--tw-backdrop-contrast:;--tw-backdrop-grayscale:;--tw-backdrop-hue-rotate:;--tw-backdrop-invert:;--tw-backdrop-opacity:;--tw-backdrop-saturate:;--tw-backdrop-sepia:}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x:;--tw-pan-y:;--tw-pinch-zoom:;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position:;--tw-gradient-via-position:;--tw-gradient-to-position:;--tw-ordinal:;--tw-slashed-zero:;--tw-numeric-figure:;--tw-numeric-spacing:;--tw-numeric-fraction:;--tw-ring-inset:;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246/0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur:;--tw-brightness:;--tw-contrast:;--tw-grayscale:;--tw-hue-rotate:;--tw-invert:;--tw-saturate:;--tw-sepia:;--tw-drop-shadow:;--tw-backdrop-blur:;--tw-backdrop-brightness:;--tw-backdrop-contrast:;--tw-backdrop-grayscale:;--tw-backdrop-hue-rotate:;--tw-backdrop-invert:;--tw-backdrop-opacity:;--tw-backdrop-saturate:;--tw-backdrop-sepia:}
body{scroll-behavior:smooth}*,::before,::after{transition-property:all;transition-duration:300ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)}.float-start{float:inline-start}.mx-auto{margin-left:auto;margin-right:auto}.mb-2{margin-bottom:0.5rem}.me-4{margin-inline-end:1rem}.mr-auto{margin-right:auto}.mt-1{margin-top:0.25rem}.mt-4{margin-top:1rem}.mt-8{margin-top:2rem}.block{display:block}.flex{display:flex}.grid{display:grid}.size-\[7\.5rem\]{width:7.5rem;height:7.5rem}.h-12{height:3rem}.min-h-screen{min-height:100vh}.w-12{width:3rem}.max-w-2xl{max-width:42rem}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y))}.grid-rows-\[auto_1fr_auto\]{grid-template-rows:auto 1fr auto}.items-center{align-items:center}.space-x-6>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1.5rem*var(--tw-space-x-reverse));margin-left:calc(1.5rem*calc(1-var(--tw-space-x-reverse)))}.overflow-hidden{overflow:hidden}.border-t-\[1px\]{border-top-width:1px}.border-cat-surface0{--tw-border-opacity:1;border-color:rgba(var(--ctp-surface0),var(--tw-border-opacity))}.bg-cat-base{--tw-bg-opacity:1;background-color:rgba(var(--ctp-base),var(--tw-bg-opacity))}.bg-cat-text{--tw-bg-opacity:1;background-color:rgba(var(--ctp-text),var(--tw-bg-opacity))}.p-4{padding:1rem}.px-8{padding-left:2rem;padding-right:2rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pt-20{padding-top:5rem}.pt-3{padding-top:0.75rem}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.font-extralight{font-weight:200}.font-normal{font-weight:400}.font-semibold{font-weight:600}.text-cat-subtext0{--tw-text-opacity:1;color:rgba(var(--ctp-subtext0),var(--tw-text-opacity))}.text-cat-text{--tw-text-opacity:1;color:rgba(var(--ctp-text),var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.underline{text-decoration-line:underline}.decoration-neutral-800{text-decoration-color:#262626}.opacity-80{opacity:0.8}.prose:where(blockquote p:first-of-type):not(:where([class~="not-prose"]*))::before,.prose:where(blockquote p:last-of-type):not(:where([class~="not-prose"]*))::after{content:none}.prose blockquote,.prose cite{font-style:normal}
@media print{a::after{content:" (" attr(href)") "}}.\[mask-image\:url\(\/monocon\.svg\)\]{mask-image:url(/monocon.svg)}
@media(prefers-color-scheme:dark){.dark\:cat-macchiato{--ctp-rosewater:244,219,214;--ctp-flamingo:240,198,198;--ctp-pink:245,189,230;--ctp-mauve:198,160,246;--ctp-red:237,135,150;--ctp-maroon:238,153,160;--ctp-peach:245,169,127;--ctp-yellow:238,212,159;--ctp-green:166,218,149;--ctp-teal:139,213,202;--ctp-sky:145,215,227;--ctp-sapphire:125,196,228;--ctp-blue:138,173,244;--ctp-lavender:183,189,248;--ctp-text:202,211,245;--ctp-subtext1:184,192,224;--ctp-subtext0:165,173,203;--ctp-overlay2:147,154,183;--ctp-overlay1:128,135,162;--ctp-overlay0:110,115,141;--ctp-surface2:91,96,120;--ctp-surface1:73,77,100;--ctp-surface0:54,58,79;--ctp-base:36,39,58;--ctp-mantle:30,32,48;--ctp-crust:24,25,38}}.hover\:decoration-black:hover{text-decoration-color:#000}.hover\:opacity-100:hover{opacity:1}
@media(prefers-color-scheme:dark){.dark\:bg-cat-base{--tw-bg-opacity:1;background-color:rgba(var(--ctp-base),var(--tw-bg-opacity))}.dark\:bg-zinc-800{--tw-bg-opacity:1;background-color:rgb(39 39 42/var(--tw-bg-opacity))}.dark\:text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.dark\:text-zinc-300{--tw-text-opacity:1;color:rgb(212 212 216/var(--tw-text-opacity))}.dark\:decoration-zinc-400{text-decoration-color:#a1a1aa}.dark\:hover\:decoration-white:hover{text-decoration-color:#fff}}
@media print{.print\:hidden{display:none}}</style>
      </head>
      <body class="cat-latte dark:cat-macchiato bg-cat-base text-cat-text">
        <main class="mx-auto min-h-screen max-w-2xl pt-20">
          <header>
            <a class="bg-cat-text float-start me-4 block size-[7.5rem] [mask-image:url(/monocon.svg)]">
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>
            </a>
            <div class="overflow-hidden">
              <h1 class="pt-3 text-4xl font-semibold">
                <xsl:value-of select="/rss/channel/title"/>
              </h1>
              <p class="text-cat-subtext0 mb-2 mt-1 text-lg font-extralight">
                <xsl:value-of select="/rss/channel/description"/>
              </p>
              <a class="text-sm font-semibold">
                <xsl:attribute name="href">
                  <xsl:value-of select="/rss/channel/link"/>
                </xsl:attribute>
              返回主页 &#x2192;
              </a>
            </div>
          </header>
          <xsl:if test="/rss/channel/atom:link[@rel='alternate']">
            <div class="links inner">
              <xsl:for-each select="/rss/channel/atom:link[@rel='alternate']">
                <a target="_blank">
                  <xsl:attribute name="class">
                    <xsl:value-of select="@icon"/>
                  </xsl:attribute>
                  <xsl:attribute name="href">
                    <xsl:value-of select="@href"/>
                  </xsl:attribute>
                  <xsl:value-of select="@title"/>
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
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
