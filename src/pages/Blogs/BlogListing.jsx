/**
 * pages/Blogs/BlogListing.jsx
 *
 * Blog listing page — /blogs
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Meta from "../../seo/Meta";
import BreadcrumbSchema from "../../seo/schema/BreadcrumbSchema";
import OrganizationSchema from "../../seo/schema/OrganizationSchema";

import { blogs, formatBlogDate } from "../../data/blogs";

import { useLanguage } from "../../i18n/useLanguage";
import { blogTranslations } from "../../i18n/translations-blogs";

import "./Blog.css";


/* ─────────────────────────────────────────────
   Get translated blog data
───────────────────────────────────────────── */

function getTranslatedBlog(post, language) {
  const translated =
    blogTranslations?.[language]?.[post.slug];

  return {
    ...post,
    ...(translated || {}),
  };
}


/* ─────────────────────────────────────────────
   Date formatting
───────────────────────────────────────────── */

function formatLocalizedDate(dateString, language) {
  const locales = {
    en: "en-US",
    nl: "nl-NL",
    de: "de-DE",
  };

  return new Date(dateString).toLocaleDateString(
    locales[language] || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


/* ─────────────────────────────────────────────
   Blog Listing
───────────────────────────────────────────── */

export default function BlogListing() {
  const { t, language } = useLanguage();

  return (
    <>
      {/* SEO */}

      <Meta
        title={t("blog.listingMetaTitle")}
        description={t("blog.listingMetaDesc")}
        canonical="/blogs"
        keywords="SystemaOps blog, AI automation blog, Odoo ERP insights, workflow automation guides, n8n development, business operations"
      />

      <BreadcrumbSchema
        items={[
          {
            name: t("breadcrumbs.home"),
            href: "/",
          },
          {
            name: t("breadcrumbs.blog"),
            href: "/blogs",
          },
        ]}
      />

      <OrganizationSchema />

      {/* ─────────────────────────────────────
          Blog Listing
      ───────────────────────────────────── */}

      <section className="blog-listing">
        <div className="blog-listing-inner">

          {/* Header */}

          <div className="blog-listing-header">

            <span className="blog-listing-eyebrow">
              {t("blog.insights")}
            </span>

            <h1 className="blog-listing-title">
              {t("blog.ourBlog")}
            </h1>

            <p className="blog-listing-desc">
              {t("blog.listingDesc")}
            </p>

          </div>


          {/* Blog Grid */}

          {blogs.length > 0 ? (

            <div className="blog-grid">

              {blogs.map((post) => (

                <BlogCard
                  key={post.slug}
                  post={post}
                  language={language}
                />

              ))}

            </div>

          ) : (

            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <p>
                {t("blog.comingSoon")}
              </p>
            </div>

          )}

        </div>
      </section>
    </>
  );
}


/* ─────────────────────────────────────────────
   Blog Card
───────────────────────────────────────────── */

function BlogCard({
  post,
  language,
}) {
  const { t } = useLanguage();

  /* Get translated version */

  const translatedPost =
    getTranslatedBlog(
      post,
      language
    );


  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card"
    >

      {/* ─────────────────────────────
          Featured Image
      ───────────────────────────── */}

      <img
        src={post.image}
        alt={translatedPost.title}
        className="blog-card-image"
        loading="lazy"
      />


      {/* ─────────────────────────────
          Card Body
      ───────────────────────────── */}

      <div className="blog-card-body">


        {/* Category */}

        <span
          className="blog-card-category"
          style={{
            color:
              post.categoryColor,
          }}
        >

          <span
            className="blog-card-category-dot"
            style={{
              background:
                post.categoryColor,
            }}
          />

          {translatedPost.category}

        </span>


        {/* Title */}

        <h2 className="blog-card-title">
          {translatedPost.title}
        </h2>


        {/* Excerpt */}

        <p className="blog-card-excerpt">
          {translatedPost.excerpt}
        </p>


        {/* Meta */}

        <div className="blog-card-meta">

          <span>
            {formatLocalizedDate(
              post.datePublished,
              language
            )}
          </span>

          <span className="blog-card-meta-dot" />

          <span>
            {translatedPost.readTime ||
              post.readTime}
          </span>

          <span className="blog-card-meta-dot" />

          <span>
            {translatedPost.author ||
              post.author}
          </span>

        </div>


        {/* CTA */}

        <span
          className="blog-card-cta"
          style={{
            color:
              post.categoryColor,
          }}
        >

          {t("blog.readArticle")}

          <ArrowRight size={14} />

        </span>

      </div>

    </Link>
  );
}