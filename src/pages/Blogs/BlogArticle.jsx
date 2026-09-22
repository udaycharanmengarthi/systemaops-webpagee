/**
 * pages/Blogs/BlogArticle.jsx
 *
 * Individual blog article page — /blog/:slug
 *
 * Supports multilingual blog articles:
 * English / Nederlands / Deutsch
 */

import { useEffect, useState } from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import { useLanguage } from "../../i18n/useLanguage";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowRight,
  ArrowLeft,
  Plus,
  CalendarDays,
  Share2,
} from "lucide-react";

import Meta from "../../seo/Meta";
import BlogSchema from "../../seo/schema/BlogSchema";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import FAQSchema from "../../seo/schema/FAQSchema";

import {
  blogs,
  getBlogBySlug,
  getRelatedBlogs,
  formatBlogDate,
} from "../../data/blogs";

import { blogTranslations } from "../../i18n/translations-blogs";

import "./Blog.css";


/* ================================================================
   HELPERS
================================================================ */

/*
 * Get the translated version of a blog post.
 *
 * Expected structure:
 *
 * blogTranslations = {
 *   en: {
 *     "business-workflow-automation": {
 *       title: "...",
 *       excerpt: "...",
 *       content: "...",
 *       ...
 *     }
 *   },
 *
 *   nl: {
 *     "business-workflow-automation": {
 *       ...
 *     }
 *   },
 *
 *   de: {
 *     "business-workflow-automation": {
 *       ...
 *     }
 *   }
 * }
 */

function getTranslatedPost(
  originalPost,
  language
) {
  if (!originalPost) {
    return null;
  }

  const languageTranslations =
    blogTranslations?.[language];

  if (!languageTranslations) {
    return originalPost;
  }

  /*
   * Main expected structure:
   *
   * blogTranslations[language][slug]
   */

  const translated =
    languageTranslations?.[
      originalPost.slug
    ];

  /*
   * Fallback in case the translation file
   * uses:
   *
   * blogTranslations[language].blogs[slug]
   */

  const nestedTranslated =
    languageTranslations?.blogs?.[
      originalPost.slug
    ];

  const translation =
    translated || nestedTranslated;

  if (!translation) {
    return originalPost;
  }

  /*
   * Merge original post + translated fields.
   *
   * This means things such as image, slug,
   * dates, tags etc. remain available even
   * if they aren't translated.
   */

  return {
    ...originalPost,
    ...translation,

    /*
     * Keep these from the original post unless
     * the translation explicitly provides them.
     */

    slug: originalPost.slug,
    image:
      translation.image ||
      originalPost.image,
    categoryColor:
      translation.categoryColor ||
      originalPost.categoryColor,
    datePublished:
      translation.datePublished ||
      originalPost.datePublished,
    dateModified:
      translation.dateModified ||
      originalPost.dateModified,
    author:
      translation.author ||
      originalPost.author,
    tags:
      translation.tags ||
      originalPost.tags,
    relatedSlugs:
      translation.relatedSlugs ||
      originalPost.relatedSlugs,
  };
}


/* ─── Extract H2 headings ─── */

function extractHeadings(markdown) {
  if (!markdown) {
    return [];
  }

  const matches =
    markdown.match(/^## (.+)$/gm) || [];

  return matches.map((line) => {
    const text =
      line.replace(/^## /, "");

    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    return {
      text,
      id,
    };
  });
}


/* ─── Heading renderer ─── */

function HeadingWithId({
  children,
  level,
}) {
  const text = String(children);

  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const Tag = `h${level}`;

  return (
    <Tag id={id}>
      {children}
    </Tag>
  );
}


const markdownComponents = {
  h2: (props) => (
    <HeadingWithId
      level={2}
      {...props}
    />
  ),

  h3: (props) => (
    <HeadingWithId
      level={3}
      {...props}
    />
  ),
};


/* ================================================================
   MAIN BLOG ARTICLE
================================================================ */

export default function BlogArticle() {

  const {
    t,
    language,
  } = useLanguage();

  const {
    slug,
  } = useParams();

  const navigate =
    useNavigate();


  /* --------------------------------------------------------------
     ORIGINAL ENGLISH POST
  -------------------------------------------------------------- */

  const originalPost =
    getBlogBySlug(slug);


  /* --------------------------------------------------------------
     TRANSLATED POST
  -------------------------------------------------------------- */

  const post =
    getTranslatedPost(
      originalPost,
      language
    );


  /* --------------------------------------------------------------
     STATE
  -------------------------------------------------------------- */

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    activeId,
    setActiveId,
  ] = useState("");

  const [
    tocOpen,
    setTocOpen,
  ] = useState(false);

  const [
    openFaq,
    setOpenFaq,
  ] = useState(null);


  /* ================================================================
     REDIRECT IF POST DOESN'T EXIST
  ================================================================= */

  useEffect(() => {
    if (!originalPost) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    originalPost,
    navigate,
  ]);


  /* ================================================================
     READING PROGRESS
  ================================================================= */

  useEffect(() => {

    const handleScroll = () => {

      const el =
        document.documentElement;

      const scrollTop =
        el.scrollTop ||
        document.body.scrollTop;

      const scrollHeight =
        el.scrollHeight -
        el.clientHeight;

      if (scrollHeight > 0) {

        setProgress(
          (scrollTop /
            scrollHeight) *
            100
        );

      }
    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  /* ================================================================
     ACTIVE TABLE OF CONTENTS
  ================================================================= */

  useEffect(() => {

    if (!post) {
      return;
    }

    const headings =
      document.querySelectorAll(
        ".blog-prose h2"
      );

    if (!headings.length) {
      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                setActiveId(
                  entry.target.id
                );

              }

            }
          );

        },
        {
          rootMargin:
            "-20% 0% -70% 0%",

          threshold: 0,
        }
      );


    headings.forEach(
      (el) =>
        observer.observe(el)
    );


    return () =>
      observer.disconnect();

  }, [
    post,
    language,
  ]);


  /* --------------------------------------------------------------
     WAIT FOR INVALID POST REDIRECT
  -------------------------------------------------------------- */

  if (!post) {
    return null;
  }


  /* ================================================================
     TRANSLATED HEADINGS
  ================================================================= */

  const headings =
    extractHeadings(
      post.content
    );


  /* ================================================================
     RELATED POSTS
  ================================================================= */

  const relatedPosts =
    getRelatedBlogs(
      post.relatedSlugs
    );


  /* ================================================================
     PREVIOUS / NEXT
  ================================================================= */

  const currentIndex =
    blogs.findIndex(
      (b) =>
        b.slug === slug
    );


  const prevPost =
    currentIndex > 0
      ? blogs[
          currentIndex - 1
        ]
      : null;


  const nextPost =
    currentIndex <
    blogs.length - 1
      ? blogs[
          currentIndex + 1
        ]
      : null;


  /*
   * Translate previous and next articles
   */

  const translatedPrevPost =
    getTranslatedPost(
      prevPost,
      language
    );


  const translatedNextPost =
    getTranslatedPost(
      nextPost,
      language
    );


  /* ================================================================
     SHARE URL
  ================================================================= */

  const shareUrl =
    `https://www.systemaops.com/blog/${post.slug}`;


  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <>

      {/* ==========================================================
          SEO
      ========================================================== */}

      <Meta
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={`https://www.systemaops.com${post.image}`}
        keywords={post.tags.join(", ")}
      />


      <BlogSchema
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={
          post.datePublished
        }
        dateModified={
          post.dateModified
        }
        image={`https://www.systemaops.com${post.image}`}
      />


      <BreadcrumbSchema
        items={[
          {
            name: t(
              "breadcrumbs.home"
            ),
            href: "/",
          },

          {
            name: t(
              "breadcrumbs.blog"
            ),
            href: "/blogs",
          },

          {
            name: post.title,
            href:
              `/blog/${post.slug}`,
          },
        ]}
      />


      <FAQSchema
        faqs={post.faqs}
      />


      {/* ==========================================================
          READING PROGRESS
      ========================================================== */}

      <div
        className="blog-progress-bar"
        style={{
          width:
            `${progress}%`,
        }}
        aria-hidden="true"
      />


      <article className="blog-article">


        {/* ========================================================
            BREADCRUMBS
        ======================================================== */}

        <nav
          className="blog-breadcrumbs"
          aria-label="Breadcrumb"
        >

          <Link to="/">
            {t(
              "breadcrumbs.home"
            )}
          </Link>


          <span className="blog-breadcrumbs-sep">
            ›
          </span>


          <Link to="/blogs">
            {t(
              "breadcrumbs.blog"
            )}
          </Link>


          <span className="blog-breadcrumbs-sep">
            ›
          </span>


          <span className="blog-breadcrumbs-current">
            {post.title}
          </span>

        </nav>


        {/* ========================================================
            HERO
        ======================================================== */}

        <header className="blog-hero">


          {/* CATEGORY */}

          <span
            className="blog-hero-category"
            style={{
              color:
                post.categoryColor,
            }}
          >

            <span
              style={{
                display:
                  "inline-block",

                width: 5,

                height: 5,

                borderRadius:
                  "50%",

                background:
                  post.categoryColor,

                marginRight: 6,

                verticalAlign:
                  "middle",

                position:
                  "relative",

                top: -1,
              }}
            />


            {post.category}

          </span>


          {/* TITLE */}

          <h1 className="blog-hero-title">
            {post.title}
          </h1>


          {/* META */}

          <div className="blog-hero-meta">

            <span>
              {post.author}
            </span>


            <span className="blog-hero-meta-sep" />


            <span>
              {post.readTime}
            </span>


            <span className="blog-hero-meta-sep" />


            <time
              dateTime={
                post.datePublished
              }
            >
              {formatBlogDate(
                post.datePublished
              )}
            </time>


            {post.dateModified &&
              post.dateModified !==
                post.datePublished && (
                <>

                  <span className="blog-hero-meta-sep" />

                  <span>
                    {t(
                      "blog.updated"
                    )}{" "}
                    {formatBlogDate(
                      post.dateModified
                    )}
                  </span>

                </>
              )}

          </div>


          {/* SHARE */}

          <div className="blog-share">

            <span className="blog-share-label">
              {t(
                "blog.share"
              )}
            </span>


            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}&text=${encodeURIComponent(
                post.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on Twitter"
            >

              <Share2 size={12} />

              Twitter

            </a>


            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                shareUrl
              )}&title=${encodeURIComponent(
                post.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on LinkedIn"
            >

              <Share2 size={12} />

              LinkedIn

            </a>

          </div>

        </header>


        {/* ========================================================
            VERDICT + TAKEAWAYS
        ======================================================== */}

        <div className="blog-verdict-section">


          {/* QUICK VERDICT */}

          <div className="blog-verdict-box">

            <p className="blog-verdict-label">

              ⚡{" "}

              {t(
                "blog.quickVerdict"
              )}

            </p>


            <p className="blog-verdict-text">

              {post.quickVerdict}

            </p>

          </div>


          {/* KEY TAKEAWAYS */}

          <div className="blog-takeaways-box">

            <p className="blog-takeaways-label">

              {t(
                "blog.keyTakeaways"
              )}

            </p>


            <ul className="blog-takeaways-list">

              {post.keyTakeaways?.map(
                (point, i) => (

                  <li key={i}>

                    <span
                      className="blog-takeaways-bullet"
                      style={{
                        background:
                          post.categoryColor,
                      }}
                    />

                    {point}

                  </li>

                )
              )}

            </ul>

          </div>

        </div>


        {/* ========================================================
            FEATURED IMAGE
        ======================================================== */}

        <div className="blog-featured-image-wrap">

          <img
            src={post.image}
            alt={post.title}
            className="blog-featured-image"
          />

        </div>


        {/* ========================================================
            CONTENT + TOC
        ======================================================== */}

        <div className="blog-content-layout">


          {/* ARTICLE CONTENT */}

          <div className="blog-prose">

            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
              components={
                markdownComponents
              }
            >
              {post.content}
            </ReactMarkdown>

          </div>


          {/* TABLE OF CONTENTS */}

          {headings.length > 0 && (

            <aside
              className="blog-toc"
              aria-label="Table of contents"
            >

              <div className="blog-toc-inner">


                <div
                  className={`blog-toc-header ${
                    tocOpen
                      ? "open"
                      : ""
                  }`}
                  onClick={() =>
                    setTocOpen(
                      !tocOpen
                    )
                  }
                >

                  <p className="blog-toc-title">

                    {t(
                      "blog.onThisPage"
                    )}

                  </p>


                  <span className="blog-toc-toggle">

                    <Plus size={14} />

                  </span>

                </div>


                <ul
                  className={`blog-toc-list ${
                    tocOpen
                      ? "open"
                      : ""
                  }`}
                >

                  {headings.map(
                    (h) => (

                      <li
                        key={h.id}
                        className={`blog-toc-item ${
                          activeId ===
                          h.id
                            ? "active"
                            : ""
                        }`}
                      >

                        <a
                          href={`#${h.id}`}
                          onClick={() =>
                            setTocOpen(
                              false
                            )
                          }
                        >
                          {h.text}
                        </a>

                      </li>

                    )
                  )}

                </ul>

              </div>

            </aside>

          )}

        </div>


        {/* ========================================================
            FAQ
        ======================================================== */}

        {post.faqs?.length > 0 && (

          <section className="blog-faq">

            <h2 className="blog-faq-title">

              {t(
                "blog.faq"
              )}

            </h2>


            <FaqAccordion
              faqs={post.faqs}
              openFaq={openFaq}
              setOpenFaq={
                setOpenFaq
              }
            />

          </section>

        )}


        {/* ========================================================
            CTA
        ======================================================== */}

        <section className="blog-cta">

          <div className="blog-cta-box">


            <span className="blog-cta-label">

              {t(
                "blog.readyToScale"
              )}

            </span>


            <h2 className="blog-cta-title">

              {t(
                "blog.automateSlowing"
              )}

            </h2>


            <p className="blog-cta-text">

              {t(
                "blog.mapsBottlenecks"
              )}

            </p>


            <Link
              to="/contact"
              className="blog-cta-btn"
            >

              <CalendarDays
                size={18}
              />


              {t(
                "about.bookCall"
              )}


              <ArrowRight
                size={16}
              />

            </Link>

          </div>

        </section>


        {/* ========================================================
            PREVIOUS / NEXT
        ======================================================== */}

        {(prevPost ||
          nextPost) && (

          <nav
            className="blog-nav"
            aria-label="Article navigation"
          >


            {/* PREVIOUS */}

            {translatedPrevPost ? (

              <Link
                to={`/blog/${translatedPrevPost.slug}`}
                className="blog-nav-link"
              >

                <span className="blog-nav-direction">

                  <ArrowLeft
                    size={12}
                  />

                  {t(
                    "blog.previous"
                  )}

                </span>


                <span className="blog-nav-title">

                  {translatedPrevPost.title}

                </span>

              </Link>

            ) : (

              <div />

            )}


            {/* NEXT */}

            {translatedNextPost ? (

              <Link
                to={`/blog/${translatedNextPost.slug}`}
                className="blog-nav-link blog-nav-link--next"
              >

                <span className="blog-nav-direction">

                  {t(
                    "blog.next"
                  )}

                  <ArrowRight
                    size={12}
                  />

                </span>


                <span className="blog-nav-title">

                  {translatedNextPost.title}

                </span>

              </Link>

            ) : (

              <div />

            )}

          </nav>

        )}


        {/* ========================================================
            RELATED ARTICLES
        ======================================================== */}

        {relatedPosts.length > 0 && (

          <section className="blog-related">

            <h2 className="blog-related-title">

              {t(
                "blog.relatedArticles"
              )}

            </h2>


            <div className="blog-related-grid">

              {relatedPosts.map(
                (related) => (

                  <RelatedCard
                    key={
                      related.slug
                    }
                    post={related}
                    language={
                      language
                    }
                  />

                )
              )}

            </div>

          </section>

        )}

      </article>

    </>
  );
}


/* ================================================================
   FAQ ACCORDION
================================================================ */

function FaqAccordion({
  faqs,
  openFaq,
  setOpenFaq,
}) {

  return (

    <div className="faq-accordion">

      {faqs.map(
        (faq, i) => {

          const isOpen =
            openFaq === i;


          return (

            <div
              key={i}
              className={`faq-item ${
                isOpen
                  ? "open"
                  : ""
              }`}
            >


              <button
                className="faq-trigger"
                onClick={() =>
                  setOpenFaq(
                    isOpen
                      ? null
                      : i
                  )
                }
                aria-expanded={
                  isOpen
                }
                id={`blog-faq-trigger-${i}`}
                aria-controls={`blog-faq-body-${i}`}
              >

                <span className="faq-trigger-text">

                  {faq.question}

                </span>


                <span
                  className="faq-icon"
                  aria-hidden="true"
                >

                  <Plus
                    size={14}
                    color="rgba(255,255,255,0.6)"
                  />

                </span>

              </button>


              <div
                id={`blog-faq-body-${i}`}
                role="region"
                aria-labelledby={`blog-faq-trigger-${i}`}
                className={`faq-body ${
                  isOpen
                    ? "open"
                    : ""
                }`}
              >

                <div className="faq-body-inner">

                  <p className="faq-answer">

                    {faq.answer}

                  </p>

                </div>

              </div>

            </div>

          );

        }
      )}

    </div>

  );
}


/* ================================================================
   RELATED ARTICLE CARD
================================================================ */

function RelatedCard({
  post,
  language,
}) {

  const { t } =
    useLanguage();


  const translatedPost =
    getTranslatedPost(
      post,
      language
    );


  return (

    <Link
      to={`/blog/${post.slug}`}
      className="blog-card"
    >


      <img
        src={translatedPost.image}
        alt={translatedPost.title}
        className="blog-card-image"
        loading="lazy"
      />


      <div className="blog-card-body">


        <span
          className="blog-card-category"
          style={{
            color:
              translatedPost.categoryColor,
          }}
        >

          <span
            className="blog-card-category-dot"
            style={{
              background:
                translatedPost.categoryColor,
            }}
          />


          {translatedPost.category}

        </span>


        <h3 className="blog-card-title">

          {translatedPost.title}

        </h3>


        <p className="blog-card-excerpt">

          {translatedPost.excerpt}

        </p>


        <div className="blog-card-meta">

          <span>

            {formatBlogDate(
              translatedPost.datePublished
            )}

          </span>


          <span className="blog-card-meta-dot" />


          <span>

            {translatedPost.readTime}

          </span>

        </div>


        <span
          className="blog-card-cta"
          style={{
            color:
              translatedPost.categoryColor,
          }}
        >

          {t(
            "blog.readArticle"
          )}


          <ArrowRight
            size={14}
          />

        </span>

      </div>

    </Link>

  );
}