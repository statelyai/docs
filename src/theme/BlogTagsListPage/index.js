import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import TagsListByLetter from '@theme/TagsListByLetter';
import SearchMetadata from '@theme/SearchMetadata';
function useBlogTagsPostsPageDescription() {
  return translate({
    id: 'theme.blog.tagListPageDescription',
    description: 'The description of the page for a blog tag',
    message: 'Browse all the tags used in the posts.',
  });
}

export default function BlogTagsListPage({ tags, sidebar }) {
  const title = translateTagsPageTitle();
  const description = useBlogTagsPostsPageDescription();
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagsListPage,
      )}
    >
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag="blog_tags_list" />
      <BlogLayout sidebar={sidebar}>
        <h1>{title}</h1>
        <TagsListByLetter tags={tags} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
